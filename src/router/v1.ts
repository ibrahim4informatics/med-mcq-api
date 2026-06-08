import { Router } from "express";
import authRoutes from "../modules/auth/auth.route";


const routes = Router();


routes.use("/auth", authRoutes);
routes.get("/health", async (req, res) => {
  res.sendStatus(200);
  return
});

export default routes;