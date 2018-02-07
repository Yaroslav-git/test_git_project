/**
 * Created by kuvyatkin on 24.08.2017.
 */


$.datetimepicker.setLocale('ru');

$( function() {

    $( "input.datetimepicker").datetimepicker({

        dayOfWeekStart : 1,
        lang:'ru',
        format:'Y-m-d H:i'

    });


    $( ".fieldFiltersRow input.date, input.datepicker").datetimepicker({
        timepicker:false,
        dayOfWeekStart : 1,
        lang:'ru',
        format:'Y-m-d'
    });

    $( ".fieldFiltersRow input.time").datetimepicker({
        datepicker:false,
        dayOfWeekStart : 1,
        lang:'ru',
        format:'H:i'
    });

    $.unblockUI();

    $("#refreshReportBtn").click(function () {

        $.blockUI({
            css: {
                border: 'none',
                padding: '15px',
                backgroundColor: '#000',
                '-webkit-border-radius': '10px',
                '-moz-border-radius': '10px',
                opacity: .5,
                color: '#fff'
            },
            message: '<h3>Пожалуйста, подождите<br><br>Ваш запрос выполняется</h3>'
        });

    });

    $("#projectFilterBtn").click(function(){

        $("#projectFilter").toggleClass("hidden");
        $("#projectFilterBtn").removeClass("btn-default");
        $("#projectFilterBtn").addClass("btn-info");
        $("#projectFilterInput").focus();

    });

    $("#projectFilterInput").keyup(function() {
        filterProjectList($(this).val().toLowerCase());
    });

    $("#clearProjectFilterBtn").click(function(){
        $("#projectFilterInput").val('');
        $("#projectFilterBtn").addClass("btn-default");
        $("#projectFilterBtn").removeClass("btn-info");
        $("#projectFilter").toggleClass("hidden");
        filterProjectList('');

    });




    $("#testBtn").click(function(){

        var isParentSpan =  $("#testOption1").parent().is( 'span' );
        console.log( 'is parent span: ' + isParentSpan );
        if( !isParentSpan )
            $("#testOption1").wrap('<span>');
        else
            $("#testOption1").unwrap('span');

    });

});

function filterProjectList( searchVal ){

    if ( navigator.appName == 'Microsoft Internet Explorer' ) {

        $("#projectSelector option").each(function() {

            if( $(this).html() === '' && jQuery.type($(this).data('hiddenName')) === "undefined" )
                return;

                if (searchVal == '' && $(this).html() === '') {
                    $(this).html($(this).data('hiddenName'));
                }
                else {
                    if ($(this).html() !== '') {
                        if ($(this).html().toLowerCase().indexOf(searchVal) < 0) {
                            $(this).data('hiddenName', $(this).html());
                            $(this).html('');
                        }
                    }
                    else {
                        if ($(this).data('hiddenName').toLowerCase().indexOf(searchVal) >= 0)
                            $(this).html($(this).data('hiddenName'));
                    }
                }
        });
    }
    else{

        $("#projectSelector option").each(function() {

            if( $(this).html() === '' )
                return;

            if( searchVal == '' ) {
                $(this).show();
            }
            else {
                if ( $(this).html().toLowerCase().indexOf(searchVal) < 0 )
                        $(this).hide();
                else
                    $(this).show();
            }

        });
    }
}

// Проверка временного периода (вызывается на странице со сводной статистикой)
function checkTimePeriod(){

    var startTime   = new Date( $("#timePeriodStart").val() );
    var endTime     = new Date( $("#timePeriodEnd").val() );
    var ms_per_day  = 1000 * 60 * 60 * 24;
    var period      = (endTime - startTime) / ms_per_day;

    if ( isNaN(period) )
        return;

    /* детализация по дням и часам недоступна при периоде от года */
    if ( period > 365 ) {
        $("#splittingPeriod").find("option[value='hour'], option[value='date']").attr("disabled", true);
        $("#splittingPeriod").find("option[value='hour'], option[value='date']").prop("selected", false);
    }
    /* детализация по часам недоступна при периоде от месяца */
    else if ( period <= 365 && period > 31 ) {
        $("#splittingPeriod").find("option[value='date']").attr("disabled", false);
        $("#splittingPeriod").find("option[value='hour']").attr("disabled", true);
        $("#splittingPeriod").find("option[value='hour']").prop("selected", false);
    }
    else if ( period <= 31 ) {
        $("#splittingPeriod").find("option[value='hour'], option[value='date']").attr("disabled", false);
    }
}

// Обновление значения фильтров временного периода (вызывается при изменении значения select'а с проектами)

function updateTimePeriod() {

    var currentResource = getParameterByName('resource', window.location.href);

    /*
        Начало периода.
        Если у фильтра не задано значение
        и для проекта задан дефолтный период построения статистики
        и это не страница детализации,
        то присвоить фильтру начало дефолтного периода построения статистики.
     */
    if ( $("#timePeriodStart").val() == ""  &&  $("#projectSelector").find(":selected").data("statisticsStartTime") != "" && currentResource != "DetailReport") 
        $("#timePeriodStart").val($("#projectSelector").find(":selected").data("statisticsStartTime"));

    /*
         Начало периода.
         Если у фильтра не задано значение и выбран проект,
         то присвоить фильтру начало текущего месяца.
     */
    if ( $("#timePeriodStart").val() == "" &&  $("#projectSelector").val() != '' )
    {
        var today = new Date();
        var monthStartDate = today.getFullYear() + '-' + ('0' + ( today.getMonth() + 1 ) ).slice(-2) + '-01 00:00';

        $("#timePeriodStart").val(monthStartDate);
    }

    /*
     Конец периода.
     Если у фильтра не задано значение и выбран проект,
     то присвоить фильтру завтрашнюю дату.
     */
    if ( $("#timePeriodEnd").val() == '' &&  $("#timePeriodStart").val() != '' )
    {
        var today = new Date();
        var tomorrow = new Date( today.setDate( today.getDate() + 1 ));
        var tomorrow_trim = tomorrow.getFullYear() + '-'
            + ('0' + ( tomorrow.getMonth() + 1 ) ).slice(-2) + '-'
            + ('0' + tomorrow.getDate() ).slice(-2) + ' '
            + '00:00';

        $("#timePeriodEnd").val(tomorrow_trim);
    }

}
// Изменение состава фильтров в зависимости от выбранного проекта
function processProjectChange( projectType ){

    switch ( projectType ) {
        case "Infra_legal":{
            $("#resultSummaryType").find("option[value='rubric']").attr("disabled", false);
            $(".serviceLevelSummaryTypeFilter").hide();
            $(".resultSummaryTypeFilter").show();
            $(".workTimeSummaryTypeFilter").show();
            $(".resTypeFilter").show();
            break;
        }
        case "Infra_natural":{
            $("#resultSummaryType").find("option[value='rubric']").attr("disabled", true);
            $("#resultSummaryType").find("option[value='rubric']").prop("selected", false);
            $(".serviceLevelSummaryTypeFilter").hide();
            $(".resultSummaryTypeFilter").show();
            $(".workTimeSummaryTypeFilter").show();
            $(".resTypeFilter").show();
            break;
        }
        case "Naumen_incoming":
        case "Naumen_outcoming":{
            $(".serviceLevelSummaryTypeFilter").show();
            $(".resultSummaryTypeFilter").show();
            $(".workTimeSummaryTypeFilter").hide();
            $(".resTypeFilter").hide();
            break;
        }
        default:{
            $(".splittingPeriodFilter").show();
            $(".resultSummaryTypeFilter").show();
            $(".workTimeSummaryTypeFilter").hide();
            $(".resTypeFilter").hide();
        }
    }

    $('#selectedProjectType').val( projectType );

}


function processChangeViewClick( button ){

    $(button).addClass("active");

    if( $(button).attr("id") == "chartViewBtn" ) {
        $(".chartsRow").show();
        $(".summaryStatisticsContent").hide();
        $("#tableViewBtn").removeClass("active");
    }

    if( $(button).attr("id") == "tableViewBtn" ) {
        $(".chartsRow").hide();
        $(".summaryStatisticsContent").show();
        $("#chartViewBtn").removeClass("active");
    }
}