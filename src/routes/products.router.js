import { Router, json } from "express";
import { ProductManager } from "../dao/index.js";
import uploader from "../file-upload.js";

const productRouter = Router();
productRouter.use(json());

productRouter.get("/", async (req, res) => {
  const { limit } = req.query;
  try {
    if (!limit) {
      const products = await ProductManager.getProducts();
      res.send({ status: "succes", payload: products });
    } else {
      const products = await ProductManager.getProducts();
      const limited = products.splice(0, limit);
      res.send({ status: "succes", payload: limited });
    }
  } catch (error) {
    res.status(404).send({ status: "error", error: `{$error}` });
  }
});

productRouter.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await ProductManager.getProductById(parseInt(pid));
    res.send({ status: "succes", payload: product });
  } catch (error) {
    res.status(404).send({ status: "error", error: `${error}` });
  }
});

productRouter.post("/", uploader.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ error: "required file not found" });
    }
    const thumbnail = { thumbnails: req.file.path };
    const {
      title,
      description,
      price,
      thumbails = thumbnail,
      code,
      stock,
      status = true,
      category,
    } = req.body;
    await ProductManager.addProduct(
      title,
      description,
      parseInt(price),
      thumbails,
      code,
      parseInt(stock),
      status,
      category
    );

    req.io.emit("new-product", req.body);

    res.send({ status: "succes", payload: req.body });
  } catch (error) {
    res.status(404).send({ status: "error", error: `${error}` });
  }
});

productRouter.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const id = parseInt(pid);
    await ProductManager.updateProduct(id, req.body);

    const products = await ProductManager.getProducts();

    req.io.emit("update-product", products);

    res.send({ status: "succes", payload: await ProductManager.getProductById(id) });
  } catch (error) {
    res.status(404).send({ status: "error", error: `${error}` });
  }
});

productRouter.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const id = parseInt(pid);
    await ProductManager.deleteProduct(id);

    const products = await ProductManager.getProducts();

    req.io.emit("delete-product", products);

    res.send({ status: "succes", payload: "Producto eliminado" });
  } catch (error) {
    res.status(404).send({ status: "error", error: `${error}` });
  }
});

export default productRouter;
