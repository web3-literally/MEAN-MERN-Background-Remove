let express = require('express');
let router = express.Router();

let MiddlewareController = require('../controllers/MiddlewareController');
let AdminController = require('../controllers/AdminController');


router.get('/account-settings', MiddlewareController.m_checkLogin, function (req, res, next) {
    AdminController.account_settings(req, res, next);
});
router.post('/account-settings/edit-profile', MiddlewareController.m_checkLoginPost, function (req, res, next) {
    AdminController.editProfile(req, res, next);
});
router.post('/account-settings/change-avatar', MiddlewareController.m_checkLoginPost, function (req, res, next) {
    AdminController.changeAvatar(req, res, next);
});



router.get('/dashboard', MiddlewareController.m_checkLogin, MiddlewareController.m_checkAdmin, function (req, res, next) {
    AdminController.dashboard(req, res, next);
});
router.get('/activity', MiddlewareController.m_checkLogin, MiddlewareController.m_checkAdmin, function (req, res, next) {
    AdminController.activity(req, res, next);
});
router.get('/setting', MiddlewareController.m_checkLogin, MiddlewareController.m_checkAdmin, function (req, res, next) {
    AdminController.setting(req, res, next);
});
router.get('/client-management', MiddlewareController.m_checkLogin, MiddlewareController.m_checkAdmin, function (req, res, next) {
    AdminController.clientManagement(req, res, next);
});
router.get('/message-center/new-message', MiddlewareController.m_checkLogin, MiddlewareController.m_checkAdmin, function (req, res, next) {
    AdminController.newMessage(req, res, next);
});
router.get('/message-center/inbox', MiddlewareController.m_checkLogin, MiddlewareController.m_checkAdmin, function (req, res, next) {
    AdminController.messageInbox(req, res, next);
});
router.get('/message-center/sent', MiddlewareController.m_checkLogin, MiddlewareController.m_checkAdmin, function (req, res, next) {
    AdminController.messageSent(req, res, next);
});


router.post('/editUser', MiddlewareController.m_checkLoginPost, MiddlewareController.m_checkAdminPost, function (req, res, next) {
    AdminController.editUser(req, res, next);
});
router.post('/delete-activity', MiddlewareController.m_checkLoginPost, MiddlewareController.m_checkAdminPost, function (req, res, next) {
    AdminController.deleteActivity(req, res, next);
});
router.post('/send-message', MiddlewareController.m_checkLoginPost, MiddlewareController.m_checkAdminPost, function (req, res, next) {
    AdminController.sendMessage(req, res, next);
});
router.post('/accept-custom-background', MiddlewareController.m_checkLoginPost, MiddlewareController.m_checkAdminPost, function (req, res, next) {
    AdminController.acceptCustomBackground(req, res, next);
});
router.post('/setting/upload-backgrounds', MiddlewareController.m_checkLoginPost, MiddlewareController.m_checkAdminPost, function (req, res, next) {
    AdminController.uploadBackgrounds(req, res, next);
});
router.post('/setting/delete-backgrounds', MiddlewareController.m_checkLoginPost, MiddlewareController.m_checkAdminPost, function (req, res, next) {
    AdminController.deleteBackgrounds(req, res, next);
});
router.post('/setting/visible-backgrounds', MiddlewareController.m_checkLoginPost, MiddlewareController.m_checkAdminPost, function (req, res, next) {
    AdminController.visibleBackgrounds(req, res, next);
});
router.post('/setting/set-background', MiddlewareController.m_checkLoginPost, MiddlewareController.m_checkAdminPost, function (req, res, next) {
    AdminController.editUser(req, res, next);
});
router.post('/change-theme', MiddlewareController.m_checkLoginPost, MiddlewareController.m_checkAdminPost, function (req, res, next) {
    AdminController.changeTheme(req, res, next);
});

module.exports = router;
