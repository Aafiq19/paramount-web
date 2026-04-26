import express from 'express';
import { PORT, mongoDBURL } from './config.js';
import mongoose from 'mongoose';
import cors from 'cors';

import AuthRoute    from './routes/authRoute.js';
import ShopRoute    from './routes/shopRoute.js';
import OrderRoute   from './routes/orderRoute.js';
import PayhereRoute from './routes/payhereRoute.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get('/', (req, res) => res.status(200).send('Paramount Enterprises - Customer Portal API'));

app.use('/auth',    AuthRoute);
app.use('/shop',    ShopRoute);
app.use('/orders',  OrderRoute);
app.use('/payhere', PayhereRoute);

mongoose.connect(mongoDBURL)
  .then(() => {
    console.log("Customer Portal connected to database");
    app.listen(PORT, () => console.log(`Customer Portal API running on port: ${PORT}`));
  })
  .catch((error) => console.log(error));