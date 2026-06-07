import { Router } from "express";
import { MaterialsController, upload } from "./materials.controller";

const router = Router();

router.get("/materials", MaterialsController.getAllMaterials);
router.post(
  "/materials",
  upload.single("image"),
  MaterialsController.createMaterial
);
router.delete("/materials/:id", MaterialsController.deleteMaterial);

export default router;
