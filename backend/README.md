# Setup

Using the following command to install the dependencies for backend.

```bash
cd backend
npm install
```

Next, you have to `create mysql database` in your local machine and set the connection string in the .env.dev.

Replace your username, password, host, port, and database name with your own.

``` title=".env.dev"
# DATABASE_URL="mysql://root:<password>@<host>:<port>/<database_name>"
```

Then, run the following command to setup the database.

```bash
cd backend
npx prisma migrate dev
```

Once the database is setup, you can **seed** the database with some sample data.

```bash
cd backend
npm run seed
```

Finally, you can start the backend server. The backend server will run on port `3007`.

```bash
cd backend
npm run dev
```

# API Documentation

## Items API Endpoints

### Create Item
- **Method**: POST
- **Endpoint**: `/api/items`
- **Body**:
```json
{
  "name": "string",
  "description": "string",
  "price": number
}
```

### Get All Items
- **Method**: GET
- **Endpoint**: `/api/items`
- **Response**: Array of items

### Get Item by ID
- **Method**: GET
- **Endpoint**: `/api/items/:id`
- **Parameters**: 
  - `id`: Item ID
- **Response**: Single item object

### Update Item
- **Method**: PUT
- **Endpoint**: `/api/items/:id`
- **Parameters**: 
  - `id`: Item ID
- **Body**:
```json
{
  "name": "string",
  "description": "string",
  "price": number
}
```

### Delete Item
- **Method**: DELETE
- **Endpoint**: `/api/items/:id`
- **Parameters**: 
  - `id`: Item ID

### Batch Delete Items
- **Method**: DELETE
- **Endpoint**: `/api/items/batch`
- **Body**:
```json
{
  "ids": ["id1", "id2", "id3"]
}
```

# Additional Notes

## Prisma Client Generation

Although the Prisma client is generated automatically when you run the migration, you by chance have the error from Prisma Client with start the server, you can generate the Prisma client by running the following command.

```bash
cd backend
npm run prisma:generate
```

## Start the backend and frontend at the same time

There is a script provided to start the backend server and frontend at the same time in the root directory of package.json with the following command.

```bash
cd .. # Move to the root directory
npm install # Install dependencies if not installed
npm run dev # Start the backend server and frontend
```
