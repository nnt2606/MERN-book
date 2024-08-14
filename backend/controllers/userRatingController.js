import { UserRating } from "../models/userRatingModel.js";
import { BookRating } from "../models/bookRatingModel.js";
import logActivity from "../config/logger.js";

export const createNewRating = async(req, res) =>{
    try{
        const {bookId, rate, comment} = req.body;
        // console.log(req.body);
        // console.log(req.body);
        const userId = req._id;
        const rating = new UserRating({userId: userId, bookId: bookId, rate: rate, comment: comment});
        const bookRate = await BookRating.findOne({bookId: bookId});
        // console.log(bookRate);
        // console.log(rating);
        switch(rate){
            case 1:
                bookRate.stars1+=1;
                break;
            case 2:
                bookRate.stars2+=1;
                break;
            case 3:
                bookRate.stars3+=1;
                break;
            case 4:
                bookRate.stars4+=1;
                break;
            case 5:
                bookRate.stars5+=1;
                break;
        }
        bookRate.reviews+=1;
        

        await rating.save();
        await bookRate.save();
        await logActivity(req._id, 'CREATE NEW RATING', rating._id, 'Rating', rating);
        res.sendStatus(200);
    }catch(error){
        console.log(error);
        res.status(500).json({message: error.message});
    }
}

export const getRatingByBook = async(req, res) =>{
    try{
        const{bookId} = req.body;
        // console.log(req.body);
        const ratings = await UserRating.find({bookId: bookId}).sort({createdAt: -1}).populate({path:'userId', model:'User',select:'name'});
        // ratings.map((rating) =>{
        //     const currentTimeUTC = new Date(rating.createdAt);
        //     // Define the GMT+7 timezone offset in milliseconds (7 hours ahead of UTC)
        //     const timezoneOffset = 7 * 60 * 60 * 1000;
        //     // Calculate the timestamp in GMT+7
        //     const currentTimeGMTplus7 = new Date(currentTimeUTC.getTime() + timezoneOffset);
        //     return {
        //         ...rating,
        //         createdAt: currentTimeGMTplus7
        //     }
        // })
        const countRating = await BookRating.findOne({bookId: bookId});
        // console.log(countRating);
        const totalReview = countRating.reviews;
        const mediumRate = (countRating.stars1+countRating.stars2*2+countRating.stars3*3+countRating.stars4*4+countRating.stars5*5)/(countRating.stars1+countRating.stars2+countRating.stars3+countRating.stars4+countRating.stars5);
        res.status(200).json({mediumRate,totalReview ,ratings});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export const getRatingByUser = async(req, res) =>{
    try{
        const {userId} = req.body;
        const ratings = await UserRating.find({userId: userId}).sort({createdAt:-1}).populate({path:'bookId',model:'Book'});
        res.status(200).jsom(ratings);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}