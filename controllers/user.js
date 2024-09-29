import { validateApi } from "../schemas/schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../config.js";

export class UserController {
  constructor({ userModel }) {
    this.userModel = userModel;
  }

  register = async (req, res) => {
    try {
      // validaciones

      const result = validateApi(req.body);

      if (!result.success) {
        return res.status(400).json({ error: result.error.message });
      }

      const hashedPassword = await bcrypt.hash(result.data.password, 10);

      const createUser = await this.userModel.register({
        username: result.data.username,
        password: hashedPassword,
      });

      const token = jwt.sign(
        {
          username: createUser.username,
          id: createUser.id,
        },
        SECRET_JWT_KEY,
        {
          expiresIn: "1h",
        }
      );

      return res
        .cookie("access_token", token, {
          httpOnly: true, // Importante para prevenir accesos desde JavaScript del lado del cliente
          secure: process.env.NODE_ENV === "production" || false, // Solo si estás en producción
          sameSite: "none", // Cambia según tus necesidades
          maxAge: 1000 * 60 * 60,
        })
        .json({ createUser, token });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  getAll = async (req, res) => {
    try {
      const viewAll = await this.userModel.getAll();

      return res.json(viewAll);
    } catch (error) {
      return res.status(500).send("Internal error server");
    }
  };

  login = async (req, res) => {
    try {
      const result = validateApi(req.body);

      if (!result.success) {
        return res.status(400).json({ error: result.error.format() });
      }

      const user = await this.userModel.login(result.data.username);

      if (!user)
        return res
          .status(400)
          .json({ error: "Incorrect username or password" });

      const isValid = await bcrypt.compare(result.data.password, user.password);

      if (!isValid) {
        return res
          .status(400)
          .json({ error: "Incorrect username or password" });
      }

      const token = jwt.sign(
        {
          username: user.username,
          id: user.id,
        },
        SECRET_JWT_KEY,
        {
          expiresIn: "1h",
        }
      );

      return res
        .cookie("access_token", token, {
          httpOnly: true, // Importante para prevenir accesos desde JavaScript del lado del cliente
          secure: process.env.NODE_ENV === "production" || false, // Solo si estás en producción
          sameSite: "none", // Cambia según tus necesidades
          maxAge: 1000 * 60 * 60,
        })
        .json({ user, token });
    } catch (error) {
      return res.status(500).send("Internal server error");
    }
  };

  protected = async (req, res) => {
    try {
      const token = req.cookies.access_token; // Verifica que esto se esté recibiendo correctamente
      if (!token) {
        return res.status(403).json({ error: "Access not authorized" });
      }

      const data = jwt.verify(token, SECRET_JWT_KEY);
      return res.json(data);
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(403).json({ error: "Access not authorized" });
    }
  };

  logOut = async (req, res) => {
    try {
      res.clearCookie("access_token").json({ message: "logoutSuccessful" });
    } catch (error) {
      return res.status(500).json({ error: "internal server error" });
    }
  };
}
