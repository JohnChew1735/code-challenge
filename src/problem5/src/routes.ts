import { Router, Request, Response } from 'express';
import { Database } from './database';

const router = Router();

// Middleware to validate ID parameter
const validateId = (req: Request, res: Response, next: Function) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ error: 'Invalid ID. Must be a positive integer.' });
  }
  req.params.id = id.toString();
  next();
};

// Create a resource
router.post('/resources', async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required and must be a non-empty string.' });
    }

    const db = new Database();
    const resource = await db.createResource(name.trim(), description?.trim() || '');

    res.status(201).json({
      message: 'Resource created successfully',
      resource
    });
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all resources with optional filtering
router.get('/resources', async (req: Request, res: Response) => {
  try {
    const { limit, offset, name } = req.query;

    const limitNum = limit ? parseInt(limit as string) : undefined;
    const offsetNum = offset ? parseInt(offset as string) : undefined;
    const nameFilter = name ? name as string : undefined;

    // Validate limit and offset
    if (limitNum !== undefined && (isNaN(limitNum) || limitNum <= 0 || limitNum > 100)) {
      return res.status(400).json({ error: 'Limit must be a positive integer between 1 and 100.' });
    }

    if (offsetNum !== undefined && (isNaN(offsetNum) || offsetNum < 0)) {
      return res.status(400).json({ error: 'Offset must be a non-negative integer.' });
    }

    const db = new Database();
    const resources = await db.getAllResources(limitNum, offsetNum, nameFilter);

    res.json({
      resources,
      count: resources.length,
      filters: {
        name: nameFilter,
        limit: limitNum,
        offset: offsetNum
      }
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a single resource by ID
router.get('/resources/:id', validateId, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const db = new Database();
    const resource = await db.getResourceById(id);

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json({ resource });
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a resource
router.put('/resources/:id', validateId, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description } = req.body;

    // Validate input
    if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
      return res.status(400).json({ error: 'Name must be a non-empty string.' });
    }

    if (description !== undefined && typeof description !== 'string') {
      return res.status(400).json({ error: 'Description must be a string.' });
    }

    const db = new Database();
    const resource = await db.updateResource(id, name?.trim(), description?.trim());

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json({
      message: 'Resource updated successfully',
      resource
    });
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a resource
router.delete('/resources/:id', validateId, async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const db = new Database();
    const deleted = await db.deleteResource(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
