/*
combined files : 

page/sale-init

*/
//***  saleControl   js* **/
KISSY.add('page/sale-init',function(S,Tooltip){
	var S = KISSY,DOM = S.DOM, Event = S.Event;	
	return saleControl = {
		    	paginator : null,
		    	page : null,
		    	chart : null,
		    	msg :null,
		    	popup : null,
		    	init : function() {
					 var promptHelp0 = new Tooltip.Tip({
						 trigger : '#J_promptHelp0',
						 alignType : 'top',
						 offset : 10,
						 elCls : 'ui-tip',
						 title : '<div class="ui-tip-text">成交用户从下单到发货的平均跨度</div>'
					 })
					 promptHelp0.render();
					 var promptHelp1 = new Tooltip.Tip({
						 trigger : '#J_promptHelp1',
						 alignType : 'top',
						 offset : 10,
						 elCls : 'ui-tip',
						 title : '<div class="ui-tip-text">成交用户从下单到交易成功的平均跨度</div>'
					 })
					 promptHelp1.render();
		    		Event.on('.J_ListBtn1','click',function(ev){
		    			var val = DOM.attr(ev.currentTarget,'data');
		    			DOM.val('#J_TypeId',val);
		    			DOM.removeClass('.J_ListBtn1','current');
		    			DOM.addClass(ev.currentTarget,'current');
		    			saleControl.getSaleAjax();
		    		})
                    Event.on('.J_ListBtn2','click',function(ev){
                        var val = DOM.attr(ev.currentTarget,'data');
                        DOM.removeClass('.J_ListBtn2','current');
                        DOM.addClass(ev.currentTarget,'current');
                        DOM.val('#J_time',val);
                        saleControl.getSaleAjax();
                    })
					saleControl.getSaleAjax();
		        },
		        getSaleAjax :function() {
                    var submitHandle = function(o) {
                        DOM.html(DOM.get("#J_List"), o.payload.body,true);
                        if(saleControl.chart){
                            saleControl.chart.destroy();
                        }
                        jQuery(function () {
                        	jQuery('#J_Chart1').highcharts({
                                chart: {
                                    type: 'line',
                                    height:300,
                                    spacingLeft:0,
                                    spacingRight:0,
                                    spacingBottom:15,
                                    spacingTop:15
                                },
                                title: {
                                    text: '订购人数走势',
                                    verticalAlign: 'bottom',
                                    y: 35,
                                    float: true
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
                                    categories: o.payload.xdata,
                                    labels: {
                                    	step: o.payload.xkuadu
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
                                series: []
                            });
                        });
                        var pointdata = o.payload.pointdata;
                        saleControl.chart = jQuery('#J_Chart1').highcharts();
	                    S.each(pointdata,function(item,i){
	                    	saleControl.chart.addSeries(item);
	                    })
                    };
                    var errorHandle = function(o){
                        DOM.html(DOM.get("#J_Chart1"), o.desc,true);
                    };
                    DOM.html('#J_Chart1','<div class="loading" style="display:block;"></div>');
                    var startDate = DOM.val('#J_time');
                    var type_id = DOM.val('#J_TypeId');
                    var data = 'type_id='+type_id+'&show_cycle='+startDate;
                    new H.widget.asyncRequest().setURI(getSaleAjaxUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
                }
		}
}, {
    requires: ['bui/tooltip']
});

