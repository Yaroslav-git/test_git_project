$(document).ready(function() {


    $('[data-toggle="tooltip"]').tooltip({html: true});

    var projectProperties = [];

    $('button.savePropertyButton').click(function(){

        $('input:enabled.projectPropertyValue').each(function(){
            var newProperty = {};
            newProperty[$(this).prop('id')] = $(this).val();
            projectProperties.push(newProperty);
        });

        //alert( JSON.stringify(projectProperties) );
        saveProjectProperty( JSON.stringify(projectProperties) );
    });

});



