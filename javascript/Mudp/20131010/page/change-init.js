/*
combined files : 

page/change-init

*/
/**
 * @fileOverview 
 * @author  
 */
KISSY.add('page/change-init',function (S,Tooltip) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return changeControl = {
	    	Paginator : null,
	    	msg :null,
	    	chart :null,
	    	chart2 :null,
	    	chart3 :null,
	    	init : function() {
			
				changeControl.loadAllAjax();
				Event.on('.J_Type','click',function(ev){
					DOM.val('#J_Type',DOM.attr(ev.currentTarget,'data'));
					DOM.removeClass('.J_Type','current');
					DOM.addClass(ev.currentTarget,'current');
					changeControl.getChangeListAjax();
				})
				Event.on('.J_Type2','click',function(ev){
					DOM.val('#J_Type2',DOM.attr(ev.currentTarget,'data'));
					DOM.removeClass('.J_Type2','current');
					DOM.addClass(ev.currentTarget,'current');
					changeControl.getSuccessListAjax();
				})
				Event.on('.J_Type3','click',function(ev){
					DOM.val('#J_Type3',DOM.attr(ev.currentTarget,'data'));
					DOM.removeClass('.J_Type3','current');
					DOM.addClass(ev.currentTarget,'current');
					changeControl.getAskListAjax();
				})
				
				 var promptHelp0 = new Tooltip.Tip({
					 trigger : '#J_promptHelp0',
					 alignType : 'top',
					 offset : 10,
					 elCls : 'ui-tip',
					 title : '<div class="ui-tip-text">成交转化率=成交人数累加/UV累加</div>'
				 })
				 promptHelp0.render();
				 var promptHelp1 = new Tooltip.Tip({
					 trigger : '#J_promptHelp1',
					 alignType : 'top',
					 offset : 10,
					 elCls : 'ui-tip',
					 title : '<div class="ui-tip-text">静默转化率=未咨询的客户成交人数累加/UV累加</div>'
				 })
				 promptHelp1.render();
				 var promptHelp2 = new Tooltip.Tip({
					 trigger : '#J_promptHelp2',
					 alignType : 'top',
					 offset : 10,
					 elCls : 'ui-tip',
					 title : '<div class="ui-tip-text">询盘转化率=询盘总人数/访客数</div>'
				 })
				 promptHelp2.render();
				 var promptHelp3 = new Tooltip.Tip({
					 trigger : '#J_promptHelp3',
					 alignType : 'top',
					 offset : 10,
					 elCls : 'ui-tip',
					 title : '<div class="ui-tip-text">询盘成交转化率=当日有咨询客服的客户成交人数累加/咨询客服的用户人数累加</div>'
				 })
				 promptHelp3.render();
					
	        },
	        loadAllAjax: function(){
	        	changeControl.getAskListAjax();
				changeControl.getChangeListAjax();
				changeControl.getSuccessListAjax();
	        },
	        getChangeListAjax : function() {
	            var submitHandle = function(o) {
	            	if(changeControl.chart){
                        changeControl.chart.destroy();
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
                    changeControl.chart = jQuery('#J_Chart1').highcharts();
                    S.each(pointdata,function(item,i){
                    	changeControl.chart.addSeries(item);
                    })
	    	    };
                var errorHandle = function(o){
                    DOM.html(DOM.get("#J_Chart1"), o.desc,true);
                };
                DOM.html('#J_Chart1','<div class="loading" style="display:block;"></div>');
                var show_cycle = DOM.val('#J_Type');
	        	var data = 'show_cycle='+show_cycle;
	 			DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
	    	    new H.widget.asyncRequest().setURI(getChangeListAjaxUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			getSuccessListAjax: function() {
	        	var submitHandle = function(o) {
	        		if(changeControl.chart2){
	        			changeControl.chart2.destroy();
	        		}
	        		jQuery(function () {
	        			jQuery('#J_Chart2').highcharts({
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
	        		changeControl.chart2 = jQuery('#J_Chart2').highcharts();
	        		S.each(pointdata,function(item,i){
	        			changeControl.chart2.addSeries(item);
	        		})
	        	};
	        	var errorHandle = function(o){
	        		DOM.html(DOM.get("#J_Chart2"), o.desc,true);
	        	};
                var show_cycle = DOM.val('#J_Type2');
	        	var data = 'show_cycle='+show_cycle;
	        	DOM.show('#J_LeftLoading');
	        	DOM.hide('#J_MainLeftContent');
	        	new H.widget.asyncRequest().setURI(getSuccessListAjaxUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
	        },
	        getAskListAjax : function() {
				var submitHandle = function(o) {
					if(changeControl.chart3){
						changeControl.chart3.destroy();
					}
					jQuery(function () {
						jQuery('#J_Chart3').highcharts({
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
					changeControl.chart3 = jQuery('#J_Chart3').highcharts();
					S.each(pointdata,function(item,i){
						changeControl.chart3.addSeries(item);
					})
				};
				var errorHandle = function(o){
					DOM.html(DOM.get("#J_Chart3"), o.desc,true);
				};
                var show_cycle = DOM.val('#J_Type3');
	        	var data = 'show_cycle='+show_cycle;
				DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
				new H.widget.asyncRequest().setURI(getAskListAjaxUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			}
	
	}
}, {
    requires: ['bui/tooltip']
});
