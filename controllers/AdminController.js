let View = require('../views/base');
let path = require('path');
let fs = require('fs');
let crypto = require('crypto');
let nodemailer = require('nodemailer');
let config = require('../config/index')();
let transporter = nodemailer.createTransport({
    host: config.mail_info.host,
    port: 587,
    secure: false,
    auth: {
        user: config.mail_info.user,
        pass: config.mail_info.password
    }
});
let ejs = require('ejs');
let speakeasy = require('speakeasy');

let BaseController = require('./BaseController');
let UserModel = require('../models/admin_ms/UserModel');
let BackgroundModel = require('../models/admin_ms/BackgroundModel');
let ActivityHistoryModel = require('../models/admin_ms/ActivityHistoryModel');
let UserMessageModel = require('../models/admin_ms/UserMessageModel');
let AdminMessageModel = require('../models/admin_ms/AdminMessageModel');
let ConfigModel = require('../models/admin_ms/ConfigModel');

module.exports = BaseController.extend({
    name: 'UserController',

    account_settings: async function (req, res, next) {
        let user = await UserModel.findOne({id: req.session.user.id});

        let config = await ConfigModel.findOne({});
        let theme_index = 4;
        if (config)
            theme_index = config.theme_index;
        let v = new View(res, 'settings/account_settings');
        v.render({
            title: 'MotorCut|Profile',
            session: req.session,
            i18n: res,
            tab_text: 'settings',
            sub_text: 'settings_profile',
            user: user,
            theme_index: theme_index,
        })
    },
    editProfile: async function (req, res, next) {
        let username = req.body.username, email = req.body.email,
            old_password = req.body.old_password, new_password = req.body.new_password;
        let user = await UserModel.findOne({id: req.session.user.id});
        if (user.email !== email) return res.send({status: 'error', message: res.cookie().__('Undefined user')});
        if (!user.verifyPassword(old_password)) return res.send({status: 'error', message: res.cookie().__('Old password is not correct')});
        user.username = username;
        user.password = new_password;
        await user.save();
        req.session.user = user;
        return res.send({status: 'success', message: res.cookie().__('Updated user profile successfully')});
    },
    changeAvatar: async function (req, res, next) {
        let user = await UserModel.findOne({id: req.session.user.id});
        let avatarPath = user.avatar;
        if (req.body.avatarImg.length > 1000) {
            let avatarData = req.body.avatarImg.replace(/^data:image\/\w+;base64,/, "");
            let file_extension = '.png';
            if (avatarData.charAt(0) === '/') file_extension = '.jpg';
            else if (avatarData.charAt(0) === 'R') file_extension = '.gif';
            let public_path = path.resolve('public');
            avatarPath = '/avatars/avatar_' + user.id + file_extension;
            let avatarUploadPath = path.resolve('public') + avatarPath;
            fs.writeFileSync(avatarUploadPath, avatarData, 'base64');
        }
        await user.updateOne({avatar: avatarPath});
        req.session.user.avatar = avatarPath;
        return res.send({status: 'success', message: res.cookie().__('Changed avatar successfully'), avatarPath: avatarPath});
    },
    error: async function (req, res, next) {
        let config = await ConfigModel.findOne({});
        let theme_index = 4;
        if (config)
            theme_index = config.theme_index;
        let v = new View(res, 'partials/error');
        v.render({
            title: 'MotorCut|Error',
            session: req.session,
            i18n: res,
            theme_index: theme_index,
        })
    },


    dashboard: async function (req, res, next) {
        let user = req.session.user;
        let users = await UserModel.find({role: 2});
        let users_credits = await UserModel.aggregate([{$match: {role:2}}, {$group: {_id:null, all_remain_token:{$sum:"$remain_token"}}}]);
        let ranking_users = await UserModel.aggregate([{$match: {role:2}}, {$sort: {'processed_count': -1}}]);
        let highest_members = [];
        let lowest_members = [];
        if (ranking_users.length >= 3)
        {
            highest_members.push(ranking_users[0]);
            highest_members.push(ranking_users[1]);
            highest_members.push(ranking_users[2]);
        }
        if (ranking_users.length >= 6)
        {
            lowest_members.push(ranking_users[ranking_users.length - 1]);
            lowest_members.push(ranking_users[ranking_users.length - 2]);
            lowest_members.push(ranking_users[ranking_users.length - 3]);
        }

        let config = await ConfigModel.findOne({});
        let theme_index = 4;
        if (config)
            theme_index = config.theme_index;
        let v = new View(res, 'admin_vs/dashboard');
        v.render({
            title: 'MotorCut|Dashboard',
            session: req.session,
            i18n: res,
            tab_text: 'admin_dashboard',
            sub_text: '',
            theme_index: theme_index,
            user: user,
            users: users,
            highest_members: highest_members,
            lowest_members: lowest_members,
            users_credits: users_credits[0].all_remain_token,
        })
    },
    activity: async function (req, res, next) {
        let user = req.session.user;
        let activities = await ActivityHistoryModel.aggregate([{$match: {}}, {$sort: {'history_date': -1}}]);
        let users = await UserModel.find({});

        let config = await ConfigModel.findOne({});
        let theme_index = 4;
        if (config)
            theme_index = config.theme_index;
        let v = new View(res, 'admin_vs/activity');
        v.render({
            title: 'MotorCut|Activity',
            session: req.session,
            i18n: res,
            tab_text: 'admin_activity',
            sub_text: '',
            theme_index: theme_index,
            user: user,
            users: users,
            activities: activities,
        })
    },
    setting: async function (req, res, next) {
        let user = req.session.user;
        let backgrounds = await BackgroundModel.find({});
        let users = await UserModel.find({});
        let config = await ConfigModel.findOne({});
        let theme_index = 4;
        if (config)
            theme_index = config.theme_index;
        let v = new View(res, 'admin_vs/setting');
        v.render({
            title: 'MotorCut|Setting',
            session: req.session,
            i18n: res,
            tab_text: 'admin_setting',
            sub_text: '',
            theme_index: theme_index,
            user: user,
            backgrounds:backgrounds,
            users: users,
        })
    },
    clientManagement: async function (req, res, next) {
        let user = req.session.user;
        let users = await UserModel.find({role:2});
        let backgrounds = await BackgroundModel.find({});

        let config = await ConfigModel.findOne({});
        let theme_index = 4;
        if (config)
            theme_index = config.theme_index;
        let v = new View(res, 'admin_vs/client_manage');
        v.render({
            title: 'MotorCut|Client Management',
            session: req.session,
            i18n: res,
            tab_text: 'admin_client_management',
            sub_text: '',
            theme_index: theme_index,
            user: user,
            users: users,
            backgrounds: backgrounds,
        })
    },
    messageInbox: async function (req, res, next) {
        let user = req.session.user;
        let inbox_messages = await UserMessageModel.aggregate([{$match: {}}, {$sort: {'date': -1}}]);
        if (!inbox_messages) inbox_messages = [];
        let users = await UserModel.find({});

        let config = await ConfigModel.findOne({});
        let theme_index = 4;
        if (config)
            theme_index = config.theme_index;
        let v = new View(res, 'admin_vs/message_inbox');
        v.render({
            title: 'MotorCut|Message Inbox',
            session: req.session,
            i18n: res,
            tab_text: 'message_center',
            sub_text: 'inbox_message',
            theme_index: theme_index,
            user: user,
            users: users,
            inbox_messages: inbox_messages,
        })
    },
    newMessage: async function (req, res, next) {
        let user = req.session.user;

        let config = await ConfigModel.findOne({});
        let theme_index = 4;
        if (config)
            theme_index = config.theme_index;
        let v = new View(res, 'admin_vs/new_message');
        v.render({
            title: 'MotorCut|Message Inbox',
            session: req.session,
            i18n: res,
            tab_text: 'message_center',
            sub_text: 'admin_new_message',
            user: user,
            theme_index: theme_index,
        })
    },
    messageSent: async function (req, res, next) {
        let user = req.session.user;
        let sent_messages = await AdminMessageModel.aggregate([{$match: {}}, {$sort: {'date': -1}}]);
        if (!sent_messages) sent_messages = [];
        let users = await UserModel.find({});

        let config = await ConfigModel.findOne({});
        let theme_index = 4;
        if (config)
            theme_index = config.theme_index;
        let v = new View(res, 'admin_vs/message_sent');
        v.render({
            title: 'MotorCut|Message Sent',
            session: req.session,
            i18n: res,
            tab_text: 'message_center',
            sub_text: 'sent_message',
            theme_index: theme_index,
            user: user,
            users: users,
            sent_messages: sent_messages,
        })
    },


    editUser: async function (req, res, next) {
        let type = req.body.type;

        let bIsAvatarChanged = req.body.bIsAvatarChanged;
        let avatarPath = '';
        if (bIsAvatarChanged)
        {
            let user_avatar = req.body.user_avatar;
            let avatar = user_avatar.replace(/^data:image\/\w+;base64,/, "");
            let file_extension = '.png';
            if (avatar.charAt(0) === '/') file_extension = '.jpg';
            else if (avatar.charAt(0) === 'R') file_extension = '.gif';
            let public_path = path.resolve('public');
            avatarPath = '/avatars/avatar_' + Math.random() + file_extension;
            let avatarUploadPath = public_path + avatarPath;
            fs.writeFileSync(avatarUploadPath, avatar, 'base64');
        }

        if (type == "add")
        {
            let username = req.body.username;
            let email = req.body.email;
            let phone = req.body.phone;
            let password = req.body.password;
            let monthly_token = req.body.monthly_token;

            let new_user = new UserModel({
                username: username,
                email: email,
                phone:phone,
                monthly_token: monthly_token,
                remain_token: monthly_token,
                password: password,
                online_state: false,
                email_verify_flag: 2,
                phone_verify_flag: 2,
                reset_flag: 2,
                role: 2,
                token_assign_date: new Date()
            });

            if (bIsAvatarChanged)
                new_user.avatar = avatarPath;
            await new_user.save();
            return res.send({status: 'success', message: res.cookie().__('Registered New User Successfully')});
        }
        if (type == "edit")
        {
            let id = req.body.id;
            let username = req.body.username;
            let email = req.body.email;
            let phone = req.body.phone;
            let monthly_token = req.body.monthly_token;
            let password_flag = req.body.password_flag;
            let password = req.body.password;

            let user = await UserModel.findOne({id: id});
            if (!user) return res.send({status: 'error', message: res.cookie().__('Undefined user')});

            if (user.monthly_token != monthly_token)
                await user.updateOne({username: username, email: email, phone: phone, monthly_token: monthly_token, remain_token: monthly_token, token_assign_date: new Date()});
            else
                await user.updateOne({username: username, email: email, phone: phone});

            if (password_flag == 'true') {
                await user.updateOne({password: crypto.createHash('md5').update(password).digest('hex')})
            }

            if (bIsAvatarChanged)
                await user.updateOne({avatar: avatarPath});
            return res.send({status: 'success', message: res.cookie().__('Updated user profile successfully')});
        }
        if (type == "active")
        {
            let id = req.body.id;
            let user = await UserModel.findOne({id: id});
            if (!user) return res.send({status: 'error', message: res.cookie().__('Undefined user')});

            await user.updateOne({aprove_status: 'ACTIVE'});
            return res.send({status: 'success', message: res.cookie().__('User Account Actived!')});
        }
        if (type == "block")
        {
            let id = req.body.id;
            let user = await UserModel.findOne({id: id});
            if (!user) return res.send({status: 'error', message: res.cookie().__('Undefined user')});

            await user.updateOne({aprove_status: 'BLOCK'});
            return res.send({status: 'success', message: res.cookie().__('User Account Blocked!')});
        }
        if (type == "remove") {
            let id = req.body.id;
            await UserModel.deleteMany({id: id});
            return res.send({status: 'success', message: res.cookie().__('User Account Deleted!')});
        }
        if (type == "set-background") {
            let user_id = req.body.user_id;
            let background_id = req.body.background_id;
            let background_url = req.body.background_url;
            let user = await UserModel.findOne({id: user_id});
            if (!user) return res.send({status: 'error', message: res.cookie().__('Undefined user')});

            let old_background = await BackgroundModel.findOne({id: user.background_id});
            if (old_background){
                //console.log(old_background);
                if (old_background.user_list.includes(user.id))
                {
                    old_background.user_list.remove(user.id);
                    await old_background.save();
                }
            }

            let new_background = await BackgroundModel.findOne({id: background_id});
            if (new_background){
                new_background.user_list.push(user.id);
                await new_background.save();
            }

            await user.updateOne({background_id: background_id, background_url: background_url});
            return res.send({status: 'success', message: res.cookie().__('Updated background successfully!')});
        }
        if (type == "background-upload-set") {
            let user_id = req.body.user_id;
            //----------- Image Save To File!---------------
            let background_data = req.body.background_data;
            let background = background_data.replace(/^data:image\/\w+;base64,/, "");
            let file_extension = '.png';
            if (background.charAt(0) === '/') file_extension = '.jpg';
            else if (background.charAt(0) === 'R') file_extension = '.gif';
            let public_path = path.resolve('public');
            let backgroundPath = '/backgrounds/background_' + Math.random() + file_extension;
            let backgroundUploadPath = public_path + backgroundPath;
            fs.writeFileSync(backgroundUploadPath, background, 'base64');
            let new_background = new BackgroundModel({
                url: backgroundPath,
                visible_flag: true,
            });
            await new_background.save();

            let user = await UserModel.findOne({id: user_id});
            if (!user) return res.send({status: 'error', message: res.cookie().__('Undefined user')});

            let old_background = await BackgroundModel.findOne({id: user.background_id});
            if (old_background){
                //console.log(old_background);
                if (old_background.user_list.includes(user.id))
                {
                    old_background.user_list.remove(user.id);
                    await old_background.save();
                }
            }

            new_background.user_list.push(user.id);
            await new_background.save();

            await user.updateOne({background_url: backgroundPath});
            return res.send({status: 'success', message: res.cookie().__('Updated background successfully!')});
        }
    },
    deleteActivity: async function (req, res, next) {
        let delete_type = req.body.delete_type;

        if (delete_type == "today")
        {
            let from_date = new Date();
            from_date.setDate(from_date.getDate() - 1);
            await ActivityHistoryModel.deleteMany({history_date: {$gte: from_date}});
            return res.send({status: 'success', message: res.cookie().__('Today Activity History Removed Successfully')});
        }
        if (delete_type == "week")
        {
            let from_date = new Date();
            from_date.setDate(from_date.getDate() - 7);
            await ActivityHistoryModel.deleteMany({history_date: {$gte: from_date}});
            return res.send({status: 'success', message: res.cookie().__('Week Activity History Removed Successfully')});
        }
        if (delete_type == "month")
        {
            let from_date = new Date();
            from_date.setDate(from_date.getDate() - 30);
            await ActivityHistoryModel.deleteMany({history_date: {$gte: from_date}});
            return res.send({status: 'success', message: res.cookie().__('Month Activity History Removed Successfully')});
        }
        if (delete_type == "total")
        {
            await ActivityHistoryModel.deleteMany({});
            return res.send({status: 'success', message: res.cookie().__('Total Activity History Removed Successfully')});
        }
        {
            let user_id = req.body.user_id;
            let background_data = req.body.background_data;
            let background = background_data.replace(/^data:image\/\w+;base64,/, "");
            let file_extension = '.png';
            if (background.charAt(0) === '/') file_extension = '.jpg';
            else if (background.charAt(0) === 'R') file_extension = '.gif';
            let public_path = path.resolve('public');
            let backgroundPath = '/backgrounds/background_' + Math.random() + file_extension;
            let backgroundUploadPath = public_path + backgroundPath;
            fs.writeFileSync(backgroundUploadPath, background, 'base64');
            let new_background = new BackgroundModel({
                url: backgroundPath,
                visible_flag: true,
            });
            await new_background.save();

            let user = await UserModel.findOne({id: user_id});
            if (!user) return res.send({status: 'error', message: res.cookie().__('Undefined user')});

            let old_background = await BackgroundModel.findOne({id: user.background_id});
            if (old_background){
                //console.log(old_background);
                if (old_background.user_list.includes(user.id))
                {
                    old_background.user_list.remove(user.id);
                    await old_background.save();
                }
            }

            new_background.user_list.push(user.id);
            await new_background.save();

            await user.updateOne({background_url: backgroundPath});
            return res.send({status: 'success', message: res.cookie().__('Updated background successfully!')});
        }
    },
    uploadBackgrounds: async function (req, res, next) {
        let background_data = req.body.background_data;
        if (!background_data)
            return res.send({status: 'failed', message: res.cookie().__('Please Select Images!')});
        for (let i = 0; i < background_data.length; i++)
        {
            let background = background_data[i].replace(/^data:image\/\w+;base64,/, "");
            let file_extension = '.png';
            if (background.charAt(0) === '/') file_extension = '.jpg';
            else if (background.charAt(0) === 'R') file_extension = '.gif';
            let public_path = path.resolve('public');
            let backgroundPath = '/backgrounds/background_' + Math.random() + file_extension;
            let backgroundUploadPath = public_path + backgroundPath;
            fs.writeFileSync(backgroundUploadPath, background, 'base64');

            let new_background = new BackgroundModel({
                url: backgroundPath,
                visible_flag: true,
            });
            await new_background.save();
        }
        return res.send({status: 'success', message: res.cookie().__('Background uploaded successfully')});
    },
    deleteBackgrounds: async function (req, res, next) {
        let background_id = req.body.background_id;
        let background_item = await BackgroundModel.findOne({id: background_id});
        if (!background_item)
            return res.send({status: 'failed', message: res.cookie().__('Can not find this background!')});
        await background_item.remove();
        return res.send({status: 'success', message: res.cookie().__('Background deleted successfully')});
    },
    visibleBackgrounds: async function (req, res, next) {
        let background_id = req.body.background_id;
        let visible = req.body.visible;
        let background_item = await BackgroundModel.findOne({id: background_id});
        if (!background_item)
            return res.send({status: 'failed', message: res.cookie().__('Can not find this background!')});
        background_item.visible_flag = (visible == "Visible");
        await background_item.save();
        return res.send({status: 'success', message: res.cookie().__('Background Setting Success!')});
    },
    sendMessage: async function (req, res, next) {
        let user_email = req.body.user_email;
        let user_item = await UserModel.findOne({email: user_email});
        if (!user_item) return res.send({status: 'error', message: res.cookie().__('This Email User is undefined!')});

        let message_subject = req.body.message_subject;
        let message_content = req.body.message_content;
        let date = req.body.date;

        let new_message = new AdminMessageModel({
            user_id: user_item.id,
            subject: message_subject,
            content: message_content,
            date: date,
        });
        await new_message.save();

        return res.send({status: 'success', message: res.cookie().__('Your message is sent successfully')});
    },
    acceptCustomBackground: async function (req, res, next) {
        let message_id = req.body.message_id;
        let message_inbox = await UserMessageModel.findOne({id: message_id});
        if (!message_inbox) return res.send({status: 'failed', message: res.cookie().__('There is not this message!')});

        let new_background = new BackgroundModel({
            url: message_inbox.image_url,
            owner_id: message_inbox.user_id,
            visible_flag: true,
        });
        await new_background.save();
        await message_inbox.updateOne({status: 'READ'});
        return res.send({status: 'success', message: res.cookie().__('Your message is sent successfully')});
    },
    changeTheme: async function (req, res, next) {
        let theme_index = req.body.theme_index;
        let config = await ConfigModel.findOne({});
        if (!config) {
            config = new ConfigModel({
                theme_index: theme_index
            });
        } else {
            config.theme_index = theme_index;
        }
        await config.save();
        return res.send({status: 'success', message: res.cookie().__('Application Theme Changed Successfully.')});
    },

});
