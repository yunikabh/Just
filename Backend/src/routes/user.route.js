import { Router } from "express";
import { getUser, getUserById,updateUser,deleteUser } from "../controllers/user.controller.js";
// import { register, login,addBook,getBooks,getBookById,updateBooks,deleteBooks } from "../controllers/user.controller.js";

const router = Router();
router.route("/getUsers").get(getUser);
router.route("/getUserById/:id").get(getUserById);
router.route("/updateUser/:id").put(updateUser);
router.route("/deleteUser/:id").delete(deleteUser);


export default router;