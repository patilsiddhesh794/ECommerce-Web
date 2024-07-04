import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        unique: true,
        reuired: true
    },
    phone:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    address:{
        type: {},
        required: true
    },
    role:{
        type: Number,
        default: 0
    },
    blocked:{
        type: String,
        default: "Unblocked"
    },
    cart:{
        type: []
    }
},{timestamps:true})


export default mongoose.model('users',userSchema)