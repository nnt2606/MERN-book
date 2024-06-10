import mongoose from "mongoose";

const bookRatingSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    stars5: {
        type: Number,
        default: 0,
    },
    stars4: {
        type: Number,
        default: 0,
    },
    stars3: {
        type: Number,
        default: 0,
    },
    stars2: {
        type: Number,
        default: 0,
    },
    stars1: {
        type: Number,
        default: 0,
    },
    reviews: {
        type: Number,
        default: 0,
    }
}, {
    timestamps: true,
})

export const BookRating = mongoose.model('BookRating',bookRatingSchema);

