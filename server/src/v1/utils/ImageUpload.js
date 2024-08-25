const fs = require("fs");
const path = require("path");
const imgpath = path.resolve(__dirname, "../../../uploads");

const copyFile = (source, destination) => {
  
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(source);
    const writeStream = fs.createWriteStream(destination);
    readStream.on("error", reject);
    writeStream.on("error", reject);
    writeStream.on("finish", resolve);
    readStream.pipe(writeStream);
  });

};

const ImageUpload = async files => {
var condition = false
 if(files?.length>1){
   var filenames = [];
   condition = true
  }else{
    var filenames = "";
    condition = false
 }

  if (files) {
    for (let i = 0; i < files?.length; i++) {
      const file = files[i];
      if (typeof file !== "undefined" && file.originalFilename) {
        let file_ext = file.originalFilename.split(".").pop();
        let filename = Date.now() + "-" + file.originalFilename.split(" ").join("");
        let tmp_path = file.filepath;
        let destination = path.join(imgpath, filename);
        await copyFile(tmp_path, destination);
        if(condition){
          filenames.push(filename);
        }else{
          filenames = filename;
        }
      }
    }
  }
  return filenames;
};


const RemoveImage = async (image) => {
  if (!image) {
    return false;
  }
  const filePath = path.join(imgpath, image);
  try {
    await fs.promises.unlink(filePath);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false; // File does not exist
    }
    console.error('Error removing file:', err);
    return false; // Other errors
  }
};


module.exports = {ImageUpload,RemoveImage};