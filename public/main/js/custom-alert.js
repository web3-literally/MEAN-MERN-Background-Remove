function customAlert(message, state) {
    let isSuccess = state || false;
    let html = "";
    if (isSuccess) {
        html += '<div class="alert alert-success alert-dismissible">\n' +
            '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>\n' +
            '<h4><i class="icon fa fa-check"></i> Success!</h4>' + message + '</div>';
    } else {
        html += '<div class="alert alert-danger alert-dismissible">\n' +
            '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>' +
            '<h4><i class="icon fa fa-ban"></i> Failed!</h4>' + message + '</div>';
    }
    $('.custom-alert').html(html);
    setTimeout(function () {
        $('.custom-alert').html("");
    }, 3000);
}
$('#language_group').on('change', function () {
    location.href = '/lang/' + this.value;
});
function customValid(id, state) {
    let isValid = state || false;
    if (isValid) {
        $('#' + id).addClass('is-valid');
    } else {
        $('#' + id).addClass('is-invalid')
    }
    setTimeout(function () {
        $('#' + id).removeClass('is-invalid').removeClass('is-valid')
    }, 3000);
}
function customMessageNotification(title, content) {
    let html = '<a href="/messages">' +
        '<div class="alert alert-success alert-dismissible fade show">' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span></button>' +
        '<h4 class="alert-heading">' + title + '</h4>' +
        '<p class="mb-0 alert-content">' + content + '</p>' +
        '</div></a>';
    $('.custom-message-notifications').append(html);
}
function customAdminMessageNotification(title, content) {
    let html = '<a href="/">' +
        '<div class="alert alert-danger alert-dismissible fade show">' +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span></button>' +
        '<h4 class="alert-heading">' + title + '</h4>' +
        '<p class="mb-0 alert-content">' + content + '</p>' +
        '</div></a>';
    $('.custom-message-notifications').append(html);
}
