import { Request, Response, NextFunction } from "express";
import prisma from "../db";
const fs = require('fs');
const path = require('path');

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

const getRates= async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filePath = path.join(__dirname, '../Rates.json');
    const jsonData = fs.readFileSync(filePath, 'utf8');

    // Parse the JSON data
    const ratesData = JSON.parse(jsonData);

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


export default { createDonation, getDonations, getDonationsByStatus, deleteDonation, getRates };
