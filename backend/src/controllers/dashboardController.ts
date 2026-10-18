import { Request, Response } from "express";
import { readFile } from "fs/promises";
import path from "path";

// ==========================================
// ANALYTICS
// ==========================================

export const getAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const filePath = path.join(
      process.cwd(),
      "src",
      "data",
      "analytics.json"
    );

    const fileData = await readFile(filePath, "utf-8");

    const analytics = JSON.parse(fileData);

    res.status(200).json({
      success: true,
      message: "Analytics loaded successfully",
      analytics,
    });
  } catch (error) {
    console.error("Analytics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load analytics",
    });
  }
};

// ==========================================
// NOTIFICATIONS
// ==========================================

export const getNotifications = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const notifications = [
      {
        id: 1,
        message: "New product created successfully",
      },
      {
        id: 2,
        message: "System is running successfully",
      },
    ];

    res.status(200).json({
      success: true,
      message: "Notifications loaded successfully",
      notifications,
    });
  } catch (error) {
    console.error("Notifications error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load notifications",
    });
  }
};