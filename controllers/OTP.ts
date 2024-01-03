import { Request, Response } from "express";
import prisma from "../db";

const saveOTPToDatabase = async (req: Request, res: Response) => {
  try {
    const OTP_LENGTH = 6;
    const min = Math.pow(10, OTP_LENGTH - 1);
    const max = Math.pow(10, OTP_LENGTH) - 1;
    const otp = Math.floor(Math.random() * (max - min + 1)) + min;

    // Assuming 'email' is the identifier for a user in the donations table
    const {email, createdAt} = req.body; // Adjust this according to your request body structure

    // Save the generated OTP ('code') to the database for the specific user/email
    const updatedDonation = await prisma.donations.update({
      where: {
        email: email,
        createdAt:createdAt,
      },
      data: {
        code : otp.toString() as string, // Saving the OTP as a string in the 'code' field
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
  } catch (error) {
    console.error("Error saving OTP to the database:", error);
    return res.status(500).json({
      error: "Failed to save OTP.",
    });
  }
};

const VerifyOTP = async (req: Request, res: Response) => {
    try {
      // Getting the request body to find and evaluate.
      const { email, createdAt, code } = req.body;
  
      // Get the code from the donation for the provided email and createdAt
      const donation = await prisma.donations.findFirst({
        where: {
          email: email,
          createdAt: createdAt,
        },
      });
  
      if (donation) {
        const savedOTP = donation.code; // Fetch the saved OTP from the database
  
        if (savedOTP === code) {
          
          const updateDonationStatus = await prisma.donations.update({
            where: {
              email: email,
              createdAt: createdAt,
            },
            data:{
              status:"Verified"
            }
          });

          return res.status(200).json({
            message: "OTP verification successful",
          });
        } else {
          return res.status(400).json({
            error: "OTP verification failed. Provided OTP does not match.",
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

export default { saveOTPToDatabase, VerifyOTP };
