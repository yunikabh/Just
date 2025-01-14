import multer from "multer";
import path from "path";

//Configure Storage
const storage = multer.diskStorage({
    //Set the destination folder for uploaded files
    destination: function(req,file,cb){
        cb(null,'public/temp');
    },

    //set the filename for uploaded files
    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        const timestamp =Date.now();
        const fileExtension = path?.extname(file.originalname)
        cb(null, file.fieldname + '-' + timestamp + fileExtension)
      }
    })

//Initialize multer with the configured storage
const upload = multer({storage :storage});

export default upload;