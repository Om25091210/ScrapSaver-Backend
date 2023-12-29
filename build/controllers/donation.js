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
const fs = require('fs');
const path = require('path');
const getDonations = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Getting all books list.
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
const getDonationsByStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //Getting all books list.
        const { email, status } = req.params;
        console.log(status);
        let result = yield db_1.default.donations.findMany({
            where: {
                email: email,
                status: status
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
const createDonation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { imageurl, address, phone, date, time, email, status } = req.body;
        const result = yield db_1.default.donations.create({
            data: {
                email: email,
                address: address,
                phone: phone,
                date: date,
                time: time,
                imageurl: imageurl,
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
const getRates = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filePath = path.join(__dirname, '../Rates.json');
        const jsonData = fs.readFileSync(filePath, 'utf8');
        // Parse the JSON data
        const ratesData = JSON.parse(jsonData);
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
            response: error,
        });
    }
});
exports.default = { createDonation, getDonations, getDonationsByStatus, deleteDonation, getRates };
