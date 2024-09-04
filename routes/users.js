import express from "express";
import Joi from "joi";

const router = express.Router();

const addressSchema = Joi.object({
  street: Joi.string().required(),
  city: Joi.string().required(),
  postalCode: Joi.string()
    .pattern(/^[0-9]{5}$/, "postal code")
    .required(),
});

const passwordComplexity = Joi.string()
  .pattern(
    new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})"
    )
  )
  .message(
    "Password must include uppercase, lowercase, number, and special character, and be at least 8 characters long."
  );

const userSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: passwordComplexity.required(),
  age: Joi.number().integer().min(0).required(),
  roles: Joi.array()
    .items(Joi.string().valid("admin", "user", "guest"))
    .required(),
  address: addressSchema,
  preferences: Joi.object({
    notifications: Joi.boolean().required(),
    theme: Joi.string().valid("light", "dark").required(),
  }).required(),
});

router.post("/", (req, res) => {
  const { error, value } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  res.status(201).json({ message: "User created successfully", user: value });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;

  const schema = Joi.object({
    id: Joi.string().guid().required(),
  });
  const { error } = schema.validate({ id });

  if (error) {
    return res.status(400).json({ error: "ID must be a valid UUID" });
  }

  res.json({ message: `User with ID ${id} retrieved successfully` });
});

router.get("/", (req, res) => {
  const { minAge, maxAge } = req.query;

  const schema = Joi.object({
    minAge: Joi.number().integer().min(0).optional(),
    maxAge: Joi.number().integer().min(0).optional(),
  });
  const { error } = schema.validate({ minAge, maxAge });

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  if (minAge && maxAge && minAge > maxAge) {
    return res.status(400).json({ error: "minAge cannot be greater than maxAge" });
  }

  res.json({ message: "Users retrieved successfully", filter: { minAge, maxAge } });
});

export default router;
