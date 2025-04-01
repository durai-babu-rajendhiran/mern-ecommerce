const Category = require("../models/category");
const slugify = require("slugify");
const responseHandlier = require('../utils/status');

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await new Category({ name, slug: slugify(name) }).save();
    return responseHandlier.successResponse(category, res);    
  } catch (err) {
    res.status(400).send("Create category failed");
  }
};


exports.read = async (req, res) => {
  let category = await Category.findOne({ slug: req.params.slug }).exec();
  // res.json(category);
  const products = await Product.find({ category }).populate("category").exec();

  res.json({
    category,
    products,
  });
};

exports.list = async (req, res) =>  responseHandlier.successResponse(await Category.find({}).sort({ createdAt: -1 }).exec(), res);    


exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    const updated = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    return responseHandlier.successResponse(updated, res);    

  } catch (err) {
    res.status(400).send("Create update failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug });
    return responseHandlier.successResponse(deleted, res);    
  } catch (err) {
    res.status(400).send("Create delete failed");
  }
};
