import multer from "multer";

const storage = multer.diskStorage({
    destination:"./public/img",
    filename: function (req, file, cb) {
        cd(null, file.originalname);
    },
});

const uploader = multer({storage});

export default uploader;