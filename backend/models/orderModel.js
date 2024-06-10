import mongoose, {Schema} from "mongoose";

const cartModel = new mongoose.Schema(
    {
        copyId: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        }
    }
) 

const addressSchema = new mongoose.Schema(
    {
        address: {
            type: String,
            required: true,
        },
        ward: {
            type: String,
            required: true,
        },
        district: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        name: {
            type:String,
            required: true,
        },
        phoneNumber: {
            type:Number,
            required: true,
        }
    }
)

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        cart: {
            type: [cartModel],
        },
        shippingcharge: {
            type: Number,
        },
        subtotal: {
            type: Number,
        },
        discount:{
            type: Number,
        },
        totalPayment:{
            type: Number,
        },
        address: {
            type: addressSchema,
        },
        userNote: {
            type: [String],
        },
        status: {
            type: String,
            default: 'On pending',
        },
        available: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true,
    }
)

export const Order = mongoose.model('Order', orderSchema);