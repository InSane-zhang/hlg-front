/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,Tooltip,Calendar) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return buyerControl = {
	    	Paginator : null,
	    	msg :null,
            chart : null,
            chart2 : null,
	    	init : function() {
				buyerControl.drawShopChart();
				buyerControl.drawSecondChart();
				buyerControl.drawThreeChart();
	        },
            drawShopChart :function() {
                var titleText = '店铺'+cycleTip+'成交用户数和客单价走势';
                jQuery(function () {
                    jQuery('#J_Chart1').highcharts({
                        chart: {
                            type: 'line',
                            height:430,
                            spacingLeft:20,
                            spacingRight:20,
                            spacingBottom:35,
                            spacingTop:15
                        },
                        title: {
                            text: titleText,
                            verticalAlign: 'bottom',
                            x:0,
                            y:25 
                        },
                        colors: [
                            '#8bd167','#4dc1e8','#fb6e52','#ffce55','#656d78','#ac92ed','#ec87c1','#4b89dc','#db4453','#d8ad88','#00d39f','#a2b1c7','#5937ae','#bc3783'
                        ],
                        plotOptions: {
                            series: {
                                stickyTracking: false,
                                marker:{symbol:'circle',}
                            }
                        },
                        xAxis: {
                            categories: shopChart.xdata,
                            labels: {
                                step: shopChart.xkuadu
                            }
                        },
                        yAxis: [{
                            title : {text:null},
                            // min : 5,
                            minPadding:0,
                            maxPadding:0,
                            lineWidth: 1,
                            gridLineWidth: 1,    
                            labels: {
                                 format: '{value}元',
                            }
                        },{
                            title : {text:null},
                            // min : 5,
                            minPadding:0,
                            maxPadding:0,
                            lineWidth: 1,
                            gridLineWidth: 1,  
                            labels: {
                                format: '{value}人',
                            },
                            opposite: true
                        }],
                        legend: {
                            enabled:true,
                            borderWidth:0
                        },
                        credits: {
                            enabled:false
                        },
                        series: []
                    });
                });
                var pointdata = shopChart.pointdata;
                buyerControl.chart = jQuery('#J_Chart1').highcharts();
                S.each(pointdata,function(item,i){
                    if(i == 1){
                        item.yAxis = 1;
                    }
                    buyerControl.chart.addSeries(item);
                })
            },
            drawSecondChart :function() {
                jQuery(function () {
                    jQuery('#J_Chart2').highcharts({
                        chart: {
                            type: 'pie',
                            height:300,
                            spacingLeft:0,
                            spacingRight:0,
                            spacingBottom:15,
                            spacingTop:15
                        },
                        title: {
                            text: '买家地域分布'
                        },
                        colors: [
                            '#8bd167','#4dc1e8','#fb6e52','#ffce55','#656d78','#ac92ed','#ec87c1','#4b89dc','#db4453','#d8ad88','#00d39f','#a2b1c7','#5937ae','#bc3783'
                        ],
                        plotOptions: {
                            pie: {
                                shadow: false,
                                startAngle: 0,
                                borderWidth: 0,
                                center: [140, 90],
                                point: {
                                    events: {
                                        legendItemClick: function () {
                                            return false;
                                        }
                                    }
                                }
                            }
                        },
                        tooltip: {
                            formatter: function() {
                                if(buyerAreaChart.xdata == "无数据"){
                                    return '无数据';
                                }else{
                                    return '<b>'+ this.point.name +'</b>: '+ this.point.percentage.toFixed(2) +' %，共'+this.point.y+' 人';
                                }
                            }
                        },
                        legend: {
                            layout: 'vertical',
                            backgroundColor: '#FFFFFF',
                            floating: true,
                            align: 'left',
                            borderWidth: 0,
                            verticalAlign: 'top',
                            x: 290,
                            y: 30,
                            labelFormatter: function() {
                                if(buyerAreaChart.xdata == "无数据"){
                                    return '无数据';
                                }else{
                                    return '<div style="margin-bottom:15px;"><span style="font-weight:700;color:#656d78;">'+Highcharts.numberFormat(this.y/buyerAreaChart.total*100,2) +'%</span>    ' + '<span style="color:#abb3be;">'+this.name+'</span></div>';
                                }
                            }
                        },
                        xAxis: {
                            categories: buyerAreaChart.xdata,
                            labels: {
                                step: buyerAreaChart.xkuadu
                            }
                        },
                        yAxis: {
                            title : {text:null},
                            // min : 5,
                            minPadding:0,
                            maxPadding:0,
                            lineWidth: 1,
                            gridLineWidth: 1,    
                            labels: {
                                 format: '{value}',
                            }
                        },
                        credits: {
                            enabled:false
                        },
                        series: [{
                            name: ' ',
                            data: buyerAreaChart.pointdata,
                            size: '100%',
                            innerSize: '40%',
                            showInLegend:true,
                            dataLabels: {
                                enabled: false
                            }
                        }]
                    });
                });
            },
            drawThreeChart :function() {
                jQuery(function () {
                    jQuery('#J_Chart3').highcharts({
                        chart: {
                            type: 'column',
                            height:300,
                            spacingLeft:0,
                            spacingRight:0,
                            spacingBottom:15,
                            spacingTop:15
                        },
                        title: {
                            text: '买家成交时间－24小时分布',
                        },
                        colors: [
                            '#8bd167','#4dc1e8','#fb6e52','#ffce55','#656d78','#ac92ed','#ec87c1','#4b89dc','#db4453','#d8ad88','#00d39f','#a2b1c7','#5937ae','#bc3783'
                        ],
                        plotOptions: {
                            series: {
                                stickyTracking: false,
                                marker:{symbol:'circle',}
                            }
                        },
                        xAxis: {
                            categories: buyTimeChart.xdata,
                            labels: {
                                step: buyTimeChart.xkuadu
                            }
                        },
                        yAxis: {
                            title : {text:null},
                            // min : 5,
                            minPadding:0,
                            maxPadding:0,
                            lineWidth: 1,
                            gridLineWidth: 1,    
                            labels: {
                                 format: '{value}',
                            }
                        },
                        legend: {
                            enabled:true,
                            borderWidth:0
                        },
                        credits: {
                            enabled:false
                        },
                        series: [buyTimeChart.pointdata]
                    })
                })
        }
	
	}
}, {
    requires: ['bui/tooltip','bui/calendar']
});