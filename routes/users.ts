import {Express, Request, Response, NextFunction, Router} from 'express';
import user_controllers from "../controllers/users";
import donation_controllers from "../controllers/donation";
import OTP from "../controllers/OTP";
import Payment from "../controllers/Payment";
// Import the middleware and function from the imgUpload controller
const multer = require("multer");
const firebsae = require("firebase/app");
import { getStorage, ref, uploadBytes,getDownloadURL  } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyBzQ-bQBLysok0nfHR0ZQJ82ftruYyGpoc",
    authDomain: "scrapsaver-f21f5.firebaseapp.com",
    projectId: "scrapsaver-f21f5",
    storageBucket: "scrapsaver-f21f5.appspot.com",
    messagingSenderId: "1062344693975",
    appId: "1:1062344693975:web:1de04e29f491bb816ab892",
    measurementId: "G-02YMLSBGLX"
  };
  
firebsae.initializeApp(firebaseConfig);
  
const router:Router = Router();

const upload = multer({ storage: multer.memoryStorage() });

//routers for Users
router.get("/users",user_controllers.getUsers);
router.get("/user/:email",user_controllers.getUser);
router.put("/update/:email",user_controllers.updateUser);
router.post("/new_user",user_controllers.createUser);
router.delete("/delete_user/:email",user_controllers.deleteUser);

router.post('/image-upload', upload.single("filename"), async (req, res, next) => {
  try {
      const storage = getStorage();
      if (!req.file) {
          throw new Error('No file uploaded');
      }

      const storageRef = ref(storage, `files/${req.file?.originalname}`);
      const snapshot = await uploadBytes(storageRef, req.file.buffer);

      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('File available at', downloadURL);

      res.json({
          message: 'File uploaded successfully',
          fileUrl: downloadURL
      });
  } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).send({ error: `Error uploading file with error : ${error} ` });
  }
});

//Router for getting rates.
router.get("/rates",donation_controllers.getRates);

//Router for generating OTP.
router.post("/generate-otp",OTP.saveOTPToDatabase);
router.post("/verify-otp",OTP.VerifyOTP);

//Route for addition of amount to db.
router.post("/add-amount",Payment.saveAmountToDatabase);
router.get("/get-amount",Payment.getAmount);
router.post("/verify-amount",Payment.VerifyAmountStatus);

//router for Donations
router.post("/create-donation",donation_controllers.createDonation);
router.get("/donations/:email",donation_controllers.getDonations);
router.get("/donation/:email/:createdAt",donation_controllers.getDonation);
router.post("/confirm-pickup",donation_controllers.setResponded);

//updateDonation
router.put("/update-donation",donation_controllers.updateDonation);
router.get("/donations/:email/:status",donation_controllers.getDonationsByStatus);
router.delete("/delete-donation",donation_controllers.deleteDonation);

export default router