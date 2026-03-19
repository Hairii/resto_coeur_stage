import express from "express";
import {
  getAllEvenements,
  addEvenements,
  removeEvenements,
} from "../controllers/evenements.controller.js";

const router = express.Router();

router.post("/add", addEvenements);
router.get("/", getAllEvenements);
router.delete("/delete/:id", removeEvenements);

export default router;
