# Setup

Using the following command to install the dependencies for frontend.

```bash
cd frontend
npm install
```

Finally, you can start the frontend server.

```bash
cd frontend
npm run dev
```

> Note: The frontend server will use the backend server running on port `3007`.
> Please make sure the backend server is running before starting the frontend server.

# Additional Notes

There is a script provided to start the backend server and frontend at the same time in the root directory of package.json with the following command.

```bash
cd .. # Move to the root directory
npm install # Install dependencies if not installed
npm run dev # Start the backend server and frontend
```
