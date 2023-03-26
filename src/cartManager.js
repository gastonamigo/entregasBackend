import fs from "fs" 

class CartManager {
    #path = ""

    constructor(path){
        this.#path = path
    }

    async getCarts(){
        try{
            const carts = await fs.promises.readFile(this.#path, "utf-8");
            return JSON.parse(carts);
        }catch(e){
            return [];
        };
    };

    async getIDs(){
        const carts = await this.getCarts();
        const ids = carts.map(c => c.id);
        let cartID = Math.max(...ids);
        if (cartID === -Infinity) {
            return 0;
        } else {
            return ++cartID;
        };
    };

    async addCart(){
        try{
            let carts = await this.getCarts();
            let cartID = await this.getIDs();
            const newCart = {
                id: cartID,
                products: []
            };

            await fs.promises.writeFile(this.#path, JSON.stringify([...carts, newCart]));
        }catch(e){
            throw new Error(e);
        };
    };
    async getCartProduct(id) {
        const carts = await this.getCarts();
        let cart = carts.find((c) => c.id === id);
        if (cart) {
            return cart;
        } else {
            return [];
        };
    };

    async addProductToCart (product, cardID){
        try{
            
            let cart = await this.getCartProduct(cardID);

            const prodInCart = cart.product.find((p)=> p.id === product.id);

            if (prodInCart){
                prodInCart.quantity +=1;
                let searchProduct = cart.product.filter((p) => p.id !== prodInCart.id);
                
                cart.products = [...searchProduct, prodInCart];

                let newCarts = carts.filter( c => c.id !== cartID);
                
                await fs.promises.writeFile(this.#path, JSON.stringify([...newCarts, cart]));
            } else {
                cart.products = [
                    ...cart.products,
                    {
                        id: prod.id,
                        quantity: 1
                    }
                ];
                let newCarts = carts.filter( c => c.id !== cartID);
                
                await fs.promises.writeFile(this.#path, JSON.stringify([...newCarts, cart]));
            
            };
            
        }catch(e){
            throw new Error(e);
        };
    };

};

export default CartManager
