import express from "express";
import Joi from "joi";

const router = express.Router();

const itemSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
});

const addressSchema = Joi.object({
  street: Joi.string().required(),
  city: Joi.string().required(),
  postalCode: Joi.string()
    .pattern(/^[0-9]{5}$/, "postal code")
    .required(),
}).required();

const orderSchema = Joi.object({
  orderId: Joi.string().required(),
  userId: Joi.string().required(),
  items: Joi.array().items(itemSchema).min(1).required(),
  orderDate: Joi.date().iso().required(),
  status: Joi.string()
    .valid("pending", "shipped", "delivered", "cancelled")
    .required(),
  shippingAddress: addressSchema,
  payment: Joi.object({
    method: Joi.string().valid("credit card", "paypal").required(),
    cardNumber: Joi.string().when("method", {
      is: "credit card",
      then: Joi.string().creditCard().required(),
      otherwise: Joi.forbidden(),
    }),
    transactionId: Joi.string().when("method", {
      is: "paypal",
      then: Joi.string().required(),
      otherwise: Joi.forbidden(),
    }),
  }).required(),
});

router.post("/", (req, res) => {
  const { error, value } = orderSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  res.status(201).json({ message: "Order created successfully", order: value });
});

export default router;
