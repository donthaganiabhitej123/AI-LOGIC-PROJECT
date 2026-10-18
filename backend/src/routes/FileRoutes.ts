import { Router } from "express";
import { Server } from "socket.io";

import upload from "../config/multer";

import {
  downloadFile,
  getAllFiles,
  uploadFile,
} from "../controllers/FileController";

const createFileRouter = (io: Server) => {
  const router = Router();

  // GET ALL FILES
  router.get(
    "/",
    getAllFiles
  );

  // UPLOAD FILE
  router.post(
    "/upload",
    upload.single("file"),
    (req, res) => {
      return uploadFile(
        io,
        req,
        res
      );
    }
  );

  // DOWNLOAD FILE
  router.get(
    "/:id/download",
    (req, res) => {
      return downloadFile(
        io,
        req,
        res
      );
    }
  );

  return router;
};

export default createFileRouter;