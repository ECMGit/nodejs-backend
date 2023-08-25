import express from 'express';
import bodyParser from 'body-parser';
import { PrismaClient } from '@prisma/client';

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Create a Prisma client instance
const prisma = new PrismaClient();

// Register a new user
app.post('/user/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if username is already taken
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    // Create a new user
    await prisma.user.create({ data: { username, email, password } });

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User login
app.post('/user/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find the user in the database
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare the provided password with the stored password
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    // Exclude password and other sensitive fields before sending
    const { password: _, ...safeUser } = user;
    return res.status(200).json({ message: 'Login successful', user: safeUser});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get("/", (req, res) => {
  res.status(200).send("Hello World!");
});


export default app;