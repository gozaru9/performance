//------------------------------------------------------------------------------
// radar chart directive
// chart.jsを使用したレーダーチャートディレクティブ
// http://www.chartjs.org/docs/
//------------------------------------------------------------------------------
var myApp = angular.module('myApp');
myApp.directive('radarChart', function(){
    return {
        restrict:"E",
        replace: true,
        template : '<canvas height="400" width="400"></canvas>',
        scope: {data: '=chartData'},
        link: function(scope, element, attr) {
            
            var datasets = [];
            var fillColor = 220;
            
            for (var i = 0; i < scope.data.data.length; i++)
            {
                var setColor = "rgba("+ String(fillColor - i*20 ) +", 220,220,0.5)";
                
                datasets.push({
                   
                    fillColor : setColor,
                    strokeColor : "rgba(220,220,220,1)",
                    pointColor : "rgba(220,220,220,1)",
                    pointStrokeColor : "#fff",
                    data : scope.data.data[i]
                });
            }
            
            var radarChartData = {
                labels : scope.data.label,
                datasets : datasets
            };
            new Chart(element[0].getContext("2d")).Radar(radarChartData,{scaleShowLabels : true, pointLabelFontSize : 10});
        },
    };
});