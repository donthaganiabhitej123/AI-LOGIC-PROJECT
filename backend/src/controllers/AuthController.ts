
import { Request, Response } from "express";
import { loginUser } from "../services/AuthService";

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
      return;
    }

    const result = await loginUser(email.trim(), password);

    if (!result) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
      token: result.token,
    });
  } catch (error: unknown) {
    console.error("Login controller error:", error);

    res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
    });
  }
};
