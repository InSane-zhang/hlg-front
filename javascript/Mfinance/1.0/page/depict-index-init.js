/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,Tooltip) {
	var DOM = S.DOM, Event = S.Event;
	return indexControl = {
				msg : null,
				chart : null,
				chart1 : null,
				chart2 : null,
				chart3 : null,
				flag:false,
				flags:false,
				init : function(){
		            indexControl.getMoneyListItem();
					indexControl.getMoneyAjax();
					indexControl.getBackAjax();
					indexControl.getIncomeRatioAjax();
					indexControl.getMemberAjax();
					indexControl.getLessTotalAjax();
					indexControl.searchProfitItem();
					Event.delegate(document,'click mouseover','.J_itemNav',function(ev){
						var pid = DOM.attr(ev.currentTarget,'pid');
						DOM.val('#J_getListPid',pid)
			        	DOM.removeClass('.J_itemNav','current');
			        	DOM.addClass(ev.currentTarget,'current');
			        	if(pid== 0){
			        		DOM.hide('.modle2');
			        		if(indexControl.flag==false){
			        			indexControl.searchProfitItem();
			        		}
			        		DOM.show('.model1');
			        	}else if(pid==1){
			        		
			        		DOM.hide('.model1');
			        		if(indexControl.flags==false){
			        			indexControl.searchSaleItem();
			        		}
			        		DOM.show('.modle2');
			        	}
			        });
//					Event.on('#J_propit_rank','click',function(){
//						indexControl.searchProfitItem();							
//					});
					
					
				},
             //销售额图表
				getBackAjax :function() {
                    var submitHandle = function(o) {
                        if(indexControl.chart1){
                            indexControl.chart1.destroy();
                        }
                        jQuery(function () {
                        	jQuery('#J_line_one').highcharts({
                                chart: {
                                    type: 'line',
                                    height:274,
                                    spacingLeft:0,
                                    spacingRight:0,
                                    spacingBottom:15,
                                    spacingTop:15
                                },
                                title: {
                                    text: '销售额',
                                    verticalAlign: 'bottom',
                                    y: 35,
                                    float: true
                                },
                                colors: [
                                 	'#64ABEB','#4dc1e8','#fb6e52','#ffce55','#656d78','#ac92ed','#ec87c1','#4b89dc','#db4453','#d8ad88','#00d39f','#a2b1c7','#5937ae','#bc3783'
                                ],
                                plotOptions: {
                                    series: {
                                        stickyTracking: false,
                                    	marker:{symbol:'circle'}
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
                        var pointdata = o.payload.data;
                        var ydata=o.payload.ydata;
                        var tdata=o.payload.tdata;
                        DOM.html('#J_yesterday',ydata);
                        DOM.html('#J_today',tdata);
                        indexControl.chart1 = jQuery('#J_line_one').highcharts();
	                    S.each(pointdata,function(item,i){
	                    	indexControl.chart1.addSeries(item);
	                    });
                    };
                    var errorHandle = function(o){
                    };
                    new H.widget.asyncRequest().setURI(getSalesUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(null).send();
                },
              //收入支出图表 
				getMoneyAjax :function() {
                    var submitHandle = function(o) {
                        if(indexControl.chart){
                            indexControl.chart.destroy();
                        }
                        jQuery(function () {
                        	jQuery('#J_line-two').highcharts({
                        		chart: {
				                type: 'line',
				                width: 560,
				                height:274,
				                spacingLeft:0,
                                spacingRight:0,
                                spacingBottom:15,
                                spacingTop:15
				            },
				            title: {
                                text: '收入',
                                verticalAlign: 'bottom',
                                y: 35,
                                float: true
                            },
                            colors: [
                             	'#64ABEB','#4dc1e8','#fb6e52','#ffce55','#656d78','#ac92ed','#ec87c1','#4b89dc','#db4453','#d8ad88','#00d39f','#a2b1c7','#5937ae','#bc3783'
                            ],
                            plotOptions: {
                                series: {
                                    stickyTracking: false,
                                	marker:{symbol:'circle'}
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
                    var pointdata = o.payload.data;
                    var yincome=o.payload.yincome;
                    var tincome=o.payload.tincome;
                    var ypay=o.payload.ypay;
                    var tpay=o.payload.tpay;
                    DOM.html('#J_zuori',yincome);
                    DOM.html('#J_jinri',tincome);
                    DOM.html('#J_zouriPay',ypay);
                    DOM.html('#J_todayPay',tpay);
                    indexControl.chart = jQuery('#J_line-two').highcharts();
                    S.each(pointdata,function(item,i){
                    	indexControl.chart.addSeries(item);
                    })
                };
                    var errorHandle = function(o){
                    };
                    new H.widget.asyncRequest().setURI(getAccountsUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(null).send();
                },
                
                
                
			//收入比例	
				getIncomeRatioAjax :function() {
                    var submitHandle = function(o) {
                        if(indexControl.chart2){
                            indexControl.chart2.destroy();
                        }
 
                        jQuery(function () {
                                chart2 = new Highcharts.Chart({
                                    chart: {
                                        renderTo: 'demo3',
                                        width:380,
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
                                        '#64ABEB',
                                        '#4dc1e8',
                                        '#4b89dc',
                                        '#656d78',    
                                        '#d8ad88'
                                    ],
                                    yAxis: {
                                        title: {
                                            text: ' '
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
                                            return '<div style="margin-bottom:15px;"><span style="font-weight:700;color:#656d78;">'+Highcharts.numberFormat(this.y/500*100,2) +'%</span>  ' + '<span style="color:#abb3be;">'+this.name+'</span></div>';
                                        }
                                    },
                                    credits: {
                                        enabled:false
                                    },
                                    series: [{
                                        name: ' ',
                                        data: o.payload.items,
                                        size: '90%',
                                        innerSize: '50%',
                                        showInLegend:true,
                                        dataLabels: {
                                            enabled: false
                                        }
                                    }]
                                });
                            });
                    };
                    var errorHandle = function(o){
                    };
                    new H.widget.asyncRequest().setURI(getIncomeRatioUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(null).send();
                },
              //支出比例	
                getMemberAjax :function() {
                    var submitHandle = function(o) {
                        if(indexControl.chart3){
                            indexControl.chart3.destroy();
                        } 
                        jQuery(function () {
                                chart3= new Highcharts.Chart({
                                    chart: {
                                        renderTo: 'demo4',
                                        width:380,
                                        height:245,
                                        type: 'pie',
                                        spacingRight:0,
                                        spacingBottom:30
                                    },
                                    title: {
                                        text: ' ',
                                        float: true
                                    },
                                    colors: [
                                        '#64ABEB',
                                        '#4dc1e8',
                                        '#4b89dc',
                                        '#656d78',    
                                        '#d8ad88'
                                    ],
                                    yAxis: {
                                        title: {
                                            text: ' '
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
                                            return '<div style="margin-bottom:15px;"><span style="font-weight:700;color:#656d78;">'+Highcharts.numberFormat(this.y/500*100,2) +'%</span>  ' + '<span style="color:#abb3be;">'+this.name+'</span></div>';
                                        }
                                    },
                                    credits: {
                                        enabled:false
                                    },
                                    series: [{
                                        name: ' ',
                                        data: o.payload.items,
                                        size: '90%',
                                        innerSize: '50%',
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
                    };
                    new H.widget.asyncRequest().setURI(getExpenditureUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(null).send();
                }, 
                //获取未分类数据量
                getLessTotalAjax:function(){
                	 var submitHandle = function(o) {
                		 var totalLess=o.payload;
                     	 DOM.html('#J_remain',totalLess);
                     	if(totalLess==0){
                     		DOM.hide('#J_lessTotal');
                     	}else{
                     	   DOM.show('#J_lessTotal');
                     	}
                	 };
                	 new H.widget.asyncRequest().setURI(getUnsetsUrl).setMethod("POST").setHandle(submitHandle).setData(null).send();
                },
                
                  //搜索销量排行
    	        searchSaleItem : function() {
                    var submitHandle = function(o) {
    	        	    totalRecords = o.payload.totalRecords;
    	        	    if(totalRecords > 0){
    						DOM.get('#J_REmpty').style.display = 'none';
    						DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'');
    					} else {
    						DOM.get('#J_REmpty').style.display = '';
    						DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'none');
    					}
    					indexControl.renderItems(o.payload.body);	
      					DOM.hide('#J_RightLoading');
     					DOM.show('#J_MainRightContent');
            	    };
            	    var errorHandle = function(o){
    					new H.widget.msgBox({
    					    title:"错误提示",
    					    content:o.desc,
    					    type:"error"
    					});		
            	    };
    				DOM.show('#J_RightLoading');
    				DOM.hide('#J_MainRightContent');
            	    new H.widget.asyncRequest().setURI(getSaleRankingsUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(null).setDataType('json').send();
    			},
    			
    			    // 渲染 TbItems
    			renderItems: function(c) {
            	    DOM.html(DOM.get("#J_sale"), c,true);
            	    indexControl.flags=true;
    			},
    			
    			    //搜索利润排行
    	        searchProfitItem : function() {
                    var submitHandle = function(o) {
    	        	    totalRecords = o.payload.totalRecords;
    	        	    if(totalRecords > 0){
    						DOM.get('#J_LEmpty').style.display = 'none';
    						DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'');
    					} else {
    						DOM.get('#J_LEmpty').style.display = '';
    						DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'none');
    					}
    					indexControl.renderprofitItems(o.payload.body);	
      					DOM.hide('#J_LeftLoading');
     					DOM.show('#J_MainLeftContent');
            	    };
            	    var errorHandle = function(o){
    					new H.widget.msgBox({
    					    title:"错误提示",
    					    content:o.desc,
    					    type:"error"
    					});		
            	    };
    				DOM.show('#J_LeftLoading');
    				DOM.hide('#J_MainLeftContent');
            	    new H.widget.asyncRequest().setURI(getProfitRankingsUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(null).setDataType('json').send();
    			},
    			 // 渲染 TbItems
    			renderprofitItems: function(c) {
            	    DOM.html(DOM.get("#J_profit"), c,true);
            	    indexControl.flag=true;
    			},
               //判断利润是否为0
    			getMoneyListItem : function() {
                    var submitHandle = function(o){
    				var income=o.payload.income;	
    				var pay=o.payload.pay;
    				var profit=o.payload.profit;
    				var refund=o.payload.refund;
    				DOM.html('#J_income',income);
    				DOM.html('#J_out',pay);
    				DOM.html('#J_proval',profit);
    				DOM.html('#J_drawback',refund);
    				if(profit == 0){
						 DOM.show('#J_pro');
					     var sendLotteryHover = new Tooltip.Tip({
				   			 trigger :'#J_pro',
				   			 alignType :'top',
				   			 offset : 10,
				   			 elCls : 'ui-tip',
				   			 title :'<div class="zero"><p style="color:#989898;">没有利润？不可能！</p><span>由于您暂未设置宝贝成本，利润数据不精准，暂不为您推送。</span><a href="http://tb-new.huanleguang.com/finance/configure/index/?sid=0-1369739-3-8f09ad69ed774f0a7ca741e9fad4c686&zid=1369739" target="_blank" >去设置</a></div></div>'
			   			 }); 
						   //金额为0时提示信息
						 Event.on('#J_pro',"mouseover mouseenter", function (ev) {    	 
						   sendLotteryHover.render();
						   sendLotteryHover.show();
						 });
						 Event.on('#J_pro',"mouseleave", function (e) {
							 var sendLotteryHover = new Tooltip.Tip({
					   			 trigger :'#J_pro',
					   			 alignType :'top',
					   			 offset : 10,
					   			 elCls : 'ui-tip',
					   			 title :'<div class="zero"><p style="color:#989898;">没有利润？不可能！</p><span>由于您暂未设置宝贝成本，利润数据不精准，暂不为您推送。</span><a href="http://tb-new.huanleguang.com/finance/configure/index/?sid=0-1369739-3-8f09ad69ed774f0a7ca741e9fad4c686&zid=1369739" target="_blank" >去设置</a></div></div>'
				   			 }); 
							 sendLotteryHover.show();
							 sendLotteryHover.render();
	                            S.later(function(){
			                    	sendLotteryHover.hide();
			                    },10000,true);
			                }); 
					}else{
						DOM.hide('#J_pro');	
					  }	
            	    }; 
            	    new H.widget.asyncRequest().setURI(getStatisticUrl).setMethod("GET").setHandle(submitHandle).setData(null).send();
    			}
       
                
		}
}, {
	requires: ['bui/tooltip']
});      