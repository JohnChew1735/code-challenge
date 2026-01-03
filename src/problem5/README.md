# CRUD Backend API

A TypeScript Express.js backend service providing CRUD operations for resource management with SQLite database persistence.

## Installation

1. Navigate to the problem5 directory:
   ```bash
   cd code-challenge/src/problem5
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode (with hot reload)
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

### Watch Mode (rebuilds on changes)
```bash
npm run watch
```

The server will start on `http://localhost:3000` by default.

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Health Check
```http
GET /health
```

### Resources

#### Create a Resource
```http
POST /api/resources
Content-Type: application/json

{
  "name": "Sample Resource",
  "description": "This is a sample resource"
}
```

#### List Resources
```http
GET /api/resources
GET /api/resources?limit=10&offset=0&name=search_term
```

Query Parameters:
- `limit`: Number of resources to return (1-100, default: all)
- `offset`: Number of resources to skip (default: 0)
- `name`: Filter by name (partial match)

#### Get Resource Details
```http
GET /api/resources/:id
```

#### Update a Resource
```http
PUT /api/resources/:id
Content-Type: application/json

{
  "name": "Updated Resource Name",
  "description": "Updated description"
}
```

#### Delete a Resource
```http
DELETE /api/resources/:id
```

## Data Model

### Resource
```typescript
{
  id: number;           // Auto-generated
  name: string;         // Required
  description: string;  // Optional
  createdAt: string;    // Auto-generated
  updatedAt: string;    // Auto-updated
}
```

## API Response Formats

### Success Response
```json
{
  "message": "Resource created successfully",
  "resource": {
    "id": 1,
    "name": "Sample Resource",
    "description": "This is a sample resource",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Error Response
```json
{
  "error": "Resource not found"
}
```

### List Response
```json
{
  "resources": [...],
  "count": 10,
  "filters": {
    "name": null,
    "limit": 10,
    "offset": 0
  }
}
```

## Error Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `404`: Not Found
- `500`: Internal Server Error

## Database

The application uses SQLite with a local database file (`resources.db`). The database and tables are automatically created when the server starts.

## Development

### Project Structure
```
src/
├── database.ts    # Database connection and operations
├── routes.ts      # API route definitions
└── server.ts      # Express server setup
```

### Available Scripts

- `npm run build`: Compile TypeScript to JavaScript
- `npm run start`: Run compiled JavaScript
- `npm run dev`: Run with ts-node (development)
- `npm run watch`: Watch for changes and restart

## Testing the API

You can test the API using tools like:
- Postman
- curl
- Thunder Client (VS Code extension)

### Example curl commands:

Create a resource:
```bash
curl -X POST http://localhost:3000/api/resources \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Resource", "description": "A test resource"}'
```

List resources:
```bash
curl http://localhost:3000/api/resources
```

Get a specific resource:
```bash
curl http://localhost:3000/api/resources/1
```

## Security Features

- Helmet.js for security headers
- Input validation and sanitization
- CORS enabled for cross-origin requests
- Parameter validation middleware

## Environment Variables

- `PORT`: Server port (default: 3000)

## License

MIT
