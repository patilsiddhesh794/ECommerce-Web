import express from 'express'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import formidable from 'express-formidable'
import { categoryProductController, createProductController, deleteProductController, getProductsController, getSingleProductController, ordersController, productCountController, productFilterController, productListController, productPhotoController, searchProductController, similarProductController, successController, updateProductController } from '../controllers/productController.js';

const router = express.Router();

//Create Product Route
router.post('/create-product', requireSignIn, isAdmin, formidable() ,createProductController)

//Update Product Route
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable() ,updateProductController)

//Get all products
router.get('/get-products', getProductsController);

//Get single product
router.get('/get-products/:slug', getSingleProductController);

//Get Photo
router.get('/product-photo/:pid', productPhotoController);

//Delete Product
router.delete('/product-delete/:pid', requireSignIn, isAdmin, deleteProductController)

//Filter Products
router.post('/filter-products', productFilterController)

//Product Count
router.get('/product-count', productCountController);

//Page list product
router.get('/product-list/:page', productListController);

//Search Product
router.get('/search/:keyword', searchProductController);

//Similar Products
router.get('/similar-product/:pid/:cid', similarProductController);

//Category Product
router.get('/category-product/:slug', categoryProductController);

//Order Payment
router.post('/orders', requireSignIn, ordersController);

//Lrgit Paymnet
router.post('/success', requireSignIn, successController);

export default router