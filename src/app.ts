import express from "express";
import cors from "cors";
import helmet from "helmet";
import { errorMiddleware } from "./middlewares/error.middleware";
import { notFoundMiddleware } from "./middlewares/not-found-middleware";
import V1Router from "./router/v1";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/v1", V1Router);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;