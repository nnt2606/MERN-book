import mongoose, { Schema } from 'mongoose';

const ObjectId = Schema.Types.ObjectId;
const copySchema = new mongoose.Schema(
    {
        ISBN: {
            type: String,
            required: true,
        },
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref:  'Book',
            required: true,
        },
        description:{
            type: String,
        },
        pages: {
            type: Number,
            required: false,
        },
        format: {
            type: String,
            required: false,
        },
        language: {
            type: String,
            required: false,
        },
        publishYear: {
            type: Number,
            required: false,
        },
        Publisher: {
            type: String,
            required: false,
        },
        imgURL: {
            type: String,
            required: false,
        },
        inStock: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            default: 0,
        },
        sold: {
            type: Number,
            default: 0
        },
        onHold: {
            type: Number,
            default: 0,
        },
        discount: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'DiscountBook',
        }
    },
    {
        timestamps: true,
    }
);

export const Copy = mongoose.model('Copy', copySchema);