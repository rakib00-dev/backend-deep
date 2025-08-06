import "dotenv/config";
import connectDB from "./db/db.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 8000;

app.on("error", () => {
  console.error("ERROR:", err);
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `server is running at port ${PORT}, http://localhost:${PORT}`
      );
    });
  })
  .catch((err) => console.error("ERROR through connecting DB !!!", err));

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
