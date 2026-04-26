import express from 'express';
import { PORT, mongoDBURL } from './config.js';
import mongoose from 'mongoose';
import cors from 'cors';

import StockRoute    from './routes/stockRoute.js';
import CustomerRoute from './routes/customerRoute.js';
import EmployeeRoute from './routes/employeeRoute.js';
import SupplierRoute from './routes/supplierRoute.js';
import OrderRoute    from './routes/orderRoute.js';
import UserRoute     from './routes/userRoute.js';

const app = express();

app.use(express.json());

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get('/', (request, response) => {
  return response.status(200).send('Paramount Enterprises - Hardware Shop API');
});

// Routes
app.use('/stocks',    StockRoute);
app.use('/customers', CustomerRoute);
app.use('/employees', EmployeeRoute);
app.use('/suppliers', SupplierRoute);
app.use('/orders',    OrderRoute);
app.use('/users',     UserRoute);

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => { console.log(error); });