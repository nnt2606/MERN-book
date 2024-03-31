import express from "express";
import { mongoDBURL, PORT } from "./config.js";
import mongoose from "mongoose";
import {Book} from './models/booksModel.js';
import bookRoute from './routes/booksRoute.js';
import cors from 'cors';

const app = express();

//Middleware for parsing request body
app.use(express.json());

//Middleware for handling CORS POLICY
//Op1: Allow all origins with default of cors(*)
app.use(cors());

//Op2: Allow Custom Origins
// app.use(
//     cors({
//         origin: 'http://localhist:3000',
//         methods: ['GET','POST','PUT','DELETE'],
//         allowedHeaders: ['Content-Type'],
//     })
// )

app.get('/',(request, response) =>{
    console.log(request);
    return response.status(234).send("Welcome to the New World");
});

app.use('/books', bookRoute);

mongoose
    .connect(mongoDBURL)
    .then(() =>{
        console.log("App connected to database");
        app.listen(PORT, () =>{
            console.log(`App is listening to port: ${PORT}`);
        })
    })
    .catch((error) => {
        console.log(error);
    });