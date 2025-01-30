const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("placeOrder", (orderDetails) => {
    io.emit("newOrder", orderDetails); // Broadcast the new order to all clients
  });

  // Listen for the order alert event
  socket.on("orderAlert", (message) => {
    io.emit("orderAlert", message); // Broadcast the alert message to all clients
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});

///// Other routes and server setup...
require("./src/route/category.route")(app);
require("./src/route/auth.route")(app);
require("./src/route/role.route")(app);
require("./src/route/supplier.route")(app);
require("./src/route/config.route")(app);
require("./src/route/product.route")(app);
require("./src/route/customer.route")(app);
require("./src/route/employee.route")(app);
require("./src/route/expense.route")(app);
require("./src/route/order.route")(app);
require("./src/route/dashboard.route")(app);

const PORT = 8081;
httpServer.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

// const express = require("express");
// const cors = require("cors");
// const { createServer } = require("http");
// const { Server } = require("socket.io");

// const app = express();
// const httpServer = createServer(app);
// const io = new Server(httpServer, { cors: { origin: "*" } });

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cors({ origin: "*" }));

// io.on("connection", (socket) => {
//   socket.on("newOrderAlert", (orderDetails) => {
//     io.emit("orderReceived", orderDetails);
//   });
// });

// require("./src/route/category.route")(app);
// require("./src/route/auth.route")(app);
// require("./src/route/role.route")(app);
// require("./src/route/supplier.route")(app);
// require("./src/route/config.route")(app);
// require("./src/route/product.route")(app);
// require("./src/route/customer.route")(app);
// require("./src/route/employee.route")(app);
// require("./src/route/expense.route")(app);
// require("./src/route/order.route")(app);
// require("./src/route/dashboard.route")(app);

// const PORT = 8081;
// httpServer.listen(PORT, () => {
//   console.log(`http://localhost:${PORT}`);
// });
