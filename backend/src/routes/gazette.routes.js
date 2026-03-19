import express from'express';
import { getAllGazettes, addGazettes, getOneGazette, removeGazette } from '../controllers/gazette.controller.js';

const router = express.Router();

router.post('/add', addGazettes);
router.get('/', getAllGazettes);
router.get('/:id', getOneGazette);
router.delete('/delete/:id', removeGazette);

export default router;