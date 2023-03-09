import fs from "fs";
import { Blob } from "buffer";

export default class CartManager {
  constructor() {
    this.dir = "./files";
    this.path = "./files/carts.json";
  }

  getCarts = async (logCarts) => {
    try {
      if (!fs.existsSync(this.dir)) {
        fs.mkdirSync(this.dir);
      }
      if (fs.existsSync(this.path)) {
        const cartsData = await fs.promises.readFile(this.path, "utf-8");
        const size = new Blob([cartsData]).size;
        if (size > 0) {
          const parsedCarts = JSON.parse(cartsData);
          if (logCarts === "log") {
            console.table(parsedCarts);
          }
          return parsedCarts;
        } else {
          return [];
        }
      } else {
        return [];
      }
    } catch (error) {
      console.log(error);
    }
  };

  getCartById = async (cartId) => {
    try {
      const carts = await this.getCarts();
      const cartIdFound = carts.findIndex((cart) => cart.id === cartId);
      if (cartIdFound !== -1) {
        console.log(`Info on cart with Cart ID ${cartId}:`);
        console.log(carts[cartIdFound]);
      } else {
        throw new Error(`Get: Cart with ID ${cartId} was not found`);
      }
    } catch (error) {
      console.log(error)
    }
  };

  createCart = async () => {
    try {
      const newCart = {
        id: 0,
        products: [],
      };

      const carts = await this.getCarts();

      carts.length === 0
        ? (newCart.id = 1)
        : (newCart.id = carts[carts.length - 1].id + 1);

      carts.push(newCart);
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
    } catch (error) {
      console.log(error);
    } 
  };

  addToCart = async (cartId, productId, quantity) => {
    try {

      if (!cartId) {
        throw new Error("You must specify the cart ID to add a product to.");
      }

      if (!quantity) {
        throw new Error("You must specify quantity to add a product to the cart.");
      }

      if (!productId) {
        throw new Error("You must specify the product ID to add to the cart.");
      }

      const carts = await this.getCarts();
      const cartIdFound = carts.findIndex((cart) => cart.id === parseInt(cartId));

      if (cartIdFound !== -1) {
        // por a acá meter un push


        const updatedProduct = { ...products[productIdFound], ...updates}
        products[productIdFound] = updatedProduct;
        await fs.promises.writeFile(this.path,JSON.stringify(products, null, "\t"));
        console.log(`Product with ID ${productId} was updated successfully`);
      } else {
        throw new Error(`Add: Cart with ID ${cartId} was not found`);
      }
    } catch (error) {
      console.log(error)
    }
  };

}