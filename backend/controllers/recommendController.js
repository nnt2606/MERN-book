import { Copy } from "../models/copyModel.js"
import axios from 'axios';
import mongoose from "mongoose";

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8004',
    headers: {
        'Content-Type': 'application/json',
    }
})

export const getRecommend = async(req,res)=>{
    try{
        const {_id} = req.body
        const response = await axiosInstance.post('rec_book_cosine', JSON.stringify({id: _id, limit: 6}))
        const objectIds = response.data.copy_ids.map(id => new mongoose.Types.ObjectId(id));
        const aggregationPipeline = [
            { $match: { _id: { $in: objectIds } }},
            {
                $lookup: {
                  from: 'books',
                  localField: 'bookId',
                  foreignField: '_id',
                  as: 'bookId'
                }
              },
              { $unwind: '$bookId' },
              {
                $project: {
                  _id: 1,
                  price: 1,
                  inStock: 1,
                  imgURL: 1,
                  sold: 1,
                  'bookId._id': 1,
                  'bookId.title': 1,
                  'bookId.genre': 1,
                  'bookId.authors': 1,
                }
              },
        ]

        const result = await Copy.aggregate(aggregationPipeline);
        res.status(200).json(result);
        

    }catch(error) {
        res.status(400).json({message: error.message})
    }
}