const Sub = require("../models/sub");
const slugify = require("slugify");

exports.create = async (req, res) => {
  try {
    const { name, parent } = req.body;
    const SubData =await new Sub({ name, parent, slug: slugify(name) }).save()
    res.json({data:SubData});
  } catch (err) {
    console.log(err);
    res.status(400).send("Create sub failed");
  }
};

exports.list = async (req, res) =>{
  const SubData =await Sub.find({}).sort({ createdAt: -1 }).exec()
  res.json({data:SubData});
}

  exports.read = async (req, res) => {
   const SubData = await Sub.find({ parent: req.params._id }).exec();
    res.json({data:SubData});
  };

exports.update = async (req, res) => {
  const { name, parent } = req.body;
  try {
    const updated = await Sub.findOneAndUpdate(
      { slug: req.params.slug },
      { name, parent, slug: slugify(name) },
      { new: true }
    );
    res.json({data:updated});
  } catch (err) {
    res.status(400).send("Sub update failed");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Sub.findOneAndDelete({ slug: req.params.slug });
    res.json({data:deleted});
  } catch (err) {
    res.status(400).send("Sub delete failed");
  }
};
