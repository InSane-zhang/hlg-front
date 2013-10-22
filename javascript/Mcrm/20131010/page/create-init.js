/*
combined files : 

utils/beautifyForm/index
page/create-init

*/
/**
 * @美化按钮组件
 * @author  @sjs_stef
 */
KISSY.add('utils/beautifyForm/index',function (S) {
	var DOM = S.DOM, Event = S.Event,
	    d = document,
	    body = DOM.get('body'),
		safari = false;
		if(S.UA.safari != 'undefined' && S.UA.safari < 3){
			 safari = true;
		}
	if(S.UA.ie == 6){
		DOM.replaceClass('#J_BodyHtml','has-js','no-js');
	}	
	
	function beautifyForm(el, cfg) { //初始化属性 
	    var self = this; 
	    defaultCfg = {
	        init:true
	    };
	    if(self instanceof beautifyForm) {
	        var config = S.merge(defaultCfg, cfg);
	        self._init(el, config);
	    } else {
	        return new beautifyForm(el, cfg);
	    }
	}
	S.augment(beautifyForm,{
	    _init : function(target, cfg) {
	        var self = this;
//	        if(!target) {
//	            S.log('请输入需要渲染区域的id(_init)');
//	            return;
//	        }
	        self.renderAll(target);
	    },
	    //渲染pid下全部input，自动判断类型
	    renderAll: function(pid){
	        var self = this;
	        pid = typeof(pid) == 'undefined' ? '#J_BodyHtml': pid;
	        var al = DOM.filter (DOM.query(pid+' input'),function(i){if(i.type =='checkbox' || i.type =='radio')return true;});
//	        if(al.length < 1){
//	            S.log('此id下没有input(renderAll)');
//	            return;                
//	        }
//	        DOM.hasClass(body,'has-js') ? '' : DOM.addClass(body,'has-js');
	        for (var h = al.length - 1; h >= 0; h--) {
	            self.renderInput(al[h]);
	        };
	    },
	    //渲染单个input，自动判断类型
	    renderInput: function(id){
	        var self = this;
	        var i = DOM.get(id);
//	        var l = DOM.parent(i,'label') || DOM.parent(i,'span');
	        var l = DOM.parent(i);
	        if (l.tagName.toUpperCase() == 'LABEL' && l.className.indexOf('beautify_') > -1) {
	            if (l.className == 'beautify_check') {
	                self.renderCheckbox(i);
	            }else if (l.className == 'beautify_radio') {
	                self.renderRadio(i);
	            };
	        }else if(l.tagName.toUpperCase() == 'SPAN'){
	            if (DOM.hasClass(i,'beautify_input')) {
	                self.renderCheckPro(i);
	            }
	        }
	    },
	    //渲染pid下全部 高级选择框
	    renderAllCheckPro: function(pid){
	        var self = this;
	        var al = DOM.filter (DOM.query(pid+' input'),function(i){if((i.type =='checkbox' || i.type =='radio') && DOM.hasClass(i,'beautify_input'))return true;});
	        if(al.length < 1){
//	            S.log('此id下没有input(renderAllCheckPro)');
	            return;                
	        }
	        for (var h = al.length - 1; h >= 0; h--) {
	            self.renderCheckPro(al[h]);
	        };
	    },
	    //渲染pid下全部checkbox
	    renderAllCheckbox: function(pid){
	        var self = this;
	        var al = DOM.filter (DOM.query(pid+' input'),function(i){if(i.type =='checkbox')return true;});
	        if(al.length < 1){
	            S.log('此id下没有input(renderAllCheckbox)');
	            return;                
	        }
	        for (var h = al.length - 1; h >= 0; h--) {
	            self.renderCheckbox(al[h]);
	        };
	    },
	    //渲染pid下全部radio
	    renderAllRadio: function(pid){
	        var self = this;
	        var al = DOM.filter (DOM.query(pid+' input'),function(i){if(i.type =='radio')return true;});
	        if(al.length < 1){
	            S.log('此id下没有input(renderAllRadio)');
	            return;                
	        }
	        for (var h = al.length - 1; h >= 0; h--) {
	            self.renderRadio(al[h]);
	        };
	    },
	    //渲染单个高级选择框
	    renderCheckPro: function(id){
	        var self = this;
	        var i = DOM.get(id);
	        var isCheckbox = DOM.prop(i,"type") == "checkbox";
	        var l = DOM.parent(i,'label') || DOM.parent(i,'span');
	        if (!DOM.hasClass(i,'beautify_input')) {
	            S.log('input必须有class=”beautify_input“(renderCheckPro)');
	            return;
	        }
	        if(isCheckbox){
	        	if(safari && i.checked == true || i.checked){
	        		DOM.removeClass(l,'radio-checkoff-span');
	        		DOM.addClass(l,'radio-checkon-span');
	        		DOM.addClass(DOM.parent(l),'radio-checkstyle');
	        	}else{
	        		DOM.removeClass(l,'radio-checkon-span');
	        		DOM.addClass(l,'radio-checkoff-span');
	        		DOM.removeClass(DOM.parent(l),'radio-checkstyle');
	        	}
	        }else{
	        	if(safari && i.checked == true || i.checked){
	        		DOM.removeClass(l,'beautify_radio_off');
	        		DOM.addClass(l,'beautify_radio_on');
	        		DOM.addClass(DOM.parent(l),'radio-checkstyle');
	        	}else{
	        		DOM.removeClass(l,'beautify_radio_on');
	        		DOM.addClass(l,'beautify_radio_off');
	        		DOM.removeClass(DOM.parent(l),'radio-checkstyle');
	        	}
	        }
	        Event.on(l,'click',function(e){
	        	e.stopPropagation();
                if(e.target.tagName.toUpperCase() == 'LABEL'){
                	return ;
                }else{
                	 self.toggleCheckPro(i);
                }
	        })
	    },
	    //渲染单个checkbox
	    renderCheckbox: function(id){
	        var self = this;
	        var i = DOM.get(id);
	        var l = DOM.parent(i,'label') || DOM.parent(i,'span');
	        if (!DOM.hasClass(l,'beautify_check')) {
//	            S.log('input的父级标签应为”beautify_check“(renderCheckbox)');
	            return;
	        }
	        DOM.append(DOM.create('<i>&nbsp;</i>'),l);
	        if(i.disabled == true){
	            if(safari && i.checked == true || i.checked){
	                l.className = 'beautify_check c_on_disable';
	            }else{
	                l.className = 'beautify_check beautify_check_disable';
	            }
	        }else {
	            if(safari && i.checked == true || i.checked){
	                l.className = 'beautify_check c_on';
	            }else{
	                l.className = 'beautify_check c_off';
	            }
	            Event.on(l,'click',function(e){
	            	e.stopPropagation();
	                if(e.target.tagName.toUpperCase() == 'LABEL'){
	                	return ;
	                }else{
	                	 self.toggleCheckbox(i);
	                }
	            })
	        }
	    },
	    //渲染单个radio
	    renderRadio: function(id){
	        var self = this;
	        var i = DOM.get(id);
	        var l = DOM.parent(i,'label') || DOM.parent(i,'span');
	        if (!DOM.hasClass(l,'beautify_radio')) {
//	            S.log('input的父级标签应为”beautify_radio“(renderRadio)');
	            return;
	        }
	        DOM.append(DOM.create('<i>&nbsp;</i>'),l);
	        if(i.disabled == true){
	            if(safari && i.checked == true || i.checked){
	                l.className = 'beautify_radio r_on_disable';
	            }else{
	                l.className = 'beautify_radio beautify_radio_disable';
	            }
	        }else {
	            if(safari && i.checked == true || i.checked){
	                l.className = 'beautify_radio r_on';
	            }else{
	                l.className = 'beautify_radio r_off';
	            }
	            Event.on(l,'click',function(e){
	            	e.stopPropagation();
	                if(e.target.tagName.toUpperCase() == 'LABEL'){
	                	return ;
	                }else{
	                	 self.toggleRadio(i);
	                }
	            })
	        }
	    },
	    // checkbox单个设置为选中
	    setCheckboxOn: function(id) {
	        var i = DOM.get(id);
	        var l = DOM.parent(i,'label');
	        l.className = 'beautify_check c_on';
	        i.checked = true;
	    },
	    // checkbox单个设置为未选中
	    setCheckboxOff: function(id) {
	        var i = DOM.get(id);
	        var l = DOM.parent(i,'label');
	        l.className = 'beautify_check c_off';
	        i.checked = false;
	    },
	    // checkbox单个设置为选中 disabled 状态
	    setCheckboxDisabled: function(id) {
	        var i = DOM.get(id);
	        var l = DOM.parent(i,'label');
            if(safari && i.checked == true || i.checked){
                l.className = 'beautify_check c_on_disable';
            }else{
                l.className = 'beautify_check beautify_check_disable';
            }
	        i.disabled = true;
	    },
	    // checkbox单个设置为选中 disabled 状态
	    setCheckboxNoDisabled: function(id) {
	        var i = DOM.get(id);
	        var l = DOM.parent(i,'label');
	        if(safari && i.checked == true || i.checked){
                l.className = 'beautify_check c_on_disable';
            }else{
                l.className = 'beautify_check beautify_check_disable';
            }
	        i.disabled = false;
	    },
	    // checkbox切换
	    toggleCheckbox: function(id) {
	        var i = DOM.get(id);
	        var l = DOM.parent(i,'label');
	        if (l.className == 'beautify_check c_off') {
	            if(l.className == 'beautify_check c_on_disable'){
	                l.className = 'beautify_check c_on_disable';
	            }else{
	                l.className = 'beautify_check c_on';
	            }
	            if (safari){i.click();}
	        }else if(l.className == 'beautify_check c_on_disable'){
	            l.className = 'beautify_check c_on_disable';
	            if (safari) i.click();
	        }else if(l.className == 'beautify_check beautify_check_disable'){
	            l.className = 'beautify_check beautify_check_disable';
	            if (safari) i.click();
	        }else {
	            l.className = 'beautify_check c_off';
	            if (safari) i.click();
	        };
	    },
	    // radio切换
	    toggleRadio: function(id) {
	        var i = DOM.get(id);
	        var iName = DOM.attr(i,'name');
	        var l = DOM.parent(i,'label');
	        if (l.className == 'beautify_radio r_off' || i.checked) {
	            var ls = DOM.filter (DOM.query('input'),function(i){if(i.type =='radio')return true;});
	            // var ls = DOM.siblings(l);
	            for (var j = 0; j < ls.length; j++) {
	                var li =  DOM.parent(ls[j]);
	                //var lii = DOM.children(ls[j],'input');
	                //console.log(li);
	                if (li.className.indexOf('beautify_radio') == -1)  continue;
	                if (DOM.attr(ls[j],'name') !== iName)  continue;
	                li.className = 'beautify_radio r_off';
	            };
	            l.className = 'beautify_radio r_on';
	            if (safari) i.click();
	        }else if(l.className == 'beautify_radio beautify_radio_disable'){
	            l.className = 'beautify_radio beautify_radio_disable';
	            if (safari) i.click();
	        }else {
	            l.className = 'beautify_radio r_off';
	            if (safari) i.click();
	        };
	    },
	    // 普通radio切换
	    setRadioOn: function(id) {
	        var i = DOM.get(id);
	        var iName = DOM.attr(i,'name');
	        var l = DOM.parent(i,'label');
	        if (l.className == 'beautify_radio r_off' || i.checked) {
	            var ls = DOM.filter (DOM.query('input'),function(i){if(i.type =='radio')return true;});
	            for (var j = 0; j < ls.length; j++) {
	                var li =  DOM.parent(ls[j]);
	                if (li.className.indexOf('beautify_radio') == -1)  continue;
	                if (DOM.attr(ls[j],'name') !== iName)  continue;
	                li.className = 'beautify_radio r_off';
	            };
	            l.className = 'beautify_radio r_on';
	            i.checked = true;
	        };
	    },
	    // 高级选择框切换
	    toggleCheckPro: function(id) {
	        var i = DOM.get(id);
	        var isCheckbox = DOM.prop(i,"type") == "checkbox";
	        var iName = DOM.attr(i,'name');
	        var l = DOM.parent(id,'span');
	        if(isCheckbox){
		        if (DOM.hasClass(l,'radio-checkon-span')) {
		           DOM.removeClass(DOM.parent(l),'radio-checkstyle');
		           DOM.removeClass(l,'radio-checkon-span');
		           if (!DOM.hasClass(l,'radio-checkoff-span')){
		                DOM.addClass(l,'radio-checkoff-span');
		           };
		        }else{
		           DOM.addClass(DOM.parent(l),'radio-checkstyle');
		           DOM.toggleClass(l,'radio-checkon-span','radio-checkoff-span');
		        }
	        }else{
	        	if(DOM.hasClass(l,'beautify_radio_off')){
	        		var ls = DOM.filter (DOM.query('.beautify_input'),function(i){if(i.type =='radio')return true;});
		            for (var i = 0; i < ls.length; i++) {
		                var li = ls[i];
		                var lip = DOM.parent(ls[i]);
		                if (li.className.indexOf('beautify_input') == -1)  continue;
		                if (DOM.attr(li,'name') !== iName)  continue;
		                lip.className = 'beautify_radio_off';
		                DOM.removeClass(DOM.parent(lip),'radio-checkstyle');
		            };
		            DOM.addClass(DOM.parent(l),'radio-checkstyle');
		            l.className = 'beautify_radio_on';
		            if (safari) i.click();
	        	}else{
	        		DOM.addClass(DOM.parent(l),'radio-checkstyle');
		            l.className = 'beautify_radio_on';
		            if (safari) i.click();
	        	}
	        }
	    },
	    // 高级radio切换
	    setRadioPro: function(id) {
	    	  var i = DOM.get(id);
		      var iName = DOM.attr(i,'name');
		      var l = DOM.parent(id,'span');
    		  var ls = DOM.filter (DOM.query('.beautify_input'),function(i){if(i.type =='radio')return true;});
              for (var i = 0; i < ls.length; i++) {
	                var li = ls[i];
	                var lip = DOM.parent(ls[i]);
	                if (li.className.indexOf('beautify_input') == -1)  continue;
	                if (DOM.attr(li,'name') !== iName)  continue;
	                lip.className = 'beautify_radio_off';
	                DOM.removeClass(DOM.parent(lip),'radio-checkstyle');
	             };
	         DOM.addClass(DOM.parent(l),'radio-checkstyle');
             l.className = 'beautify_radio_on';
             DOM.get(id).checked = true;
	    },
	    // 高级radio设置为未选中
	    setRadioProOff: function(id) {
	    	  var i = DOM.get(id);
		      var iName = DOM.attr(i,'name');
		      var l = DOM.parent(id,'span');
    		  var ls = DOM.filter (DOM.query('.beautify_input'),function(i){if(i.type =='radio')return true;});
              for (var i = 0; i < ls.length; i++) {
	                var li = ls[i];
	                var lip = DOM.parent(ls[i]);
	                if (li.className.indexOf('beautify_input') == -1)  continue;
	                if (DOM.attr(li,'name') !== iName)  continue;
	                lip.className = 'beautify_radio_on';
	             };
             l.className = 'beautify_radio_off';
             DOM.get(id).checked = false;
	    },
	    // 高级checkbox on单个设置为选中
	    setCheckboxProOn: function(id) {
	    	  var i = DOM.get(id);
		        var iName = DOM.attr(i,'name');
		        var l = DOM.parent(id,'span');
		        DOM.addClass(DOM.parent(l),'radio-checkstyle');
		        DOM.toggleClass(l,'radio-checkon-span','radio-checkoff-span');
	            DOM.get(id).checked = true;
	    },
	    // 高级checkbox on单个设置为未选中
	    setCheckboxProOff: function(id) {
	    	  var i = DOM.get(id);
		        var iName = DOM.attr(i,'name');
		        var l = DOM.parent(id,'span');
	           DOM.removeClass(DOM.parent(l),'radio-checkstyle');
	           DOM.removeClass(l,'radio-checkon-span');
	           if (!DOM.hasClass(l,'radio-checkoff-span')){
	                DOM.addClass(l,'radio-checkoff-span');
	           };
	           DOM.get(id).checked = false;
	    }
	});
	return beautifyForm;
});
/**
 * @fileOverview 
 * @author  
 */
KISSY.add('page/create-init',function (S,Select,beautifyForm,Calendar) {
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
