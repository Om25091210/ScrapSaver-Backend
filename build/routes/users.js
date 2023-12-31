"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = __importDefault(require("../controllers/users"));
const donation_1 = __importDefault(require("../controllers/donation"));
const OTP_1 = __importDefault(require("../controllers/OTP"));
const Payment_1 = __importDefault(require("../controllers/Payment"));
// Import the middleware and function from the imgUpload controller
const multer = require("multer");
const firebsae = require("firebase/app");
const storage_1 = require("firebase/storage");
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
const router = (0, express_1.Router)();
const upload = multer({ storage: multer.memoryStorage() });
//routers for Users
router.get("/users", users_1.default.getUsers);
router.get("/user/:email", users_1.default.getUser);
router.put("/update/:email", users_1.default.updateUser);
router.post("/new_user", users_1.default.createUser);
router.delete("/delete_user/:email", users_1.default.deleteUser);
router.post('/image-upload', upload.single("filename"), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const storage = (0, storage_1.getStorage)();
        if (!req.file) {
            throw new Error('No file uploaded');
        }
        const storageRef = (0, storage_1.ref)(storage, `files/${(_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname}`);
        const snapshot = yield (0, storage_1.uploadBytes)(storageRef, req.file.buffer);
        const downloadURL = yield (0, storage_1.getDownloadURL)(snapshot.ref);
        console.log('File available at', downloadURL);
        res.json({
            message: 'File uploaded successfully',
            fileUrl: downloadURL
        });
    }
    catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ error: 'Error uploading file' });
    }
}));
//Router for getting rates.
router.get("/rates", donation_1.default.getRates);
//Router for generating OTP.
router.post("/generate-otp", OTP_1.default.saveOTPToDatabase);
//Route for Verifying OTP.
router.get("/verify-otp", OTP_1.default.VerifyOTP);
//Route for addition of amount to db.
router.post("/add-amount", Payment_1.default.saveAmountToDatabase);
router.get("/get-amount", Payment_1.default.getAmount);
router.post("/verify-amount", Payment_1.default.VerifyAmountStatus);
//router for Donations
router.post("/create-donation", donation_1.default.createDonation);
router.get("/donations/:email", donation_1.default.getDonations);
//updateDonation
router.put("/update/donation", donation_1.default.updateDonation);
router.get("/donations/:email/:status", donation_1.default.getDonationsByStatus);
router.delete("/delete-donation", donation_1.default.deleteDonation);
exports.default = router;
