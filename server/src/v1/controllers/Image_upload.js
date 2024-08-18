const formidable = require('formidable');
const imageUpload = require('../utils/ImageUpload');

// req.files.file.path
exports.upload = async (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        var file = await imageUpload(files.mediaUrls);
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


