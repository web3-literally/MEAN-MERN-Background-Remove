$('#profile_form').on('submit', function (evt) {
    evt.preventDefault();
    submitEditProfile();
});
function saveAvatar() {
    let avatarImg = $('#profile_avatar').attr('src');
    if (avatarImg.length < 1000) {
        customAlert(messages[9]);
        return;
    }
    $.ajax({
        url: '/admin/account-settings/change-avatar',
        method: 'post',
        data: {
            avatarImg: avatarImg
        },
        success: function (res) {
            if (res.status === 'success') {
                customAlert(res.message, true);
                $('.user__info .user__img').attr('src', res.avatarPath);
            }
            else customAlert(res.message);
        }
    })
}
function submitEditProfile() {
    let username = $('#profile_user_name').val();
    let email = $('#profile_email').val();
    let old_password = $('#profile_old_password').val();
    let new_password = $('#profile_new_password').val();
    let confirm_password = $('#profile_confirm_password').val();
    if (username === '') {
        customAlert(messages[0]);
        customValid('profile_user_name');
        return;
    }
    if (old_password === '') {
        customAlert(messages[2]);
        customValid('profile_old_password');
        return;
    }
    if (new_password === '') {
        customAlert(messages[3]);
        customValid('profile_new_password');
        return;
    }
    if (confirm_password === '') {
        customAlert(messages[4]);
        customValid('profile_confirm_password');
        return;
    }
    if (new_password !== confirm_password) {
        customAlert(messages[5]);
        customValid('profile_new_password');
        customValid('profile_confirm_password');
        return;
    }
    let avatarImg = $('#profile_avatar').attr('src');
    let url = '/admin/account-settings/edit-profile';
    let data = {
        username: username,
        email: email,
        old_password: old_password,
        new_password: new_password,
        avatarImg: avatarImg
    };
    $.ajax({
        url: url,
        method: 'post',
        data: data,
        success: function (res) {
            if (res.status === 'success') {
                customAlert(res.message, true);
            } else customAlert(res.message);
        }
    })
}
function previewProfileAvatar(evt) {
    let reader = new FileReader();
    reader.onload = function (evt) {
        $('#profile_avatar').attr('src', evt.target.result);
    };
    reader.readAsDataURL(evt.target.files[0]);
}
function validatePhone(phone) {
    let reg = /^\d+$/;
    return reg.test(phone)
}
function sendPhoneVerify(preTel, phoneNumber, codeTextId, verifyBtnId, verifyCodeBtnId) {
    $(verifyBtnId).prop('disabled', true);
    if (!validatePhone(phoneNumber)) {
        customAlert(messages[10]);
        $(verifyBtnId).prop('disabled', false);
        return;
    }
    let url = '/auth/verification-phone';
    $.ajax({
        url: url,
        method: 'post',
        data: {
            dialCode: preTel.dialCode,
            iso2: preTel.iso2,
            phone_number: phoneNumber
        },
        success: function (res) {
            if (res.status === 'success') {
                customAlert(res.message, true);
                $(codeTextId).css('display', 'inline-block');
                $(verifyBtnId).css('display', 'none');
                $(verifyCodeBtnId).css('display', 'inline-block');
            } else {
                customAlert(res.message);
                $(verifyBtnId).prop('disabled', false);
            }
        }
    })
}
function confirmPhoneVerify(phoneNumber, phoneCode, verifyCodeBtnId, reload_flag) {
    $(verifyCodeBtnId).prop('disabled', true);
    if (!validatePhone(phoneNumber)) {
        customAlert(messages[10]);
        $(verifyCodeBtnId).prop('disabled', false);
        return;
    }
    if (phoneCode === '') {
        customAlert(messages[11]);
        $(verifyCodeBtnId).prop('disabled', false);
        return;
    }
    let url = '/auth/verification-phone-code';
    $.ajax({
        url: url,
        method: 'post',
        data: {
            phone_number: phoneNumber,
            phone_code: phoneCode
        },
        success: function (res) {
            if (res.status === 'success') {
                customAlert(res.message, true);
                $(verifyCodeBtnId).prop('disabled', false);
                if (reload_flag) {
                    setTimeout(function () {
                        location.reload();
                    }, 1000);
                } else {
                    $('#phone_group').css('display', 'none');
                    $('#new_phone_group').css('display', 'block');
                    $('#new_profile_phone').css('padding-left', '81px');
                }
            } else {
                customAlert(res.message);
                $(verifyCodeBtnId).prop('disabled', false);
            }
        }
    })
}
function sendOldPhone() {
    let input = document.querySelector('#profile_phone');
    let iti = window.intlTelInputGlobals.getInstance(input);
    let preTel = iti.getSelectedCountryData();
    let phoneNumber = $('#profile_phone').val();
    sendPhoneVerify(preTel, phoneNumber, $('#old_phone_code').parent(), '#send_old_phone_code_btn', '#confirm_old_phone_btn')
}
function confirmOldPhone() {
    let phoneNumber = $('#profile_phone').val();
    let phoneCode = $('#old_phone_code').val();
    confirmPhoneVerify(phoneNumber, phoneCode, '#confirm_old_phone_btn', false);
}
function sendNewPhone() {
    let input = document.querySelector('#new_profile_phone');
    let iti = window.intlTelInputGlobals.getInstance(input);
    let preTel = iti.getSelectedCountryData();
    let phoneNumber = $('#new_profile_phone').val();
    sendPhoneVerify(preTel, phoneNumber, $('#new_phone_code').parent(), '#send_new_phone_code_btn', '#confirm_new_phone_btn')
}
function confirmNewPhone() {
    let phoneNumber = $('#new_profile_phone').val();
    let phoneCode = $('#new_phone_code').val();
    confirmPhoneVerify(phoneNumber, phoneCode, '#confirm_new_phone_btn', true);
}