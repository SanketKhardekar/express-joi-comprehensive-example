import express from 'express';
import Joi from 'joi';

const router = express.Router();

const customJoi = Joi.extend((joi) => ({
  type: 'palindrome',
  base: joi.string(),
  messages: {
    'palindrome.base': '{{#label}} must be a palindrome',
  },
  validate(value, helpers) {
    if (value !== value.split('').reverse().join('')) {
      return { value, errors: helpers.error('palindrome.base') };
    }
  },
}));

const customMessageSchema = Joi.object({
  username: Joi.string().min(3).required().messages({
    'string.base': 'Username should be a type of text',
    'string.empty': 'Username cannot be empty',
    'string.min': 'Username should have a minimum length of {#limit}',
    'any.required': 'Username is a required field',
  }),
  birth_year: Joi.number().integer().min(1900).max(2023).required().messages({
    'number.base': 'Birth year should be a number',
    'number.min': 'Birth year should not be less than {#limit}',
    'number.max': 'Birth year should not be greater than {#limit}',
    'any.required': 'Birth year is a required field',
  }),
});

const conditionalSchema = Joi.object({
  isStudent: Joi.boolean().required(),
  discount: Joi.when('isStudent', {
    is: true,
    then: Joi.number().min(10).max(50).required(),
    otherwise: Joi.forbidden(),
  }),
});

const alternativesSchema = Joi.object({
  id: Joi.alternatives().try(Joi.string().uuid(), Joi.number().integer()),
  value: Joi.alternatives().try(
    Joi.string().regex(/^\d+$/).message('Must be a number string'),
    Joi.number().integer()
  ),
});

const palindromeSchema = customJoi.object({
  text: customJoi.palindrome().required(),
});

router.post('/custom-messages', (req, res) => {
  const { error, value } = customMessageSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  res.status(200).json({ message: 'Validation passed', value });
});

router.post('/conditional', (req, res) => {
  const { error, value } = conditionalSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  res.status(200).json({ message: 'Validation passed', value });
});

router.post('/alternatives', (req, res) => {
  const { error, value } = alternativesSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  res.status(200).json({ message: 'Validation passed', value });
});

router.post('/palindrome', (req, res) => {
  const { error, value } = palindromeSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  res.status(200).json({ message: 'Validation passed', value });
});

export default router;
