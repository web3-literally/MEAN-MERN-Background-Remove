let en_regex = /^[A-Za-z0-9]*$/;

$('#login_form').on('submit', function (evt) {
    evt.preventDefault();
    loginPost();
});
function loginPost() {
    let login_email = $('input[name="login_email"]').val();
    let login_password = $('input[name="login_password"]').val();
    $('#submit_login').prop('disabled', true);
    if (login_email === '') {
        customAlert(messages[0]);
        $('#submit_login').prop('disabled', false);
        return;
    }
    if (login_email.indexOf('@') <= 0) {
        customAlert(messages[1]);
        $('#submit_login').prop('disabled', false);
        return;
    }
    if (login_password === '') {
        customAlert(messages[2]);
        $('#submit_login').prop('disabled', false);
        return;
    }
    let login_url = '/auth/login';
    let data = $('#login_form').serialize();
    $.ajax({
        url: login_url,
        method: 'post',
        data: data,
        success: function (res) {
            if (res.status === 'success') {
                customAlert(res.message, true);
                setTimeout(function () {
                    location.reload();
                }, 1500);
            } else if (res.status === 'factor') {
                customAlert(res.message, true);
                $('#factor2_input').css('display', 'block');
            }
            else if (res.status === 'phone_verification') {
                customAlert(res.message, true);
                setTimeout(function () {
                    $('#submit_login').prop('disabled', false);
                    location.href = '/auth/verification-phone';
                }, 1500);
            } else customAlert(res.message);
            $('#submit_login').prop('disabled', false);
        }
    })
}
function registerPost() {
    let register_f_name = $('#register_f_name').val();
    let register_email = $('#register_email').val();
    let register_password = $('#register_password').val();
    let register_confirm_password = $('#register_confirm_password').val();
    $('#submit_register').prop('disabled', true);
    if (register_f_name === '') {
        customAlert(messages[0]);
        $('#submit_register').prop('disabled', false);
        return;
    }
    if (register_email === '') {
        customAlert(messages[2]);
        $('#submit_register').prop('disabled', false);
        return;
    }
    if (register_email.indexOf('@') <= 0) {
        customAlert(messages[3]);
        $('#submit_register').prop('disabled', false);
        return;
    }
    if (register_password === '') {
        customAlert(messages[4]);
        $('#submit_register').prop('disabled', false);
        return;
    }
    if (register_confirm_password === '') {
        customAlert(messages[5]);
        $('#submit_register').prop('disabled', false);
        return;
    }
    if (register_password !== register_confirm_password) {
        customAlert(messages[6]);
        $('#submit_register').prop('disabled', false);
        return;
    }
    let register_url = '/auth/register';
    let data = {
        register_f_name: register_f_name,
        register_email: register_email,
        register_password: register_password
    };
    $.ajax({
        url: register_url,
        method: 'post',
        data: data,
        success: function (res) {
            if (res.status === 'success') {
                customAlert(res.message, true);
                $('#submit_register').prop('disabled', false);
                location.href = '/auth/login';
            } else {
                customAlert(res.message);
                $('#submit_register').prop('disabled', false);
            }
        }
    })
}
function validatePhone(phone) {
    var reg = /^\d+$/;
    return reg.test(phone)
}
function submitPhoneVerify() {
    let phone_number = $('#phone_number').val();
    let preTel = iti.getSelectedCountryData();
    $('#submit_phone_verify').prop('disabled', true);
    if (!validatePhone(phone_number)) {
        customAlert(messages[0]);
        $('#submit_phone_verify').prop('disabled', false);
        return;
    }
    let url = '/auth/verification-phone';
    $.ajax({
        url: url,
        method: 'post',
        data: {
            dialCode: preTel.dialCode,
            iso2: preTel.iso2,
            phone_number: phone_number
        },
        success: function (res) {
            if (res.status === 'success') {
                customAlert(res.message, true);
                $('#phone_verify_code').css('display', 'inline-block');
                $('#submit_phone_verify').css('display', 'none');
                $('#submit_phone_verify_code').css('display', 'inline-block');
            } else {
                customAlert(res.message);
                $('#submit_phone_verify').prop('disabled', false);
            }
        }
    })
}
function submitPhoneVerifyCode() {
    let phone_number = $('#phone_number').val();
    let phone_code = $('#phone_verify_code').val();
    $('#submit_phone_verify_code').prop('disabled', true);
    if (!validatePhone(phone_number)) {
        customAlert(messages[0]);
        $('#submit_phone_verify_code').prop('disabled', false);
        return;
    }
    if (phone_code === '') {
        customAlert(messages[1]);
        $('#submit_phone_verify_code').prop('disabled', false);
        return;
    }
    let url = '/auth/verification-phone-code';
    $.ajax({
        url: url,
        method: 'post',
        data: {
            phone_number: phone_number,
            phone_code: phone_code
        },
        success: function (res) {
            if (res.status === 'success') {
                customAlert(res.message, true);
                setTimeout(function () {
                    $('#submit_phone_verify_code').prop('disabled', false);
                    location.href = '/';
                }, 1500);
            } else {
                customAlert(res.message);
                $('#submit_phone_verify_code').prop('disabled', false);
            }
        }
    })
}
function resendEmailVerification() {
    let verify_email = $('#verify_email').val();
    $('#submit_resend_email').prop('disabled', true);
    if (verify_email === '') {
        customAlert(messages[0]);
        $('#submit_resend_email').prop('disabled', false);
        return;
    }
    if (verify_email.indexOf('@') <= 0) {
        customAlert(messages[1]);
        $('#submit_resend_email').prop('disabled', false);
        return;
    }
    $.ajax({
        url: '/auth/verification-email',
        method: 'post',
        data: {
            verify_email: verify_email
        },
        success: function (res) {
            if (res.status === 'success') customAlert(res.message, true);
            else customAlert(res.message)
            $('#submit_resend_email').prop('disabled', false);
        }
    })
}
function forgotPassword() {
    let forgot_email = $('#forgot_email').val();
    $('#submit_forgot').prop('disabled', true);
    if (forgot_email === '') {
        customAlert(messages[0]);
        $('#submit_forgot').prop('disabled', false);
        return;
    }
    if (forgot_email.indexOf('@') <= 0) {
        customAlert(messages[1]);
        $('#submit_forgot').prop('disabled', false);
        return;
    }
    $.ajax({
        url: '/auth/forgot-password',
        method: 'post',
        data: {
            forgot_email: forgot_email
        },
        success: function (res) {
            if (res.status === 'success') customAlert(res.message, true);
            else customAlert(res.message);
            $('#submit_forgot').prop('disabled', false);
        }
    })
}
function submitResetPassword() {
    let new_password = $('#new_password').val();
    let confirm_new_password = $('#confirm_new_password').val();
    $('#submit_reset_password').prop('disabled', true);
    if (new_password === '') {
        customAlert(messages[0]);
        $('#submit_reset_password').prop('disabled', false);
        return;
    }
    if (confirm_new_password === '') {
        customAlert(messages[1]);
        $('#submit_reset_password').prop('disabled', false);
        return;
    }
    if (new_password !== confirm_new_password) {
        customAlert(messages[2]);
        $('#submit_reset_password').prop('disabled', false);
        return;
    }
    $.ajax({
        url: '/auth/reset-password',
        method: 'post',
        data: {
            new_password: new_password
        },
        success: function (res) {
            if (res.status === 'success') {
                customAlert(res.message, true);
                setTimeout(function () {
                    location.href = '/auth/login'
                }, 1500);
            } else customAlert(res.message);
            $('#submit_reset_password').prop('disabled', false);
        }
    })
}
