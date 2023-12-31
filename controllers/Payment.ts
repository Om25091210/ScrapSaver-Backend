import { Request, Response, response } from "express";
import prisma from "../db";

const saveAmountToDatabase = async (req: Request, res: Response) => {
  try {
    //Getting the request body.
    const {email, createdAt, amount} = req.body; // Adjust this according to your request body structure

    const dataToUpdate: any = {};

    if (amount !== undefined) {
      dataToUpdate.amount = amount;
    }

    dataToUpdate.status = "Transaction Pending";

    // Save the generated OTP ('code') to the database for the specific user/email
    const updatedDonation = await prisma.donations.update({
      where: {
        email: email,
        createdAt:createdAt,
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
  } catch (error) {
    console.error("Error saving OTP to the database:", error);
    return res.status(500).json({
      error: "Failed to save OTP.",
    });
  }
};

const VerifyAmountStatus = async (req: Request, res: Response) => {
    try {
      //Getting the request body.
      const {email, createdAt} = req.body; // Adjust this according to your request body structure
  
      const dataToUpdate: any = {};
  
      dataToUpdate.status = "Completed";
  
      // Save the generated OTP ('code') to the database for the specific user/email
      const updatedDonation = await prisma.donations.update({
        where: {
          email: email,
          createdAt:createdAt,
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
    } catch (error) {
      console.error("Error saving status to the database:", error);
      return res.status(500).json({
        error: "Failed to save status.",
      });
    }
  };
  
const getAmount = async (req: Request, res: Response) => {
    try {
      // Getting the request body to find and evaluate.
      const { email, createdAt } = req.body;
  
      // Get the code from the donation for the provided email and createdAt
      const donation = await prisma.donations.findFirst({
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
        } else {
          return res.status(400).json({
            error: "Amount retrieved failed.",
          });
        }
      } else {
        return res.status(404).json({
          error: "Donation record not found for the provided email and createdAt.",
        });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      return res.status(500).json({
        error: "Failed to verify OTP.",
      });
    }
  };  

export default { saveAmountToDatabase, getAmount, VerifyAmountStatus };
