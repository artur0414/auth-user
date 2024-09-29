import cors from "cors";

export const corsMiddleware = cors({
  origin: "*", // Solo para desarrollo
});
