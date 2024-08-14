import express from "express";
import cors from 'cors';
import authRoute from '../routes/authRoute.js';
import bookRoute from '../routes/booksRoute.js';
import copyRoute from '../routes/copyRoute.js';
import userRoute from '../routes/userRoute.js';
import orderRoute from '../routes/orderRoute.js';
import ratingRoute from '../routes/userRatingRoute.js';
import discountBookRoute from '../routes/discountBookRoute.js';
import recommendRoute from '../routes/recommendRoute.js';
import { requiredAuth } from "./verifyJWT.js";
import cookieParser from 'cookie-parser';
const allowedOrigins = [
    'http://127.0.0.1:5173',
    'http://localhost:5173',
    'https://localhost:5173'
]

const corsOptions = {
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Cho phép gửi cookies
  };

export default function(app) {
    app.use(express.json());
    app.use((request, response, next) => {
        console.log(request.path, request.method)
        next()
    })
    //Middleware for handling CORS POLICY
    app.use(cors(corsOptions));
    //Middleware for cookie
    app.use(cookieParser());

    app.get('/',(request, response) =>{
        response.json({mssg: 'Hello world'})
    });
    
    app.use('/uploads',express.static('uploads'))

    app.use('/auth', authRoute);

    app.use('/api', recommendRoute);
    app.use('/api', bookRoute);
    app.use('/api', copyRoute);
    app.use('/api', ratingRoute)
    app.use('/api',requiredAuth, userRoute);
    app.use('/api',requiredAuth, orderRoute);
   
    app.use('/api',requiredAuth, discountBookRoute);
}