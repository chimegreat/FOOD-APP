import mongoose from "mongoose";

export const connectDB = async () =>{
    await mongoose.connect('mongodb+srv://okorogreat46:youknowitwasyou@cluster0.a9czops.mongodb.net/food-del').then(() => console.log("DB Connected"));
}