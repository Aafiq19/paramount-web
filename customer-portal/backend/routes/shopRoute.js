import express from 'express';
import { Stock } from '../models/stockModel.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const stocks = await Stock.find({});  // ← remove the stockQuantity filter
    return res.status(200).json({ count: stocks.length, products: stocks });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Get one product
router.get('/:id', async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: 'Product not found' });
    return res.status(200).json(stock);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

export default router;