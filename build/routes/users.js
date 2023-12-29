"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = __importDefault(require("../controllers/users"));
const donation_1 = __importDefault(require("../controllers/donation"));
// Import the middleware and function from the imgUpload controller
const multer = require("multer");
const firebsae = require("firebase/app");
// const firebaseConfig = {
//     apiKey: "AIzaSyBzQ-bQBLysok0nfHR0ZQJ82ftruYyGpoc",
//     authDomain: "scrapsaver-f21f5.firebaseapp.com",
//     projectId: "scrapsaver-f21f5",
//     storageBucket: "scrapsaver-f21f5.appspot.com",
//     messagingSenderId: "1062344693975",
//     appId: "1:1062344693975:web:1de04e29f491bb816ab892",
//     measurementId: "G-02YMLSBGLX"
//   };
// firebsae.initializeApp(firebaseConfig);
// const storage = getStorage();
// const upload = multer({ storage: multer.memoryStorage() });
const router = (0, express_1.Router)();
//routers for Users
router.get("/users", users_1.default.getUsers);
router.get("/user/:email", users_1.default.getUser);
router.put("/update/:email", users_1.default.updateUser);
router.post("/new_user", users_1.default.createUser);
router.delete("/delete_user/:email", users_1.default.deleteUser);
// router.post('/image-upload', upload.single("filename"), async (req, res, next) => {
//   try {
//       if (!req.file) {
//           throw new Error('No file uploaded');
//       }
//       const storageRef = ref(storage, `files/${req.file?.originalname}`);
//       const snapshot = await uploadBytes(storageRef, req.file.buffer);
//       const downloadURL = await getDownloadURL(snapshot.ref);
//       console.log('File available at', downloadURL);
//       res.json({
//           message: 'File uploaded successfully',
//           fileUrl: downloadURL
//       });
//   } catch (error) {
//       console.error("Error uploading file:", error);
//       res.status(500).json({ error: 'Error uploading file' });
//   }
// });
//Router for getting rates.
router.get("/rates", donation_1.default.getRates);
//router for Donations
router.post("/create-donation", donation_1.default.createDonation);
router.get("/donations/:email", donation_1.default.getDonations);
router.get("/donations/:email/:status", donation_1.default.getDonationsByStatus);
router.delete("/delete-donation", donation_1.default.deleteDonation);
exports.default = router;
