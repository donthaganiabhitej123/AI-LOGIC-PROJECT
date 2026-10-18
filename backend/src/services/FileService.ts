import pool from "../db/database";

// ==========================================
// SAVE FILE
// ==========================================

export const saveFile = async (
  fileName: string,
  fileType: string,
  fileSize: number,
  fileData: Buffer
) => {
  const result = await pool.query(
    `
    INSERT INTO uploaded_files
      (
        file_name,
        file_type,
        file_size,
        file_data
      )
    VALUES
      ($1, $2, $3, $4)
    RETURNING
      id,
      file_name,
      file_type,
      file_size,
      created_at
    `,
    [
      fileName,
      fileType,
      fileSize,
      fileData,
    ]
  );

  return result.rows[0];
};

// ==========================================
// GET ALL FILES
// ==========================================

export const getFiles = async () => {
  const result = await pool.query(
    `
    SELECT
      id,
      file_name,
      file_type,
      file_size,
      created_at
    FROM uploaded_files
    ORDER BY id DESC
    `
  );

  return result.rows;
};

// ==========================================
// GET FILE BY ID
// ==========================================

export const getFileById = async (
  id: number
) => {
  const result = await pool.query(
    `
    SELECT
      id,
      file_name,
      file_type,
      file_size,
      file_data
    FROM uploaded_files
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
};