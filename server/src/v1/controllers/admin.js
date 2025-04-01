const Order = require("../models/order");
const responseHandlier = require('../utils/status');

exports.orders = async (req, res) => {
  try {
    let allOrders = await Order.find({})
      .sort("-createdAt")
      .populate("products.product")
      .exec();
     return responseHandlier.successResponse(allOrders, res);
  } catch (error) {
    return responseHandlier.errorResponse(error.message, res);
  }
};

exports.orderStatus = async (req, res) => {
  try{
  const { orderId, orderStatus } = req.body;
  let updated = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus },
    { new: true }
  ).exec();
  return responseHandlier.successResponse(updated, res);
} catch (error) {
  return responseHandlier.errorResponse(error.message, res);
}
};
