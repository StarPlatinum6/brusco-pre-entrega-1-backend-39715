import express from "express";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import __dirname from "./utils.js";

const env = async () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(`${__dirname}/public`));

  app.use("/api/products", productsRouter);
  app.use("/api/carts", cartsRouter);

  app.listen(8080, () => console.log("Server up in port 8080!"));
};

env();

// status Tendrá un valor true por defecto. Será false cuando hayan 0 unidades del producto en stock