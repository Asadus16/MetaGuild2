const express = require("express");
const cors = require("cors");
const app = express();
const port = 8000;
const apiRoutes = require("./src/routes/api");

app.use(express.json());

app.use(
  cors({
    // Enable CORS with specific origin
    origin: "http://localhost:3000", // Allow requests from this origin
  })
);

app.use("/", apiRoutes);

app.listen(port, () => {
  console.log(`App listening on : ${port}`);
});
