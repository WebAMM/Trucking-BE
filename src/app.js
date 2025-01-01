const express = require("express");
const AppRoutes = require("./api");
const colors = require("./loaders/colors");
const config = require("./config");
const { appMiddlewares } = require("./loaders");
//Express app setup
const app = express();
//loaders
require("dotenv").config();

//Middlewares
const { errorHandler } = require("./middlewares/errorHandler");
appMiddlewares(app);
require("express-async-errors");

//initial route
app.get("/", (req, res) => {
  res.send("Initial route running...");
});

//Base route
app.use("/trucker/api/v1", AppRoutes);

//Route not found - 404 Route
app.use((req, res) => {
  res.status(404).json({
    status: "404",
    message: "Route not found",
  });
});

//Error handler, handing multer + app errors
app.use(errorHandler);

//Starting server
async function startServer() {
  app
    .listen(config.port, () => {
      console.log(
        colors.fg.cyan,
        `
        ########################################
        🛡️  Server is listening on port: ${config.port}  🛡️
        ########################################
        `,
        colors.reset
      );
    })
    .on("error", (err) => {
      console.log("Server starting error: ", err);
      process.exit(1);
    });
}

startServer();
