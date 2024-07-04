import mongoose from 'mongoose'
import colors from 'colors'

const connectDb = async()=>{
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URL}`);
        console.log(`Connected to database ${conn.connection.host}`.green.white);
    } catch (error) {
        console.log(`Error ocuured ${error}`.red.white);
    }
}

export default connectDb;