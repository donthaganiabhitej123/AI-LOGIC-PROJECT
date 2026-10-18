import pool from "../db/database";

// GET

export const getUsers = async () => {
  const result = await pool.query(
    `
    SELECT
      u.id,
      u.name,
      u.email,
      u.age,
      COALESCE(ur.role, 'user') AS role
    FROM users1 AS u
    LEFT JOIN public.user_roles AS ur
      ON ur."authUserId" = u.id
    ORDER BY u.id DESC
    `
  );

  return result.rows;
};


// POST

export const createUser = async (
  name: string,
  email: string,
  age: number,
  password: string,
  role: "admin" | "user" = "user"
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Create the user
    const result = await client.query(
      `
      INSERT INTO users1
        (name, email, age, password)
      VALUES
        ($1, $2, $3, $4)
      RETURNING
        id,
        name,
        email,
        age
      `,
      [name, email, age, password]
    );

    const user = result.rows[0];

    // 2. Save the selected role
    await client.query(
      `
      INSERT INTO public.user_roles
        ("authUserId", role)
      VALUES
        ($1, $2)
      `,
      [user.id, role]
    );

    await client.query("COMMIT");

    // 3. Return the created user with its role
    return {
      ...user,
      role,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};


// PUT
export const updateUser = async (
  id: number,
  name: string,
  email: string,
  age: number,
  role: "admin" | "user"
) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
      UPDATE users1
      SET
        name = $1,
        email = $2,
        age = $3
      WHERE id = $4
      RETURNING
        id,
        name,
        email,
        age
      `,
      [name, email, age, id]
    );

    if (result.rowCount === 0) {
      throw new Error("User not found");
    }

    await client.query(
      `
      INSERT INTO public.user_roles ("authUserId", role)
      VALUES ($1, $2)
      ON CONFLICT ("authUserId")
      DO UPDATE SET
        role = EXCLUDED.role,
        "updatedAt" = CURRENT_TIMESTAMP
      `,
      [id, role]
    );

    await client.query("COMMIT");

    return {
      ...result.rows[0],
      role,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// DELETE
export const deleteUser = async (id: number) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await client.query(
      `
      DELETE FROM users1
      WHERE id = $1
      RETURNING id, name, email, age
      `,
      [id]
    );

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return null;
    }

    await client.query(
      `
      DELETE FROM public.user_roles
      WHERE "authUserId" = $1
      `,
      [id]
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

 // GET LOGGED-IN USER DETAILS

export const getUserById = async (id: number) => {
  const result = await pool.query(
    `
    SELECT
      u.id,
      u.name,
      u.email,
      u.age,
      COALESCE(ur.role, 'user') AS role
    FROM users1 AS u
    LEFT JOIN public.user_roles AS ur
      ON ur."authUserId" = u.id
    WHERE u.id = $1
    LIMIT 1
    `,
    [id]
  );

  return result.rows[0] ?? null;
};



