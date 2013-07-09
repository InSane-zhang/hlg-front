/*
combined files : 

page/mods/check
page/addscp-init

*/
   		 
/**
 * @fileOverview 
 * @author  
 */
KISSY.add('page/mods/check',function (S) {
    // your code here
	
	return checkUtil = {
			/*违禁词限制*/
			checkSpecTitle : function(str){
				var result = [];
				var error = false;
				var msg = null;
				var re =/(淘宝)|(限时折扣)|(限时打折)|(良品)|(淘金币)|(天天特价)|(满就送)/i;
				if(re.test(str)){
				    var rt = re.exec(str);
				    if(rt != null){
						error = true;
						msg = '含有违禁字'+rt[0]+'！';
					}
				}
				result.push(error);
				result.push(msg);
				return result;
			},
			/*验证活动名称*/
			checkPromoName : function(promoName){
				var result = [];
				var error = false;
				var msg = null;
				var re=/^[\u4E00-\u9FA5\uf900-\ufa2d\A-Za-z0-9]{2,5}$/;
				if(!re.test(promoName)){
					if(promoName.length<2 || promoName.length >5){
						error = true;
						msg = '长度2~5个字符！';
					}else {
						var reg=/[^\u4E00-\u9FA5\uf900-\ufa2d\A-Za-z0-9]+/;
						var rt = promoName.match(reg);
						if(rt != null){
							error = true;
							msg = '含有非法字符'+rt[0]+'！';
						}
					}
				}
				result.push(error);
				result.push(msg);
				return result;
			},
			/*验证活动备注*/
			checkPromoDesc : function(promoDesc){
				var result = [];
				var error = false;
				var msg = null;
				var re=/^[\u4E00-\u9FA5\uf900-\ufa2d\w\s\，！。《》（）、—]{0,30}$/;
				if(!re.test(promoDesc)){
					if(promoDesc.length>30){
						error = true;
						msg = '长度30个字以内！';
					}else {
						var reg=/[^\u4E00-\u9FA5\uf900-\ufa2d\w\s\，！。《》（）、—]+/;
						var rt = promoDesc.match(reg);
						if(rt != null){
							error = true;
							msg = '含有非法字符'+rt[0]+'！';
						}
					}
				}
				result.push(error);
				result.push(msg);
				return result;
			},
			/*URL验证*/
			checkUrl : function(v){
				var result = [];
				var error = false;
				var msg = null;
				var reUrl = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/ ;
				if(!reUrl.test(v)){
						error = true;
						msg = '非法URl地址！';
				}
				result.push(error);
				result.push(msg);
				return result;
			},
			/*折扣验证*/
			checkDiscount : function(v){
				var result = [];
				var error = false;
				var msg = null;
				if(isNaN(Number(v)) || v <= 0 || v >=10){
					error = true;
					msg = '折扣范围在 0.00~9.99之间哦！';
				}else {
					var re = /(^[0-9]([.][0-9]{1,2})?$)|(^1[0-9]([.][0-9]{1,2})?$)|(^2[0-3]([.][0-9]{1,2})?$)|(^10([.]0{1,2})?$)/;
					if(!re.test(v)){
						error = true;
						msg = '折扣范围在 0.00~9.99之间哦！';
					}
				}
				result.push(error);
				result.push(msg);
				return result;
			}
		
		
	}
});
/**
 * @fileOverview 
 * @author  
 */
KISSY.add('page/addscp-init',function (S,checkUtil) {
    // your code here
    var DOM = S.DOM, Event = S.Event;
	
	return promotionControl ={
		
			isEidt : promotionForm.id.value != '0' ? true: false,
			isChange : false,   
			msg : null,
			NameError : false,
			DescError : false,
			rule_num : 0,
			ids : [0],
			ruleMsg :false,
			free_post_areasId :[],
			free_post_areasName :[],
			free_post_num :[],
			free_post_name : [],
			ladders:[0],
			ladder_num : 0,
			groupRule:[],
			groupRule_num : 0,
			carouselAll :null,
			carouselPart : null,
			init : function(){
				
				//处理 input 状态
				promotionControl.handleInputs();
				//初始化 日历
				if(S.one("#J_startDate")){
					myCalendar('J_startDate',new Date(2038,11,29,00,00,00));
				}
				if(S.one("#J_endDate")){
					myCalendar('J_endDate',new Date(2038,11,29,00,00,00));
				}
				
				if(promotionControl.isEidt){
					var typeId = DOM.val('#J_TypeId');
						var levels = DOM.val(DOM.get('#J_ids'));
						promotionControl.rule_num =levels - 1 ;
						promotionControl.ids = [];
						for(var m = 0;m<levels;m++){
							promotionControl.ids.push(m);
							promotionControl.mini(m);
						}
					}
				//详情预览
				Event.delegate(document,'click','#J_PreviewDesc', function(ev) {
					 promotionControl.save('preview');
				});
				if(S.one('#J_IsRestart')){
					promotionControl.isChange = true;
				}
				//  活动保存 
				var timeFunName = null;
				Event.on('#J_BtnPublish','click dblclick',function(ev){
					if(!promotionControl.isChange && promotionControl.isEidt){
						window.location.href = nextTargerUrl;
						return ;
					}
					if(ev.type == 'click'){
			        	 clearTimeout(timeFunName);
			        	 timeFunName = setTimeout(function () {
			          		 var diff  = IsExpired();
			       			 if(diff > -5000){
			      					var sucessHandle = function(o) {
			      						promotionControl.save();
			      			 		};
			      			 		var errorHandle = function(o){
			      			 			KISSY.Event.fire('.J_TopExpired','click');
			      			 		};
			      			 		var data = '';
			      			  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
			      				}else{
			      						promotionControl.save();
			          			}
			              }, 300); 
			    	}
			        if(ev.type == 'dblclick') {
			       	 	clearTimeout(timeFunName); 
			       	 //console.log('双击');
			       		var diff  = IsExpired();
						 if(diff > -5000 ){
								var sucessHandle = function(o) {
			  							promotionControl.save();
						 		};
						 		var errorHandle = function(o){
						 			KISSY.Event.fire('.J_TopExpired','click');
						 		};
						 		var data = '';
						  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
							}else{
								promotionControl.save();
			      			}
			        }
				})
				
				
				//打折 减钱 需要高于店铺最低折扣 提示
				Event.on('#J_focus','focus blur',function(ev){
					if(ev.type == 'focus'){
						DOM.show('#J_msg');
					}else{
						//DOM.hide('#J_msg');
					}
				})	
				
			},
			/*加载规则*/
			loadRules : function(ruleId){
				promotionControl.isChange = true;
		        if(ruleId.split('_')[1] == 1){
				    var submitHandle = function(o) {
				    	DOM.show('#J_LoadRule');
				    	DOM.html('#J_LoadRule',o.payload);
				    };
				    var errorHandle = function(o){
				    	var ParamsErrorBox = KISSY.one('#J_ParamsErrorBox');
						DOM.html('#J_ParamsErrorMsg',o.payload.desc);
						if (ParamsErrorBox.css("display")==="none") {
							ParamsErrorBox.slideDown();
						}
				 	};
				    var data ='rule_id='+ruleId.split('_')[0];
				    new H.widget.asyncRequest().setURI(loadRuleUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
		        }else{
		        	DOM.hide('#J_LoadRule');
			    }
			},
			/*新建分组*/
			addGroup : function(em){
				var typeId = promotionForm.type_id.value;
				DOM.attr('#J_SelectTagId','disabled','disabled');
				DOM.addClass('#J_GroupManage','current');
				DOM.show('#J_RemoveGroup');
				DOM.hide('#J_AddGroup');
				DOM.hide('#J_LoadRule');
				DOM.show(DOM.query('.J_GroupParams'));
				DOM.val('#J_Is_Add_Group','1');
				Event.remove('.J_ConditionType');
				Event.remove(DOM.query('.J_Rule_Del'));
				Event.on('.J_ConditionType','click',function(ev){
					var type = ev.target.value; 
					var HandelBox = KISSY.one('#J_Handel');   	
					if(type == 2 ){
						DOM.hide('#J_ParamsErrorBox');
						HandelBox.hide();
					}else{
						HandelBox.show();
    				}
				});
				Event.on(DOM.query('.J_Rule_Del'),'click',function(ev){
					var ruleId = DOM.attr(ev.currentTarget,"data");
					var rule = DOM.parent(DOM.parent(ev.currentTarget));
					new H.widget.msgBox({
					    title: "删除筛选条件",
					    content: '删除筛选条件会使与之关联的分组不再更新。 <br/>确定继续吗？',
					    type: "confirm",
					    buttons: [{ value: "确定删除" }, { value: "取消" }],
					    success: function (result) {
					        if (result == "确定删除") {
								 var submitHandle = function(o) {
						 	    	DOM.remove(rule);
						 	    	var tbRuleNum = parseInt(DOM.val('#J_RuleTotal'));
						 	    	DOM.val('#J_RuleTotal',tbRuleNum-1);
							    };
							    var errorHandle = function(o){
							    	var ParamsErrorBox = KISSY.one('#J_ParamsErrorBox');
									DOM.html('#J_ParamsErrorMsg',o.payload.desc);
									if (ParamsErrorBox.css("display")==="none") {
										ParamsErrorBox.slideDown();
									}
							 	};
							    var data ='rule_id='+ruleId;
							    new H.widget.asyncRequest().setURI(deleteRuleUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
					        }
					    }
					});
				});
				promotionControl.addGroupRule();
			},
			//取消新建分组
			removeGroup : function(){
				var typeId = promotionForm.type_id.value;
				var val = DOM.val('#J_SelectTagId');
				DOM.removeClass('#J_GroupManage','current');
				DOM.val('#J_Is_Add_Group','0');
				DOM.hide('#J_RemoveGroup');
				DOM.show('#J_AddGroup');
				DOM.hide('#J_ParamsErrorBox');
				DOM.show('#J_LoadRule');
				DOM.hide(DOM.query('.J_GroupParams'));
				DOM.attr('#J_SelectTagId','disabled',false);
			},
			//增加筛选条件  暂时 无用
			addGroupRule : function(){
				var RuleNum = promotionControl.groupRule.length;
				var tbRuleNum = DOM.val('#J_RuleTotal');
				var totalRules = parseInt(RuleNum)+parseInt(tbRuleNum);
				if(totalRules > 0){
	//				var ParamsErrorBox = KISSY.one('#J_ParamsErrorBox');
	//				DOM.html('#J_ParamsErrorMsg','一个分组的规则为1个！');
	//				if (ParamsErrorBox.css("display")==="none") {
	//					ParamsErrorBox.slideDown();
	//				}
					return ;
				}
				promotionControl.groupRule_num++;
				for(var n = 0; n<RuleNum; n++){
					promotionControl.groupMini(promotionControl.groupRule[n]);
				}
				promotionControl.groupRule.push(promotionControl.groupRule_num);
				var a= KISSY.Template(DOM.html(DOM.get('#J_Templet_Group')));
				var data = {num:promotionControl.groupRule_num};
				var b =a.render(data);
				DOM.append(DOM.create(b),DOM.get('#J_AddGroupRule'));
				jtjCalendar('J_StartDate'+promotionControl.groupRule_num,promotionControl.groupRule_num,'group');
				jtjCalendar('J_EndDate'+promotionControl.groupRule_num,promotionControl.groupRule_num,'group');
				promotionControl.handleInputs();
			},
			groupMini : function(num){
				var contentBox = KISSY.one('#J_Max_Group_'+num);
				var miniBox = KISSY.one('#J_Mini_Group_'+num);
				DOM.hide(DOM.get('.suoxiao','#J_Group_'+num));
				DOM.show(DOM.get('.fangda','#J_Group_'+num));	
				//var ruleName = DOM.val('#J_RuleName_'+num) || 0;
				var ruleName = document.getElementsByName('params[group_name]')[0].value;
				var grade = DOM.val('#J_Grade_'+num) || 0;
				var minCount = DOM.val('#J_MinCount_'+num) || 0;
				var maxCount = DOM.val('#J_MaxCount_'+num) || 0;
				var minAmount = DOM.val('#J_MinAmount_'+num) || 0;
				var maxAmount = DOM.val('#J_MaxAmount_'+num) || 0;
				var minTime = DOM.val('#J_StartDate'+num) || 0;
				var maxTime = DOM.val('#J_EndDate'+num) || 0;
				var minAvg = DOM.val('#J_MinAvgPrice_'+num) || 0;
				var maxAvg = DOM.val('#J_MaxAvgPrice_'+num) || 0;
				var minClose = DOM.val('#J_MinCloseNum_'+num) || 0;
				var maxClose= DOM.val('#J_MinCloseNum_'+num) || 0;
				var gradeName = '';
				switch(grade){
					case 0:
					gradeName = '不限级别';
					break;
					case 1:
						gradeName = '普通会员';
						break;
					case 2:
						gradeName = '高级会员';
						break;
					case 3:
						gradeName = 'VIP会员';
						break;
					case 4:
						gradeName = '至尊VIP会员';
						break;			
				}
				flag = ruleName+grade+minCount+maxCount+minAmount+maxAmount+minTime+maxTime+minAvg+maxAvg+minClose+maxClose;		
				if(flag == 0){
					str ='<span style="color:#F00">未设置条件&nbsp;&nbsp;&nbsp;<a href="#2" onclick="promotionControl.groupMaxi('+num+');" >[重新编辑]</a></span>';
				}else{
	//				var Template= KISSY.Template(DOM.html(DOM.get('#J_Templet_Mjs')));
					var str = '<p>名称：'+ruleName+'，会员级别:'+gradeName+'</p>'+
								'<p>交易次数：'+minCount+' 到 '+maxCount+'</p>'+
								'<p>交易金额：'+minAmount+' 到 '+maxAmount+'</p>'+
								'<p>上次交易时间:'+minTime+' 到 '+maxTime+'</p>'+
								'<p>平均客单价：'+minAvg+' 到 '+maxAvg+'</p>'+
								'<p>交易关闭次数：'+minClose+' 到 '+maxClose+'</p>';
								
				}
				miniBox.html(str);
				if (contentBox.css("display")!="none") {
					miniBox.slideDown(0.7)
					contentBox.slideUp(0.3);
				}
			},
			groupMaxi : function(num){
				var contentBox = KISSY.one('#J_Max_Group_'+num);
				var miniBox = KISSY.one('#J_Mini_Group_'+num);
				DOM.show(DOM.get('.suoxiao','#J_Group_'+num));
				DOM.hide(DOM.get('.fangda','#J_Group_'+num));		
				if (contentBox.css("display")==="none") {
					miniBox.slideUp(0.1)
					contentBox.slideDown(0.7);
				}
			},
			groupDele : function(num){
				DOM.remove(DOM.get('#J_Group_'+num));
				for(var i =0;i<promotionControl.groupRule.length;i++){
					if(promotionControl.groupRule[i] == num){
						promotionControl.groupRule.splice(i,1);
					}
				}
			},
			/*新建分组错误查看*/
			checkGroupAction : function(num){
				for(var m = 0; m<promotionControl.groupRule.length; m++){
					if(num == promotionControl.groupRule[m]){
						promotionControl.groupMaxi(num);
					}else{
						promotionControl.groupMini(promotionControl.groupRule[m]);
					}
				}
				var $ = KISSY.Node.all;
				if(KISSY.one('#J_Group_'+num)){
					var s = KISSY.one('#J_Group_'+num).offset();
							$(window).stop();
							$(window).animate({
							scrollTop:s.top
								},1,"easeOut");
				}
				
			},
			/*新建分组参数验证*/
			checkGroupRule :function(num ,n){
				var error = false;
	//			var ruleName = DOM.val('#J_RuleName_'+num);
	//			var result = H.util.isNull(ruleName);
	//			var error = result[0];
	//			if(error){
	//				promotionControl.msg.hide();
	//				DOM.html('#J_ParamsErrorMsg',result[1]+'<a href="javascript:promotionControl.checkGroupAction('+num+')">点此修改</a>');
	//				if (ParamsErrorBox.css("display")==="none") {
	//					ParamsErrorBox.slideDown();
	//				}
	//				DOM.val('#J_RuleName_'+num, '');
	//				DOM.addClass(DOM.parent(DOM.get('#J_RuleName_'+num)), 'text-error');
	//				return  error=true;
	//			}
				var minCount = DOM.val('#J_MinCount_'+num);
				var maxCount = DOM.val('#J_MaxCount_'+num);
				if(minCount || maxCount ){
					if ((isNaN(Number(minCount)) == true || minCount<0 ) || (isNaN(Number(maxCount)) == true || minCount<0)) {
						promotionControl.msg.hide();
						DOM.html('#J_ParamsErrorMsg','交易次数大于0<a href="javascript:promotionControl.checkGroupAction('+num+')">点此修改</a>');
						if (ParamsErrorBox.css("display")==="none") {
							ParamsErrorBox.slideDown();
						}
						return  error=true;
					}
				}
				var minAmount = DOM.val('#J_MinAmount_'+num);
				var maxAmount = DOM.val('#J_MaxAmount_'+num);
				if(minAmount || maxAmount ){
					result = H.util.checkPrice(minAmount);
					result1 = H.util.checkPrice(minAmount);
					error = result[0];
					error1 = result1[0];
					msg = result[1];
					if(error || error1){
						promotionControl.msg.hide();
						DOM.html('#J_ParamsErrorMsg',result[1]+'<a href="javascript:promotionControl.checkGroupAction('+num+')">点此修改</a>');
						if (ParamsErrorBox.css("display")==="none") {
							ParamsErrorBox.slideDown();
						}
						return  error=true;
					}
				}
				var minAvg = DOM.val('#J_MinAvgPrice_'+num);
				var maxAvg = DOM.val('#J_MaxAvgPrice_'+num);
				if(minAvg || maxAvg ){
					result = H.util.checkPrice(minAvg);
					result1 = H.util.checkPrice(maxAvg);
					error = result[0];
					error1 = result1[0];
					msg = result[1];
					if(error || error1){
						promotionControl.msg.hide();
						DOM.html('#J_ParamsErrorMsg',result[1]+'<a href="javascript:promotionControl.checkGroupAction('+num+')">点此修改</a>');
						if (ParamsErrorBox.css("display")==="none") {
							ParamsErrorBox.slideDown();
						}
						return  error=true;
					}
				}
				if(minClose || maxClose ){
					var minClose = DOM.val('#J_MinCloseNum_'+num);
					var maxClose= DOM.val('#J_MinCloseNum_'+num);
					if ((isNaN(Number(minClose)) == true || minClose<0 ) || (isNaN(Number(maxClose)) == true || maxClose<0)) {
						promotionControl.msg.hide();
						DOM.html('#J_ParamsErrorMsg','宝贝件数要大于0<a href="javascript:promotionControl.checkGroupAction('+num+')">点此修改</a>');
						if (ParamsErrorBox.css("display")==="none") {
							ParamsErrorBox.slideDown();
						}
						return  error=true;
					}
				}
			
			},

			showdate : function(n, d) {
				//计算d天的前几天或者后几天，返回date,注：chrome下不支持date构造时的天溢出        
				var uom = new Date(d - 0 + n * 86400000);        
				uom = uom.getFullYear() + "/" + (uom.getMonth() + 1) + "/" + uom.getDate();        
				return new Date(uom);    
			},
			
			/* 满就送 增加层级*/
			addRule : function(){
				promotionControl.isChange = true;
				if(promotionControl.ids.length > 10){
					new H.widget.msgBox({
							    title:"错误提示",
							    content:'满就送层级不能超过10层！',
							    type:"error"
							});
					return ;
				}
				promotionControl.rule_num++;
				for(var n = 0; n<promotionControl.ids.length; n++){
					promotionControl.mini(promotionControl.ids[n]);
				}
				var a= KISSY.Template(DOM.html(DOM.get('#J_Rule')));
				var type_value = DOM.val(DOM.get('#J_con_type0')); 
				if(type_value == 1){
					type ="元";
				}else if(type_value == 0){
					type ="件";
				}
				var data = {type:type,num:promotionControl.rule_num,areas:[{areaId:'110000',name:'北京'},{areaId:'120000',name:'天津'},{areaId:'130000',name:'河北'},{areaId:'140000',name:'山西'},{areaId:'210000',name:'辽宁'},{areaId:'220000',name:'吉林'},{areaId:'310000',name:'上海'},{areaId:'320000',name:'江苏'},{areaId:'330000',name:'浙江'},{areaId:'340000',name:'安徽'},{areaId:'350000',name:'福建'},{areaId:'360000',name:'江西'},{areaId:'370000',name:'山东'},{areaId:'410000',name:'河南'},{areaId:'420000',name:'湖北'},{areaId:'430000',name:'湖南'},{areaId:'440000',name:'广东'},{areaId:'450000',name:'广西'},{areaId:'460000',name:'海南'},{areaId:'500000',name:'重庆'},{areaId:'510000',name:'四川'},{areaId:'520000',name:'贵州'},{areaId:'530000',name:'云南'},{areaId:'540000',name:'西藏'},{areaId:'610000',name:'陕西'},{areaId:'620000',name:'甘肃'},{areaId:'630000',name:'青海'},{areaId:'640000',name:'宁夏'},{areaId:'650000',name:'新疆'},{areaId:'710000',name:'台湾'},{areaId:'810000',name:'香港'},{areaId:'820000',name:'澳门'},{areaId:'990000',name:'海外'},{areaId:'230000',name:'黑龙江'},{areaId:'150000',name:'内蒙古'}]};
				promotionControl.ids.push(promotionControl.rule_num);
				var b =a.render(data);
				DOM.insertBefore(DOM.create(b),DOM.get('#J_AddRule'));
				promotionControl.handleInputs();
			},
			/*  满就送 删除层级*/
			dele : function(num){
				promotionControl.isChange = true;
				DOM.remove(DOM.get('#J_youhui_'+num));
				for(var i =0;i<promotionControl.ids.length;i++){
					if(promotionControl.ids[i] == num){
						promotionControl.ids.splice(i,1);
					}
				}
			},
			/*  满就送 放大层级*/
			maxi : function(num){
				var contentBox = KISSY.one('#J_Content_Detail_'+num);
				var miniBox = KISSY.one('#J_Mini_Detail_'+num);
				DOM.show(DOM.get('.suoxiao','#J_youhui_'+num));
				DOM.hide(DOM.get('.fangda','#J_youhui_'+num));		
				if (contentBox.css("display")==="none") {
					miniBox.slideUp(0.1)
					contentBox.slideDown(0.7);
				}
			},
			/*  满就送 缩小层级*/
			mini : function(num){
				var contentBox = KISSY.one('#J_Content_Detail_'+num);
				var miniBox = KISSY.one('#J_Mini_Detail_'+num);
				DOM.hide(DOM.get('.suoxiao','#J_youhui_'+num));
				DOM.show(DOM.get('.fangda','#J_youhui_'+num));		
				var con_type = DOM.val('#J_con_type0');
				var type = con_type == 1 ? '元' : '件';
					var con_value = DOM.val('#J_con_value_'+num) || 0 ,
					decrease_money = DOM.val('#J_decrease_money_'+num) || 0 ,
					cp_num = DOM.val('#J_cp_num_'+num),
					cp_type = DOM.val('#J_cpType_'+num),
					enable_multiple = DOM.get('#J_enable_multiple_'+num).checked,
					IsDecrease = DOM.get('#J_decrease_'+num).checked, 
					IsFreePost = DOM.get('#J_post_postage_'+num).checked,
					IsSend_cp = DOM.get('#J_send_cp_'+num).checked;
					promotionControl.checkPost(num);
					var free_post = '';
					var len = promotionControl.free_post_name.length;
					var unfree_len = promotionControl.free_post_areasName.length;
					//免邮地区比较少
					if (len<unfree_len) {
						if(len==0) {
							free_post = '，免邮地区：无'
						}else{
							free_post = '，免邮地区：' + promotionControl.free_post_name.join(',')
						}
					}else {
						if(unfree_len==0){
							free_post = '，不免邮地区：无'
						}else{
							free_post = '，不免邮地区：' + promotionControl.free_post_areasName.join(',')
						}
					}
					if (con_type == 1) {
						con_value = H.util.FormatNumber(con_value,2);
					}
					var data = {con_value:con_value, type:type, IsDecrease:IsDecrease,decrease_money:H.util.FormatNumber(decrease_money,2),cp_num:cp_num,enable_multiple:enable_multiple,IsFreePost:IsFreePost,IsSend_cp:IsSend_cp,free_post:free_post,cp_type:cp_type};
				if((con_value == 0 && IsDecrease == false && IsFreePost == false && IsSend_cp == false) || ( IsDecrease == false && IsFreePost == false && IsSend_cp == false)){
					str ='<span style="color:#F00">未设置优惠内容&nbsp;&nbsp;&nbsp;<a href="#2" onclick="promotionControl.maxi('+num+');" >[重新编辑]</a></span>';
				}else{
					var Template= KISSY.Template(DOM.html(DOM.get('#J_Templet_Mjs')));
					var str = Template.render(data);
				}
				miniBox.html(str);
				if (contentBox.css("display")!="none") {
					miniBox.slideDown(0.7)
					contentBox.slideUp(0.3);
				}
			},
			/*将checkbox 值传过去*/
			checkForm : function(){
				var checks = DOM.filter(DOM.query('input'),function(i){if(i.type =='checkbox' && DOM.hasClass(i,'J_checkForm'))return true;})
				KISSY.each(checks,function(item){
					if(item.checked == false){
						DOM.val(DOM.next(item),0);
					}else{
						DOM.val(DOM.next(item),1);
					}
				})
			},
			/*将checkbox 值传回来*/
			backCheckForm : function(){
				var checks = DOM.filter(DOM.query('input'),function(i){if(i.type =='checkbox' && DOM.hasClass(i,'J_checkForm'))return true;})
				KISSY.each(checks,function(item){
					var v = DOM.val(item);
					if(v == 1){
						item.checked = true;
					}else{
						item.checked = false;
						DOM.val(item,1);
					}
				})
			},
			/*满就送错误查看*/
			checkAction : function(num){
				for(var m = 0; m<promotionControl.ids.length; m++){
					if(num == promotionControl.ids[m]){
						promotionControl.maxi(num);
					}else{
						promotionControl.mini(promotionControl.ids[m]);
					}
				}
				var $ = KISSY.Node.all;
				if(KISSY.one('#J_youhui_'+num)){
					var s =  KISSY.one('#J_youhui_'+num).offset();
							$(window).stop();
							$(window).animate({
							scrollTop:s.top
								},1,"easeOut");
				}
			},
			/*满就送参数验证*/
			checkRule :function(num ,n){
				var error = false;
				var con_value = DOM.val('#J_con_value_'+num);
				var result = H.util.isNull(con_value);
				var error = result[0];
				if(error){
					promotionControl.msg.hide();
					DOM.html('#J_ParamsErrorMsg',result[1]+'<a href="javascript:promotionControl.checkAction('+num+')">点此修改</a>');
					if (ParamsErrorBox.css("display")==="none") {
						ParamsErrorBox.slideDown();
					}
					DOM.val('#J_con_value_'+num, '');
					//DOM.get('#J_con_value_'+num).focus();
					DOM.addClass(DOM.parent(DOM.get('#J_con_value_'+num)), 'text-error');
					return  error=true;
				}
				result = H.util.checkPrice(con_value);
				error = result[0];
				msg = result[1];
				if(error){
					promotionControl.msg.hide();
					DOM.html('#J_ParamsErrorMsg',result[1]+'<a href="javascript:promotionControl.checkAction('+num+')">点此修改</a>');
					if (ParamsErrorBox.css("display")==="none") {
						ParamsErrorBox.slideDown();
					}
					DOM.val('#J_con_value_'+num, '');
					//DOM.get('#J_con_value_'+num).focus();
					DOM.addClass(DOM.parent(DOM.get('#J_con_value_'+num)), 'text-error');
					return  error=true;
				}
				
				if(DOM.get('#J_send_cp_'+num).checked === false ){
					promotionControl.msg.hide();
					//DOM.get('#J_con_value_'+num).focus();
					DOM.html('#J_ParamsErrorMsg','层级'+(n+1)+'必须选中彩票！'+'<a href="javascript:promotionControl.checkAction('+num+')">点此修改</a>');
					if (ParamsErrorBox.css("display")==="none") {
						ParamsErrorBox.slideDown();
					}
					return  error=true;
				}
				if(DOM.get('#J_decrease_'+num).checked === false && DOM.get('#J_post_postage_'+num).checked === false){
					promotionControl.msg.hide();
					//DOM.get('#J_con_value_'+num).focus();
					DOM.html('#J_ParamsErrorMsg','层级'+(n+1)+'的优惠内容必须选中彩票+至少其他一项！'+'<a href="javascript:promotionControl.checkAction('+num+')">点此修改</a>');
					if (ParamsErrorBox.css("display")==="none") {
						ParamsErrorBox.slideDown();
					}
					return  error=true;
				}
				var con_type = DOM.val('#J_con_type0');
				if(DOM.get('#J_decrease_'+num).checked === true){
					var decrease_money = DOM.val('#J_decrease_money_'+num);
					result = H.util.checkPrice(decrease_money);
					error = result[0];
					msg = result[1];
					if(error){
						promotionControl.msg.hide();
						DOM.html('#J_ParamsErrorMsg',result[1]+'<a href="javascript:promotionControl.checkAction('+num+')">点此修改</a>');
						if (ParamsErrorBox.css("display")==="none") {
							ParamsErrorBox.slideDown();
						}
						DOM.val('#J_decrease_money_'+num, '');
						//DOM.get('#J_decrease_money_'+num).focus();
						DOM.addClass(DOM.parent(DOM.get('#J_decrease_money_'+num)), 'text-error');
						return  error=true;
					}
					if(con_type == 1){
						var isOver = con_value-decrease_money;
						if(isOver <=0){
							promotionControl.msg.hide();
							DOM.html('#J_ParamsErrorMsg','层级'+(n+1)+'满'+con_value+'元减'+decrease_money+'元后总价等于'+isOver+'小于0<a href="javascript:promotionControl.checkAction('+num+')">点此修改</a>');
							if (ParamsErrorBox.css("display")==="none") {
								ParamsErrorBox.slideDown();
							}
							DOM.val('#J_decrease_money_'+num, '');
							DOM.addClass(DOM.parent(DOM.get('#J_decrease_money_'+num)), 'text-error');
							return  error=true;
						}
					}
				}
				if(DOM.get('#J_send_cp_'+num).checked === true){
						var cp_num = DOM.val('#J_cp_num_'+num);
						var result = H.util.isNull(cp_num);
						var error = result[0];
						if(error){
							promotionControl.msg.hide();
							DOM.html('#J_ParamsErrorMsg',result[1]+'<a href="javascript:promotionControl.checkAction('+num+')">点此修改</a>');
							if (ParamsErrorBox.css("display")==="none") {
								ParamsErrorBox.slideDown();
							}
							DOM.addClass(DOM.get('#J_cp_num_'+num), 'text-error');
							return  error=true;
						}
						var str = KISSY.trim(DOM.val('#J_CareBox_'+num));
						var len = str.replace(/[^\x00-\xff]/g,"**").length;
						if(len > 40){
							promotionControl.msg.hide();
							DOM.html('#J_ParamsErrorMsg','彩票赠言不能超过40个字符<a href="javascript:promotionControl.checkAction('+num+')">点此修改</a>');
							if (ParamsErrorBox.css("display")==="none") {
								ParamsErrorBox.slideDown();
							}
							return  error=true;
						}
				}
				if(DOM.get('#J_post_postage_'+num).checked === true){
					promotionControl.checkPost(num);
					if(promotionControl.free_post_num.length == 0){
						var str = "层级"+(n+1)+"免邮地区未设置！";
						promotionControl.msg.hide();
						DOM.html('#J_ParamsErrorMsg',str+'<a href="javascript:promotionControl.checkAction('+num+')">点此修改</a>');
						if (ParamsErrorBox.css("display")==="none") {
							ParamsErrorBox.slideDown();
						}
						//DOM.get('#J_post_postage_'+num).focus();
						return error=true;
					}
					DOM.val('#J_free_post_areasId'+num ,promotionControl.free_post_areasId);
					DOM.val('#J_free_post_areasName'+num ,promotionControl.free_post_areasName);
				}
				return  error;
	
			},
			/*免邮设置判断*/
			checkPost : function(num){
				promotionControl.free_post_areasId =[],promotionControl.free_post_areasName =[];promotionControl.free_post_num =[],promotionControl.free_post_name=[];
				var ex_ids = DOM.query('#J_youhui_'+num+' .J_ex_id');
				var ex_names = DOM.query('#J_youhui_'+num+' .J_ex_name');
				KISSY.each(ex_ids,function(it){
					if(!it.disabled){
						promotionControl.free_post_areasId.push(DOM.val(it));
					}else{
						promotionControl.free_post_num.push(DOM.val(it));
					}
				})
				KISSY.each(ex_names,function(item){
					if(!item.disabled){
						promotionControl.free_post_areasName.push(DOM.val(item));
					}else{
						promotionControl.free_post_name.push(DOM.val(item));
					}
				})
			},
			checkTitleLen : function(str,num){
				var len = str.replace(/[^\x00-\xff]/g, "*").length ;
				DOM.html(DOM.get('#J_Zs_Num'+num), len);
			
			},
			/*是否签订彩票协议*/
			checkCpAgreement : function(el){
				if(DOM.val('#J_IsSign') == 1){
					return ;
				}
				DOM.prop(el,'checked',false);
			    var submitHandle = function(o) {
			    	if(o.payload.sign){
			    		DOM.val('#J_IsSign','1');
			    		DOM.prop(el,'checked',true);
				    }else{
						new H.widget.msgBox({
								    title:"签订协议",
								    content:'请先开通<a href="'+o.payload.sign_url+'" target="_blank">支付宝代购协议</a>',
								    type:"info"
									
								});
				    	DOM.val('#J_IsSign','0');
					}
			    };
			    var errorHandle = function(o){
			    	var ParamsErrorBox = KISSY.one('#J_ParamsErrorBox');
					DOM.html('#J_ParamsErrorMsg',o.desc);
					if (ParamsErrorBox.css("display")==="none") {
						ParamsErrorBox.slideDown();
					}
			 	};
			    var data ='';
			    new H.widget.asyncRequest().setURI(checkSignUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
	
			},
			/*宝贝数 是否超过 3000*/
			checkTbItemNum : function(el){
				if(DOM.val('#J_RangeTypeValue') != 'ALL'){
					if(el.checked){
						DOM.show('#J_PromodescBox');
					}else{
						DOM.hide('#J_PromodescBox');
					}
					return ;
				}
				if(DOM.val('#J_TbItemsNum') == 1){
					var num = DOM.val('#J_TbItemsTotalNum');
					new H.widget.msgBox({
								    title:"温馨提示",
								    content:'宝贝数 0~1000才能使用全店详情模板，您店铺总共'+num+'个宝贝。',
								    type:"info"
									
								});
			    	DOM.prop(el,'checked',false);
			    	DOM.hide('#J_PromodescBox');
					return ;
				}
				if(DOM.val('#J_TbItemsNum') == 9999){
					if(el.checked){
						DOM.show('#J_PromodescBox');
					}else{
						DOM.hide('#J_PromodescBox');
					}
					return ;
				}
				DOM.prop(el,'checked',false);
			    var submitHandle = function(o) {
			    	if(o.payload.num >3000 || o.payload.num == 0){
						new H.widget.msgBox({
								    title:"温馨提示",
								    content:'宝贝数 0~1000才能使用全店详情模板，您店铺总共'+o.payload.num+'个宝贝。',
								    type:"info"
									
								});
				    	DOM.val('#J_TbItemsNum',1);
				    	DOM.prop(el,'checked',false);
				    	DOM.hide('#J_PromodescBox');
				    }else{
				    	DOM.prop(el,'checked',true);
				    	DOM.val('#J_TbItemsNum',9999);
					}
			    	DOM.val('#J_TbItemsTotalNum',o.payload.num)
			    };
			    var errorHandle = function(o){
			    	var ParamsErrorBox = KISSY.one('#J_ParamsErrorBox');
					DOM.html('#J_ParamsErrorMsg',o.payload.desc);
					if (ParamsErrorBox.css("display")==="none") {
						ParamsErrorBox.slideDown();
					}
			 	};
			    var data ='';
			    new H.widget.asyncRequest().setURI(getTbItemsNumUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
	
			},
			
			/*活动保存 验证*/
			save : function(type) {
				if(type == 'preview'){
					promotionControl.msg = {
						hide : function(){
							
						}
					}
				}else{
					promotionControl.msg = null;
					promotionControl.msg = new H.widget.msgBox({
								    title:"",
									dialogType : 'loading',
								    content:'正在保存中，请稍候'	
								});
				}
				var promoName = promotionForm.promo_name.value;
				var promoDesc = promotionForm.promo_desc.value;
				promotionControl.PromoNameAction(promoName);
				if(promotionControl.NameError == true){
					promotionControl.msg.hide();
					return ;
				}
				//备注删除
//				promotionControl.PromoDescAction(promoDesc);
//				if(promotionControl.DescError == true){
//					promotionControl.msg.hide();
//					return ;
//				}
				ParamsErrorBox = KISSY.one('#J_ParamsErrorBox');
				ParamsErrorBox.hide();
				var typeId = promotionForm.type_id.value;
				if(S.one("#J_startDate")){
					var startDate = DOM.val('#J_startDate');
					var endDate = S.one('#J_endDate').val();
					if((endDate!='')&&(startDate>=endDate)){
						promotionControl.msg.hide();
						DOM.html('#J_ParamsErrorMsg','开始时间不能大于结束时间，请重新选择');
						if (ParamsErrorBox.css("display")==="none") {
							ParamsErrorBox.slideDown();
						}
						DOM.addClass('#J_startDate','text-error');
						return ;
					}
				}
				if(S.one("#J_endDate")){
					var endDate = S.one('#J_endDate').val();
					var n = new Date()
					var nowDate = new Date(n.getTime()+ (Number(DiffTime)));
					var startTime = H.util.StringToDate(S.one('#J_startDate').val());
					var endTime = H.util.StringToDate(endDate);
					var invalidate =H.util.StringToDate(invaliDate);

					if(endTime.getTime() <= nowDate.getTime() || endTime.getTime()<=startTime ){
						promotionControl.msg.hide();
						DOM.html('#J_ParamsErrorMsg','结束时间不能小于开始时间，请重新选择');
						if (ParamsErrorBox.css("display")==="none") {
							ParamsErrorBox.slideDown();
						}
						DOM.addClass('#J_endDate','text-error');
						return ;
					}
				}
						
				switch(typeId) {
					
						case '207':
						case '208':
						case '217':
							for(var n = 0; n<promotionControl.ids.length; n++){
								var flag = promotionControl.checkRule(promotionControl.ids[n] ,n);
								if(flag == true){
									return ;
								}
								if(n>0){
									var con_value_pre = DOM.val('#J_con_value_'+promotionControl.ids[n-1]);
									var con_value_now = DOM.val('#J_con_value_'+promotionControl.ids[n]);
									if(Number(con_value_pre)-Number(con_value_now) >=0){
										promotionControl.msg.hide();
										var str = "层级"+(n+1)+"满多少要大于层级"+n+'！';
										for(var m = 0; m<promotionControl.ids.length; m++){
											promotionControl.mini(promotionControl.ids[m]);
										}
										promotionControl.maxi(promotionControl.ids[n]);
										DOM.html('#J_ParamsErrorMsg',str+'<a href="javascript:promotionControl.checkAction('+promotionControl.ids[n]+')">点此修改</a>');
										if (ParamsErrorBox.css("display")==="none") {
											ParamsErrorBox.slideDown();
										}
										DOM.addClass(DOM.parent(DOM.get('#J_con_value_'+promotionControl.ids[n])), 'text-error');
										return ;
									}
								}
							}
							break;
						default:break;
				}
				if(isMbb || typeId == 2){
					/*验证新建分组*/
					var isAddGroup = DOM.val('#J_Is_Add_Group');
					if(isAddGroup == 1){
						var groupName = document.getElementsByName('params[group_name]');
						var result = H.util.isNull(groupName[0].value);
						var error = result[0];
						if(error){
							promotionControl.msg.hide();
							DOM.html('#J_ParamsErrorMsg',result[1]);
							if (ParamsErrorBox.css("display")==="none") {
								ParamsErrorBox.slideDown();
							}
							groupName[0].value = '';
							groupName[0].focus();
							DOM.addClass(groupName[0], 'text-error');
							return ;
						}
						var conditionType = document.getElementsByName('params[group_type]');
						if(conditionType[0].checked){
							for(var n = 0; n<promotionControl.groupRule.length; n++){
								var flag = promotionControl.checkGroupRule(promotionControl.groupRule[n] ,n);
								if(flag == true){
									return ;
								}
							}
						}
					}
				}
				
				if(typeId == '207' || typeId == '208' || typeId == '217'){
					if(type != 'preview'){
						for(var m = 0; m<promotionControl.ids.length; m++){
							DOM.attr('#J_youhui_'+promotionControl.ids[m]+' .J_ex_id', 'disabled', true);
							DOM.attr('#J_youhui_'+promotionControl.ids[m]+' .J_ex_name', 'disabled', true);
						}	
					}
					promotionControl.checkForm();
				}
				
				DOM.get('#J_startDate').disabled = false;
				DOM.get('#J_endDate').disabled = false;
				if(promotionControl.isEidt){
					
		           if(type == 'preview'){
		        	   var temId = DOM.val('#J_ProtoId');
			  			var sucessHandle = function(o) {
			  				ParamsErrorBox.hide();
					    	DOM.html(DOM.get('#J_PreviewBox_'+temId),o.payload.body);
					       	DOM.height(DOM.parent('#J_PreviewBox_'+temId, '.J_Height'),DOM.height(DOM.get('#J_PreviewBox_'+temId+' table')));
		
					      if(prodescTempleteId){
						  		if(!DOM.prop('#J_IsPromodesc','checked')){
					       			DOM.hide('#J_PromodescBox');
						    	}
						  }
						};
						var errorHandle = function(o){
							promotionControl.msg.hide();
				 			if(o.desc == 'need-oauth'){
								 KISSY.Event.fire('.J_TopExpired','click');
								 return ;
							}
							DOM.html('#J_ParamsErrorMsg',o.desc);
							if (ParamsErrorBox.css("display")==="none") {
								ParamsErrorBox.slideDown();
							}
							 DOM.scrollIntoView('#J_ParamsErrorMsg',window);
							
						};
						var data ='';
					    new H.widget.asyncRequest().setURI(privewPromodescUrl).setMethod("POST").setForm('#promotion_edit_form').setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
				  	}else{
						var sucessHandle = function(o) {
				 			promotionControl.msg.hide();
				 			ParamsErrorBox.hide();
				 			ParamsSucessBox = KISSY.one('#J_ParamsSucessBox')
				 			DOM.html('#J_ParamsSucessMsg',o.desc);
							if (ParamsSucessBox.css("display")==="none") {
								ParamsSucessBox.slideDown();
							}
							DOM.scrollIntoView('#J_ParamsSucessMsg',window);
				 			window.location.href= sucessTargerUrl+'&pid='+o.pid;
				 		};
				 		var errorHandle = function(o){
				 			promotionControl.msg.hide();
				 			if(o.desc == 'need-oauth'){
								 KISSY.Event.fire('.J_TopExpired','click');
								 return ;
							}
							DOM.html('#J_ParamsErrorMsg',o.desc);
							if (ParamsErrorBox.css("display")==="none") {
								ParamsErrorBox.slideDown();
							}
							 DOM.scrollIntoView('#J_ParamsErrorMsg',window);
							
				 		};
				 		var data = '';
				  	    new H.widget.asyncRequest().setURI(editorSaveUrl).setMethod("POST").setForm('#promotion_edit_form').setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
				  	}
	          }else{
			  		if(type == 'preview'){
			  			var temId = DOM.val('#J_ProtoId');
			  			var sucessHandle = function(o) {
					    	DOM.html(DOM.get('#J_PreviewBox_'+temId),o.payload.body);
					    	DOM.height(DOM.parent('#J_PreviewBox_'+temId, '.J_Height'),DOM.height(DOM.get('#J_PreviewBox_'+temId+' table')));
						};
						var errorHandle = function(o){
							promotionControl.msg.hide();
				 			if(o.desc == 'need-oauth'){
								 KISSY.Event.fire('.J_TopExpired','click');
								 return ;
							}
							DOM.html('#J_ParamsErrorMsg',o.desc);
							if (ParamsErrorBox.css("display")==="none") {
								ParamsErrorBox.slideDown();
							}
							 DOM.scrollIntoView('#J_ParamsErrorMsg',window);
						};
						var data ='';
					    new H.widget.asyncRequest().setURI(privewPromodescUrl).setMethod("POST").setForm('#promotion_edit_form').setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
	
			  		}else{
				  		var sucessHandle = function(o) {
				 			promotionControl.msg.hide();
				 			ParamsErrorBox.hide();
				 			ParamsSucessBox = KISSY.one('#J_ParamsSucessBox')
				 			DOM.html('#J_ParamsSucessMsg','成功创建活动！');
							if (ParamsSucessBox.css("display")==="none") {
								ParamsSucessBox.slideDown();
							}
							DOM.scrollIntoView('#J_ParamsSucessMsg',window);
							window.location.href=o.desc;
				 			
				 		};
				 		var errorHandle = function(o){
				 			promotionControl.msg.hide();
				 			if(o.desc == 'need-oauth'){
								 KISSY.Event.fire('.J_TopExpired','click');
								 return ;
							}
							DOM.html('#J_ParamsErrorMsg',o.desc);
							if (ParamsErrorBox.css("display")==="none") {
								ParamsErrorBox.slideDown();
							}
							 DOM.scrollIntoView('#J_ParamsErrorMsg',window);
				 		};
				 		var data = '';
				  	    new H.widget.asyncRequest().setURI(SaveUrl).setMethod("POST").setForm('#promotion_edit_form').setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
				  	}
			  }
				return true;
		    },
			/*活动名称 验证*/
			PromoNameAction : function(name){
				var result = H.util.isNull(name);
				var error = result[0];
				var msg = result[1];
				if(error){
					DOM.addClass(promotionForm.promo_name,'text-error');
					DOM.html('#J_PromoNameError',msg);
					DOM.hide('#J_PromoNameRequired');
					DOM.hide('#J_PromoNameSucess');
					DOM.show('#J_PromoNameError');
					return promotionControl.NameError = true;
				}
				result = checkUtil.checkSpecTitle(name);
				error = result[0];
				msg = result[1];
				if(error){
					DOM.addClass(promotionForm.promo_name,'text-error');
					DOM.html('#J_PromoNameError',msg);
					DOM.hide('#J_PromoNameRequired');
					DOM.hide('#J_PromoNameSucess');
					DOM.show('#J_PromoNameError');
					return promotionControl.NameError = true;
				}
				var typeId = DOM.val('#J_TypeId');
				if(typeId == '2' || typeId == '9' || typeId == '20' || typeId == '22' || typeId == '32'){
					result = checkUtil.checkPromoName(name);
					error = result[0];
					msg = result[1];
					if(error){
						DOM.addClass(promotionForm.promo_name,'text-error');
						DOM.html('#J_PromoNameError',msg);
						DOM.hide('#J_PromoNameRequired');
						DOM.hide('#J_PromoNameSucess');
						DOM.show('#J_PromoNameError');
						return promotionControl.NameError = true;
					}
				}
				DOM.removeClass(promotionForm.promo_name,'text-error');
				DOM.hide('#J_PromoNameRequired');
				DOM.show('#J_PromoNameSucess');
				DOM.hide('#J_PromoNameError');
				return promotionControl.NameError = false;
			},
			/*活动备注 验证*/
			PromoDescAction : function(desc){
				var result = H.util.isNull(desc);
				var error = result[0];
				var msg = result[1];
				if(!error){
					result = checkUtil.checkPromoDesc(desc);
					error = result[0];
					msg = result[1];
					if(error){
						DOM.addClass(promotionForm.promo_desc,'text-error');
						DOM.html('#J_PromoDescError',msg);
						DOM.hide('#J_PromoDescRequired');
						DOM.hide('#J_PromoDescSucess');
						DOM.show('#J_PromoDescError');
						return promotionControl.DescError = true;
					}
					result = checkUtil.checkSpecTitle(desc);
					error = result[0];
					msg = result[1];
					if(error){
						DOM.addClass(promotionForm.promo_desc,'text-error');
						DOM.html('#J_PromoDescError',msg);
						DOM.hide('#J_PromoDescRequired');
						DOM.hide('#J_PromoDescSucess');
						DOM.show('#J_PromoDescError');
						return promotionControl.DescError = true;
					}
				}
				DOM.removeClass(promotionForm.promo_desc,'text-error');
				DOM.hide('#J_PromoDescRequired');
				DOM.show('#J_PromoDescSucess');
				DOM.hide('#J_PromoDescError');
				return promotionControl.DescError = false;
			},
			//选择免邮区 或 不免邮区
			turnCheck :function(obj, id,num){
				var checkMethod = DOM.val('#J_check_method'+num);
				var typeId = DOM.val('#J_TypeId');
				if ('1'==checkMethod) { //选择免邮地区
					if (obj.checked) {
						DOM.show('#J_in_span_'+id+'_'+num);
						DOM.attr('#J_ex_id_'+id+'_'+num, 'disabled', true);
						DOM.attr('#J_ex_name_'+id+'_'+num, 'disabled', true);
					} else {
						DOM.hide('#J_in_span_'+id+'_'+num);
						DOM.removeAttr('#J_ex_id_'+id+'_'+num, 'disabled');
						DOM.removeAttr('#J_ex_name_'+id+'_'+num, 'disabled');
					}
				} else {
					if (obj.checked) {
						DOM.show('#J_ex_span_'+id+'_'+num);
						DOM.removeAttr('#J_ex_id_'+id+'_'+num, 'disabled');
						DOM.removeAttr('#J_ex_name_'+id+'_'+num, 'disabled');
					} else {
						DOM.hide('#J_ex_span_'+id+'_'+num);
						DOM.attr('#J_ex_id_'+id+'_'+num, 'disabled', true);
						DOM.attr('#J_ex_name_'+id+'_'+num, 'disabled', true);
					}
				}
				return
			},
			//选择免邮区 或 不免邮区
			turnCheckMethod : function(checkMethod,num){
				DOM.attr('#J_youhui_'+num+' .J_check_areas', 'checked', false);
				DOM.hide('#J_youhui_'+num+' .J_in_span');
				DOM.hide('#J_youhui_'+num+' .J_ex_span');
				DOM.val('#J_check_method'+num, checkMethod);
				if ('1'==checkMethod) { //选择免邮地区
					DOM.removeAttr('#J_youhui_'+num+' .J_ex_id', 'disabled');
					DOM.removeAttr('#J_youhui_'+num+' .J_ex_name', 'disabled');
					
					DOM.html('#J_freepost_tip'+num, '免邮区域：');
					DOM.show('#J_include_title'+num);
					DOM.hide('#J_exclude_title'+num);
				} else {
					DOM.attr('#J_youhui_'+num+' .J_ex_id', 'disabled', true);
					DOM.attr('#J_youhui_'+num+' .J_ex_name', 'disabled', true);
					
					DOM.html('#J_freepost_tip'+num, '不免邮区域：');
					DOM.hide('#J_include_title'+num);
					DOM.show('#J_exclude_title'+num);
				}
			},
			//优惠对象提示 
			showTip :function(){
				if(DOM.val('#J_SelectTagId')!=1){
					if(DOM.val('#J_SelectTagId')!=1){
						DOM.html('#J_IsAllMemberContent','非全网会员，搜索页会显示原价');
						DOM.show('#J_IsAllMemberContent');
					}
					DOM.val('#J_Show_yj',1);
				}else{
					DOM.hide('#J_IsAllMemberContent');
					DOM.val('#J_Show_yj',0);
				}
			},
			handleInputs : function(){
				var inputs = DOM.filter (DOM.query('input'),function(i){if(i.type =='text')return true;})
				Event.on(inputs,'focus blur',function(ev){
					if(ev.type == 'focus'){
						if(DOM.hasClass(ev.target,'input-none')){
							DOM.removeClass(DOM.parent(ev.target),'input-text text text-error');
							DOM.addClass(DOM.parent(ev.target),'input-text-on');
						}else{
							DOM.removeClass(ev.target,'input-text text text-error');
							DOM.addClass(ev.target,'input-text-on');
						}
					} else if(ev.type == 'blur'){
						if(DOM.hasClass(ev.target,'input-none')){
							DOM.removeClass(DOM.parent(ev.target),'input-text-on');
							DOM.addClass(DOM.parent(ev.target),'input-text');
						}else{
							DOM.removeClass(ev.target,'input-text-on');
							DOM.addClass(ev.target,'input-text');
						}
					}
				})
			},
				//上不封顶提醒
			showMjsTip :function(num){
				if(DOM.prop('#J_enable_multiple_'+num,'checked')){
					var max = Number(DOM.val('#J_con_value_'+num))*2;
					var type = DOM.val('#J_con_type0') == 1 ?  '元' : '件';
					//var zhu =  Number(DOM.val('#J_cp_num_'+num))*2;
					var str = '消费满'+max+type+'会送出双倍，依此类推 ';
					DOM.html('#J_OneWarn'+num,str);
					DOM.show('#J_OneWarn'+num);
				}else{
					DOM.hide('#J_OneWarn'+num);
				}
			}
	}
	
	
	
}, {
    requires: ['./mods/check']
});
