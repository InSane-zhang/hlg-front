/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,Tooltip,Calendar) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return dailyControl = {
	    	Paginator : null,
	    	msg :null,
            chart : null,
            chart2 : null,
	    	init : function() {
	    	    dailyControl.drawSecondChart();
	    	    dailyControl.drawThreeChart();
				Event.on('.J_Type','click',function(ev){
					DOM.val('#J_Type',DOM.attr(ev.currentTarget,'data'));
					DOM.removeClass('.J_Type','current');
					DOM.addClass(ev.currentTarget,'current');
				})
				var currentDate = new Date(Date.parse(DOM.val('#J_startDate').replace(/-/g,"/")));
				var datepicker = new Calendar.DatePicker({
	  	              trigger:'#J_startDate',
	  	              maxDate: new Date().getTime()-(24*60*60*1000),
	  	              elCls: 'J_CalendarDiv',
	  	              showTime:false,
	  	              autoRender : true,
	  	              selectedDate :currentDate
	  	         })
				datepicker.on('selectedchange',function (e) {
					var startDate   = e.value;
						S.one('#J_startDate').val(e.text);
						window.location.href=dateUrl+'&date='+e.text;
    	         })
				 var promptHelp0 = new Tooltip.Tip({
					 trigger : '#J_promptHelp0',
					 alignType : 'top',
					 offset : 10,
					 elCls : 'ui-tip',
					 title : '<div class="ui-tip-text">该功能开启后，每天上午9:00~12:00,<br/>我们会向您所绑定的手机发送前一天的<br/>主要运营数据。</div>'
				 })
				 promptHelp0.render();
				 var promptHelp1 = new Tooltip.Tip({
					 trigger : '#J_promptHelp1',
					 alignType : 'top',
					 offset : 10,
					 elCls : 'ui-tip',
					 title : '<div class="ui-tip-text">店铺当天的成交、流量、转化等指标</div>'
				 })
				 promptHelp1.render();
				 var promptHelp2 = new Tooltip.Tip({
					 trigger : '#J_promptHelp2',
					 alignType : 'top',
					 offset : 10,
					 elCls : 'ui-tip',
					 title : '<div class="ui-tip-text">对店铺当天的宝贝销量、搜索量、转化率等进行分析</div>'
				 })
				 promptHelp2.render();
				 var promptHelp3 = new Tooltip.Tip({
					 trigger : '#J_promptHelp3',
					 alignType : 'top',
					 offset : 10,
					 elCls : 'ui-tip',
					 title : '<div class="ui-tip-text">对买家的购买时间分布和地域属性进行分析</div>'
				 })
				 promptHelp3.render();
				 //昨日数据提示
				 var yestodayTip = new Tooltip.Tips({
    				 tip : {
        				 trigger : '.J_ShowYesTip',
        				 alignType : 'top',
        				 elCls : 'ui-tip',
        				 offset : 0
    				 }
				 });
				 yestodayTip.render();
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
                                 format: '{value}'
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
                            text: '买家成交时间－24小时分布'
                        },
                        colors: [
                            '#8bd167','#4dc1e8','#fb6e52','#ffce55','#656d78','#ac92ed','#ec87c1','#4b89dc','#db4453','#d8ad88','#00d39f','#a2b1c7','#5937ae','#bc3783'
                        ],
                        plotOptions: {
                            series: {
                                stickyTracking: false,
                                marker:{symbol:'circle'}
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
                                 format: '{value}'
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