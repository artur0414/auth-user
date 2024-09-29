import mysql from "mysql2/promise";
import { dbConfig } from "../config.js";

const config = dbConfig;

const connection = await mysql.createConnection(config);

export class UserModel {
  static async register({ username, password }) {
    try {
      const [result] = await connection.query(
        "INSERT INTO user (username, password) VALUES (?, ?)",
        [username, password]
      );

      return {
        username: username,
        password: password,
      };
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new Error("Username already exists");
      }
      console.log(error);
      throw new Error("Error creating user");
    }
  }

  static async getAll() {
    try {
      const [result] = await connection.query("SELECT * FROM user");

      return result.map((row) => row);
    } catch (error) {
      throw new Error("error gattering users");
    }
  }

  static async login(input) {
    try {
      const [result] = await connection.query(
        "SELECT * FROM user WHERE username = ?",
        [input]
      );

      if (result.length === 0) return false;

      return {
        password: result[0].password,
        id: result[0].id,
        username: result[0].username,
      };
    } catch (error) {
      throw new Error("error login in");
    }
  }
}
