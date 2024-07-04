import { error } from 'console';
import productsModel from '../models/productsModel.js';
import categoryModel from '../models/categoryModel.js';
import orderModel from '../models/orderModel.js';
import fs from 'fs'
import slugify from 'slugify';
import { v4 } from 'uuid';
import Razorpay from 'razorpay';
import userModel from '../models/userModel.js';
import crypto from 'crypto'

export const createProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is required' });
            case !description:
                return res.status(500).send({ error: 'Description is required' });
            case !price:
                return res.status(500).send({ error: 'Price is required' });
            case !category:
                return res.status(500).send({ error: 'Category is required' });
            case !quantity:
                return res.status(500).send({ error: 'Quantity is required' });
            case !photo || photo.size > 1000000:
                return res.status(500).send({ error: 'Photo is required and should be less than 1MB' });
        }

        const products = new productsModel({ ...req.fields, slug: slugify(name) });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }

        await products.save();
        res.status(200).send({
            success: true,
            message: 'Product Created Successfully',
            products
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error Occured While Creating Product',
            error
        })
    }
}

//Get all products controller
export const getProductsController = async (req, res) => {
    try {
        const products = await productsModel.find({}).populate('category').select('-photo').limit(12).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            totalCount: products.length,
            message: 'Products List',
            products
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error Occured While Getting Products',
            error
        })
    }
}

//Get Single Product Controller
export const getSingleProductController = async (req, res) => {
    try {
        const product = await productsModel.findOne({ slug: req.params.slug }).select('-photo').populate('category');
        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'Product Not Found',
            });
        }
        res.status(200).send({
            success: true,
            message: 'Product Found Successfully',
            product
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while getting the product',
            error
        })
    }
}

//Photo Controller
export const productPhotoController = async (req, res) => {
    try {
        const product = await productsModel.findById(req.params.pid).select('photo');
        if (product.photo.data) {
            res.set('Content-type', product.photo.contentType);
            res.status(201).send(product.photo.data)
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error Occured while getting photo',
            error
        })
    }
}

//Delete Controller
export const deleteProductController = async (req, res) => {
    try {
        await productsModel.findByIdAndDelete(req.params.pid).select('-photo');
        res.status(200).send({
            success: true,
            message: 'Product Deleted Successfully'
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error while deleting product',
            error
        })
    }
}

//Update Controller
export const updateProductController = async (req, res) => {
    try {
        const { name, slug, description, price, category, quantity, shipping } = req.fields;
        const { photo } = req.files;

        switch (true) {
            case !name:
                return res.status(500).send({ error: 'Name is required' });
            case !description:
                return res.status(500).send({ error: 'Description is required' });
            case !price:
                return res.status(500).send({ error: 'Price is required' });
            case !category:
                return res.status(500).send({ error: 'Category is required' });
            case !quantity:
                return res.status(500).send({ error: 'Quantity is required' });
            case photo && photo.size > 1000000:
                return res.status(500).send({ error: 'Photo is required and should be less than 1MB' });
        }

        const products = await productsModel.findByIdAndUpdate(req.params.pid, { ...req.fields, slug: slugify(name) }, { new: true });
        if (photo) {
            products.photo.data = fs.readFileSync(photo.path);
            products.photo.contentType = photo.type;
        }

        await products.save();
        res.status(200).send({
            success: true,
            message: 'Product Updated Successfully',
            products
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error Occured While Updating Product',
            error
        })
    }
}

//Filter Controller
export const productFilterController = async (req, res) => {
    try {
        const { checked, radio } = req.body;
        let args = {}
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        const products = await productsModel.find(args);
        res.status(201).send({
            success: true,
            message: 'Got Filtered Products Successfully',
            products
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error Occured while filtering products',
            error
        })
    }
}

//Product Count Controller
export const productCountController = async (req, res) => {
    try {
        const total = await productsModel.find({}).estimatedDocumentCount();
        res.status(201).send({
            success: true,
            message: 'Count Got Successfully',
            total
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error occurured while getting count',
            error
        })
    }
}

//Page list Controller
export const productListController = async (req, res) => {
    try {
        const perPage = 8;
        const page = req.params.page ? req.params.page : 1;
        const products = await productsModel.find({}).select('-photo').skip((page - 1) * perPage).limit(perPage).sort({ createdAt: -1 });
        res.status(201).send({
            success: true,
            message: 'Got Product List Successfully',
            products
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error occurured while getting product list',
            error
        })
    }
}

//Search Controller
export const searchProductController = async (req, res) => {
    try {
        const { keyword } = req.params;
        const results = await productsModel.find({
            $or: [
                { name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ]
        }).select('-photo');

        res.json(results);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error In Search API',
            error
        })
    }
}

//Similar Product Controller
export const similarProductController = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        const products = await productsModel.find({
            category: cid,
            _id: { $ne: pid }
        }).select('-photo').limit(4).populate('category');

        res.status(201).send({
            success: true,
            message: 'Similar Products Got Successfully',
            products
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error to fetch similar products',
            error
        })
    }
}

export const categoryProductController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug });
        const products = await productsModel.find({ category: category._id }).populate('category').select('-photo');
        return res.status(200).send({
            success: true,
            message: 'Successfully Got Products',
            products
        })


    } catch (error) {
        return res.status(500).send({
            success: false,
            message: 'Error in category product',
            error
        })
    }
}

//Payment orders controller
export const ordersController = async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });

        const options = {
            amount: req.body.amount * 100, // amount in smallest currency unit
            currency: req.body.currency,
            receipt: v4(),
        };

        const order = await instance.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        res.status(200).json(order);
    } catch (error) {
        res.status(500).send(error);
    }
};

export const successController = async (req, res) => {
    try {
        // getting the details back from our font-end
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        } = req.body.data;


        // Creating our own digest
        // The format should be like this:
        // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
        const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");

        // comaparing our digest with the actual signature
        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legit!" });

        // THE PAYMENT IS LEGIT & VERIFIED
        // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT
        const user = await userModel.findById(req.user._id);

        const updateQuantities = async (cart) => {
            const updatePromises = cart.map(async (element) => {
                const product = await productsModel.findById(element._id);
                if (product) {
                    const newQuantity = product.quantity - 1;
                    return productsModel.findByIdAndUpdate(element._id, { quantity: newQuantity }, { new: true });
                } else {
                    throw new Error(`Product with ID ${element._id} not found`);
                }
            });

            // Wait for all updates to complete
            return Promise.all(updatePromises);
        };

        // Use the function and handle potential errors
        try {
            const updatedProducts = await updateQuantities(req.body.cart);
        } catch (error) {
            console.error('Error updating product quantities:', error);
        }
        user.cart = [];
        await user.save();

        //Save order details
        const order = new orderModel({
            products: req.body.cart,
            payment: req.body.data,
            buyer: req.user._id,
            amount: req.body.amount
        }).save();

        res.json({
            msg: "success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
    } catch (error) {
        res.status(500).send(error);
    }
}

