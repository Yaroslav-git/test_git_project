/**
 * Created by kuvyatkin on 11.08.2017.
 */
function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(document).ready(function(){

    var currentUrl = window.location.href;
    var currentResource = getParameterByName('resource', currentUrl);

    if(currentResource != null)
    $(".navbar-collapse .navbar-nav  > li").each(function(){
        if ( ( $(this).find("a[href*='resource="+currentResource+"']") ).length > 0 )
            $(this).addClass('active');
    });
});