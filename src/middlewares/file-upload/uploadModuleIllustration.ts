import multer, {diskStorage} from "multer"

const storage = diskStorage({
    destination:"public/uploads/modules/illustrations",
    filename:(req,file, cb)=>{
        const fileName = `${file.originalname.split(".")[0]}-${Date.now()}.${file.originalname.split(".")[1]}`;
        cb(null, fileName);
    }
});
export default multer({storage});