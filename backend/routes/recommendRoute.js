import express from "express";
import { getRecommend } from "../controllers/recommendController.js";

const router = express.Router();

router.post('/getRecommend', getRecommend);

export default router;