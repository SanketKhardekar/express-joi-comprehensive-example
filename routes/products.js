import express from 'express';
import Joi from 'joi';

const router = express.Router();

const productSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  price: Joi.number().positive().precision(2).required(),
  category: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).optional(),
  stock: Joi.number().integer().min(0).required(),
  description: Joi.string().optional(),
  releaseDate: Joi.date().iso().optional(),
});

router.post('/', (req, res) => {
  const { error, value } = productSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  res.status(201).json({ message: 'Product created successfully', product: value });
});

export default router;
