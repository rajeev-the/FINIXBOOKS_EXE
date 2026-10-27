import dotenv from "dotenv";

dotenv.config();

const envConfig = {
  PORT: process.env.PORT || 3001,
  TALLY_BRIDGE_BACKEND_URL: process.env.TALLY_BRIDGE_BACKEND_URL,
  TALLY_URL: process.env.TALLY_URL,
  TALLY_TIMEOUT: process.env.TALLY_TIMEOUT ? Number(process.env.TALLY_TIMEOUT) : 180000,
};

export default envConfig;
