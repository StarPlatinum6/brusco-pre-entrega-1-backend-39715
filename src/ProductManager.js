import fs from "fs";
import { Blob } from "buffer";

export default class ProductManager {
  constructor() {
    this.dir = "./files";
    this.path = "./files/products.json";
  }

  getProducts = async (logProducts) => {
    try {
      if (!fs.existsSync(this.dir)) {
        fs.mkdirSync(this.dir);
      }
      if (fs.existsSync(this.path)) {
        const productData = await fs.promises.readFile(this.path, "utf-8");
        const size = new Blob([productData]).size;
        if (size > 0) {
          const parsedProducts = JSON.parse(productData);
          if (logProducts === "log") {
            console.table(parsedProducts);
          }
          return parsedProducts;
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

  getProductById = async (productId) => {
    try {
      const products = await this.getProducts();
      const productIdFound = products.findIndex((prod) => prod.id === productId);
      if (productIdFound !== -1) {
        console.log(`Info on product with Product ID ${productId}:`);
        console.log(products[productIdFound]);
      } else {
        throw new Error(`Get: Product with ID ${productId} was not found`);
      }
    } catch (error) {
      console.log(error)
    }
  };

  addProduct = async (product) => {
    try {
      const products = await this.getProducts();

      if (!product.title || !product.description || !product.code || !product.price || !product.status || !product.stock || !product.category) {
        throw new Error("All fields are mandatory");
      }
  
      const productIndex = await products.findIndex((prod) => prod.code === product.code);
      
      if (productIndex === -1) {
        products.length === 0 
          ? product.id = 1
          : product.id = products[products.length - 1].id + 1;

        products.push(product);

        await fs.promises.writeFile(this.path,JSON.stringify(products, null, "\t"));
        
        console.log(`Product with code ${product.code} added successfully`);
      } else {
        throw new Error(`Add: Product with code ${product.code} already exists`);
      }
    } catch (error) {
      console.log(error)
    }
  };

  updateProduct = async (productId, updates) => {
    try {
      const products = await this.getProducts();
      const productIdFound = products.findIndex((prod) => prod.id === parseInt(productId));

      if (productIdFound !== -1) {
        const updatedProduct = { ...products[productIdFound], ...updates}
        products[productIdFound] = updatedProduct;
        await fs.promises.writeFile(this.path,JSON.stringify(products, null, "\t"));
        console.log(`Product with ID ${productId} was updated successfully`);
      } else {
        throw new Error(`Update: Product with ID ${productId} was not found`);
      }
    } catch (error) {
      console.log(error)
    }
  };

  deleteProduct = async (productId) => {
    try {
      const products = await this.getProducts();
      const productIdFound = products.findIndex((prod) => prod.id === parseInt(productId));
      if (productIdFound !== -1) {
        products.splice(productIdFound, 1);
        await fs.promises.writeFile(this.path,JSON.stringify(products, null, "\t"));
        console.log(`Product with Product ID ${productId} was successfully deleted.`);
      } else {
        throw new Error(`Delete: Product with ID ${productId} was not found`);
      }
    } catch (error) {
      console.log(error)
    }
  };
}