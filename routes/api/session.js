const express = require('express');
const asyncHandler = require('express-async-handler');
const { validationResult, check } = require('express-validator');



const { authenticated, generateToken } = require('./security-utils');

const router = express.Router();

const email = check('email').isEmail().withMessage('Provide valid email').normalizeEmail();
const password = check('password').not().isEmpty().withMessage('Provide password');


router.put('/', [email, password],
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return next({ status: 422, errors: errors.array() });
        const { email, password } = req.body;
        let user;
        try {
            user = await UserRepository.findByEmail(email);
        } catch (e) {
            return next({ status: 401, message: "UserRepo.findByEmail did not work" });
        }
        if (!user.isValidPassword(password)) {
            const err = new Error('Invalid credentials');
            err.status = 401;
            err.title = 'Login failed';
            err.errors = ['Invalid1 credentials'];
            return next(err);
        }
        const { jti, token } = generateToken(user);
        user.tokenId = jti;
        await user.save();
        res.cookie('token', token);
        res.json({ token, user: user.toSafeObject() });
    }));

router.delete('/', [authenticated],
    asyncHandler(async (req, res) => {
        req.user.tokenId = null;
        await req.user.save();
        res.clearCookie('token');
        res.json({ message: 'success' });
    }));

module.exports = router;
