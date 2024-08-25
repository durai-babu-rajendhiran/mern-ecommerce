const formidable = require('formidable');
const {ImageUpload,RemoveImage} = require('../utils/ImageUpload');

// req.files.file.path
exports.upload = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        var file = await ImageUpload(files.mediaUrls);
        if (Array.isArray(file)) {
            file = file
        }else{
            file = [file]
        }
        if (!file) {
          return res.status(406).json({
              message: "Please send mandatory fields",
              status: false
          });
      }
  res.json({
    public_id: file,
    url: file,
  });
});
} catch (error) {
    res.status(500).json({ error: error.message });
}
}



exports.remove = async(req, res) => {
    const { image } = req.body; // Assuming you pass the image name in the request body
    console.log(image)
    if (!image) {
      return res.status(400).json({ error: 'Image name is required' });
    }
    const filePath = await RemoveImage(image);
    if(!filePath){
        return res.status(500).json({ error: "Erro in Image delete" });
    }
      return res.json({ message: 'Image deleted successfully' });
  };

