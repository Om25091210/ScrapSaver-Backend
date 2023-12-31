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
const saveAmountToDatabase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Getting the request body.
        const { email, createdAt, amount } = req.body; // Adjust this according to your request body structure
        const dataToUpdate = {};
        if (amount !== undefined) {
            dataToUpdate.amount = amount;
        }
        dataToUpdate.status = "Transaction Pending";
        // Save the generated OTP ('code') to the database for the specific user/email
        const updatedDonation = yield db_1.default.donations.update({
            where: {
                email: email,
                createdAt: createdAt,
            },
            data: dataToUpdate,
        });
        if (updatedDonation) {
            return res.status(200).json({
                message: "OTP saved successfully",
                data: updatedDonation,
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
const VerifyAmountStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Getting the request body.
        const { email, createdAt } = req.body; // Adjust this according to your request body structure
        const dataToUpdate = {};
        dataToUpdate.status = "Completed";
        // Save the generated OTP ('code') to the database for the specific user/email
        const updatedDonation = yield db_1.default.donations.update({
            where: {
                email: email,
                createdAt: createdAt,
            },
            data: dataToUpdate,
        });
        if (updatedDonation) {
            return res.status(200).json({
                message: "PickUp successfull",
                data: updatedDonation,
            });
        }
        else {
            return res.status(500).json({
                error: "Failed to save status in database.",
            });
        }
    }
    catch (error) {
        console.error("Error saving status to the database:", error);
        return res.status(500).json({
            error: "Failed to save status.",
        });
    }
});
const getAmount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Getting the request body to find and evaluate.
        const { email, createdAt } = req.body;
        // Get the code from the donation for the provided email and createdAt
        const donation = yield db_1.default.donations.findFirst({
            where: {
                email: email,
                createdAt: createdAt,
            },
        });
        if (donation) {
            const savedAmount = donation.amount; // Fetch the saved OTP from the database
            if (savedAmount) {
                return res.status(200).json({
                    message: "Amount retrieved successful",
                    amount: savedAmount,
                });
            }
            else {
                return res.status(400).json({
                    error: "Amount retrieved failed.",
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
exports.default = { saveAmountToDatabase, getAmount, VerifyAmountStatus };
