let BaseController = require('./BaseController.js');
module.exports = {
    name: 'MiddlewareController',
    m_checkLogin: function (req, res, next) {
        if (req.session.login === 1 && req.session.user) next();
        else {
            req.session.login = 0;
            req.session.user = null;
            res.redirect('/auth/login');
        }
    },
    m_checkAdmin: function (req, res, next) {
        let role = req.session.user.role;
        if (role === 0 || role === 1) next();
        else res.redirect('/404');
    },
    m_checkLoginPost: function (req, res, next) {
        if (req.session.login === 1 && req.session.user) next();
        else {
            req.session.login = 0;
            req.session.user = null;
            res.send({status: 'error', message: res.cookie().__('You are not logged in')});
        }
    },
    m_checkAdminPost: function (req, res, next) {
        let role = req.session.user.role;
        if (role === 0 || role === 1) next();
        else res.send({status: 'error', message: res.cookie().__('Access is undefined')});
    },
};
