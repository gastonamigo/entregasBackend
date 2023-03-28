import { json, Router } from "express";
import { ProductManager } from "../dao/index.js";

const viewsRouter = Router();
viewsRouter.use(json());

viewsRouter.get("/", async (req, res) => {
  try {
    const products = await ProductManager.getProducts();
    res.render("home", { products });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting products");
  }
});

viewsRouter.get("/real-time-products", async (req, res) => {
  try {
    const products = await ProductManager.getProducts();
    res.render("real_time_products", { products });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting real-time products");
  }
});

export default viewsRouter;

