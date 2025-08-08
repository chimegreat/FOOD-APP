import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

import paystack from "paystack-api";
const paystackClient = paystack(process.env.PAYSTACK_SECRET_KEY);

//placing user order for frontend
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5173";

  try {
    const newOrder = new orderModel({
      userId : req.user.id,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

console.log("Incoming order:", req.body);
console.log("User from token:", req.user); // should contain `_id` if using auth

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.user.id, { cartData: {} });

    const totalAmount = req.body.amount * 150000 // payment in dollars
    const email = req.body.email; // make sure email is included in req.body

    const response = await paystackClient.transaction.initialize({
      email,
      amount: totalAmount,
      callback_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
    });
    
    res.json({
      success: true,
      payment: response.data ,
      orderId: newOrder._id
    });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error placing order" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, reference } = req.body;

  try {
    const result = await paystackClient.transaction.verify({ reference });

    if (result.data.status === "success") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error verifying payment" });
  }
}

// user orders for frontend
const   userOrders = async (req,res) => {
  try {
    console.log(req.user.id)
    const orders = await orderModel.find({userId : req.user.id});
    res.json({success : true, data : orders})
  } catch (error) {
    console.log(error);
    res.json({success:false, message : "Error"})
  }
}

// Listing orders for admin panel
const listOrders = async (req,res) => {
  try {
    const orders = await orderModel.find({});
    res.json({sucess:true, data:orders})
  } catch (error) {
    console.log(error);
    res.json({sucess:false, message:"Error"})
  }
}

//api for updating order status
const updateStatus = async (req, res) =>{
    try {
      await orderModel.findByIdAndUpdate(req.body.orderId, {status : req.body.status});
      res.json({success : true, message : "Status Updated"})
    } catch (error) {
      console.log(error);
      res.json({success:false,message : "Error"})
    }
}

export {placeOrder, verifyOrder, userOrders, listOrders,updateStatus}