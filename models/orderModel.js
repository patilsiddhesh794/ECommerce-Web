import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    products:[
        {
            type: mongoose.ObjectId,
            ref: "products",
        },
    ],
    payment: {},
    buyer: {
        type: mongoose.ObjectId,
        ref: "users",
    },
    status: {
        type: String,
        default: "Not Process",
        enum: ["Not Process", "Processing", "Shipped", "Delivered", "Cancel"],
      },
    amount: {
        type: Number,
        required: true
    }
}, {timestamps: true}
);

export default mongoose.model("Orders", orderSchema);