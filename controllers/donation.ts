import { Request, Response, NextFunction } from "express";
import prisma from "../db";

const getDonations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //Getting all books list.
    const{ email } = req.body;
    let result = await prisma.donations.findMany({
      where:{
        email: email,
      }
    });
    // Send the response with a 200 status code and the user data
    return res.status(200).json({
      response: result,
    });
  } catch (error) {
    // If there's an error, handle it by sending a 500 status code and an error message
    return res.status(500).json({
      error: "Failed to get data.",
    });
  }
};

const getDonationsByStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //Getting all books list.
    const{ email, status } = req.params;
    console.log(status);
    let result = await prisma.donations.findMany({
      where:{
        email: email,
        status:status
      }
    });
    // Send the response with a 200 status code and the user data
    return res.status(200).json({
      response: result,
    });
  } catch (error) {
    // If there's an error, handle it by sending a 500 status code and an error message
    return res.status(500).json({
      error: "Failed to get data.",
    });
  }
};

const createDonation= async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { imageurl, address, phone, date, time, email, status } = req.body;

    const result = await prisma.donations.create({
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
  } catch (error) {
    return res.status(500).json({
      response: error,
    });
  }
};



export default { createDonation, getDonations, getDonationsByStatus };
