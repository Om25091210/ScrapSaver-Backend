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
const db_1 = __importDefault(require("../db"));
const Rates_1 = require("../Rates");
const getDonations = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        let result = yield db_1.default.donations.findMany({
            where: {
                email: email,
            }
        });
        // Send the response with a 200 status code and the user data
        return res.status(200).json({
            response: result,
        });
    }
    catch (error) {
        // If there's an error, handle it by sending a 500 status code and an error message
        return res.status(500).json({
            error: "Failed to get data.",
        });
    }
});
const getDonation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Getting all books list.
        const { email, createdAt } = req.params;
        let result = yield db_1.default.donations.findFirst({
            where: {
                email: email,
                createdAt: createdAt
            }
        });
        // Send the response with a 200 status code and the user data
        return res.status(200).json({
            response: result,
        });
    }
    catch (error) {
        // If there's an error, handle it by sending a 500 status code and an error message
        return res.status(500).json({
            error: "Failed to get data.",
        });
    }
});
const getDonationsByStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Getting all books list.
        const { email, status } = req.params;
        const isAdmin = yield db_1.default.admins.findFirst({ where: { email: email } });
        if (isAdmin) {
            let result;
            if (status === 'Pending') {
                result = yield db_1.default.donations.findMany({
                    where: {
                        NOT: {
                            status: 'Completed'
                        }
                    }
                });
            }
            else {
                result = yield db_1.default.donations.findMany({
                    where: {
                        status: 'Completed'
                    }
                });
            }
            // Send the response with a 200 status code and the user data
            return res.status(200).json({
                response: result,
            });
        }
        else {
            let result;
            console.log(status);
            if (status === 'Pending') {
                result = yield db_1.default.donations.findMany({
                    where: {
                        email: email,
                        NOT: {
                            status: 'Completed'
                        }
                    }
                });
                console.log(express_1.response);
            }
            else {
                result = yield db_1.default.donations.findMany({
                    where: {
                        email: email,
                        status: 'Completed'
                    }
                });
            }
            // Send the response with a 200 status code and the user data
            return res.status(200).json({
                response: result,
            });
        }
    }
    catch (error) {
        // If there's an error, handle it by sending a 500 status code and an error message
        return res.status(500).json({
            error: "Failed to get data.",
        });
    }
});
const createDonation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { imageurl, address, phone, date, time, email, status, donationType, wallet } = req.body;
        const result = yield db_1.default.donations.create({
            data: {
                email: email,
                address: address,
                phone: phone,
                date: date,
                time: time,
                imageurl: imageurl,
                donationType: donationType,
                wallet: wallet,
                status: status,
                updatedAt: new Date().toISOString(),
            },
        });
        return res.status(200).json({
            response: result,
        });
    }
    catch (error) {
        return res.status(500).json({
            response: error,
        });
    }
});
const setResponded = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Assuming 'email' is the identifier for a user in the donations table
        const { email, createdAt } = req.body; // Adjust this according to your request body structure
        // Save the generated OTP ('code') to the database for the specific user/email
        const updatedDonation = yield db_1.default.donations.update({
            where: {
                email: email,
                createdAt: createdAt,
            },
            data: {
                status: "Responded", // Saving the OTP as a string in the 'code' field
            },
        });
        if (updatedDonation) {
            return res.status(200).json({
                message: "Status changed successfully",
                data: updatedDonation,
            });
        }
        else {
            return res.status(500).json({
                error: "Failed to changed status in database.",
            });
        }
    }
    catch (error) {
        console.error("Error change status to the database:", error);
        return res.status(500).json({
            error: "Failed to change status.",
        });
    }
});
const getRates = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ratesData = Rates_1.rates;
        // Extracting categories and items separately for better structure
        const categories = ratesData.scrapCategories.map((category) => {
            return {
                category: category.category,
                items: category.items.map((item) => {
                    return {
                        name: item.name,
                        rate: item.rate,
                    };
                }),
            };
        });
        // Form the response JSON with structured data
        const response = {
            scrapCategories: categories,
        };
        return res.status(200).json(response);
    }
    catch (error) {
        return res.status(500).json({
            response: error.message, // Send the error message for better identification
        });
    }
});
const updateDonation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //Getting all donation data to update.
    const { email, createdAt, type, address, phone, time, date, imageurl, donationType, wallet, picker } = req.body;
    console.log("triggered");
    const dataToUpdate = {};
    if (type !== undefined) {
        dataToUpdate.type = type;
    }
    if (address !== undefined) {
        dataToUpdate.address = address;
    }
    if (phone !== undefined) {
        dataToUpdate.phone = phone;
    }
    if (donationType !== undefined) {
        dataToUpdate.donationType = donationType;
    }
    if (wallet !== undefined) {
        dataToUpdate.wallet = wallet;
    }
    if (picker !== undefined) {
        dataToUpdate.picker = picker;
    }
    if (time !== undefined) {
        dataToUpdate.time = time;
    }
    if (imageurl !== undefined) {
        dataToUpdate.imageurl = imageurl;
    }
    if (date !== undefined) {
        dataToUpdate.date = date;
    }
    dataToUpdate.updatedAt = new Date().toISOString();
    // Perform the update operation with the data object
    const result = yield db_1.default.donations.update({
        where: {
            email: email,
            createdAt: createdAt,
        },
        data: dataToUpdate,
    });
    // Send the response with a 200 status code and the user data
    return res.status(200).json({
        response: result,
    });
    try {
    }
    catch (error) {
        // If there's an error, handle it by sending a 500 status code and an error message
        return res.status(500).json({
            error: "Failed to get data.",
        });
    }
});
const deleteDonation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Get the record and delete.
        const { email, createdAt } = req.body;
        let result = yield db_1.default.donations.delete({
            where: {
                email: email,
                createdAt: createdAt,
            }
        });
        return res.status(200).json({
            response: result,
        });
    }
    catch (error) {
        return res.status(500).json({
            error: "Error in deletion of Pickup",
        });
    }
});
exports.default = { createDonation, getDonation, getDonations, getDonationsByStatus, deleteDonation, getRates, updateDonation, setResponded };
