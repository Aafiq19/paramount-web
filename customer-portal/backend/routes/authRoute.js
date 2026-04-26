import express from 'express';
import { Customer } from '../models/customerModel.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password)
      return res.status(400).send({ message: 'Name, email and password are required' });

    const existing = await Customer.findOne({ email });
    if (existing && existing.password) {
      return res.status(400).send({ message: 'Email already registered' });
    }

    let customer;
    if (existing) {
      // Customer exists in admin panel (added manually), just add password
      existing.password = password;
      existing.phone    = phone || existing.phone;
      existing.address  = address || existing.address;
      await existing.save();
      customer = existing;
    } else {
      customer = await Customer.create({
        name, email, password,
        contact: phone || '',
        phone:   phone || '',
        address: address || '',
      });
    }

    return res.status(201).send({
      message: 'Registered successfully',
      customer: {
        id:      customer._id,
        name:    customer.name,
        email:   customer.email,
        phone:   customer.phone || customer.contact,
        address: customer.address
      }
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).send({ message: 'Email and password are required' });

    const customer = await Customer.findOne({ email });
    if (!customer || !customer.password || customer.password !== password)
      return res.status(401).send({ message: 'Invalid email or password' });

    return res.status(200).send({
      message: 'Login successful',
      customer: {
        id:      customer._id,
        name:    customer.name,
        email:   customer.email,
        phone:   customer.phone || customer.contact,
        address: customer.address
      }
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default router;