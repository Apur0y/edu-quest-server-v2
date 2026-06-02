import { Request, Response } from "express";
import { userService } from "./user.service";


const createUser= async(req:Request, res:Response)=>{

    try {
        const createUSer= await userService.userCreate(req.body) 
        res.status(201).json({ message: "User created successfully",createUSer });
    } catch (error) {
        res.status(500).json({ message: "Error creating user" });
    }
}

const getAllUsers= async(req:Request, res:Response)=>{
    try {
        const page=req.query.page ? parseInt(req.query.page as string) : 1;
        const limit=req.query.limit ? parseInt(req.query.limit as string) : 10;
        const search=req.query.search ? (req.query.search as string) : '';
        const isVerified=req.query.isVerified ? (req.query.isVerified as string) === 'true' : undefined;

        const data= await userService.getAllUsers({ page, limit, search, isVerified })
        res.status(200).json({ message: "Users retrieved successfully", data });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving users" });
    }
}

export const userController={createUser, getAllUsers}