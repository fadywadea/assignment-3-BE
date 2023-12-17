"use strict";

import { createConnection } from "mysql2";

// Connect to database
export const query = createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "assignment-3",
});
