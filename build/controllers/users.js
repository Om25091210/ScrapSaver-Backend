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
// Get all users from the database
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Get all users from the database using Prisma's findMany method
        const result = yield db_1.default.users.findMany({});
        // Send the response with a 200 status code and the user data
        return res.status(200).json({
            response: result,
        });
    }
    catch (error) {
        // If there's an error, handle it by sending a 500 status code and an error message
        return res.status(500).json({
            error: "Failed to get users.",
        });
    }
});
// Get a specific user from the database based on the provided email
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract the email from the request parameters
        const email = req.params.email;
        // Get the user from the database using Prisma's findFirst method and the provided email
        const result = yield db_1.default.users.findFirst({
            where: {
                email: email,
            },
        });
        // Send the response with a 200 status code and the user data
        return res.status(200).json({
            response: result,
        });
    }
    catch (error) {
        // If there's an error, handle it by sending a 500 status code and an error message
        return res.status(500).json({
            error: "Failed to get user.",
        });
    }
});
// Update a user's information in the database
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract the email and other data from the request body
        const email = req.params.email;
        const name = req.body.name;
        const uid = req.body.uid;
        const phoneNo = parseInt(req.body.phoneNo) || 0;
        // Update the user's information in the database using Prisma's update method
        const result = yield db_1.default.users.update({
            where: {
                email: email,
            },
            data: {
                name: name,
                uid: uid,
                phoneNo: phoneNo,
                updatedAt: new Date().toISOString(),
            },
        });
        // Send the response with a 200 status code and the updated user data
        return res.status(200).json({
            response: result,
        });
    }
    catch (error) {
        // If there's an error, handle it by sending a 500 status code and an error message
        return res.status(500).json({
            error: "Failed to update user.",
        });
    }
});
// Create a new user in the database
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, uid, phoneNo = '0', walletBalance = '0', totalEarning = '0' } = req.body;
        const existingUser = yield db_1.default.users.findFirst({
            where: {
                OR: [
                    { email: email },
                    { uid: uid }
                ],
            },
        });
        if (existingUser) {
            const isAdmin = yield db_1.default.admins.findFirst({ where: { email: email } });
            const isPicker = yield db_1.default.pickers.findFirst({ where: { email: email } });
            let role = "user";
            if (isAdmin) {
                role = "admin";
            }
            else if (isPicker) {
                role = "picker";
            }
            return res.status(200).json({
                message: "User already exists. Logged in.",
                user: existingUser,
                role: role,
            });
        }
        const isAdmin = yield db_1.default.admins.findFirst({ where: { email: email } });
        const isPicker = yield db_1.default.pickers.findFirst({ where: { email: email } });
        let role = "user";
        if (isAdmin) {
            role = "admin";
        }
        else if (isPicker) {
            role = "picker";
        }
        const newUser = yield db_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            return prisma.users.create({
                data: {
                    email,
                    name,
                    uid,
                    phoneNo: parseInt(phoneNo),
                    walletBalance: parseInt(walletBalance),
                    totalEarning: parseInt(totalEarning),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    role: role,
                },
            });
        }));
        return res.status(201).json({
            message: "User created successfully.",
            role: role,
            user: newUser,
        });
    }
    catch (error) {
        console.error("Error creating user:", error);
        return res.status(500).json({
            error: "Failed to create user.",
        });
    }
});
// Delete a user from the database
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract the email from the request parameters
        const email = req.params.email;
        // Delete the user from the database using Prisma's delete method
        const result = yield db_1.default.users.delete({
            where: {
                email: email,
            },
        });
        // Send the response with a 200 status code and the deleted user data
        return res.status(200).json({
            response: result,
        });
    }
    catch (error) {
        // If there's an error, handle it by sending a 500 status code and an error message
        return res.status(500).json({
            error: "Failed to delete user.",
        });
    }
});
exports.default = { getUsers, getUser, updateUser, deleteUser, createUser };
