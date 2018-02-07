
function drawSLCharts( groupType ) {

    var SLvalues = document.querySelectorAll('.SLTable tbody>tr');

    if (groupType === undefined) {
        groupType = 'date';
    }

    var dataSL = new google.visualization.DataTable();
    var dataCalls = new google.visualization.DataTable();


    dataSL.addColumn('string', 'TimeInterval');
    dataSL.addColumn('number', 'SL (Уровень сервиса)');
    dataSL.addColumn('number', 'AR (Доля потерянных)');
    dataCalls.addColumn('string', 'TimeInterval');
    dataCalls.addColumn('number', 'Входящие вызовы');
    dataCalls.addColumn('number', 'Принятые вызовы');
    dataCalls.addColumn('number', 'Потерянные вызовы');

    SLvalues.forEach( function(item) {

        var timeInterval = '';

        switch(groupType) {
            case 'date':
                timeInterval = item.getElementsByClassName('date')[0].innerHTML;
                break;
            case 'hour':
                timeInterval = item.getElementsByClassName('date')[0].innerHTML.substring(8) + '.' + item.getElementsByClassName('date')[0].innerHTML.substring(5,7) + ' ' + item.getElementsByClassName('hour')[0].innerHTML;
                break;
            case 'week':
                timeInterval = item.getElementsByClassName('week')[0].innerHTML;
                break;
            case 'month':
                timeInterval = item.getElementsByClassName('year')[0].innerHTML + ' ' + item.getElementsByClassName('month')[0].innerHTML;
                break;
            case 'year':
                timeInterval = item.getElementsByClassName('year')[0].innerHTML;
                break;
        }

        var SL = +(item.getElementsByClassName('SL')[0].innerHTML.replace(',','.') );
        var lostCalls = +(item.getElementsByClassName('lostCallsAmount')[0].innerHTML);
        var inboundCalls = +(item.getElementsByClassName('inboundCallsAmount')[0].innerHTML);
        var acceptLost = +(item.getElementsByClassName('acceptableLostCallsAmount')[0].innerHTML);
        var answeredCalls = +(item.getElementsByClassName('answeredAmount')[0].innerHTML);


        dataSL.addRow([
            timeInterval,
            SL,
            (lostCalls / (inboundCalls - acceptLost)) * 100
        ]);

        dataCalls.addRow([
            timeInterval,
            inboundCalls,
            answeredCalls,
            lostCalls
        ]);

    });

    var HaxisTitle = '';

    switch(groupType) {
        case 'date':
            HaxisTitle = 'Дата';
            break;
        case 'hour':
            HaxisTitle = 'Час';
            break;
        case 'week':
            HaxisTitle = 'Неделя';
            break;
        case 'month':
            HaxisTitle = 'Месяц';
            break;
        case 'year':
            HaxisTitle = 'Год';
            break;
    }

    var optionsSL = {
        hAxis: {
            title: HaxisTitle,
            gridlines:{count: -1},
        },
        vAxis: {
            title: 'Процент (%)',
            gridlines:{count: 10}
        },
        colors:['#3366cc','#ff9900'],
        width: (500 + SLvalues.length * 25),
        height: 350
    };

    var optionsCalls = {
        hAxis: {
            title: HaxisTitle,
            gridlines:{count: -1},
        },
        vAxis: {
            title: 'Количество вызовов'
        },
        colors:['#990099','#109618','#dc3912'],
        width: (500 + SLvalues.length * 25),
        height: 350
    };

    var formatterSL = new google.visualization.NumberFormat({fractionDigits: 1, suffix: '%'});
    var formatterCalls = new google.visualization.NumberFormat({fractionDigits: 0, suffix: ' шт.'});

    formatterSL.format(dataSL, 1);
    formatterSL.format(dataSL, 2);
    formatterCalls.format(dataCalls, 1);
    formatterCalls.format(dataCalls, 2);
    formatterCalls.format(dataCalls, 3);

    var chartSL = new google.charts.Line(document.getElementById('serviceLevelChart'));
    var chartCalls = new google.charts.Line(document.getElementById('inboundCallsChart'));

    chartSL.draw(dataSL, google.charts.Line.convertOptions(optionsSL));
    chartCalls.draw(dataCalls, google.charts.Line.convertOptions(optionsCalls));
}



function drawResultPieChart(){

    var resultTable = document.querySelectorAll('.ResultsTable tbody>tr');
    var results = {};

    var dataRes = new google.visualization.DataTable();

    dataRes.addColumn('string', 'Result');
    dataRes.addColumn('number', 'Amount');

    resultTable.forEach( function(item) {

        var result = item.getElementsByClassName('result')[0].innerHTML;
        var resAmount = +(item.getElementsByClassName('amount')[0].innerHTML);

        if( results[result] === undefined )
            results[result] = resAmount;
        else results[result] += resAmount;

    });

    for( var res in results ) {
        if (results.hasOwnProperty(res)) {
            dataRes.addRow([res, results[res]]);
        }
    }

    var options = {
        is3D: true,
        sliceVisibilityThreshold: .0001,
        chartArea:{left:0,top:0,width:'100%',height:'100%'},
        width: 700,
        height: 300,
    };

    var resPieChart = new google.visualization.PieChart(document.getElementById('combinedResultsChart'));

    resPieChart.draw(dataRes, options);

}


function drawResultBarChart( groupType ){

    if ( groupType === undefined ) {
        groupType  = 'date';
    }

    var resultTable = document.querySelectorAll('.ResultsTable tbody>tr');


    var groupedResults = {};
    var uniqueResults = [];

    resultTable.forEach( function(item) {

        var groupName = '';

        switch (groupType){
            case 'date':
                var groupName = item.getElementsByClassName('date')[0].innerHTML;
                break;
            case 'operator':
                var groupName = item.getElementsByClassName('operator')[0].innerHTML;
                break;
            case 'date_oper':
                var groupName = item.getElementsByClassName('date')[0].innerHTML.substring(8) + '.' + item.getElementsByClassName('date')[0].innerHTML.substring(5,7) + ' ' + item.getElementsByClassName('operator')[0].innerHTML;
                break;
            case 'product':
                var groupName = item.getElementsByClassName('product')[0].innerHTML;
                break;
            case 'rubric':
                var groupName = item.getElementsByClassName('rubric')[0].innerHTML;
                break;
        }
        var result = item.getElementsByClassName('result')[0].innerHTML;
        var resAmount = +(item.getElementsByClassName('amount')[0].innerHTML);


        //console.log( 'groupName:' + groupName + ' result:' + result + ' resAmount:' + resAmount );
        //console.log( 'groupedResults[groupName] 1 :' + groupedResults[groupName] );

        if( uniqueResults.indexOf(result) < 0 )
            uniqueResults.push(result);

        if( groupedResults[groupName] === undefined ){
            var resultList = {};
            resultList[result] = resAmount;
            groupedResults[groupName] = resultList;
        }
        else {
            var resultList = groupedResults[groupName];

            if( resultList[result] === undefined )
                resultList[result] = resAmount;
            else resultList[result] += resAmount;

            groupedResults[groupName] = resultList;
        }

        //console.log( 'groupedResults[groupName][result] 2 :' + groupedResults[groupName][result] );
    });

    //console.log( 'groupedResults[2017-08-07][Другая компания] 2 :' + groupedResults['2017-08-07']['Другая компания'] );

    var dataRes = new google.visualization.DataTable();
    dataRes.addColumn('string', 'group');

    for(var res in uniqueResults){
        dataRes.addColumn('number', uniqueResults[res]);
    }
    //console.log( 'uniqueResults:' );
    //console.log( uniqueResults );

    for( var group in groupedResults ) {
        //console.log( 'group: ' + group );

        if ( groupedResults.hasOwnProperty(group) ) {
            var groupRow = [];
            groupRow.push(group);

            uniqueResults.forEach( function(res) {

                //console.log( 'res:' + res + ' groupedResults[group][res]:' + groupedResults[group][res] );

                if (groupedResults[group][res] === undefined)
                    groupRow.push(0);
                else
                    groupRow.push(groupedResults[group][res]);
            });
            dataRes.addRow( groupRow );
            //console.log( groupRow );
        }

    }

    var options = {
        isStacked: true,
        //isStacked: 'percent',
        //legend: {position: 'top', maxLines: 3},
        hAxis: {format: 'decimal'},
        chartArea:{left:30,top:10,width:'80%',height:'90%'},
        width: 1200,
        height: 400,
    };

    var resBarChart = new google.visualization.ColumnChart(document.getElementById('groupedResultsChart'));
    resBarChart.draw(dataRes, options);

/*
    var data = new google.visualization.DataTable();

    data.addColumn('number', 'Year');
    data.addColumn('number', 'Fantasy & Sci Fi');
    data.addColumn('number', 'Romance');
    data.addColumn('number', 'Mystery/Crime');
    data.addColumn('number', 'General');

    data.addRow( [2010, 10, 24, 20, 32] );
    data.addRow( [2020, 16, 22, 23, 30] );
    data.addRow( [2030, 28, 19, 29, 30] );

    var options = {
        isStacked: true,
        height: 350,
        width: 500,
        hAxis: {format: 'decimal'},
        chartArea:{left:35,top:10,width:'70%',height:'90%'},
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('groupedResultsChart'));
    chart.draw(data, options);
    */
}