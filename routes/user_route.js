let express = require('express');
let router = express.Router();

let MiddlewareController = require('../controllers/MiddlewareController');
let UserController = require('../controllers/UserController');
let AdminController = require('../controllers/AdminController');

/**
 * Multi-language Support
 * */
router.get('/lang/en', function (req, res) {
    res.cookie('i18n', 'EN');
    res.redirect(req.headers.referer)
});
router.get('/lang/pl', function (req, res) {
    res.cookie('i18n', 'PL');
    res.redirect(req.headers.referer)
});

router.get('/', MiddlewareController.m_checkLogin, function (req, res, next) {
    if (req.session.user.role == 0 || req.session.user.role == 1)
        AdminController.dashboard(req, res, next);
    else
        UserController.dashboard(req, res, next);
});

router.get('/dashboard', MiddlewareController.m_checkLogin, function (req, res, next) {
    UserController.dashboard(req, res, next);
});

router.get('/recent_activities', MiddlewareController.m_checkLogin, function (req, res, next) {
    UserController.recentActivities(req, res, next);
});

router.get('/tutorial', MiddlewareController.m_checkLogin, function (req, res, next) {
    UserController.tutorial(req, res, next);
});

router.get('/background-remove', MiddlewareController.m_checkLogin, function (req, res, next) {
    UserController.backgroundRemove(req, res, next);
});

router.get('/setting', MiddlewareController.m_checkLogin, function (req, res, next) {
    UserController.setting(req, res, next);
});

router.get('/help/new-message', MiddlewareController.m_checkLogin, function (req, res, next) {
    UserController.newMessage(req, res, next);
});
router.get('/help/inbox', MiddlewareController.m_checkLogin, function (req, res, next) {
    UserController.helpInbox(req, res, next);
});

router.get('/help/sent', MiddlewareController.m_checkLogin, function (req, res, next) {
    UserController.helpSent(req, res, next);
});

router.get('/image-process', MiddlewareController.m_checkLogin, function (req, res, next) {
    UserController.imageProcess(req, res, next);
});



router.post('/select-background', MiddlewareController.m_checkLogin, function (req, res, next) {
    UserController.selectBackground(req, res, next);
});

router.post('/make-logo', MiddlewareController.m_checkLogin, function (req, res, next) {
    UserController.makeLogo(req, res);
});

router.post('/send-message', MiddlewareController.m_checkLogin, function (req, res, next) {
    UserController.sendMessage(req, res, next);
});


module.exports = router;
