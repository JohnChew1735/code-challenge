import sqlite3 from 'sqlite3';

export interface Resource {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export class Database {
  private db: sqlite3.Database;

  constructor() {
    this.db = new sqlite3.Database('./resources.db', (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('Connected to SQLite database.');
        this.initTable();
      }
    });
  }

  private initTable(): void {
    const sql = `
      CREATE TABLE IF NOT EXISTS resources (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `;

    this.db.run(sql, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Resources table created or already exists.');
      }
    });
  }

  // Create a new resource
  createResource(name: string, description: string): Promise<Resource> {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO resources (name, description) VALUES (?, ?)';
      const db = this.db;
      db.run(sql, [name, description], function(err: Error | null) {
        if (err) {
          reject(err);
        } else {
          // Get the created resource
          const selectSql = 'SELECT * FROM resources WHERE id = ?';
          db.get(selectSql, [this.lastID], (err: Error | null, row: Resource) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          });
        }
      });
    });
  }

  // Get all resources with optional filtering
  getAllResources(limit?: number, offset?: number, nameFilter?: string): Promise<Resource[]> {
    return new Promise((resolve, reject) => {
      let sql = 'SELECT * FROM resources';
      const params: any[] = [];

      if (nameFilter) {
        sql += ' WHERE name LIKE ?';
        params.push(`%${nameFilter}%`);
      }

      sql += ' ORDER BY createdAt DESC';

      if (limit) {
        sql += ' LIMIT ?';
        params.push(limit);
      }

      if (offset) {
        sql += ' OFFSET ?';
        params.push(offset);
      }

      this.db.all(sql, params, (err, rows: Resource[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get a single resource by ID
  getResourceById(id: number): Promise<Resource | null> {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM resources WHERE id = ?';
      this.db.get(sql, [id], (err, row: Resource) => {
        if (err) {
          reject(err);
        } else {
          resolve(row || null);
        }
      });
    });
  }

  // Update a resource
  updateResource(id: number, name?: string, description?: string): Promise<Resource | null> {
    return new Promise((resolve, reject) => {
      const updates: string[] = [];
      const params: any[] = [];

      if (name !== undefined) {
        updates.push('name = ?');
        params.push(name);
      }

      if (description !== undefined) {
        updates.push('description = ?');
        params.push(description);
      }

      if (updates.length === 0) {
        reject(new Error('No fields to update'));
        return;
      }

      updates.push('updatedAt = CURRENT_TIMESTAMP');
      params.push(id);

      const sql = `UPDATE resources SET ${updates.join(', ')} WHERE id = ?`;
      const db = this.db;

      db.run(sql, params, function(err: Error | null) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          resolve(null); // No resource found with that ID
        } else {
          // Get the updated resource
          const selectSql = 'SELECT * FROM resources WHERE id = ?';
          db.get(selectSql, [id], (err: Error | null, row: Resource) => {
            if (err) {
              reject(err);
            } else {
              resolve(row);
            }
          });
        }
      });
    });
  }

  // Delete a resource
  deleteResource(id: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM resources WHERE id = ?';
      this.db.run(sql, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes > 0);
        }
      });
    });
  }

  close(): void {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed.');
      }
    });
  }
}
