import fs from "fs";
import __dirname from "../../utils.js"

class ProductManager {
    path = __dirname + "/dao/file-managers/files/products.json";

    constructor() {
        
    };

    //OBTENGO LA LISTA DE PRODUCTOS
    async getProducts() {
        try {
            const prod = await fs.promises.readFile(path, "utf-8");
            return JSON.parse(prod);

        } catch (e) {
            return [];

        };

    };
    //FILTRA Y OBTIENE EL PRODUCTO POR ID
    async getProductById(prodId) {
        const product = await this.getProducts();
        let prod = product.find((p) => p.id === prodId);
        if (prod) {
            return prod;
        } else {
            throw new Error('Not Found ID.');
        };
    };
    // AGREGA EL PRODUCTO 
    async addProduct(title, description, price, thumbnail, code, stock) {

        const product = await this.getProducts();

        const newProduct = {
            id: product.length + 1,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
        };
        //CHECKEANDO SI FALTA INFORMACION
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error("missing information");
        };

        // CHECKEANDO QUE NO SE REPITA EL CODE       
        const checkCode = product.some((p) => p.code === code);

        if (checkCode) {
            throw new Error("product code already exist");
        } else {
            await fs.promises.writeFile(path, JSON.stringify([...product, newProduct]));
        };
    };
    //ACTUALIZA EL PRODUCTO
    async updateProduct(id, update) {
        const product = await this.getProducts();
        let productUpdated = product.find(prod => prod.id === id);

        if (!productUpdated) {
            throw new Error("Product ID not found");//CHECKEA QUE EXISTA EL ID
        };
        if (Object.keys(update).includes('id')){
            throw new Error('No es posible modificar el ID de un producto.');
        }

        if (Object.keys(update).includes('code')) {
            let checkCode = product.some(i => i.code === update.code);
            if (checkCode) {
                throw new Error("Product code modification not allowed");//CHECKEA SI SE ENVIA UN CODIGO PARA MODIFICAR
            };
        };

        productUpdated = { ...productUpdated, ...update };
        let newArray = product.filter(prod => prod.id !== id);

        newArray = [...newArray, productUpdated];

        await fs.promises.writeFile(path, JSON.stringify(newArray));

        console.log('Updated Product');
    };

    //BORRA EL PRODUCTO POR ID   
    async deleteProduct(prodId) {
        const product = await this.getProducts();
        let productId = product.find((p) => p.id === prodId);
        if (!productId) {
            throw new Error(` product id: ${prodId} not found`);

        } else {
            let eraser = product.filter((p) => p.id !== prodId);
            await fs.promises.writeFile(path, JSON.stringify(eraser));
        };
    };
};

export default ProductManager;
