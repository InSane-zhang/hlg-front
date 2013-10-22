/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,Select,beautifyForm,Calendar) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return createGroup = {
				msg : null,
				rule_num : 0,
				ruleMsg :false,
				groupRule:[],
				groupRule_num : 0,
				leftRule : 0,
				init : function(){
					Event.on('#J_BtnPublish','click',function(ev){
			//			if(showToUpdateDialog('test','','')){
			//				return ;
			//			}
						if(isVersionPer('crm')){
							return ;
						}	
						createGroup.save();
						return false;
					})
					var timing = new Calendar.DatePicker({
			            trigger:'.timing',
			            autoRender : true
			        });
					Event.on('.term','click',function(ev){
						var data = DOM.attr(ev.currentTarget,'data');
						if(ev.currentTarget.checked == true){
							DOM.show('.group_'+data);
						}else{
							DOM.hide('.group_'+data);
						}
					})
					Event.on('#J_Stat','click',function(ev){
						ParamsErrorBox = KISSY.one('#J_ParamsErrorBox');
						var sucessHandle = function(o) {
							DOM.show('.J_StatContent');
							DOM.html('.J_StatNum',o.desc)
				 		};
				 		var errorHandle = function(o){
				 			DOM.html('#J_ParamsErrorMsg',o.desc);
							if (ParamsErrorBox.css("display")==="none") {
								ParamsErrorBox.slideDown();
							}
				 		};
				 		var data = '';
				  	    new H.widget.asyncRequest().setURI(getMemberCountUrl).setMethod("POST").setForm('#promotion_edit_form').setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
					})					
					
					
					createGroup.Form = new beautifyForm();
					
					
					var items = [
					  {text:'不限级别',value:'0'},
					  {text:'普通会员',value:'1'},
					  {text:'高级会员',value:'2'},
					  {text:'VIP会员',value:'3'},
					  {text:'至尊VIP会员',value:'4'}						  
					],
					select = new Select.Select({  
					  render:'#J_Member',   
					  valueField:'#J_Grade',
					  items:items
					});
					select.render();
					select.setSelectedValue('0');
					
					var items = [
					  {text:'客户来源',value:'0'},
					  {text:'交易成功',value:'1'},
					  {text:'未成交',value:'2'}				  
					],
					select = new Select.Select({  
					  render:'#J_MemberSource',   
					  valueField:'#J_Source',
					  items:items
					});
					select.render();
					select.setSelectedValue('0'); 					

//				Event.delegate(document,'click','.J_Rule_Del',function(ev){
//					var ruleId = DOM.attr(ev.currentTarget,"data");
//					var rule = DOM.parent(DOM.parent(ev.currentTarget));
//					str = '<div class="point"><span>删除筛选条件会使与之关联的分组不再更新。<br/>确定继续吗？</span><br/><div style="width:160px;_width:170px;" class="btm-content btm-margin-30auto"><input name="" type="button" value="确定删除" class="btm-68-orange fl" id="del"/> <input name="" type="button" value="不删除" class="btm-68-gray fl" id="cancel" /></div></div>'; 
//					promotionControl.msg.setHeader('删除筛选条件').setMsg(str).showDialog();
//					Event.remove('#del');
//					Event.remove('#cancel');
//					Event.on('#del','click',function(ev){
//						 var submitHandle = function(o) {
//							 	DOM.remove(rule);
//						    	promotionControl.leftRule++
//						    	DOM.html('#J_LeftRule',promotionControl.leftRule);
//					 	    	promotionControl.msg.hide();
//						    };
//						    var errorHandle = function(o){
//						    	promotionControl.msg.hide();
//						    	var ParamsErrorBox = KISSY.one('#J_ParamsErrorBox');
//								DOM.html('#J_ParamsErrorMsg',o.payload.desc);
//								if (ParamsErrorBox.css("display")==="none") {
//									ParamsErrorBox.slideDown();
//								}
//						 	};
//						    var data ='rule_id='+ruleId;
//						    new H.widget.asyncRequest().setURI(deleteRuleUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
//					})
//					Event.on('#cancel','click',function(ev){
//						ev.preventDefault();
//						promotionControl.msg.hide();
//					})
//			  });
					
				},

				/*活动保存 验证*/
				save : function() {
						ParamsErrorBox = KISSY.one('#J_ParamsErrorBox');
						var groupName = document.getElementsByName('group_name');
						if(groupName[0].value == ''){
							result = '分组名称不能为空';
							DOM.html('#J_ParamsErrorMsg',result);
							if (ParamsErrorBox.css("display")==="none") {
								ParamsErrorBox.slideDown();
							}
							return ;
						}
						//参数验证
						var minCount = DOM.val('#J_MinCount');
						var maxCount = DOM.val('#J_MaxCount');
						if(minCount || maxCount ){
							if ((isNaN(Number(minCount)) == true || minCount<0 ) || (isNaN(Number(maxCount)) == true || minCount<0)) {
								DOM.html('#J_ParamsErrorMsg','交易次数要大于0');
								if (ParamsErrorBox.css("display")==="none") {
									ParamsErrorBox.slideDown();
								}
								return  error=true;
							}
						};
						var minItems = DOM.val('#J_MinItems');
						var maxItems = DOM.val('#J_MaxItems');
						if(minItems || maxItems ){
							if ((isNaN(Number(minItems)) == true || minItems<0 ) || (isNaN(Number(maxItems)) == true || maxItems<0)) {
								DOM.html('#J_ParamsErrorMsg','商品件数要大于0');
								if (ParamsErrorBox.css("display")==="none") {
									ParamsErrorBox.slideDown();
								}
								return  error=true;
							}
						};						
						var minAmount = DOM.val('#J_MinAmount');
						var maxAmount = DOM.val('#J_MaxAmount');
						if(minAmount || maxAmount ){
							result = H.util.checkPrice(minAmount);
							result1 = H.util.checkPrice(minAmount);
							error = result[0];
							error1 = result1[0];
							msg = result[1];
							if(error || error1){
								DOM.html('#J_ParamsErrorMsg',result[1]);
								if (ParamsErrorBox.css("display")==="none") {
									ParamsErrorBox.slideDown();
								}
								return ;
							}
						};
						var minAvg = DOM.val('#J_MinAvgPrice');
						var maxAvg = DOM.val('#J_MaxAvgPrice');
						if(minAvg || maxAvg ){
							result = H.util.checkPrice(minAvg);
							result1 = H.util.checkPrice(maxAvg);
							error = result[0];
							error1 = result1[0];
							msg = result[1];
							if(error || error1){
								DOM.html('#J_ParamsErrorMsg',result[1]);
								if (ParamsErrorBox.css("display")==="none") {
									ParamsErrorBox.slideDown();
								}
								return ;
							}
						};
						var minClose = DOM.val('#J_MinCloseNum');
						var maxClose= DOM.val('#J_MaxCloseNum');						
						if(minClose || maxClose ){

							if ((isNaN(Number(minClose)) == true || minClose<0 ) || (isNaN(Number(maxClose)) == true || maxClose<0)) {
								DOM.html('#J_ParamsErrorMsg','交易关闭数要大于0');
								if (ParamsErrorBox.css("display")==="none") {
									ParamsErrorBox.slideDown();   
								}
								return ;
							}
						};
							var Grade = DOM.val('#J_Grade');
							var MinCount = DOM.val('#J_MinCount')
							var MaxCount = DOM.val('#J_MaxCount');
							var MinAmount = DOM.val('#J_MinAmount');
							var MaxAmount = DOM.val('#J_MaxAmount');
							var MinAvgPrice = DOM.val('#J_MinAvgPrice');
							var MaxAvgPrice = DOM.val('#J_MaxAvgPrice');
							var MinCloseNum = DOM.val('#J_MinCloseNum');
							var MaxCloseNum = DOM.val('#J_MaxCloseNum');
							var StartDate = DOM.val('#J_StartDate');
							var EndDate = DOM.val('#J_EndDate');
							var minItems = DOM.val('#J_MinItems');
							var maxItems = DOM.val('#J_MaxItems');
							var Source = DOM.val('#J_Source');
							var flag = Grade+MinCount+MaxCount+MinAmount+MaxAmount+MinAvgPrice+MaxAvgPrice+MinCloseNum+MaxCloseNum+StartDate+EndDate+minItems+maxItems+Source;
							if(flag == "" || flag == 0){
					 			DOM.html('#J_ParamsErrorMsg','请至少填写一个条件！');
								if (ParamsErrorBox.css("display")==="none") {
									ParamsErrorBox.slideDown();
								}
								return
							}			
						var sucessHandle = function(o) {
							ParamsErrorBox.hide();
				 			ParamsSucessBox = KISSY.one('#J_ParamsSucessBox')
				 			DOM.html('#J_ParamsSucessMsg',o.desc);
							if (ParamsSucessBox.css("display")==="none") {
								ParamsSucessBox.slideDown();
							}
							//DOM.scrollIntoView('#J_ParamsSucessMsg',window);
				 			window.location.href=successUrl;
				 		};
				 		var errorHandle = function(o){
				 			DOM.html('#J_ParamsErrorMsg',o.desc);
							if (ParamsErrorBox.css("display")==="none") {
								ParamsErrorBox.slideDown();
							}
							 //DOM.scrollIntoView('#J_ParamsErrorMsg',window);
				 		};
				 		var data = '';
				  	    new H.widget.asyncRequest().setURI(editorSaveUrl).setMethod("POST").setForm('#promotion_edit_form').setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
						//return true;
			    	}				

	}
}, {
    requires: ['bui/select','utils/beautifyForm/index','bui/calendar']
});