import express from "express"
import { addFood , listFood, removeFood } from "../controllers/foodController.js"

import multer from "multer" // image storage system 

const foodRouter = express.Router();

// Image Storage Engine 

const myStorage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null, `${Date.now()}${file.originalname}`)
    }
});

const upload = multer({storage : myStorage})

foodRouter.post("/add", upload.single("image"), addFood)
foodRouter.get("/list", listFood)
foodRouter.post("/remove", removeFood)

export default foodRouter;
