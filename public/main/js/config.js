function changeTheme(index) {
    $.ajax({
        url: '/admin/change-theme',
        method: 'post',
        data: {
            theme_index: index
        },
        success: function (res) {
            if (res.status === 'success') {
                customAlert(res.message, true);
            }
            else customAlert(res.message);
        }
    })
}
