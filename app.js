const express = require("express");
const app = express();
require("dotenv").config();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

//  signup and login auth
require("./authentication/auth")

const userRoute = require("./routes/authRoute");

app.use("/api", userRoute);

const { DbConnection } = require("./config/dbConnection");
DbConnection();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`APP IS RUNNING AT ${PORT}`);
});
