import multer from "multer";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const id = uuid();
    const lastname = file.originalname.split(".").pop();
    const fileName = `${id}.${lastname}`;
    console.log(fileName)
    cb(null, fileName);
  },
});

export const Imageupload = multer({ storage: storage }).single(
  "buisnessLogoUrl"
);
