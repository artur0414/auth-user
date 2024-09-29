import cors from "cors";

const ACCEPTED_ORIGINS = ["https://frontend-5tebu6gz5-arturo-acostas-projects.vercel.app"];

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => {
  return cors({
    origin: (origin, callback) => {
      if (acceptedOrigins.includes(origin) || !origin) {
        return callback(null, true);
      }

      return callback(new Error("Nor allowed by cors"));
    },
    credentials: true,
  });
};
