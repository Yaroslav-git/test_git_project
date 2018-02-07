/**
 * Created by kuvyatkin on 14.08.2017.
 */



$(document).ready(function() {

    processChangeViewClick( $('#tableViewBtn') );

    updateTimePeriod();

    $("#projectSelector").change( function(){

        processProjectChange( $(this).find(':selected').data('projectType') );
        updateTimePeriod();
    });

    $("#timePeriodStart, #timePeriodEnd").change(function(){
        checkTimePeriod();
    });

    $("table.dataTables").DataTable({
        "paging":   false,
        "searching": false,
        "info":     false
    });

/*
    if( $('.ResultsTable tbody>tr').length > 0 ){
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback( drawResultPieChart );

        if( $('#resultSummaryType').val() != 'result' ){
            google.charts.load('visualization', '1', {packages: ['corechart', 'bar']});
            google.charts.setOnLoadCallback( function(){ drawResultBarChart( $('#resultSummaryType').val() ) } );
        }

    }

    switch( $(this).find(':selected').data('projectType') ){
        case 'Naumen_incoming':
            google.charts.load('current', {packages: ['corechart', 'line']});
            google.charts.setOnLoadCallback( function() { drawSLCharts( $('#serviceLevelSummaryType').val() );} );
            break;
    }
*/

    $(".viewToggleBtn").click(function(){

        processChangeViewClick( $(this) );

    });

});

