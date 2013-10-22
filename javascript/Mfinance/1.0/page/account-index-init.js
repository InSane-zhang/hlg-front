/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,Select,Overlay,Calendar,Tooltip,Overly,beautifyForm) {
	var DOM = S.DOM, Event = S.Event;
	var originsSelect;
	var incomeCates=KISSY.JSON.parse(incomeCatesJson);
	var payCates=KISSY.JSON.parse(payCatesJson);
	var classifys=incomeCates.concat(payCates);
	var cate_name;
	return 	indexControl = {
		    	paginator : null,
		    	dialog:null,
		    	dialog1:null,
		    	selectPay:null,
		    	selectIncome:null,
		    	incomeSelect:null,
		    	paySelect :null,
		    	msg:null,
		    	msg1:null,
		    	isInitSelect : [],
		    	isInitSelects : [],
		    	isInitArray:[],
		    	init : function() {
		        indexControl.Form = new beautifyForm();
		         //下拉分页条数
                Event.on(DOM.query('.J_Tiger'),'mouseenter mouseleave',function(ev){
				   		if(ev.type == 'mouseenter'){
				   		DOM.addClass(ev.currentTarget,'current');
				   		}else{
				   		DOM.removeClass(ev.currentTarget,'current');
				   		}
			   		})
			   	 Event.on(DOM.query('.J_Page'),'click',function(ev){
				   		var v = DOM.attr(ev.currentTarget,'data');
				   		DOM.removeClass(DOM.query('#J_TopLeft .J_Page'),'active');
				   		DOM.addClass(ev.currentTarget,'active');
				   		DOM.html(DOM.get('#J_TopLeft .value'),v);
				   		DOM.val('#J_SelectItemPage',v);
				   		indexControl.SearchGlideItemList();
			   		}) 
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
					indexControl.SearchGlideItemList();
				});
				//搜索
				Event.on('#J_RightSearchBtn','click',function(ev){
				  indexControl.SearchGlideItemList();
				});	
				
				 //导入数据
				Event.delegate(document,'click','.J_inportDate',function(){
					if(!indexControl.msg1){
					indexControl.msg1 = new Overlay.Dialog({
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
							   		    indexControl.SearchGlideItemList();
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
			         '<div class="fl ml6" id="J_classifyName1"><input type="hidden" value="0" id="J_classifyVal_1"></div>'+
			         '<div class="fl ml6" id="J_classifyName2" style="display:none;"><input type="hidden" value="0" id="J_classifyVal_2">'+
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
		 	           
					indexControl.msg1.set('bodyContent',str);
					indexControl.msg1.show(); 
					indexControl.Form.renderAll('#J_pop_content');
					indexControl.Form.renderAllRadio('#J_pop_content');
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
   	   		   		 }).render();

					 new Select.Select({  
	   	   		   		    render:'#J_classifyName2',
	   	   		   	      	valueField:'#J_classifyVal_2',
	   	   		   	      	items:payCates
	   	   		   		 }).render();
					 
			        var items = [{"text":"请选择银行","value":"请选择银行"},{"text":"中国银行","value":"中国银行"},{"text":"农业银行","value":"农业银行"},{"text":"商业银行","value":"商业银行"},{"text":"交通银行","value":"交通银行"},{"text":"建设银行","value":"建设银行"},{"text":"工商银行","value":"工商银行"},{"text":"招商银行","value":"招商银行"},{"text":"民生银行","value":"民生银行"},{"text":"华夏银行","value":"华夏银行"},{"text":"上海浦东发展银行","value":"上海浦东发展银行"},{"text":"深圳发展银行 ","value":"深圳发展银行"},{"text":"北京银行","value":"北京银行"},{"text":"农业发展银行","value":"农业发展银行"}],
				    select = new Select.Select({  
			   		    render:'#J_bankName',
			   	      	valueField:'#J_bankVal',
			   	      	items:items
		 	        });
					select.render();
					select.setSelectedValue('请选择银行');
					}else{
		   				indexControl.msg1.show();	 	
		   			}		
			  });
                indexControl. SearchGlideItemList();
            
            
          //删除
			Event.delegate(document,'click','.J_del',function(ev){
				var id=DOM.attr(ev.currentTarget,'data');
		   		DOM.val('#J_delVal',id);
        		if(!indexControl.dialog){
        			indexControl.dialog = new Overlay.Dialog({
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
		     								indexControl.SearchGlideItemList();	
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
			     	    	  		     new H.widget.asyncRequest().setURI(deleteItemUrl).setHandle(submitHandle).setMethod("GET").setData(data).send();
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
	 	         indexControl.dialog.show();
			});
			    	    
        },
		        SearchGlideItemList : function() {
		            var submitHandle = function(o) {
						DOM.hide('#J_RightLoading');
						DOM.show('#J_MainRightContent');
		        	    totalRecords = o.payload.totalRecords;
		        	    var income=o.payload.counts.income;
		        	    var pay=o.payload.counts.pay; 
		        	    DOM.html('#J_income',income);
		        	    DOM.html('J_pay', pay);
		        	    DOM.html('#J_totalRecords',totalRecords);
		        	    if(totalRecords > 0){
		        	    	DOM.css(DOM.get('#J_REmpty') ,'display','none');
		        	    	DOM.css(DOM.query(".J_PromotionItemBtnHolder") ,'display' , '');
		        	    	DOM.css(DOM.query(".J_ControlBtm") , 'display' , 'block');
		        	    	} else {
		        	    	DOM.css(DOM.get('#J_REmpty'), 'display' , '');
		        	    	DOM.css(DOM.query(".J_PromotionItemBtnHolder") , 'display' , 'none');
		        	    	DOM.css(DOM.query(".J_ControlBtm") , 'display' , 'none');
		        	    	} 
						indexControl.renderItems(o.payload.body);
						var income=o.payload.counts.income;
						var pay=o.payload.counts.pay;
						DOM.html('#J_income',income);
						DOM.html('#J_pay',pay);
						
						//触发分类
						Event.on(DOM.query('.J_modify'),'click',function(ev){
							var detail_id=DOM.attr(ev.currentTarget,'data_id');
							DOM.val('#J_detail_id',detail_id);
							var cate_val= DOM.attr(ev.currentTarget,'data');
							var data_type=DOM.attr(ev.currentTarget,'data-type');
							if(data_type=='income'){
								 indexControl.getIncomeClassifyList(detail_id,cate_val);
								}else if(data_type=='pay'){
								 indexControl.getPayClassifyList(detail_id,cate_val);
								}
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
								 DOM.val('#J_cateids',cate_val);
								 for( var key in classifys){
									 cate_name = '';
									if(classifys[key].value == cate_val ){ 
										    cate_name = classifys[key].text;
										    DOM.html('.J_name'+detail_id,cate_name);
										    indexControl.SearchGlideItemList();
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
						})
						  var pageCount = Math.ceil(totalRecords/o.payload.pageNum);
						 
						indexControl.paginator = new showPages('indexControl.paginator').setRender(indexControl.handlePagination).setPageCount(pageCount).printHtml('#J_BottomPaging',2);
						indexControl.paginator.setPageCount(pageCount).printHtml('#J_TopPaging',3);
		    	    };
		    	    if(DOM.val(DOM.get("#J_SearchTitle")) != '名称、流水号'){
		    	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
		    	    }else{
		    	    	var title ='';
		    	    }
					var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
					var days=DOM.val('#J_SelectItemSortHide');
		    	    var data = "q="+title+"&page_size="+itemPage+"&days="+days;
		 			DOM.show('#J_RightLoading');
					DOM.hide('#J_MainRightContent');
		    	    new H.widget.asyncRequest().setURI(loadGlideItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
				},
				renderItems: function(c) {
		    	    DOM.html(DOM.get("#J_GlideItemList"), c);
		        	var lis = DOM.query("#J_GlideItemList .J_TbItem");
		        	Event.on(lis, "mouseenter mouseleave click", function(ev){
		        		if(ev.type == 'mouseenter'){
							DOM.addClass(ev.currentTarget,'current');
		        		}else if(ev.type == 'mouseleave'){
							DOM.removeClass(ev.currentTarget,'current');
						}
		        	});	
		        	
					//提示框
	                var detailHelp = new Overly({
	                	width:160,
	                    elCls:'J_detailHelp'
	                });
	                var showTimer = null;
                    Event.on('.J_detailHelp',"mouseenter", function (ev){
                	var t = $(ev.target);
                    if(showTimer)showTimer.cancel();
                    var joinInfo = DOM.siblings(ev.currentTarget,'.J_time_pop');
                    var joinInfoHtml = DOM.html(joinInfo);
                    var h = Number(DOM.height(joinInfo)+20);
                    var cont = '<div class="bui-tooltip bui-ext-position ui-tip x-align-bottom x-align-tc-bc">'+
			                   joinInfoHtml+
                               '<s class="x-align-arrow"><s class="x-align-arrow-inner"></s></s>';
                    detailHelp.set("content", cont);
                    detailHelp.set('align', {
                        node:t,
                        points:["bc", "tc"],
                        offset: [0, -h]
                    });
                    detailHelp.show();
                    });
	                Event.on('.J_detailHelp',"mouseleave", function (e) {
	                        detailHelp.hide();
	                });
				},	
		    	handlePagination : function(turnTo) {
			    	pageId = turnTo;
		    		var submitHandle = function(o) {
		    			 totalRecords = o.payload.totalRecords;
		    			 indexControl.renderItems(o.payload.body);
		    			 if(totalRecords > 0){
		    				 DOM.css(DOM.get('#J_REmpty') ,'display','none');
		    				 DOM.css(DOM.query(".J_PromotionItemBtnHolder") ,'display' , '');
		    				 } else {
		    				 DOM.css(DOM.get('#J_REmpty'), 'display' , '');
		    				 DOM.css(DOM.query(".J_PromotionItemBtnHolder") , 'display' , 'none');
		    				 } 
		 				var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
		    			indexControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_BottomPaging',2);
						indexControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_TopPaging',3);
		 				DOM.hide('#J_RightLoading');
						DOM.show('#J_MainRightContent');
			    	};
			    	 if(DOM.val(DOM.get("#J_SearchTitle"))!= '名称、流水号'){
			    	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
			    	    }else{
			    	    	var title ='';
			    	    }
					 var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
					 var days=DOM.val('#J_SelectItemSortHide');
					 var data = "q="+title+"&page_size="+itemPage+"&days="+days;
			             data += "&page_id="+pageId;
					    DOM.show('#J_RightLoading');
						DOM.hide('#J_MainRightContent');
		    	    new H.widget.asyncRequest().setURI(loadGlideItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
				},
				
				getIncomeClassifyList : function(detail_id,cate_val){
						indexControl.isInitSelect.push(detail_id);
						var data=DOM.val('#J_timeListSelect_v'+detail_id);
						indexControl.selectIncome = new Select.Select({  
	  			   		    render:'#J_timeListSelect'+detail_id,
	  			   	      	valueField:'#J_timeListSelect_v'+detail_id,
	  			   	      	items:incomeCates
	  			   		});
						indexControl.selectIncome.render();
						indexControl.selectIncome.setSelectedValue(cate_val);
					
        	    },
				getPayClassifyList : function(detail_id,cate_val){
						indexControl.isInitSelects.push(detail_id);
						var data=DOM.val('#J_timeListSelect_v'+detail_id);
						indexControl.selectPay = new Select.Select({  
	  			   		    render:'#J_timeListSelect'+detail_id,
	  			   	      	valueField:'#J_timeListSelect_v'+detail_id,
	  			   	      	items:payCates
	  			   		});
						indexControl.selectPay.render();
						indexControl.selectPay.setSelectedValue(cate_val);
						
        	    }

        	  
				
				
		}
}, {
    requires: ['utils/showPages/index','bui/select','bui/overlay','bui/calendar','bui/tooltip','overlay','utils/beautifyForm/index']
});