import express from "express";
import {  userController } from './user.controller';

const userRoutes= express.Router();

userRoutes.post('/', userController.createUser);
userRoutes.get('/', userController.getAllUsers);

export default userRoutes;