import mongoose, {Schema} from "mongoose";

const userRatingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User',
            required: true,
        },
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
            required: true,
        },
        rate: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            required: false,
        }
    },
    {
        timestamps:true,
    }
)
export const UserRating = mongoose.model('UserRating', userRatingSchema);