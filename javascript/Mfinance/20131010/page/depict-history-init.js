/*
combined files : 

page/depict-history-init

*/
/**
 * @fileOverview 
 * @author  
 */
KISSY.add('page/depict-history-init',function (S,Select) {
	var DOM = S.DOM, Event = S.Event;		
	return historyControl = {
				msg : null,
				chart : null,
				init : function(){
					var myDate = new Date();	
					var nowYear=myDate.getFullYear();
					DOM.html('.J_year0',nowYear);
					DOM.html('.J_year1',nowYear-1);
					DOM.html('.J_year2',nowYear-2);
					DOM.html('.J_year3',nowYear-3);
					Event.on(DOM.query('.J_Tiger'),'mouseenter mouseleave',function(ev){
						 if(ev.type == 'mouseenter'){
						 DOM.addClass(ev.currentTarget,'current');
						 }else{
						 DOM.removeClass(ev.currentTarget,'current');
						 }
					}); 
					Event.on(DOM.query('.J_Page'),'click',function(ev){
						 var v = DOM.attr(ev.currentTarget,'data');
						 DOM.removeClass(DOM.query('#J_TopLeft .J_Page'),'active');
						 DOM.addClass(ev.currentTarget,'active');
						 DOM.html(DOM.get('#J_TopLeft .value'),v);
						 DOM.html('.J_year',v);
						 DOM.val('#J_SelectItemPage',v);
						 historyControl.searchHisitoryItem();
	     	          });
					 historyControl.searchHisitoryItem();

						 
				},	
				 
   				
                //搜索一年列表
    	        searchHisitoryItem : function() {
                    var submitHandle = function(o) {	
    	        	   var totalRecords = o.payload.totals.records;
    	        	    if(totalRecords > 0){
    	        	    	DOM.hide('.noDate');
	    					DOM.show('.J_ListCon');
    					} else {
	    					DOM.show('.noDate');
	    					DOM.hide('.J_ListCon');
    					}
    	        	    var income=o.payload.totals.income;
    	        	    var pay=o.payload.totals.pay;
    	        	    var profit=o.payload.totals.profit;
    	        	   // var pointdata=o.payload.totals.profits;
    	        	    DOM.html('#J_income',income);
    	        	    DOM.html('#J_out',pay);
    	        	    DOM.html('#J_profits',profit);
    	        	    historyControl.renderItems(o.payload.body);
      					DOM.hide('#J_LeftLoading');
     					DOM.show('#J_MainLeftContent');
     					//图表
     				 if(historyControl.chart){
                            historyControl.chart.destroy();
                       }
                       jQuery(function () {
                       	jQuery('#J_line_grap').highcharts({
                               chart: {
                                   type: 'line',
                                   height:200,
                                   spacingLeft:0,
                                   spacingRight:0
                               },
                               title: {
                                   text: '',
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
                                   	   marker:{symbol:'circle'}
                                     }
                               },
                               xAxis: {
                                   categories: o.payload.profits.xdata,
                                   tickInterval: 1,
                                   labels: {
                                   	step: o.payload.profits.xkuadu
                                   }
                               },
                               yAxis: {
                                   title : {text:null},
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
                               series: []
                           });
                       });
                       var pointdata=o.payload.profits.data;
                       historyControl.chart = jQuery('#J_line_grap').highcharts();
                       historyControl.chart.addSeries(pointdata);
                   };    					
            	    var errorHandle = function(o){
    					new H.widget.msgBox({
    					    content:o.desc,
    					    type:"error",
    					    autoClose:true,
    					    timeOut:3000
    					});		
            	    };
            	    DOM.hide('#J_LeftLoading');
 					DOM.show('#J_MainRightContent');
            	    var year=DOM.val('#J_SelectItemPage');
    				var data ='year='+year;
            	    new H.widget.asyncRequest().setURI(loadHistoryUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
    			},
    			 // 渲染TbItems
    			renderItems: function(c) {
            	    DOM.html(DOM.get("#J_HistoryItemList"), c,true);
    			}
    			    			     
                
		}
}, {
	requires: ['bui/select']
});      
