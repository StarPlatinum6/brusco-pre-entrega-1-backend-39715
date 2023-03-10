import { Router } from "express";
import ProductManager from "../productManager.js";

const productManager = new ProductManager();
const router = Router();

/////////////////////////
///////GET METHODS///////
/////////////////////////

router.get("/", async (req, res) => {
  const limit = req.query.limit;
  const products = await productManager.getProducts();
  const limitedProducts = products.slice(0, limit);

  if (!products)
    return res.status(404).send({
      status: "error",
      message: { error: `No products found` },
    });

  if (!limit)
    return res.status(200).send({
      status: "success",
      message: { products: products },
    });

  if (isNaN(limit)) {
    return res.status(400).send({
      status: "error",
      message: { error: `Limit ${limit} is not a valid value` },
    });
  }

  return res.status(200).send({
    status: "success",
    message: { products: limitedProducts },
  });
});

router.get("/:pid", async (req, res) => {
  let pid = req.params.pid;
  const filteredProduct = await productManager.getProductById(pid);

  if (isNaN(pid) || pid <= 0) {
    return res.status(400).send({
      status: "error",
      message: { error: `Product ID ${pid} is not a valid value` },
    });
  }

  if (!filteredProduct || filteredProduct == 0)
    return res.status(404).send({
      status: "error",
      message: { error: `Product with ID ${pid} was not found` },
    });

  return res.status(200).send({
    status: "success",
    message: { product: filteredProduct },
  });
});

/////////////////////////
///////POST METHOD///////
/////////////////////////

router.post("/", async (req, res) => {
  const newProduct = req.body;
  
  if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.status || !newProduct.stock || !newProduct.category) {
    return res.status(400).send({
      status: "error",
      message: { error: "All fields are mandatory" },
    });
  }

  const products = await productManager.getProducts()
  const productIndex = await products.findIndex((prod) => prod.code === newProduct.code);

  if (productIndex !== -1) {
    return res.status(400).send({
      status: "error",
      message: { error: `Product with code ${newProduct.code} already exists` },
    });
  }

  await productManager.addProduct(newProduct);

  return res.status(201).send({
    status: "success",
    message: {
      success: `Product ${newProduct.title} added successfully`,
      id: `${newProduct.id}`,
    },
  });
});


/////////////////////////
///////PUT METHOD////////
/////////////////////////

router.put("/:pid", async (req, res) => {
  const updateProd = req.body;
  const updatePos = req.params.pid;
  
  if (!updateProd) {
    return res.status(400).send({
      status: "error",
      message: { error: "Incomplete values" },
    });
  }
  
  const products = await productManager.getProducts()
  
  if (isNaN(updatePos) || updatePos <= 0) {
    return res.status(400).send({
      status: "error",
      message: { error: `${updatePos} is not a valid position` },
    });
  }
  
  if (updateProd.id) {
    return res.status(400).send({
      status: "error",
      message: { error: "Product ID cannot be changed" },
    });
  }

  if (updatePos > products.length) {
    return res.status(404).send({
      status: "error",
      message: { error: `No product found on position ${updatePos}` },
    });
  }
  
  await productManager.updateProduct(updatePos, updateProd);
  
  return res.status(200).send({
    status: "success",
    message: { update: `Product with ID ${updatePos} was successfully updated to ${updateProd.title}` },
  });
});

/////////////////////////
//////DELETE METHOD//////
/////////////////////////

router.delete("/:pid", async (req, res) => {
  const deletePos = req.params.pid;
  
  if (!deletePos) {
    return res.status(400).send({
      status: "error",
      message: { error: "Incomplete values" },
    });
  }
  
  if (isNaN(deletePos) || deletePos <= 0) {
    return res.status(400).send({
      status: "error",
      message: { error: `${deletePos} is not a valid position` },
    });
  }
  
  const products = await productManager.getProducts()
  
  if (products.length < deletePos) {
    return res.status(404).send({
      status: "error",
      message: { error: `No product found on position ${deletePos}` },
    });
  }
  
  await productManager.deleteProduct(deletePos);
  
  return res.status(200).send({
    status: "success",
    message: {
      delete: `The product in position ${deletePos} was successfully deleted`,
    },
  });
});

export default router;