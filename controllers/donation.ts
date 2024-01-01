import { Request, Response, NextFunction } from "express";
import prisma from "../db";
import { rates } from '../Rates';


const getDonations = async (req: Request, res: Response, next: NextFunction) => {
  try {
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

const getDonation = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //Getting all books list.
    const{ email, createdAt } = req.params;
    let result = await prisma.donations.findFirst({
      where:{
        email: email,
        createdAt : createdAt
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
    const isAdmin = await prisma.admins.findFirst({ where: { email: email } });
    
    if (isAdmin) {
      let result;
      if (status === 'Pending') {
        result = await prisma.donations.findMany({
          where: {
            NOT: {
              status: 'Completed'
            }
          }
        });
      } else {
        result = await prisma.donations.findMany({
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
    const { imageurl, address, phone, date, time, email, status, donationType, wallet } = req.body;

    const result = await prisma.donations.create({
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
  } catch (error) {
    return res.status(500).json({
      response: error,
    });
  }
};

const setResponded = async (req: Request, res: Response) => {
  try {
    // Assuming 'email' is the identifier for a user in the donations table
    const {email, createdAt} = req.body; // Adjust this according to your request body structure

    // Save the generated OTP ('code') to the database for the specific user/email
    const updatedDonation = await prisma.donations.update({
      where: {
        email: email,
        createdAt:createdAt,
      },
      data: {
        status : "Responded", // Saving the OTP as a string in the 'code' field
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
  } catch (error) {
    console.error("Error change status to the database:", error);
    return res.status(500).json({
      error: "Failed to change status.",
    });
  }
};

const getRates= async (req: Request, res: Response, next: NextFunction) => {
  try {
    const ratesData = rates;

    // Extracting categories and items separately for better structure
    const categories = ratesData.scrapCategories.map((category:any) => {
      return {
        category: category.category,
        items: category.items.map((item:any) => {
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
  } catch (error:any) {
    return res.status(500).json({
      response: error.message, // Send the error message for better identification
    });
  }
};

const updateDonation = async (req: Request, res: Response, next: NextFunction) => {
  //Getting all donation data to update.
  const{ email, createdAt, type, address, phone, time, date, imageurl, donationType, wallet, picker} = req.body;
  console.log("triggered");
  const dataToUpdate: any = {};

  if (type !== undefined) {
    dataToUpdate.type = type;
  }

  if (address !== undefined) {
    dataToUpdate.address = address;
  }

  if (phone !== undefined) {
    dataToUpdate.phone = phone;
  }

  if(donationType !== undefined){
    dataToUpdate.donationType = donationType;
  }

  if(wallet !== undefined){
    dataToUpdate.wallet = wallet;
  }

  if(picker !== undefined){
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
  const result = await prisma.donations.update({
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
    
  } catch (error) {
    // If there's an error, handle it by sending a 500 status code and an error message
    return res.status(500).json({
      error: "Failed to get data.",
    });
  }
};

const deleteDonation=async(req:Request,res:Response,next:NextFunction)=>{
  try{
      //Get the record and delete.
      const { email, createdAt } = req.body;
      let result=await prisma.donations.delete({
          where:{
              email:email,
              createdAt:createdAt,
          }
      });
      return res.status(200).json({
          response: result,
      }); 
  }catch(error){
      return res.status(500).json({
          response: error,
      }); 
  }
};


export default { createDonation,getDonation, getDonations, getDonationsByStatus, deleteDonation, getRates, updateDonation, setResponded };
