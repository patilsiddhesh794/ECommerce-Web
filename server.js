import express from 'express'
import colors from 'colors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import connectDb from './db.js'
import authRoutes from './routes/authRouter.js'
import categoryRoutes  from './routes/categoryRoutes.js'
import productsRoutes from './routes/productsRoutes.js'
import cors from "cors";

//Rest api 
const app = express()

//configure now
dotenv.config()

//Database Connection
connectDb();

//External middlewares
app.use(cors());
app.use(express.json())
app.use(morgan('dev'))

//Routes
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/category',categoryRoutes);
app.use('/api/v1/product',productsRoutes)

//Configure env
dotenv.config()

//Define port
const PORT = process.env.PORT;

app.get('/', (req,res)=>{
    res.send('<h1>Welcome to ecommerse website</h1>');
})

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})