import express, { json } from "express";
import ProductManager from "./ProductManager.js";
import CartManager from "./CartManager.js";
import productRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import __dirname from "./utils.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import viewsRouter from "./routes/views-router.js";

const PORT = 8080;

const manager = new ProductManager("./products.json");
const cartManager = new CartManager("./carrito.json");
const app = express();

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use(json());
app.use('/static',express.static(__dirname + "/../public"));
app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () => {
  console.log("Server listening on port 8080");
});

const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log("New client connected.");
});


app.use((req, res, next) => {
  req.io = io;
  next();
});

export { manager, cartManager };

// app.get("/", async(req, res)=>{
//     const product = await manager.getProducts();
//     res.render("home", {layout: "main", product});
// });
