import * as http from "http";

import app from "./app.js";

import CONFIG from "./config/config.js";

const PORT = CONFIG.PORT || 5000;

import DbConnection from "../src/db/dbConnection.js";
DbConnection();

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is listening at port: ${PORT}`);
});
