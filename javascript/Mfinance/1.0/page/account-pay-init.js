/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,beautifyForm,Select,Calendar,Overlay,Overly,Tooltip){
	var DOM = S.DOM, Event = S.Event;
	var incomeCates=KISSY.JSON.parse(incomeCatesJson);
	var payCates=KISSY.JSON.parse(payCatesJson);
	var classifys=incomeCates.concat(payCates);
	var cate_name;
	return 	payControl = {
		    	paginator : null,
		    	msg : null,
		    	msg1:null,
		    	dialog:null,
		    	panel2 :null,
		    	isInitSelect : [],
		    	selectCate:null,
		    	init : function() {	
						payControl.Form = new beautifyForm();
		                payControl.searchTbItems();
		                Event.on('.J_searchCates','click',function(ev){
                          var cate_id=DOM.attr(ev.currentTarget,'data');
                          DOM.removeClass('.J_searchCates','current');
                          DOM.addClass(ev.currentTarget,'current');
                          DOM.val('#J_catesList',cate_id);
                          DOM.hide('#J_pie');
                          if(cate_id==0){
                            DOM.show('#J_pie');
                          }
                          payControl.searchTbItems();
					    });
		                
		                Event.on('.J_TopAddToPromo','click',function(){
			        		var length =DOM.val('#J_HasSelectNum');
							if(length == 0){
								new H.widget.msgBox({
								    title:"提示",
								    content:'请至少选择一条记录',
								    type:"error"
								});	
							}else{
								payControl.batchSet();
							}	
					    });
		                Event.on('#J_mores','mouseenter mouseleave',function(ev){
							if(ev.type == 'mouseenter'){
								DOM.show('#J_moresCon');
							}else{
								DOM.hide('#J_moresCon');
							}
						});

						//时间下拉框
						var items3 = [
							{text:'最近一个月',value:'30'},
							{text:'最近2个月',value:'60'},
							{text:'最近3个月',value:'90'}								     
						],
						sortSelect = new Select.Select({  
							render:'#J_SelectItemSort',
							valueField:'#J_SelectItemSortHide',
							items:items3
						});
						sortSelect.render();
						sortSelect.setSelectedValue('30');
						sortSelect.on('change', function(ev){
							var dayTime=DOM.val('#J_SelectItemSortHide');
							payControl.searchTbItems();
						});
												
						//删除
						Event.delegate(document,'click','.J_del',function(ev){
							var id=DOM.attr(ev.currentTarget,'data');
					   		DOM.val('#J_delVal',id);
			        		if(!payControl.dialog){
			        			payControl.dialog = new Overlay.Dialog({
				     	            title:'删除',
				     	            width:330,
					 	            height:150,
				     	            mask:true,
				     	            buttons:[
					     	                   {
					     	                     text:'确定',
					     	                     elCls : 'bui-button bui-button-primary',
					     	                     handler : function(){
					     	                	  var submitHandle = function(o){
					  		 						new H.widget.msgBox({ 
					  							 			type: "sucess", 
					  							 			content: "删除成功",
					  										dialogType:"msg", 
					  										autoClose:true, 
					  										timeOut:3000
					  									});
					  		 						payControl.searchTbItems();
					  			         	    };		     	        	 
					  		 	         	    var errorHandle = function(o){
					  								new H.widget.msgBox({
					  								    title:"错误提示",
					  								    content:o.desc,
					  								    type:"error"
					  								});
					  			         	    };
					  		         	        var detail_id=DOM.val('#J_delVal');
					       	                    var data ='&detail_id='+detail_id;
					  			         	    new H.widget.asyncRequest().setURI(deleteItemUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
					     	                       this.hide();
					     	                     }
					     	                   },{
					     	                     text:'取消',
					     	                     elCls : 'bui-button',
					     	                     handler : function(){
					     	                       this.hide();
					     	                     }
					     	                   }
				     	                 ],
				     	                bodyContent:'<div style="text-align:center;"><div class="icon-doubt"></div><div class="ui-confirm-message-content" style="color:#656D7A;font-size:15px;height:20px;line-height:20px;margin-bottom:5px;font-weight:bold;">确认删除该条记录？</div></div>'
			     	          });
			        	 }
		     	         payControl.dialog.show();
						});
						

						 //导入数据
						Event.delegate(document,'click','.J_inportDate',function(){
							if(!payControl.msg1){
							payControl.msg1 = new Overlay.Dialog({
								 title:'导入数据',
						         width:400,
				 	             mask:true,
			  	                 buttons:[
				     	                   {
				     	                     text:'确定',
				     	                     elCls : 'bui-button bui-button-primary',
				     	                     handler : function(){    
				   			   		         var sucessHandle = function(o){
					   			   		        DOM.val('#J_startDate','选择添加时间');
					   			   		        DOM.val('#J_detail','请输入明细名称');
					   			        	    DOM.val('#J_radioType','pay');
					   			        	    if(DOM.val('#J_radioType')=='income'){
					   			        	     DOM.val('#J_classifyVal_1','0');
								        		}else if(DOM.val('#J_radioType')=='pay'){
								        		 DOM.val('#J_classifyVal_2','0');
								        		}
									   			DOM.val('#J_money','请输入金额');
									   			DOM.val('#J_radioids','银行');
									   			
									   			if(detail_type=='银行'){
									   				DOM.val('#J_bankNums','');
									   				DOM.val('#J_bankVal','请选择银行');
								        	    }else if(detail_type=='现金'){
								        	    	DOM.val('#J_objectNick','输入对方名称或公司名称');
								        	    }
									   			DOM.val('#J_desc','');
									   		    payControl.searchTbItems();
						   			    	 }; 
						   			        var errorHandle = function(o){
								        		 new H.widget.msgBox({
								        		 title:"",
								        		 content:o.desc,
								        		 type:"error"
								        		 });
							        		 }; 
							        		var create_time=DOM.val('#J_startDate');//时间
							        		var detail=DOM.val('#J_detail');//明细
							        		var amount_type=DOM.val('#J_radioType');//资金流向
							        		if(DOM.val('#J_radioType')=='income'){
							        	      var cate_id=DOM.val('#J_classifyVal_1');//类别名称
							        		}else if(DOM.val('#J_radioType')=='pay'){
							        		  var cate_id=DOM.val('#J_classifyVal_2');//类别名称
							        		}
							        	    var amount=DOM.val('#J_money');//金额
							        	    var detail_type=DOM.val('#J_radioids');//支付方式
							        	    var detail_desc=DOM.val('#J_desc');//说明
							        	    if(detail_type=='银行'){
							        	    	var business_type=DOM.val('#J_bankVal');//银行
							        	    	var opt_user=DOM.val('#J_bankNums');//卡号
							        	    }else if(detail_type=='现金'){
							        	    	var business_type='';
							        	    	var opt_user =DOM.val('#J_objectNick');//对象
							        	    }
							        	    ParamsErrorBox = KISSY.one('#J_Suggest_ParamsErrorBox');
							        	    if(create_time == "" || create_time == "undefined"||create_time == "选择添加时间"){
							    	    		DOM.html('#J_Suggest_ParamsErrorMsg','日期不能为空');
							    	    		if (ParamsErrorBox.css("display")==="none"){
							    	    			ParamsErrorBox.slideDown();														
												}
							    	    		S.later(function(){
							    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
												},2000,false);
												return;
											}
							        	    if(detail == "" || detail == "请输入明细名称"){
							    	    		DOM.html('#J_Suggest_ParamsErrorMsg','请填写明细名称');
							    	    		if (ParamsErrorBox.css("display")==="none"){
							    	    			ParamsErrorBox.slideDown();														
												}
							    	    		S.later(function(){
							    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
												},2000,false);
												return;
											}
							        	    if(cate_id == 0){
							    	    		DOM.html('#J_Suggest_ParamsErrorMsg','类别名称不能为空');
							    	    		if (ParamsErrorBox.css("display")==="none"){
							    	    			ParamsErrorBox.slideDown();														
												}
							    	    		S.later(function(){
							    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
												},2000,false);
												return;
											}
							        	    
						        	    if(amount == ""||amount == "请输入金额"){
						    	    		DOM.html('#J_Suggest_ParamsErrorMsg','请输入金额');
						    	    		if (ParamsErrorBox.css("display")==="none"){
						    	    			ParamsErrorBox.slideDown();														
											}
						    	    		S.later(function(){
						    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
											},2000,false);
											return;
										}
						        	    if(!isNaN(amount)){
					        	    	}else{
					        	    		DOM.html('#J_Suggest_ParamsErrorMsg','金额必须是数字');
						    	    		if (ParamsErrorBox.css("display")==="none") {
						    	    			ParamsErrorBox.slideDown();														
											}
						    	    		S.later(function(){
						    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
											},2000,false);
											return;
					        	    	}
						        	    if( amount == "undefined"||amount<0){
						    	    		DOM.html('#J_Suggest_ParamsErrorMsg','金额填写不正确');
						    	    		if (ParamsErrorBox.css("display")==="none"){
						    	    			ParamsErrorBox.slideDown();														
											}
						    	    		S.later(function(){
						    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
											},2000,false);
											return;
										}
							        	    if(business_type == "请选择银行" ){
							    	    		DOM.html('#J_Suggest_ParamsErrorMsg','请选择银行');
							    	    		if (ParamsErrorBox.css("display")==="none") {
							    	    			ParamsErrorBox.slideDown();														
												}
							    	    		S.later(function(){
							    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
												},2000,false);
												return;
											}
							        	   
							        	    if(opt_user == "请输入银行卡号"||opt_user == ""||opt_user == "undefined"||opt_user<0 ){
							    	    		DOM.html('#J_Suggest_ParamsErrorMsg','卡号填写不正确');
							    	    		if (ParamsErrorBox.css("display")==="none") {
							    	    			ParamsErrorBox.slideDown();														
												}
							    	    		S.later(function(){
							    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
												},2000,false);
												return;
											}
							        	    if(opt_user == "输入对方名称或公司名称" ){
							    	    		DOM.html('#J_Suggest_ParamsErrorMsg','对方名称或公司名称不能为空');
							    	    		if (ParamsErrorBox.css("display")==="none") {
							    	    			ParamsErrorBox.slideDown();														
												}
							    	    		S.later(function(){
							    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
												},2000,false);
												return;
											}
							        	    this.hide();
			 				   			   	var data ='&create_time='+create_time+'&detail='+detail+'&detail_type='+detail_type+'&detail_desc='+detail_desc+'&amount='+amount+'&cate_id='+cate_id+'&amount_type='+amount_type+'&opt_user='+opt_user+'&business_type='+business_type; 
			 			      	  		    new H.widget.asyncRequest().setURI(addItemUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
				     	                     }
				     	                   },{
				     	                     text:'取消',
				     	                     elCls : 'bui-button',	
				     	                     handler : function(){
				     	                      this.hide();
				     	                     }
				     	                   }
				     	                 ]
							     });      
				     	      var str='<div class="pop-content" id="J_pop_content">'+
					          '<ul style="overflow:hidden">'+
					          '<li class="min-height-35 fl" style="margin-bottom:15px;width:100%;">'+   
								'<div class="w-70 align-right fl min-height-35">选择时间:</div>'+ 
							 '<input type="text" style="margin-right: 10px;float:left; margin-top: 3px; color: rgb(101, 109, 120);" class="input-text calendarImg fr J_Seach_1" value="选择添加时间" name="start_date" id="J_startDate" readonly="readonly">'+
							  '</li>'+
					      	  '<li class="min-height-35 fl" style="margin-bottom:15px;width:100%;">' +   
								 '<div class="w-70 align-right fl min-height-35">明细名称:</div>'+ 
								'<input type="text"  value="请输入明细名称" class="input-text-2  fl" id="J_detail">'+ 
					          '</li>'+ 
					         '<li class="min-height-35 fl" style="margin-bottom:15px;width:100%;"> '+   
								 '<div class="w-70 align-right fl min-height-35">资金流向:</div>'+						 						 
								'<div class="input_style fl" style="margin-right:5px;">'+
								'<input type="hidden" value="income" id="J_radioType">'+
						           '<span class="beautify_radio_on"><input type="radio" checked="checked" name="genre" value="income"  data="income" class="beautify_input J_radio"></span>'+
								  ' <label for="J_radioType_income">收入</label>'+
						       ' </div>'+  
								'<div class="input_style fl">'+
						           ' <span class="beautify_radio_off"><input type="radio" value="pay" name="genre"  data="pay" class="beautify_input J_radio"></span>'+
									'<label for="J_radioType_pay">支出</label>'+
						       ' </div> '+        
					        ' </li>'+   
					      	'<li class="min-height-35 fl" style="margin-bottom:15px;width:100%;">'+
					        '<div class="w-70 align-right fl">类别名称:</div>'+
					         '<div class="fl ml6" id="J_classifyName1"><input type="hidden" value="选择类别" id="J_classifyVal_1"></div>'+
					         '<div class="fl ml6" id="J_classifyName2" style="display:none;"><input type="hidden" value="选择类别" id="J_classifyVal_2">'+
					        '</li>'+
					         '<li class="min-height-35 fl" style="margin-bottom:15px;width:100%;">'+
					          '<div class="w-70 align-right fl min-height-35" style="text-align:center;">金额:</div>'+
					          '<div class="fl ml6">'+
					         '<input type="text"  value="请输入金额" class="input-text-2  fl" id="J_money"></div>'+
					        '</li>'+
					        '<li class="min-height-35 fl J_radio2" style="margin-bottom:15px;width:100%;">'+
					       ' <div class="w-70 align-right fl min-height-35">支付方式:</div>'+
					        ' <div class="fl ml6">'+
					       ' <input type="hidden" value="银行" id="J_radioids">'+
					   '<label for="radio-01" class="beautify_radio r_on"><input type="radio" checked="checked" value="1" id="radio-01" name="sample-radio" class="J_radio_option" data="银行">银行</label>'+
					      '<label for="radio-02" class="beautify_radio r_off"><input type="radio"  value="2" id="radio-02" name="sample-radio" class="J_radio_option" data="现金">现金</label>'+
							'</div>'+
					       ' </li>'+
					       '<li class="min-height-35 fl J_bank" style="margin-bottom:15px;width:100%;">'+
					       ' <div class="w-70 align-right fl min-height-35" style="text-align:center;">银行:</div>'+
					        ' <div class="fl ml6" id="J_bankName"><input type="hidden" value="请选择银行" id="J_bankVal" >'+
							'</div>'+
					       ' </li>'+
					       '<li class="min-height-35 fl J_cardNums" style="margin-bottom:15px;width:100%;">'+
							' <div class="w-70 align-right fl min-height-35" style="text-align:center;">卡号:</div>'+
					        ' <div class="fl ml6"><input type="text" value="请输入银行卡号" name="name_for_it" class="input-text-2" id="J_bankNums">'+
							'</div>'+
					       ' </li>'+
					       '<li class="min-height-35 fl J_object" style="margin-bottom:15px;width:100%;display:none;">'+
					       ' <div class="w-70 align-right fl min-height-35" style="text-align:center;">对象:</div>'+
					        ' <div class="fl ml6"><input type="text" value="输入对方名称或公司名称" name="name_for_it" class="input-text-2" id="J_objectNick">'+
							'</div>'+
					       ' </li>'+
						    '<li class="fl" style="margin-bottom:5px;width:100%;">'+
					       ' <div class="w-70 align-right fl min-height-35" style="text-align:center;">说明:</div>'+
					        '<textarea id="J_desc" style="float:left;width:240px;height:60px;border-radius:5px;padding:4px; border: 1px solid #E5E8ED;"></textarea>'+
					       ' </li>'+
					       '<li  class="fl"  style="width:400px;line-height:0;min-height:0;margin-bottom:0;">'+
						       '<div id="J_Suggest_ParamsErrorBox" style="display: none; width:400px;" class="ui-msg mt15">'+
								'<div class="error-msg"><div class="img-16-1"></div>'+
								'<div id="J_Suggest_ParamsErrorMsg" class="text-16 color-red">内容不能为空</div></div>'+
								'</div>'+
								'<div id="J_Suggest_ParamsSucessBox" style="display: none;width:400px;" class="ui-msg mt15">'+
							       '<div class="success-msg"><div class="img-16-6"></div></div>'+
					       '</li>'+
					         '</ul>'+      
					       '</div>'
				 	           
							payControl.msg1.set('bodyContent',str);
							payControl.msg1.show(); 
							payControl.Form.renderAll('#J_pop_content');
							payControl.Form.renderAllRadio('#J_pop_content');
							 Event.on('.J_radio','click',function(ev){
								var type_id=DOM.attr(ev.currentTarget,'data');
								if(type_id=='income'){
									DOM.hide('#J_classifyName2');
									DOM.show('#J_classifyName1');
								}else if(type_id=='pay'){
									DOM.hide('#J_classifyName1');
									DOM.show('#J_classifyName2');
								}	
								 DOM.val('#J_radioType',type_id);
				             });
							 Event.on('.J_radio_option','click',function(ev){
								 var radio_id=DOM.attr(ev.currentTarget,'data');
								 DOM.val('#J_radioids',radio_id);
								if(radio_id=='银行'){
									DOM.show('.J_bank');
									DOM.show('.J_cardNums');
									DOM.hide('.J_object');
								}else if(radio_id=='现金'){
									DOM.show('.J_object');
									DOM.hide('.J_bank');
									DOM.hide('.J_cardNums');
								}	 
				             });
							 Event.on('#J_detail','focus',function(ev){
						    	if(DOM.val('#J_detail')=='请输入明细名称'){
						    		DOM.val('#J_detail','');
						    	  } 
								 });
						     Event.on('#J_detail','blur',function(ev){
						    	if(DOM.val('#J_detail')==''){
						    		DOM.val('#J_detail','请输入明细名称');
						    	} 
						 	 });
						 	 Event.on('#J_money','focus',function(ev){
						    	if(DOM.val('#J_money')=='请输入金额'){
						    		DOM.val('#J_money','');
						    	} 
					   		 });
						 	Event.on('#J_money','blur',function(ev){
						    	if(DOM.val('#J_money')==''){
						    		DOM.val('#J_money','请输入金额');
						    	} 
						 	 });
							 Event.on('#J_bankNums','focus',function(ev){
						    	if(DOM.val('#J_bankNums')=='请输入银行卡号'){
						    		DOM.val('#J_bankNums','');
						    	} 
							 });
						     Event.on('#J_bankNums','blur',function(ev){
						    	if(DOM.val('#J_bankNums')==''){
						    		DOM.val('#J_bankNums','请输入银行卡号');
						    	} 
						 	 });
						 	 Event.on('#J_objectNick','focus',function(ev){
						    	if(DOM.val('#J_objectNick')=='输入对方名称或公司名称'){
						    		DOM.val('#J_objectNick','');
						    	} 
					   		 });
						 	Event.on('#J_objectNick','blur',function(ev){
						    	if(DOM.val('#J_objectNick')==''){
						    		DOM.val('#J_objectNick','输入对方名称或公司名称');
						    	} 
						 	 });
							var datepicker = new Calendar.DatePicker({
					              trigger:'#J_startDate',
					              maxDate: new Date().getTime()-(24*60*60*1000),
					              showTime:false,
					              autoRender : true,
					              autoSetValue :false
					         })
							datepicker.on('selectedchange',function (e){
								var startDate = e.value;
									S.one('#J_startDate').val(e.text);
					        });
							 new Select.Select({  
		   	   		   		    render:'#J_classifyName1',
		   	   		   	      	valueField:'#J_classifyVal_1',
		   	   		   	      	items:incomeCates
		   	   		   		 }).render().setSelectedValue('0');

							 new Select.Select({  
			   	   		   		    render:'#J_classifyName2',
			   	   		   	      	valueField:'#J_classifyVal_2',
			   	   		   	      	items:payCates
			   	   		   		 }).render().setSelectedValue('0');
							 
					        var items = [{"text":"请选择银行","value":"请选择银行"},{"text":"中国银行","value":"中国银行"},{"text":"农业银行","value":"农业银行"},{"text":"商业银行","value":"商业银行"},{"text":"交通银行","value":"交通银行"},{"text":"建设银行","value":"建设银行"},{"text":"工商银行","value":"工商银行"},{"text":"招商银行","value":"招商银行"},{"text":"民生银行","value":"民生银行"},{"text":"华夏银行","value":"华夏银行"},{"text":"上海浦东发展银行","value":"上海浦东发展银行"},{"text":"深圳发展银行 ","value":"深圳发展银行"},{"text":"北京银行","value":"北京银行"},{"text":"农业发展银行","value":"农业发展银行"}],
						    select = new Select.Select({  
					   		    render:'#J_bankName',
					   	      	valueField:'#J_bankVal',
					   	      	items:items
				 	        });
							select.render();
							select.setSelectedValue('请选择银行');
							}else{
				   				payControl.msg1.show();	 	
				   			}		
					  });
						
						Event.on('#J_RightSearchBtn','click',function(ev){
							payControl.searchTbItems();
						});	
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
	 						 DOM.val('#J_SelectItemPage',v);
	     	        	     payControl.searchTbItems();
		     	          });	 					
			    	    Event.on("#J_TopCheckAll", "click", payControl.checkAll);
			    	    Event.on("#J_BottonCheckAll", "click", payControl.checkAll);
			    	    Event.on("#J_RightCheckAll", "click", payControl.rightCheckAll);
			    	    Event.on("#J_RightBottonCheckAll", "click", payControl.rightCheckAll);
			    	    Event.on("#J_RemoveItems", "click", payControl.removeItems);
			    	    Event.on('#J_BatchRetry','click',payControl.batchRetry); //从批量重试
			    	    payControl.getCateAjax();	    
		        },
		        
		           getCateAjax :function() {
                     var submitHandle = function(o) {
                        if(payControl.chart){
                            payControl.chart.destroy();
                        } 
                        jQuery(function () {
                                chart= new Highcharts.Chart({
                                    chart: {
                                        renderTo: 'J_pie',
                                        width:980,
                                        height:200,
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
                                            center: [150, 40],
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
                    new H.widget.asyncRequest().setURI(getCatesreportUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(null).send();
                }, 		        
				 searchTbItems : function() {
		            var submitHandle = function(o) {
						DOM.hide('#J_RightLoading');
						DOM.show('#J_MainRightContent');
		        	    totalRecords = o.payload.totalRecords;
		        	    DOM.html('#J_totalRecords',totalRecords);
						if(totalRecords > 0){
							DOM.css(DOM.get('#J_REmpty') ,'display','none');
							DOM.css(DOM.query(".J_ItemSelectBtnHolder") ,'display' , '');
						} else {
							DOM.css(DOM.get('#J_REmpty'), 'display' , '');
							DOM.css(DOM.query(".J_ItemSelectBtnHolder") , 'display' , 'none');
						}
						payControl.renderItems(o.payload.body);


						//触发分类
						Event.on(DOM.query('.J_modify'),'click',function(ev){
							var detail_id=DOM.attr(ev.currentTarget,'data_id');
							var cate_val= DOM.attr('#J_modify'+detail_id,'data');
							payControl.getClassifyItemList(detail_id,cate_val);
							 DOM.show('.sele_classify'+detail_id);
							 DOM.hide('.J_modify'+detail_id);	 
						});
						
						//点击确定保存分类
						Event.on('.J_sureBtn','click',function(ev){
							 var data_account=DOM.attr(ev.currentTarget,'data-account');
							 DOM.val('#J_accounts',data_account);
							 var submitHandle = function(o){
								 var detail_id=DOM.attr(ev.currentTarget,'data_id');
								 var cate_val = DOM.val('#J_timeListSelect_v'+detail_id);
								for( var key in classifys){
									 cate_name = '';
									 if(classifys[key].value == cate_val ){ 
										    cate_name = classifys[key].text;
										    DOM.html('.J_name'+detail_id,cate_name);
										    payControl.searchTbItems();
										     var counts= DOM.val('#J_accounts');
										     if(counts!=''){
												 var alertPop = new Tooltip.Tip({
													 trigger : '.J_modify'+detail_id,
													 alignType : 'top',
													 offset : 10,
													 autoRender :'true',
													 elCls : 'ui-tip',
													 title : '<div class="alert_pop"><div class="al_title"><div class="title_con"><b><i class="success-status" ></i>修改分类成功！</b></div></div><div class="ft"><span>是否将该帐号自动分类至'+cate_name+'？<a class="pop-btn" id="J_sure">确认加入</a></span></div></div>'
												  })
										     }
									   }
								 }
								 DOM.hide('.sale_classify');
								 DOM.show('.modify');
							 };
							 var errorHandle=function(o){
								 new H.widget.msgBox({
									    title:"错误提示",
									    content:o.desc,
									    type:"error"
									});
							 }
							 //将该账号统一改成一个类别
							 Event.delegate(document,'click','#J_sure',function(ev){
								 var submitHandle = function(o){
									 new H.widget.msgBox({ 
	     						 			type: "sucess", 
	     						 			content: "保存成功",
	     									dialogType:"msg", 
	     									autoClose:true, 
	     									timeOut:3000
	     								});
								 }; 
								 var alipay_id =DOM.val('#J_accounts');
								 var cate_val = DOM.val('#J_timeListSelect_v'+detail_id);	 
								 var data ="alipay_id="+alipay_id +"&cate_id="+cate_val;
							     new H.widget.asyncRequest().setURI(addAccountUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();	 
							 });
							 var detail_id=DOM.attr(ev.currentTarget,'data_id');
							 var cate_val = DOM.val('#J_timeListSelect_v'+detail_id);
							 var data = "detail_ids="+detail_id+"&cate_id="+cate_val;
						     new H.widget.asyncRequest().setURI(updateItemsCateUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();	 
						});
						var pageCount = Math.ceil(totalRecords/o.payload.pageNum);
						Event.delegate(document,'mouseover','.J_detailHelp',function(ev){
							var detail_id = DOM.attr(ev.currentTarget,'data');
							var detail_id = DOM.attr(ev.currentTarget,'data');
							var data_desc=DOM.attr(ev.currentTarget,'data-desc');
							var data_date=DOM.attr(ev.currentTarget,'data-date');
							var data_paytype=DOM.attr(ev.currentTarget,'data-paytype');
							  //提示框
							 var detailHelp = new Tooltip.Tip({
								 trigger : '#J_detailHelp_'+detail_id,
								 alignType : 'top',
								 offset : 10,
								 autoHideType :'mouseleave',
					   			 offset : 10,
					   			 autoHide : true,
	                             triggerEvent :'mouseover mouseenter',
								 elCls : 'ui-tip',
								 title : '<div class="time_pop">'+
				                 '<ul>'+
				                   '<li><i class="fon-clor">支付类型：</i>'+data_paytype+'</li>'+
				                   '<li><i class="fon-clor">到帐时间：</i>'+data_date+'</li>'+
				                   '<li><i class="fon-clor">说&nbsp;&nbsp;明：</i>'+data_desc+'</li>'+
				                 '</ul>'+
			               ' </div>'
							 })
							detailHelp.render();
				        });
						payControl.paginator = new showPages('payControl.paginator').setRender(payControl.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
						payControl.paginator.setPageCount(pageCount).printHtml('#J_TopPaging',3);
		    	    };
		        	 if(DOM.val(DOM.get("#J_SearchTitle")) != '名称、流水号'){
		    	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
		    	    	alert(DOM.val(DOM.get("#J_SearchTitle")));
		    	    }else{
		    	    	var title ='';
		    	    }
		        	 
		        	 var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
		        	 var cate_id=DOM.val('#J_catesList');
		        	 var days=DOM.val('#J_SelectItemSortHide');
		    	     var data = "q="+title+"&page_size="+itemPage+"&cate_id="+cate_id+"&days="+days;
		 			 DOM.show('#J_RightLoading');
					 DOM.hide('#J_MainRightContent');
		    	     new H.widget.asyncRequest().setURI(loadPayItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
				},
				renderItems: function(c) {
		    	    DOM.html(DOM.get("#J_PayItemList"), c);
		        	var lis = DOM.query("#J_PayItemList .J_TbItem");
		        	Event.on(lis, "mouseenter mouseleave click", function(ev){
		        		var el = DOM.get('.J_CheckBox',ev.currentTarget);
		        		if(el.disabled) return;
		        		if(ev.type == 'mouseenter'){
							DOM.addClass(ev.currentTarget,'current');
		        		}else if(ev.type == 'mouseleave'){
							DOM.removeClass(ev.currentTarget,'current');
						}
		        	});
//		        	//批量设置宝贝提示框
//	                var detailHelp = new Overly({
//	                    width:160,
//	                    elCls:'J_detailHelp'
//	                });
//	                var showTimer = null;
//                    Event.on('.J_detailHelp',"mouseenter", function (ev){
//                	var t = $(ev.target);
//                    if(showTimer)showTimer.cancel();
//                    var joinInfo = DOM.siblings(ev.currentTarget,'.J_time_pop');
//                    var joinInfoHtml = DOM.html(joinInfo);
//                    var h = Number(DOM.height(joinInfo)+20);
//                    var cont = '<div class="bui-tooltip bui-ext-position ui-tip x-align-bottom x-align-tc-bc">'+
//			                   joinInfoHtml+
//                               '<s class="x-align-arrow"><s class="x-align-arrow-inner"></s></s>';
//                    detailHelp.set("content", cont);
//                    detailHelp.set('align', {
//                        node:t,
//                        points:["bc", "tc"],
//                        offset: [0, -h]
//                    });
//                    detailHelp.show();
//                    });
//	                Event.on('.J_detailHelp',"mouseleave", function (e) {
//	                    showTimer = S.later(function(){
//	                        detailHelp.hide();
//	                    },1800,false);
//	                });
		        	payControl.Form.setCheckboxOff(DOM.get('#J_BottonCheckAll'));
    				payControl.Form.setCheckboxOff(DOM.get('#J_TopCheckAll'));
		        	payControl.Form.renderAll('#J_PayItemList');
		        	Event.on(DOM.query('#J_PayItemList .J_CheckBox'),'click',function(ev){
		        		  //ev.stopPropagation();
		        		var checkBoxs = DOM.query("#J_PayItemList .J_CheckBox");
	        			var len = checkBoxs.length;
	        			var j = 0 ;
	        			for(i=0; i<len; i++){
							if(checkBoxs[i].disabled) continue;
							if(checkBoxs[i].checked){
								j++;	
							} 
						}
		        		DOM.val('#J_HasSelectNum',j);
		        		DOM.html('#J_nums',j);
		        		var iid = ev.currentTarget.value;
		        		if(this.checked){
		        			var checkBoxs = DOM.query("#J_PayItemList .J_CheckBox");
		        			var len = checkBoxs.length;
		        			var allFlag = true;
		        			for(i=0; i<len; i++){
								if(checkBoxs[i].disabled) continue;
								if(!checkBoxs[i].checked){
									allFlag = false;
									break;
								} 
							}
		        			if(allFlag){
		        				payControl.Form.setCheckboxOn(DOM.get('#J_BottonCheckAll'));
								payControl.Form.setCheckboxOn(DOM.get('#J_TopCheckAll'));
		        			}
		        		}else{
		        			payControl.Form.setCheckboxOff(DOM.get('#J_BottonCheckAll'));
		        			payControl.Form.setCheckboxOff(DOM.get('#J_TopCheckAll'));
		        		}
		        	});	
		        	
				},
				
		    	handlePagination : function(turnTo) {
			    	pageId = turnTo;
		    		var submitHandle = function(o) {
		    			 totalRecords = o.payload.totalRecords;
		 				if(totalRecords > 0){
		 					DOM.css(DOM.get('#J_REmpty') ,'display','none');
		 					DOM.css(DOM.query(".J_ItemSelectBtnHolder") ,'display' , '');
		 				} else {
		 					DOM.css(DOM.get('#J_REmpty'), 'display' , '');
		 					DOM.css(DOM.query(".J_ItemSelectBtnHolder") , 'display' , 'none');
		 				}
		 				var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
		    			payControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
						payControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_TopPaging',3);
		        	    payControl.renderItems(o.payload.body);
		 				DOM.hide('#J_RightLoading');
						DOM.show('#J_MainRightContent');
			    	};
			    		 if(DOM.val(DOM.get("#J_SearchTitle")) != '名称、流水号'){
		    	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
		    	    }else{
		    	    	var title ='';
		    	    }
			    		 var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条		    	    	
			    		 var cate_id=DOM.val('#J_catesList');
			    		 var days=DOM.val('#J_SelectItemSortHide');
			    	     var data = "q="+title+"&page_size="+itemPage+"&cate_id="+cate_id+"&days="+days;
					      data += "&page_id="+pageId;
					    DOM.show('#J_RightLoading');
						DOM.hide('#J_MainRightContent');
		    	    new H.widget.asyncRequest().setURI(loadPayItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
				},
				
				batchSet : function(){
					var s=DOM.val('#J_HasSelectNum');
		        		if(!payControl.msg){
		 	   			   	payControl.msg = new Overlay.Dialog({
		 	   			   	mask:true,
		 	   			   	height:220,
		 		   			   	buttons:[
		 		   			   	{
		 		   			   	text:'确定',
		 		   			   	elCls : 'bui-button bui-button-primary',
		 			   			   	handler : function(){
			 		   			   		var submitHandle = function(o) {
				 		   			   		new H.widget.msgBox({ 
									 			type: "sucess", 
									 			content: "修改成功",
												dialogType:"msg", 
												autoClose:true, 
												timeOut:3000
											});
			 		   			   			DOM.html('#J_PayItemList',o.payload.body);
			 		   			   			DOM.attr('.J_CheckBox','checked',false);
			 		   			   		    payControl.searchTbItems();
			 		   			   		}
				 		   			   	checkBoxs = DOM.query("#J_PayItemList .J_CheckBox");
					 		   			var detail_ids = [];
					 		   			var len = checkBoxs.length;
					 		   			var error = false;
					 		   			for(i=0; i<len; i++){
					 		   				if(checkBoxs[i].checked && !checkBoxs[i].disabled){
					 		                     var ids = checkBoxs[i].value;
					 		                     detail_ids.push(ids);
					 		   				}
					 		            }
				 		        	    var cate_id=DOM.val('#J_cate_val');
				 						var data = "detail_ids="+detail_ids+"&cate_id="+cate_id;				
				 		        	    new H.widget.asyncRequest().setURI(updateItemsCateUrl).setMethod("POST").setHandle(submitHandle).setData(data).send();
				 		        	    this.hide();
		 			   			   	}
		 		   			   	},{
		 		   			   	text:'取消',
		 		   			   	elCls : 'bui-button',
		 			   			   	handler : function(){   		   			   		
		 		   			   			this.hide();
		 			   			   	}
		 		   			   	}
		 		   			   	]
		 	   			   	}); 

		 	   			    var str2 = '<div style="padding:0px 50px;height:95px;"><ul><li style="width:100%;height:36px;line-height:36px;text-align:center;font-size:15px;" class="fl">您已选中<b style="font-family: Georgia; font-size:15px;" id="J_nums" class="color-red">1</b>条明细</li><li style="width:100%;"><span class="fl" style="height:30px;line-height:30px;margin-right:5px;">批量设置类别为</span><div class="fl ml6" id="J_cate"><input type="hidden" value="" id="J_cate_val"></div></li></ul></div>';
		 	   			   	 payControl.msg.set('width',370);
		 	     			 payControl.msg.set('bodyContent',str2);
		 	     			 payControl.msg.render();
		 	     			 DOM.html('#J_nums',s);
		 	     			 payControl.msg.show(); 
		 	
 	  	  			   	    selectCate = new Select.Select({  
	 	  	  			   	    render:'#J_cate',
		   	   		   	      	valueField:'#J_cate_val',
		   	   		   	      	items:payCates
 	  	  			   		});
 	  	  			        selectCate.render();
 	  	  			        selectCate.setSelectedValue('0');			        	     			        
		        		}else{
		    			   	payControl.msg.show();	
		    			} 	        	   
		         },

				checkAll : function(e) {
					checkBoxs = DOM.query("#J_PayItemList .J_CheckBox");
					len = checkBoxs.length;
					for(i=0; i<len; i++){
						var iid = checkBoxs[i].value;
						if(checkBoxs[i].disabled) continue;
						if(this.checked){
							if(e.currentTarget.id == 'J_TopCheckAll'){
								payControl.Form.setCheckboxOn(DOM.get('#J_BottonCheckAll'));
							}else{
								payControl.Form.setCheckboxOn(DOM.get('#J_TopCheckAll'));
							}
							payControl.Form.setCheckboxOn(checkBoxs[i]);
							DOM.val('#J_HasSelectNum',DOM.val('#J_SelectItemPage'));
						} else {
							if(e.currentTarget.id == 'J_TopCheckAll'){
								payControl.Form.setCheckboxOff(DOM.get('#J_BottonCheckAll'));
							}else{
								payControl.Form.setCheckboxOff(DOM.get('#J_TopCheckAll'));
							}
							payControl.Form.setCheckboxOff(checkBoxs[i]);
						}
					}
				},
				hasItems: function() {
					checkBoxs = DOM.query("#J_PayItemList .J_CheckBox");
					var len = checkBoxs.length;
					var flag = false;
					for(i=0; i<len; i++){
						if(checkBoxs[i].checked && !checkBoxs[i].disabled){
							flag = true ;
							break;
						}
		            }
					return flag;
					
				},

				rightCheckAll : function(e) {
					checkBoxs = DOM.query("#J_PayItemList .J_CheckBox");
					len = checkBoxs.length;
					for(i=0; i<len; i++){
						var iid = checkBoxs[i].value;
						if(checkBoxs[i].disabled) continue;
						if(this.checked){
							if(e.currentTarget.id == 'J_RightCheckAll'){
								payControl.Form.setCheckboxOn(DOM.get('#J_RightBottonCheckAll'));
							}else{
								payControl.Form.setCheckboxOn(DOM.get('#J_RightCheckAll'));
							}
							payControl.Form.setCheckboxOn(checkBoxs[i]);
						} else {
							if(e.currentTarget.id == 'J_RightCheckAll'){
								payControl.Form.setCheckboxOff(DOM.get('#J_RightBottonCheckAll'));
							}else{
								payControl.Form.setCheckboxOff(DOM.get('#J_RightCheckAll'));
							}
							payControl.Form.setCheckboxOff(checkBoxs[i]);
						}
					}
				},
				getClassifyItemList : function(detail_id,cate_val){
						payControl.isInitSelect.push(detail_id);
						var data=DOM.val('#J_timeListSelect_v'+detail_id);
						new Select.Select({  
	   	   		   		    render:'#J_timeListSelect'+detail_id,
	   	   		   	      	valueField:'#J_timeListSelect_v'+detail_id,
	   	   		   	      	items:payCates
	   	   		   		}).render().setSelectedValue('0');
					
        	    }
				
				
		}
}, {
    requires: ['utils/showPages/index','utils/beautifyForm/index','bui/select','bui/calendar','bui/overlay','overlay','bui/tooltip']
});