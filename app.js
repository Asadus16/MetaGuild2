const express = require("express");
const app = express();
const port = 8000;
const apiRoutes = require("./src/routes/api");

app.use(express.json());

app.use("/", apiRoutes);

app.listen(port, () => {
  console.log(`App listening on : ${port}`);
});
