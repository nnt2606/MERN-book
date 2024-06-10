import express from 'express';
import { port } from './config/config.js';
import connectDB from './config/database.js';
import Route from './middleware/routes.js';
import DiscountConfig from './config/discountconfig.js';

const app = express();

connectDB();
DiscountConfig();
Route(app);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
  
