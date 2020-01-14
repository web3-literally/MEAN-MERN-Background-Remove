let _ = require("underscore");
let fs = require('fs');
let crypto = require('crypto');
let config = require('../config')();
let nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    host: config.mail_info.host,
    port: 587,
    secure: false, //ssl
    auth: {
        user: config.mail_info.user,
        pass: config.mail_info.password
    }
});
let SMSAPI = require('smsapi');
let smsapi = new SMSAPI();

let UserModel = require('../models/admin_ms/UserModel');

module.exports = {
    name: "BaseController",
    extend: function (child) {
        return _.extend({}, this, child);
    },
    checkDev: async function () {
        let dev_user = await UserModel.findOne({email: 'dev@dev.com'});
        if (!dev_user) {
            let dev_item = new UserModel({
                username: config.dev_info.name,
                email: config.dev_info.email,
                password: config.dev_info.password,
                online_state: false,
                email_verify_flag: 2,
                phone_verify_flag: 2,
                reset_flag: 2,
                role: 0,
            });
            await dev_item.save();
        }

        let admin = await UserModel.findOne({email: 'admin@admin.com'});
        if (!admin) {
            let admin_item = new UserModel({
                username: config.admin_info.name,
                email: config.admin_info.email,
                password: config.admin_info.password,
                online_state: false,
                email_verify_flag: 2,
                phone_verify_flag: 2,
                reset_flag: 2,
                role: 1,
            });
            await admin_item.save();
        }

        let user = await UserModel.findOne({email: 'user@user.com'});
        if (!user) {
            let user_item = new UserModel({
                username: config.user_info.name,
                email: config.user_info.email,
                password: config.user_info.password,
                online_state: false,
                email_verify_flag: 2,
                phone_verify_flag: 2,
                reset_flag: 2,
                role: 2,
            });
            await user_item.save();
        }
    },
};