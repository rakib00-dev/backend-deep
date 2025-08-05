import "dotenv/config";
import connectDB from "./db/db.js";

connectDB();

/* import express from "express";
const app = express();

(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_name}`);
    app.on("error", (error) => {
      console.log("ERROR: ", error);
      throw error;
    });
  } catch (error) {
    console.error("Error: DB connecting error", error);
    throw error;
  }
})();
*/
