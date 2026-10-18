
import * as Yup from "yup";

export const createUserSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(100, "Name is too long")
    .required("Name is required"),

  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must contain at least 6 characters")
    .required("Password is required"),

  age: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .typeError("Age must be a number")
    .integer("Age must be a whole number")
    .min(1, "Age must be at least 1")
    .max(150, "Age cannot exceed 150")
    .required("Age is required"),

  role: Yup.mixed<"admin" | "user">()
    .oneOf(["admin", "user"], "Select a valid role")
    .required("Role is required"),
});

export const editUserSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(100, "Name is too long")
    .required("Name is required"),

  email: Yup.string()
    .trim()
    .email("Enter a valid email address")
    .required("Email is required"),

  age: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .typeError("Age must be a number")
    .integer("Age must be a whole number")
    .min(1, "Age must be at least 1")
    .max(150, "Age cannot exceed 150")
    .required("Age is required"),

  role: Yup.mixed<"admin" | "user">()
    .oneOf(["admin", "user"], "Select a valid role")
    .required("Role is required"),
});
