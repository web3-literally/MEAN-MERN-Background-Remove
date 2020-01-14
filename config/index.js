let config = {
    mode: 'local',
    port: 8880,
    cron_port: 8881,
    base_url: 'https://45.8.224.215:8880',//'http://31.220.62.124:8880',
    mongo: {
        host: '127.0.0.1',
        port: 27017,
        db_name:'motor_cut'
    },
    redis: {
        host: '127.0.0.1',
        port: 6379
    },
    dev_info: {
        name: 'Technical Manager',
        email: 'dev@dev.com',
        password: 'dev'
    },
    admin_info: {
        name: 'Administrator',
        email: 'admin@admin.com',
        password: 'admin'
    },
    user_info: {
        name: 'User',
        email: 'user@user.com',
        password: 'user'
    },
    mail_info: {
        host: 'smtp.gmail.com',
        // user: 'manager@ciupekcapitalcoin.com',
        user: 'willcomeo022@gmail.com',//'cpnauser@gmail.com',
        // password: '5yY8yA1Gq4'
        password: '1234567890!@#$%^&*()qwertyuiop',//'147258369abc'
    },
    sms_info: {
        username: 'grzegorzciupek@gmail.com',
        // password: 'Jejek100b',
        password: 'df8fb3377bde7fabf28b73d03e9eb7b3',
        access_token: 'IBGat7nn92n1LkVwc2URNxicaZ6hLHcMEAm1NFw7'
    },
};

module.exports = function() {
    return config;
};
