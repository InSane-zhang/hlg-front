/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return indexControl = {
				msg : null,
				chart : null,
				chart1 : null,
				chart2 : null,
				init : function(){
					indexControl.getMoneyAjax();
					indexControl.getBackAjax();
					indexControl.getMemberAjax();
					Event.on('.J_MemberSale','click',function(ev){
						window.location.href = memberSaleFromTbUrl;
					})	
				},
				getMoneyAjax :function() {
                    var submitHandle = function(o) {
                        //DOM.html(DOM.get("#J_List"), o.payload.body,true);
                        if(indexControl.chart){
                            indexControl.chart.destroy();
                        }
                        jQuery(function () {
                        	jQuery('#demo1').highcharts({
                                chart: {
                                    type: 'line',
                                    height:330,
                                    width:995,
                                    spacingLeft:0,
                                    spacingRight:0,
                                    spacingBottom:15,
                                    spacingTop:15
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
                                    categories: o.payload.xdata,
                                    tickInterval: 2,
                                    labels: {
                                    	step:o.payload.xkuadu
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
                                         formatter: function() {
                                             return this.value*100+'%';
                                         },
                                         format: '{value}%'
                                    }
                                },
                                legend: {
                                    enabled:true,
                                    borderWidth:0
                                },
                                credits: {
                                    enabled:false
                                },
                                tooltip: {
                                    formatter: function() {
                                        
                                        return '<b>'+ this.x+'号' +'</b>: '+ this.y*100 +' %';
                                    }
                                },
                                series: []
                            });
                        });
                        var pointdata = o.payload.data;
                        indexControl.chart = jQuery('#demo1').highcharts();
	                    S.each(pointdata,function(item,i){
	                    	indexControl.chart.addSeries(item);
	                    })
                    };
                    var errorHandle = function(o){
                        //DOM.html(DOM.get("#J_Chart1"), o.desc,true);
                    };
                    new H.widget.asyncRequest().setURI(getSaleAjaxUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(null).send();
                },	
				getBackAjax :function() {
                    var submitHandle = function(o) {
                        //DOM.html(DOM.get("#J_List"), o.payload.body,true);
                        if(indexControl.chart1){
                            indexControl.chart1.destroy();
                        }
                        jQuery(function () {
                        	jQuery('#demo2').highcharts({
                                chart: {
                                    type: 'line',
                                    height:330,
                                    width:995,
                                    spacingLeft:0,
                                    spacingRight:0,
                                    spacingBottom:15,
                                    spacingTop:15
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
                                    categories: o.payload.xdata,
                                    tickInterval: 2,
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
                                        formatter: function() {
                                            return this.value*100+'%';
                                        },
                                        format: '{value}%'
                                   }
                                },
                                tooltip: {
                                    formatter: function() {
                                        return '<b>'+ this.x+'号' +'</b>: '+ this.y*100 +' %';
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
                        indexControl.chart1 = jQuery('#demo2').highcharts();
	                    S.each(pointdata,function(item,i){
	                    	indexControl.chart1.addSeries(item);
	                    })
                    };
                    var errorHandle = function(o){
                        //DOM.html(DOM.get("#J_Chart1"), o.desc,true);
                    };
                    new H.widget.asyncRequest().setURI(getBackAjaxUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(null).send();
                },
				getMemberAjax :function() {
                    var submitHandle = function(o) {
                        //DOM.html(DOM.get("#J_List"), o.payload.body,true);
                        if(indexControl.chart2){
                            indexControl.chart2.destroy();
                        }
 
                        jQuery(function () {
                                // Create the chart
                                chart = new Highcharts.Chart({
                                    chart: {
                                        renderTo: 'demo3',
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
                    };
                    new H.widget.asyncRequest().setURI(memberFromTbUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(null).send();
                }                  
		}
}, {
    requires: []
});      