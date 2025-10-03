const express = require('express');
const { registerUser, loginUser, updateUserProfile, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const Proxyhandler = require('./Proxy');

const router = express.Router();

router.post('/register', (req, res, next) => new Proxyhandler(registerUser).handle(req, res, next));
router.post('/login', (req, res, next) => new Proxyhandler(loginUser).handle(req, res, next));
router.get('/profile', (req, res, next) => new Proxyhandler(getProfile, [protect]).handle(req, res, next));
router.put('/profile', (req, res, next) => new Proxyhandler(updateUserProfile, [protect]).handle(req, res, next));


module.exports = router;
