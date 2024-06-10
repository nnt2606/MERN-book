import mongoose, {Schema} from "mongoose";

const discountBookShcema = new mongoose.Schema(
    {
        discountNumber: {
            type: Number,
            required: true,
        },
        startAt: {
            type: Date,
            required: true,
        },
        endAt: {
            type: Date,
            required: true,
        },
        status: {
            type: Boolean,
            default: false,
        }        
    }
)

export const DiscountBook = mongoose.model('DiscountBook', discountBookShcema);