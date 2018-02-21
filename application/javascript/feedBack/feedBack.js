$(document).ready(function(){

    $('.contactData .phone').mask('+7(000)000-00-00', {placeholder: "+7(___)___-__-__"});

    $('.contactData .email').keyup(function(){
        visualizeFieldState( 'input-group', $(this), ( validateEmail( $(this).val() ) ? 'success' : 'error' ) );
    });

    $('.contactData .phone').keyup(function(){
        visualizeFieldState( 'input-group', $(this), ( $(this).val().length == 16  ? 'success' : 'error' ) );
    });

    $('.contactData .name, .contactData .other').keyup(function(){
        visualizeFieldState( 'input-group', $(this), ( $(this).val().length >= 3  ? 'success' : 'error' ) );
    });

    $('.appealTextContent').keyup(function(){
        visualizeFieldState( 'panel', $(this), ( $(this).val().length >= 3  ? 'success' : 'error' ) );
    });

    $('.appealCategory').change(function () {
        visualizeFieldState( 'input-group', $(this), ( $(this).val() == ''  ? 'error' : 'success' ) );
    });

    $('#sendAppealBtn').click( function() {
        visualizeFieldState( 'input-group', $('.appealCategory'), ( $('.appealCategory').val() == ''  ? 'error' : 'success' ) );
        visualizeFieldState( 'panel', $('.appealTextContent'), ( $('.appealTextContent').val().length >= 3  ? 'success' : 'error' ) );
    });
});


function validateEmail( email ) {
    if( email != '' ) {
        var pattern = new RegExp("^(([^<>()\\[\\]\\\\.,;:\\s@\"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@\"]+)*)|(\".+\"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$");

        if(pattern.test( email ))
            return true;
    }

    return false;
}



function visualizeFieldState( elementType, field, state ){

    var container;

    switch (elementType){
        case 'input-group':
            container = field.closest('.input-group');
            break;
        case 'panel':
            container = field.closest('.panel');
            break;
        default:
            return;
    }

    container.removeClass('has-error has-success panel-primary panel-danger');

    switch (state){
        case 'success':
            container.addClass('has-success panel-primary');
            break;
        case 'error':
            container.addClass('has-error panel-danger');
            break;
        default:
            return;
    }

}