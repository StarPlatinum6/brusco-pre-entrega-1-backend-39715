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
  const filteredCart = await cartManager.getCartById(cid);

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

router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = req.body.quantity;

  const carts = await cartManager.getCarts();
  const cartIdFound = carts.findIndex((cart) => cart.id === parseInt(cartId));

  if (cartIdFound === -1) {
    return res.status(400).send({
      status: "error",
      message: { error: `Cart with ID ${cartId} was not found` },
    });
  }

  if (!cartId) {
    return res.status(400).send({
      status: "error",
      message: { error: "Must specify the cart ID to add a product to." },
    });
  }

  if (!quantity) {
    return res.status(400).send({
      status: "error",
      message: { error: "Must specify quantity to add a product to the cart." },
    });
  }

  if (!productId) {
    return res.status(400).send({
      status: "error",
      message: { error: "Must specify the product ID to add to the cart." },
    });
  }

  await cartManager.addToCart(cartId,productId,quantity)

  return res.status(201).send({
    status: "success",
    message: {
      success: `Successfully added ${quantity} of product with ID ${productId} to cart with ID ${cartId}`,
    },
  });
});

export default router;