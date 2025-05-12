import * as dotenv from 'dotenv'
dotenv.config()

const CONFIG = {
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
};

export default CONFIG;
