import { Router } from "express";
import CartManager from "../cartManager.js";

const cartManager = new CartManager();
const router = Router();

/////////////////////////
///////GET METHODS///////
/////////////////////////

router.get("/", async (req, res) => {
  const carts = await cartManager.getCarts();

  if (!carts)
    return res.status(404).send({
      status: "error",
      message: { error: `No carts found` },
    });

  return res.status(200).send({
    status: "success",
    message: { carts: carts },
  });
});

router.get("/:cid", async (req, res) => {
  let cid = req.params.cid;
  const carts = await cartManager.getCarts();
  const filteredCart = await carts.filter((cart) => cart.id === parseInt(cid));

  if (!carts)
    return res.status(404).send({
      status: "error",
      message: { error: `No carts found` },
    });

  if (isNaN(cid) || cid <= 0) {
    return res.status(400).send({
      status: "error",
      message: { error: `Cart ID ${cid} is not a valid value` },
    });
  }

  if (filteredCart == 0) {
    return res.status(404).send({
      status: "error",
      message: { error: `Cart with ID ${cid} was not found` },
    });
  }

  return res.status(200).send({
    status: "success",
    message: { product: filteredCart },
  });
});

/////////////////////////
///////POST METHODS//////
/////////////////////////

router.post("/", async (req, res) => {

  await cartManager.createCart()

  return res.status(201).send({
    status: "success",
    message: {
      success: "New cart created successfully.",
    },
  });
});

export default router;

/////////////////////////
///////PUT METHOD////////
/////////////////////////

// status Tendrá un valor true por defecto. Será false cuando hayan 0 unidades del producto en stock

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
    message: { update: `Product ${updateProd.title} was successfully updated` },
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