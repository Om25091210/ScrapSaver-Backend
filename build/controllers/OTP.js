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
const db_1 = __importDefault(require("../db"));
const saveOTPToDatabase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const OTP_LENGTH = 6;
        const min = Math.pow(10, OTP_LENGTH - 1);
        const max = Math.pow(10, OTP_LENGTH) - 1;
        const otp = Math.floor(Math.random() * (max - min + 1)) + min;
        // Assuming 'email' is the identifier for a user in the donations table
        const { email, createdAt } = req.body; // Adjust this according to your request body structure
        // Save the generated OTP ('code') to the database for the specific user/email
        const updatedDonation = yield db_1.default.donations.update({
            where: {
                email: email,
                createdAt: createdAt,
            },
            data: {
                code: otp.toString(), // Saving the OTP as a string in the 'code' field
            },
        });
        if (updatedDonation) {
            return res.status(200).json({
                message: "OTP saved successfully",
                otp: otp,
            });
        }
        else {
            return res.status(500).json({
                error: "Failed to save OTP in database.",
            });
        }
    }
    catch (error) {
        console.error("Error saving OTP to the database:", error);
        return res.status(500).json({
            error: "Failed to save OTP.",
        });
    }
});
const VerifyOTP = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Getting the request body to find and evaluate.
        const { email, createdAt, code } = req.body;
        // Get the code from the donation for the provided email and createdAt
        const donation = yield db_1.default.donations.findFirst({
            where: {
                email: email,
                createdAt: createdAt,
            },
        });
        if (donation) {
            const savedOTP = donation.code; // Fetch the saved OTP from the database
            if (savedOTP === code) {
                const updateDonationStatus = yield db_1.default.donations.update({
                    where: {
                        email: email,
                        createdAt: createdAt,
                    },
                    data: {
                        status: "Transaction Pending"
                    }
                });
                return res.status(200).json({
                    message: "OTP verification successful",
                });
            }
            else {
                return res.status(400).json({
                    error: "OTP verification failed. Provided OTP does not match.",
                });
            }
        }
        else {
            return res.status(404).json({
                error: "Donation record not found for the provided email and createdAt.",
            });
        }
    }
    catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({
            error: "Failed to verify OTP.",
        });
    }
});
exports.default = { saveOTPToDatabase, VerifyOTP };
