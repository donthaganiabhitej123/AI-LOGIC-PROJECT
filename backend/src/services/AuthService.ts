
import jwt from "jsonwebtoken";
import pool from "../db/database";

export const loginUser = async (
  email: string,
  password: string
) => {
  const result = await pool.query(
    `
    SELECT
      u.id,
      u.name,
      u.email,
      u.password,
      COALESCE(ur.role, 'user') AS role
    FROM users1 AS u
    LEFT JOIN public.user_roles AS ur
      ON ur."authUserId" = u.id
    WHERE u.email = $1
    `,
    [email]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const user = result.rows[0];

  // Keep the existing password check for now.
  if (user.password !== password) {
    return null;
  }

  if (user.role !== "admin" && user.role !== "user") {
    throw new Error("Invalid user role");
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    secret,
    {
      expiresIn: "1h",
    }
  );

return {
  success: true,
  message: "Login successful",
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
  token,
};
};
