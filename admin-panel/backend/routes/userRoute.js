import express from 'express';
import { User } from '../models/userModel.js';

const router = express.Router();

// Register
router.post('/register', async (request, response) => {
  try {
    const { username, password, name, role } = request.body;

    if (!username || !password || !name) {
      return response.status(400).send({ message: 'username, password and name are required' });
    }

    // Check if username already exists
    const existing = await User.findOne({ username });
    if (existing) {
      return response.status(400).send({ message: 'Username already exists' });
    }

    const user = await User.create({ username, password, name, role: role || 'Staff' });
    return response.status(201).send({
      message: 'User registered successfully',
      user: { id: user._id, username: user.username, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error(error.message);
    response.status(500).send({ message: error.message });
  }
});

// Login
router.post('/login', async (request, response) => {
  try {
    const { username, password } = request.body;

    if (!username || !password) {
      return response.status(400).send({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return response.status(401).send({ message: 'Invalid username or password' });
    }

    if (user.password !== password) {
      return response.status(401).send({ message: 'Invalid username or password' });
    }

    return response.status(200).send({
      message: 'Login successful',
      user: { id: user._id, username: user.username, name: user.name, role: user.role }
    });
  } catch (error) {
    console.error(error.message);
    response.status(500).send({ message: error.message });
  }
});

export default router;