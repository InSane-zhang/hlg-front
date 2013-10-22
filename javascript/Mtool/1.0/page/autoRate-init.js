KISSY.add(function(S,showPages,Overlay,Calendar,beautifyForm,Tooltip){
	var S = KISSY,DOM = S.DOM, Event = S.Event;	
	return autoRateControl = {
			panel : null,
		   	msg : null,
		    chart : null,
		    msgTip : null,
		    msgTip2 : null,
		   	init : function() {
				autoRateControl.Form = new beautifyForm();
				autoRateControl.ReportDataAjax();
		        var starttime = new Calendar.DatePicker({
		            trigger:'.timing',
		            autoRender : true
		        });	
		        if(!autoRateControl.msgTip){
		        	autoRateControl.msgTip = new Tooltip.Tip({
		        		trigger : '#J_MsgNotice',
		        		alignType : 'top', 
		        		offset : 10,
		        		elCls : 'ui-tip',
		        		title : '由于淘宝规则限制，必须双方都评价才<br/>能看到对方评价!'      
		        	})
		        	autoRateControl.msgTip.render();	
		        }
		        if(!autoRateControl.msgTip2){
		        	autoRateControl.msgTip2 = new Tooltip.Tip({
		        		trigger : '#J_Msg',
		        		alignType : 'top', 
		        		offset : 10,
		        		elCls : 'ui-tip',
		        		title : '抢评针对双方都没有评价的情况，强烈<br/>建议开启。'      
		        	})
		        	autoRateControl.msgTip2.render();	
		        }		        
		        
		        Event.on(".J_Save", "click", autoRateControl.save); 
		        Event.on(".J_Time", "click", function(){
		        	autoRateControl.ReportDataAjax();
		        }); 
		        Event.on(".J_Day", "click",function(ev){
		        	var id = DOM.attr(ev.currentTarget,'data-id');
		        	DOM.removeClass('.J_Day','current');
		        	DOM.addClass(ev.currentTarget,'current');
		        	var date = DOM.val('#J_Data_'+id);
		        	autoRateControl.ReportDataAjax(date);
		        });
		        
		        
			},
			save : function(){
	        	var submitHandle = function(o) {
					new H.widget.msgBox({ 
			 			type: "sucess", 
			 			content: "保存成功",
						dialogType:"msg", 
						autoClose:true, 
						timeOut:3000
					});
	        	};
        	    var errorHandle = function(o){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
        	    	return;
        	    };
				var checkBox = DOM.query('.J_CheckBox');
        		if(checkBox[0].checked == true  && checkBox[1].checked == true){
        			var buyer_rated_only  = [2,3];
        		}else if(checkBox[0].checked == true  && checkBox[1].checked == false){
        			var buyer_rated_only  = 2;
        		}else if(checkBox[0].checked == false  && checkBox[1].checked == true){
        			var buyer_rated_only  = 3;
        		}else if(checkBox[0].checked == false  && checkBox[1].checked == false){
        			var buyer_rated_only  = '';
        		}        	    
        	    var content = DOM.val('#J_ContentBox');
				var data = "content="+content+"&buyer_rated_only="+buyer_rated_only;
	        	new H.widget.asyncRequest().setURI(saveRateTbItemsUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();				
			},
			ReportDataAjax :function(date) {
                var submitHandle = function(o) {
                    if(autoRateControl.chart){
                    	autoRateControl.chart.destroy();
                    }
                    jQuery(function () {
                            // Create the chart
                            chart = new Highcharts.Chart({
                                chart: {
                                    renderTo: 'demo',
                                    width:500,
                                    type: 'pie',
                                    spacingLeft:15,
                                    spacingRight:0,
                                    spacingBottom:30,
                                    spacingTop:15
                                },
                                title: {
                                    text: ' ',
                                    float: true
                                },
                                colors: [
                                    '#8bd167',
                                    '#4dc1e8',
                                    '#4b89dc',
                                    '#656d78',    
                                    '#d8ad88'
                                ],
                                yAxis: {
                                    title: {
                                        text: ' '
                                    },
                                    labels: {
                                        format: '{value}'
                                    }
                                },
                                plotOptions: {
                                    pie: {
                                        shadow: false,
                                        startAngle: 0,
                                        borderWidth: 0,
                                        center: [100, 60],
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
                                        
                                        return '<b>'+ this.point.name +'</b>: '+ this.point.percentage.toFixed(2) +' %';
                                    }
                                    //pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                                },
                                legend: {
                                    layout: 'vertical',
                                    backgroundColor: '#FFFFFF',
                                    floating: true,
                                    align: 'left',
                                    borderWidth: 0,
                                    verticalAlign: 'top',
                                    x: 220,
                                    y: 30,
                                    labelFormatter: function() {
                                        return '<div style="margin-bottom:15px;"><span style="font-weight:700;color:#656d78;">'+Highcharts.numberFormat(this.y/o.payload.total*100,2) +'%</span>  ' + '<span style="color:#abb3be;">'+this.name+'</span></div>';
                                    }
                                },
                                credits: {
                                    enabled:false
                                },
                                series: [{
                                    name: ' ',
                                    data: o.payload.items,
                                    size: '60%',
                                    innerSize: '40%',
                                    showInLegend:true,
                                    dataLabels: {
                                        enabled: false
                                    }
                                }]
                            });
                        });
                };
                var errorHandle = function(o){
                    //DOM.html(DOM.get("#J_Chart1"), o.desc,true);
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
        	    	return;
                };
                var start_time = DOM.val('#J_StarTime');
                var end_time = DOM.val('#J_EndTime');
                if(date == '' || date == undefined){
                	var data = "start_time="+start_time+"&end_time="+end_time;
                }else{
                	var data = "start_time="+date;
                }
                new H.widget.asyncRequest().setURI(getReportDataActionUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
            }                  			
						
    	};
},{
	requires : ['utils/showPages/index','bui/overlay','bui/calendar','utils/beautifyForm/index','bui/tooltip']
});