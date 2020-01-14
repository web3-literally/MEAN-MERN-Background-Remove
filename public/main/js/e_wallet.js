$('#withdraw_button').on('click', function () {
    let available_amount = $('#available_amount').text();
    $('#modal_available_amount').text(available_amount);
    $('#modal_withdraw_amount').val('');
    $('#modal_withdraw_type').val($('#modal_withdraw_type option:first').val());
    $('#modal_withdraw_address').val(payment_addresses.BANK_address);
    $('#modal_withdraw').modal();
});
$('#modal_withdraw_type').on('change', function () {
    let withdraw_type = $(this).val();
    let withdraw_address = payment_addresses.BANK_address;
    switch (withdraw_type) {
        case "BTC":
            withdraw_address = payment_addresses.BTC_address;
            break;
        case "ETH":
            withdraw_address = payment_addresses.ETH_address;
            break;
        case "GECA":
            withdraw_address = payment_addresses.GECA_address;
            break;
        case "CCC":
            withdraw_address = payment_addresses.CCC_address;
            break;
        default:
            break;
    }
    $('#modal_withdraw_address').val(withdraw_address);
});
function submit_withdraw_order() {
    let available_amount = $('#available_amount').text().replace('$', '');
    let withdraw_amount = $('#modal_withdraw_amount').val().replace(/,/g, '');
    if (withdraw_amount === '') {
        customAlert(messages[0]);
        return;
    }
    if (parseInt(available_amount) < parseInt(withdraw_amount)) {
        customAlert(messages[2]);
        return;
    }
    let withdraw_type = $('#modal_withdraw_type').val();
    let withdraw_address = $('#modal_withdraw_address').val();
    if (withdraw_address === '') {
        customAlert(messages[1]);
        return;
    }
    $('#modal_submit_withdraw_button').prop('disabled', true);
    let url = '/post-withdraw-order';
    let data = {
        withdraw_amount: withdraw_amount,
        withdraw_type: withdraw_type,
        withdraw_address: withdraw_address
    };
    $.ajax({
        url: url,
        method: 'post',
        data: data,
        success: function (res) {
            if (res.status === 'success') {
                customAlert(res.message, true);
                setTimeout(function () {
                    location.reload()
                }, 2000)
            } else customAlert(res.message);
            $('#modal_submit_withdraw_button').prop('disabled', false);
        }
    })
}


