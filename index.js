import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import advancedRoutes from './routes/advanced.js';

const app = express();
const port = 5000;

app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/advanced', advancedRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
