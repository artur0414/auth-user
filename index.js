import express from "express";
import { PORT } from "./config.js";
import { corsMiddleware } from "./middlewares/cors.js";
import { createRouter } from "./routes/user.js";
import cookieParser from "cookie-parser";

export const createApp = ({ userModel }) => {
  const app = express();

  app.use(corsMiddleware());

  app.use(express.json());
  app.use(cookieParser());

  app.use("/", createRouter({ userModel }));

  app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`);
  });

  return app;
};
