import multer from "multer";
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'src/uploads/gazettes/');
    },
    filename: (req, file, cb) => {
        const nom = Date.now() + '-' + file.originalname;
        cb(null, nom);
    }
});

const fileFilter = (req, file, cb) => {
     const mimetypesAcceptes = [
    'application/pdf',
    'application/octet-stream',
    'binary/octet-stream'
  ];
  if (mimetypesAcceptes.includes(file.mimetype) || file.originalname.endsWith('.pdf')) {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers PDF sont autorisés'), false);
  }
};

const upload = multer({storage, fileFilter});

export default upload