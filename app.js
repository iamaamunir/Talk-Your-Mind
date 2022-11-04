require("./authentication/auth")
const express = require("express");
const app = express();
const passport = require('passport')
require("dotenv").config();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

 app.use(express.json())

const userRouter = require("./routes/authRoute");
const articleRouter = require('./routes/articleRoute')
const publicRouter = require('./routes/publicRoute')


app.use('/api', publicRouter)
app.use("/api", userRouter);
app.use('/api', passport.authenticate('jwt', { session: false }), articleRouter)

const { DbConnection } = require("./config/dbConnection");
DbConnection();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`APP IS RUNNING AT ${PORT}`);
});
