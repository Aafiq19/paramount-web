import express from 'express';
import { Stock } from '../models/stockModel.js';

const router = express.Router();

// route for save a new stock
router.post('/', async (request, response) => {
    try {
        if (
            !request.body.product ||
            !request.body.supplier ||
            !request.body.stockQuantity ||
            !request.body.reorderLevel
        ) {
            return response.status(400).send({
                message: 'Send all required fields: product, supplier, stockQuantity, reorderLevel',
            });
        }

        const newStock = {
            product: request.body.product,
            supplier: request.body.supplier,
            stockQuantity: request.body.stockQuantity,
            reorderLevel: request.body.reorderLevel
        };

        const stock = await Stock.create(newStock);

        return response.status(201).send(stock);

    } catch (error) {
        console.error(error.message);
        response.status(500).send(error.message);
    }
});

// route for get all stocks from the databse 
router.get('/', async (request, response) => {
    try {
        const stock = await Stock.find({});

        return response.status(200).json({
            count: stock.length,
            stocks: stock
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// route for get one stocks from databse by using the id
router.get('/:id', async (request, response) => {
    try {

        const { id } = request.params;

        const stockByid = await Stock.findById(id);

        return response.status(200).json(stockByid);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// rout for update a stock
router.put('/:id', async (request, response) => {
    try {
        if (
            !request.body.product ||
            !request.body.supplier ||
            !request.body.stockQuantity ||
            !request.body.reorderLevel
        ) {
            return response.status(400).send({
                message: 'Send all required fields: product, supplier, stockQuantity, reorderLevel',
            });

        }

        const { id } = request.params;

        const result = await Stock.findByIdAndUpdate(id, request.body);

        if (!result) {
            return response.status(404).json({ message: 'Stock not found' });
        }

        return response.status(200).send({ message: 'Stock updated successfully' });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// route for delete a stock
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Stock.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: 'Stock not found' });
        }

        return response.status(200).json({ message: 'Stock deleted successfully' });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});



export default router;