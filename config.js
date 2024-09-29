export const { PORT = 1234, SECRET_JWT_KEY = "" } = process.env;

export const dbConfig = {
  host: process.env.DB_HOST || "",
  user: process.env.DB_USER || "",
  port: process.env.DB_PORT || 3306,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "",
};
