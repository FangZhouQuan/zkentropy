import { Router } from "express";
import { getContractStatus } from "../services/contract";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const status = await getContractStatus();
    return res.json(status);
  } catch (error) {
    return next(error);
  }
});

export default router;
