const Category = require("../models/category");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await new Category({ name, slug: slugify(name) }).save();
    res.json({data:category});
  } catch (err) {
    res.status(400).send("Create category failed");
  }
};

exports.list = async (req, res) =>
  res.json({data:await Category.find({}).sort({ createdAt: -1 }).exec()});

exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    const updated = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    res.json({data:updated});
  } catch (err) {
    res.status(400).send("Create update failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug });
    res.json({data:deleted});
  } catch (err) {
    res.status(400).send("Create delete failed");
  }
};
