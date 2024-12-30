const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        const isVideo = file.mimetype.startsWith('video/');
        const uploadPath = path.join(__dirname,'../../../public/uploads',isVideo ? 'videos' : 'images');
        cb(null,uploadPath);
    },
    filename: function (req,file,cb){
        cb(null,file.originalname);
    }
})

const upload = multer({storage: storage});
module.exports = upload;

// module.exports = multer({storage: storage});