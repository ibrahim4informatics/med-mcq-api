import { Router } from "express";
import authRoutes from "../modules/auth/auth.route";
import usersRoutes from "../modules/users/users.routes";


const routes = Router();

  
routes.use("/auth", authRoutes);
routes.use("/users", usersRoutes);
routes.get("/health", async (req, res) => {
  res.sendStatus(200);
  return
});

export default routes;