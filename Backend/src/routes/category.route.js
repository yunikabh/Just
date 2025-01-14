import {Router} from "express"

import { verifyUser } from "../middlewares/auth.middleware.js"
import {addCategory,deleteCategory,getCategory, updateCategory} from "../controllers/category.controller.js";

const router = Router();


router.route('/addCategory').post(verifyUser,addCategory);
router.route('/getCategory').get(verifyUser,getCategory);
router.route('/updateCategory/:id').put(verifyUser,updateCategory);
router.route('/deleteCategory/:id').delete(verifyUser,deleteCategory);



export default router;