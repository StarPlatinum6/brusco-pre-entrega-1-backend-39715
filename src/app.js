import ProductManager from "./ProductManager.js";
import express from "express";

const env = async () => {
  const app = express();
  const productManager = new ProductManager();

  const product1 = {
    title: "AMD Ryzen 5600X",
    description: "6 Core AMD Processor",
    price: 6000,
    thumbnail: "No image",
    code: "AMD5600X",
    stock: 50,
  };

  const product2 = {
    title: "Intel Core i7 13700K",
    description: "8 Core Intel Processor",
    price: 8000,
    thumbnail: "No image",
    code: "INTEL13700K",
    stock: 33,
  };

  const product3 = {
    title: "AMD Ryzen 5950X",
    description: "16 Core AMD Processor",
    price: 16000,
    thumbnail: "No image",
    code: "AMD5950X",
    stock: 10,
  };

  const product4 = {
    title: "Intel Core i9 13900K",
    description: "14 Core Intel Processor",
    price: 15000,
    thumbnail: "No image",
    code: "INTEL13900K",
    stock: 16,
  };

  const product5 = {
    title: "Nvidia RTX 2060 Super",
    description: "Mid-end Nvidia Gaming GPU",
    price: 10000,
    thumbnail: "No image",
    code: "RTX2060",
    stock: 39,
  };

  const product6 = {
    title: "AMD Radeon 6600XT",
    description: "Mid-end Radeon Gaming GPU",
    price: 12000,
    thumbnail: "No image",
    code: "RADEON6600XT",
    stock: 47,
  };

  const product7 = {
    title: "Nvidia RTX 3080Ti",
    description: "High-end Nvidia Gaming GPU",
    price: 22000,
    thumbnail: "No image",
    code: "RTX3080TI",
    stock: 28,
  };

  const product8 = {
    title: "AMD Radeon 6950XT",
    description: "High-end Radeon Gaming GPU",
    price: 20000,
    thumbnail: "No image",
    code: "RADEON6950XT",
    stock: 13,
  };

  const product9 = {
    title: "Nvidia RTX 4090",
    description: "Enthusiast Nvidia Gaming GPU",
    price: 52000,
    thumbnail: "No image",
    code: "RTX4090",
    stock: 4,
  };

  const product10 = {
    title: "AMD Radeon 7900XT",
    description: "Enthusiast Radeon Gaming GPU",
    price: 45000,
    thumbnail: "No image",
    code: "RADEON7900XT",
    stock: 8,
  };

  /* Uncomment for testing
  const product11 = {
    title: "Test product",
  };
  */

  await productManager.addProduct(product1);
  await productManager.addProduct(product2);
  await productManager.addProduct(product3);
  await productManager.addProduct(product4);
  await productManager.addProduct(product5);
  await productManager.addProduct(product6);
  await productManager.addProduct(product7);
  await productManager.addProduct(product8);
  await productManager.addProduct(product9);
  await productManager.addProduct(product10);

  /* Uncomment for testing
  await productManager.addProduct(product11);
  await productManager.getProductById(50);
  await productManager.getProductById(5);
  await productManager.updateProduct(2,"description","This product was recently updated");
  await productManager.getProductById(2);
  await productManager.updateProduct(50,"description","This product was recently updated");
  await productManager.deleteProduct(2);
  await productManager.deleteProduct(2);
  await productManager.deleteProduct(50);
  */

  console.log("\n | Product list:")
  await productManager.getProducts("log")

  app.use(express.urlencoded({ extended: true }));

  app.get("/products", async (req, res) => {
    const products = await productManager.getProducts();
    const limit = req.query.limit;

    if (!limit) return res.send({ products });

    if (isNaN(limit)) {
      return res.send({ Error: `Limit ${limit} is not a valid value` });
    }

    const limitedProducts = await products.slice(0, limit);

    res.send({ Products: limitedProducts });
  });

  app.get("/products/:pid", async (req, res) => {
    let pid = req.params.pid;
    const products = await productManager.getProducts();
    const filteredProduct = await products.filter((prod) => prod.id === parseInt(pid));

    if (filteredProduct == 0) {
      res.send({ Error: `Product with ID ${pid} was not found` });
    } else {
      res.send({ Product: filteredProduct });
    }
  });

  app.listen(8080, () => console.log("Server up in port 8080!"));
};

env();