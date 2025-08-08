import userModel from "../models/userModel.js"

// add items to user cart


const addToCart = async (req, res) => {
  try {
    console.log("USER ID from token:", req.userId);

    let userData = await userModel.findById(req.userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData;

    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }

    await userModel.findByIdAndUpdate(req.userId, { cartData });

    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};


// remove items from user cart

const removeFromCart = async (req,res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        if (cartData[req.body.itemId] > 0) {
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId, {cartData});
        res.json({success:true, message : "Removed From Cart"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message: "Error"})
    }
}

//MORE SECURE WAY STUDY THIS 
// const removeFromCart = async (req, res) => {
//   try {
//     const userId = req.userId; // ✅ use from middleware
//     const { itemId } = req.body;

//     const userData = await userModel.findById(userId);
//     const cartData = userData.cartData;

//     if (cartData[itemId] > 0) {
//       cartData[itemId] -= 1;
//     }

//     await userModel.findByIdAndUpdate(userId, { cartData });

//     res.json({ success: true, message: "Removed From Cart" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "Error" });
//   }
// };


// fetch User cart data

const getCart = async (req, res) => {
  try {
    console.log("req.userId:", req.userId);

    const userData = await userModel.findById(req.userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const cartData = userData.cartData || {};
    res.json({ success: true, cartData });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error getting cart data" });
  }
};



export {addToCart, removeFromCart, getCart}