import { Router, json } from "express";
import { cartManager } from "../app.js";

const cartsRouter = Router();
cartsRouter.use(json());

cartsRouter.get("/:cid", async (req, res)=>{
    try{
        const {cid} = req.params;
        let cart = await cartManager.getCartProduct(parseInt(cid));
        res.send({status: "succes", payload: cart});
    }catch(e){
        res.status(404).send({status: "error", error: `${e}`});
    };
});

cartsRouter.post("/", async (req,res)=>{
    try{
        await cartManager.addCart();
        res.send({status: "succes", payload: "Carrito añadido."});
    }catch(e){
        res.status(404).send({status: "error", error: `${e}`});
    };
});

cartsRouter.delete("/:cid/products/:pid", async (req, res)=>{
    try{
        const {cid, pid} = req.params;
        const prodID = parseInt(pid);
        const cartID = parseInt(cid);
        await cartManager.deleteProductInCart(cartID, prodID);
        res.send({status: "succes", payload: "Producto eliminado."});
    }catch(e){
        res.status(404).send({status: 'error', error: `${e}`});
    };
});



export default cartsRouter;
