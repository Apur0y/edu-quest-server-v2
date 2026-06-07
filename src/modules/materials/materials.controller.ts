import { Request, Response } from "express";
import multer from "multer";
import catchAsync from "../../utils/catchAsync";
import { MaterialsService } from "./materials.service";

// In-memory storage (matches original behavior)
const storage = multer.memoryStorage();
export const upload = multer({ storage });

const getAllMaterials = catchAsync(async (_req: Request, res: Response) => {
  const materials = await MaterialsService.getAllMaterials();
  res.status(200).send(materials);
});

const createMaterial = catchAsync(async (req: Request, res: Response) => {
  const material = await MaterialsService.createMaterial({
    title: req.body.title,
    sessionId: req.body.sessionId,
    tutorEmail: req.body.tutorEmail,
    link: req.body.link,
  });
  res.status(201).send(material);
});

const deleteMaterial = catchAsync(async (req: Request, res: Response) => {
  const result = await MaterialsService.deleteMaterial(req.params.id as string);
  res.send(result);
});

export const MaterialsController = {
  getAllMaterials,
  createMaterial,
  deleteMaterial,
};
