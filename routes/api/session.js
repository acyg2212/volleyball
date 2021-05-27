const express = require('express');
const asyncHandler = require('express-async-handler');
const { validationResult, check } = require('express-validator');



const router = express.Router();

const email = check('email').isEmail().withMessage('Provide valid email').normalizeEmail();
const password = check('password').not().isEmpty().withMessage("Provide Password");
