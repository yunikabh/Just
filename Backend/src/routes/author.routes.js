import {Router} from "express"

import { verifyUser } from "../middlewares/auth.middleware.js"
import { addAuthor,getAuthor } from "../controllers/author.controller.js";
const router = Router();


router.route('/addAuthor').post(verifyUser,addAuthor)

router.route('/getAuthor').get(verifyUser,getAuthor)

export default router;