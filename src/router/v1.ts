import { Router } from "express";
import authRoutes from "../modules/auth/auth.route";
import usersRoutes from "../modules/users/users.routes";
import facultiesRoutes from "../modules/faculties/faculies.routes";

const routes = Router();


routes.use("/auth", authRoutes);
routes.use("/faculties", facultiesRoutes);
routes.use("/users", usersRoutes);
routes.use
routes.get("/health", async (req, res) => {
  res.sendStatus(200);
  return
});


export default routes;