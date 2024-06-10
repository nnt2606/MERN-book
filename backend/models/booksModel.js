import mongoose, { Schema } from "mongoose";

const ObjectId = Schema.Types.ObjectId;
const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        authors: {
            type: [String],
            required: true,
        },
        series: {
            type: String,
            required: false,
        },
        genre: {
            type: [String],
            required: true,
        }
    },
    {
        timestamps: true
    }
);

export const Book = mongoose.model('Book', bookSchema);