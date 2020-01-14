let View = require('../views/base');
let path = require('path');
let request = require('request-promise');
let fs = require('fs');
let crypto = require('crypto');
let ejs = require('ejs');
let config = require('../config/index')();
let config_limit = 500000;
let nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    host: config.mail_info.host,
    port: 587,
    secure: false,
    auth: {
        user: config.mail_info.user,
        pass: config.mail_info.password
    }
});
let sleep = require('sleep');

let BaseController = require('./BaseController');
let BackgroundModel = require('../models/admin_ms/BackgroundModel');
let UserModel = require('../models/admin_ms/UserModel');
let ActivityHistoryModel = require('../models/admin_ms/ActivityHistoryModel');
let UserMessageModel = require('../models/admin_ms/UserMessageModel');
let AdminMessageModel = require('../models/admin_ms/AdminMessageModel');
let ConfigModel = require('../models/admin_ms/ConfigModel');

module.exports = BaseController.extend({
    name: 'HomeController',

    error: async function (req, res, next) {
        let v = new View(res, 'partials/error');

        let config = await ConfigModel.findOne({});
        let theme_index = 4;
        if (config)
            theme_index = config.theme_index;
        v.render({
            title: 'MotorCut|Error',
            session: req.session,
            i18n: res,
            theme_index: theme_index,
        })
    },
    dashboard: async function (req, res, next) {
        let user = req.session.user;
        let user_item = await UserModel.findOne({id: user.id});
        let activities = await ActivityHistoryModel.aggregate([{$match: {user_id: user_item.id}}, {$sort: {'history_date': -1}}]);

        let config = await ConfigModel.findOne({});
        let theme_index = 4;
        if (config)
            theme_index = config.theme_index;
        let v = new View(res, 'user_vs/dashboard');
        v.render({
            title: 'MotorCut|Dashboard',
            session: req.session,
            i18n: res,
            tab_text: 'user_dashboard',
            sub_text: '',
            theme_index: theme_index,
            user: user_item,
            activities: activities,
        })
    },
    recentActivities: async function (req, res, next) {
        let user = req.session.user;
        let user_item = await UserModel.findOne({id: user.id});
        let activities = await ActivityHistoryModel.aggregate([{$match: {user_id: user_item.id}}, {$sort: {'history_date': -1}}]);

        let config = await ConfigModel.findOne({});
        let theme_index = 4;
        if (config)
            theme_index = config.theme_index;
        let v = new View(res, 'user_vs/recent_activity');
        v.render({
            title: 'MotorCut|Recent Activities',
            session: req.session,
            i18n: res,
            tab_text: 'recent_activities',
            sub_text: '',
            theme_index: theme_index,
            user: user_item,
            activities: activities,
        })
    },
    tutorial: async function (req, res, next) {
        let user = req.session.user;
        let user_item = await UserModel.findOne({id: user.id});

        let config = await ConfigModel.findOne({});
        let theme_index = 4;
        if (config)
            theme_index = config.theme_index;
        let v = new View(res, 'user_vs/tutorial');
        v.render({
            title: 'MotorCut|Tutorial',
            session: req.session,
            i18n: res,
            tab_text: 'user_tutorial',
            sub_text: '',
            theme_index: theme_index,
            user: user_item,
        })
    },
    imageProcess: async function (req, res, next) {
        let user = req.session.user;

        let from_date = new Date();
        from_date.setDate(from_date.getDate() - 2);
        let activities = await ActivityHistoryModel.aggregate([{$match: {user_id:user.id, history_date: {$gte: from_date}}}, {$sort: {'history_date': -1}}]);
        if (!activities) activities = [];

        let config = await ConfigModel.findOne({});
        let theme_index = 4;
        if (config)
            theme_index = config.theme_index;
        let v = new View(res, 'user_vs/image_process');
        v.render({
            title: 'MotorCut|Image Process',
            session: req.session,
            i18n: res,
            tab_text: 'image_process',
            sub_text: '',
            theme_index: theme_index,
            user: user,
            activities: activities,
        })
    },
    backgroundRemove: async function (req, res, next) {
        let user = req.session.user;
        let server_backgrounds = await BackgroundModel.find({visible_flag: true, owner_id: null});
        let user_backgrounds = await BackgroundModel.find({owner_id: user.id});
        if (!server_backgrounds) server_backgrounds = [];
        if (!user_backgrounds) user_backgrounds = [];

        let config = await ConfigModel.findOne({});
        let theme_index = 4;
        if (config)
            theme_index = config.theme_index;
        let v = new View(res, 'user_vs/background-remove');
        v.render({
            title: 'MotorCut|Background Remove',
            session: req.session,
            i18n: res,
            tab_text: 'user_back_remove',
            sub_text: '',
            theme_index: theme_index,
            user: user,
            server_backgrounds:server_backgrounds,
            user_backgrounds:user_backgrounds,
        })
    },
    setting: async function (req, res, next) {
        let user = req.session.user;

        let config = await ConfigModel.findOne({});
        let theme_index = 4;
        if (config)
            theme_index = config.theme_index;
        let v = new View(res, 'user_vs/setting');
        v.render({
            title: 'MotorCut|Setting',
            session: req.session,
            i18n: res,
            tab_text: 'user_setting',
            sub_text: '',
            theme_index: theme_index,
            user: user,
        })
    },
    newMessage: async function (req, res, next) {
        let user = req.session.user;

        let config = await ConfigModel.findOne({});
        let theme_index = 4;
        if (config)
            theme_index = config.theme_index;
        let v = new View(res, 'user_vs/new_message');
        v.render({
            title: 'MotorCut|Help Inbox',
            session: req.session,
            i18n: res,
            tab_text: 'user_help',
            sub_text: 'user_new_message',
            theme_index: theme_index,
            user: user,
        })
    },
    helpInbox: async function (req, res, next) {
        let user = req.session.user;
        let inbox_messages = await AdminMessageModel.aggregate([{$match: {user_id: user.id}}, {$sort: {'date': -1}}]);
        if (!inbox_messages) inbox_messages = [];

        let config = await ConfigModel.findOne({});
        let theme_index = 4;
        if (config)
            theme_index = config.theme_index;
        let v = new View(res, 'user_vs/message_inbox');
        v.render({
            title: 'MotorCut|Help Inbox',
            session: req.session,
            i18n: res,
            tab_text: 'user_help',
            sub_text: 'inbox_message',
            theme_index: theme_index,
            user: user,
            inbox_messages: inbox_messages,
        })
    },
    helpSent: async function (req, res, next) {
        let user = req.session.user;
        let sent_messages = await UserMessageModel.aggregate([{$match: {user_id: user.id}}, {$sort: {'date': -1}}]);
        if (!sent_messages) sent_messages = [];

        let config = await ConfigModel.findOne({});
        let theme_index = 4;
        if (config)
            theme_index = config.theme_index;
        let v = new View(res, 'user_vs/message_sent');
        v.render({
            title: 'MotorCut|Help Sent',
            session: req.session,
            i18n: res,
            tab_text: 'user_help',
            sub_text: 'sent_message',
            theme_index: theme_index,
            user: user,
            sent_messages: sent_messages,
        })
    },

    selectBackground: async function (req, res, next) {
        let user = req.session.user;
        let background_id = req.body.background_id;
        let background_url = req.body.background_url;
        let user_item = await UserModel.findOne({id: user.id});
        if (!user_item) return res.send({status: 'error', message: res.cookie().__('Undefined user')});

        let old_background = await BackgroundModel.findOne({id: user_item.background_id});
        if (old_background){
            //console.log(old_background);
            if (old_background.user_list.includes(user_item.id))
            {
                old_background.user_list.remove(user_item.id);
                await old_background.save();
            }
        }

        let new_background = await BackgroundModel.findOne({id: background_id});
        if (new_background){
            new_background.user_list.push(user_item.id);
            await new_background.save();
        }

        await user_item.updateOne({background_id: background_id, background_url: background_url});

        req.session.user.background_url = background_url;
        return res.send({status: 'success', message: res.cookie().__('Updated Your Background successfully')});
    },
    makeLogo: async function (req, res) {
        console.log('@@@@ Make Logo Start @@@@');
        let user = req.session.user;
        let user_item = await UserModel.findOne({id: user.id});
        let remain_token = user_item.remain_token;
        if (user_item.role == 2 && remain_token <= 0)
            return res.send({status: 'failed', message: res.cookie().__('You run out of all credits!')});

        let public_path = path.resolve('public');
        let upload_image = req.body.upload_image;
        let background_url = user.background_url;
        let background_path = public_path + background_url;
        let uploadFullPath = '';
        let uploadPath = '';
        try {
            console.log('----Uploaded Image Save Start ----');
            let upload_stream = upload_image.replace(/^data:image\/\w+;base64,/, "");
            let file_extension = '.png';
            if (upload_stream.charAt(0) === '/') file_extension = '.jpg';
            else if (upload_stream.charAt(0) === 'R') file_extension = '.gif';
            uploadPath = '/logos/from/' + Math.random() + file_extension;
            uploadFullPath = public_path + uploadPath;
            fs.writeFileSync(uploadFullPath, upload_stream, 'base64');
            console.log('----Uploaded Image Save Finished ----');
        } catch (e) {
            console.log('**** Make Logo Failed ****');
            console.log(e.data);
            return res.send({status: 'failed', message: res.cookie().__(error)});
        }

        let cutter_type = req.body.cutter_type;
        let logoPath = '';
        let api_reply_status = '';
        let api_reply_err = '';

        console.log('----Image Process Request ----');
        await request.post({
            url: 'https://api.car-cutter.com/vehicle/composition/single-segment',
            formData: {
                'image': fs.createReadStream(uploadFullPath),
                'background': fs.createReadStream(background_path),
                'cut_type':cutter_type
            },
            headers: {
                'Authorization': 'Bearer 669abiq9przmb6vq67z1',
                'Cache-Control': 'no-cache',
                'Content-Type': 'multipart/form-data',
            }
        }).then(async function(body){
            try {
                console.log('----Image Process Request Return Success ----');
                logoPath = '/logos/result/logo_' + Math.random() + '.jpg';
                fs.writeFileSync(public_path + logoPath, body, 'base64');
                let activity = new ActivityHistoryModel({
                    user_id: user.id,
                    history_date: new Date(),
                    origin_url: uploadPath,
                    background_url: background_url,
                    result_url: logoPath,
                });
                await activity.save();
                let from_date = new Date();
                from_date.setDate(from_date.getDate() - 2);
                await ActivityHistoryModel.deleteMany({history_date: {$lte: from_date}});
                let user_item1 = await UserModel.findOne({id: user.id});
                if (user_item1.role == 2) await user_item.updateOne({remain_token: user_item1.remain_token - 1});
                await user_item1.updateOne({processed_count: user_item1.processed_count + 1, last_processed_date: new Date()});
                api_reply_status = 'success';
            } catch (e) {
                console.log('**** Image Process Reply Process Failed ****');
                console.log(e);
                api_reply_err = e;
                api_reply_status = 'failed';
            }
        }).catch(function(err){
            console.log('****Image Process Request Api Failed ****');
            console.log(err);
            api_reply_err = err;
            api_reply_status = 'api-failed';
        });

        if (api_reply_status == 'success'){
            console.log('return success');
            return res.send({status: 'success', logo_image:logoPath ,message: res.cookie().__('Logo Generated successfully')});
        } else if (api_reply_status == 'api-failed'){
            console.log('return api-failed');
            return res.send({status: 'api-failed', message: res.cookie().__(api_reply_err)});
        } else {
            console.log('return failed');
            return res.send({status: 'failed', message: res.cookie().__(api_reply_err)});
        }
    },

    sendMessage: async function (req, res, next) {
        let user = req.session.user;
        let user_item = await UserModel.findOne({id: user.id});
        if (!user_item) return res.send({status: 'error', message: res.cookie().__('Undefined user')});
        let message_subject = req.body.message_subject;
        let message_content = req.body.message_content;
        let user_background = req.body.user_background;
        let message_type = req.body.message_type;
        let date = req.body.date;

        let backgroundPath = '';
        if (user_background){
            //----------- Image Save To File!---------------
            let background = user_background.replace(/^data:image\/\w+;base64,/, "");
            let file_extension = '.png';
            if (background.charAt(0) === '/') file_extension = '.jpg';
            else if (background.charAt(0) === 'R') file_extension = '.gif';
            let public_path = path.resolve('public');
            backgroundPath = '/mailbox/user_image_' + Math.random() + file_extension;
            let backgroundUploadPath = public_path + backgroundPath;
            fs.writeFileSync(backgroundUploadPath, background, 'base64');
        }

        let new_message = new UserMessageModel({
            user_id: user_item.id,
            subject: message_subject,
            content: message_content,
            image_url: backgroundPath,
            type: message_type,
            date: date,
        });
        await new_message.save();

        return res.send({status: 'success', message: res.cookie().__('Your message is sent successfully')});
    },
});
