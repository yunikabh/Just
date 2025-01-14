import { Router } from "express";
// import { addBook,getBooks,getBookById,updateBooks,deleteBooks } from "../controllers/book.controller.js";
import { verifyUser } from "../middlewares/auth.middleware.js";
import {addToCart,getCartDetails, updateCart,deleteCart } from "../controllers/cart.controller.js";

const router = Router();

router.route('/addToCart').post(verifyUser,addToCart);
router.route('/getCartDetails').get(verifyUser,getCartDetails);
router.route('/updateCart/:id').put(verifyUser,updateCart);
router.route('/deleteCart/:id').delete(verifyUser,deleteCart);




export default router;

