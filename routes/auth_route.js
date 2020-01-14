let express = require('express');
let router = express.Router();

let middleware_controller = require('../controllers/MiddlewareController');
let auth_controller = require('../controllers/AuthController');

router.get('/login', function (req, res, next) {
    auth_controller.login(req, res, next);
});
router.post('/login', function (req, res, next) {
    auth_controller.postLogin(req, res, next);
});

router.get('/register', function (req, res, next) {
    auth_controller.register(req, res, next);
});
router.post('/register', function (req, res, next) {
    auth_controller.postRegister(req, res, next);
});

router.get('/verification-email', function (req, res, next) {
    auth_controller.verify_email(req, res, next);
});
router.post('/verification-email', function (req, res, next) {
    auth_controller.postVerifyEmail(req, res, next);
});

router.get('/verification-phone', function (req, res, next) {
    auth_controller.verify_phone(req, res, next);
});
router.post('/verification-phone', function (req, res, next) {
    auth_controller.postVerifyPhone(req, res, next);
});
router.post('/verification-phone-code', function (req, res, next) {
    auth_controller.postVerifyPhoneCode(req, res, next);
});

router.get('/reset-password', function (req, res, next) {
    auth_controller.resetPassword(req, res, next);
});
router.get('/forgot-password', function (req, res, next) {
    auth_controller.forgotPassword(req, res, next);
});
router.post('/forgot-password', function (req, res, next) {
    auth_controller.postForgotPassword(req, res, next);
});
router.post('/reset-password', function (req, res, next) {
    auth_controller.postResetPassword(req, res, next);
});

router.get('/logout', function (req, res, next) {
    auth_controller.logout(req, res, next);
});




module.exports = router;