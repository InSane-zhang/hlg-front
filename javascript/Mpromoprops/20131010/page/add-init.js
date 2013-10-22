/*
combined files : 

utils/beautifyForm/index
page/add-init

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
KISSY.add('page/add-init',function (S,Calendar,Select,beautifyForm) {
    // your code here
    return promotionControl = {
			    	Paginator : null,
			    	msg :null,
					NameError :false,
					CardNumError :false,
					free_post_areasId :[],
					free_post_areasName :[],
					free_post_num :[],
					free_post_name:[],
					
			    	init : function() {
						var isEdit = DOM.val('#J_IsEdit');
						select = new Select.Select({  
				              render:'#J_ConTypeBox',
				              valueField:'#J_ConType',
				              items:[{'text':'元','value':'1'},{'text':'件','value':'0'}]
				            });
				            select.render();
				            select.on('change', function(ev){
				            });
				            promotionControl.x = new beautifyForm();
				            var datepicker = new Calendar.DatePicker({
			     	              trigger:'#J_startDate',
			     	              showTime:true,
			     	              autoRender : true,
			     	              autoSetValue :false,
			     	              textField  : '2'
			     	            });
			     	         var datepicker2 = new Calendar.DatePicker({
			     	              trigger:'#J_endDate',
			     	              showTime:true,
			     	              autoRender : true,
			     	              autoSetValue :false,
			     	              textField  : '2'
			     	            });
			     	         
			     	        datepicker.on('selectedchange',function (e) {
			     	        	 	var endDate = H.util.stringToDate(S.one('#J_endDate').val());
									var startDate   = e.value;
									if((endDate !='')&&(startDate.getTime() >= endDate.getTime()))
									{
										new H.widget.msgBox({
											    title:"错误提示",
											    content:'开始时间不能大于结束时间，请重新选择',
											    type:"info"
											});
										//S.one('#J_startDate').val('');
									}else{
										S.one('#J_startDate').val(e.text);
									}
			     	         });
			     	        datepicker2.on('selectedchange',function (e) {
					     	       	var endDate   =  e.value;
									var startTime = H.util.stringToDate(S.one('#J_startDate').val());
									var endTime = H.util.stringToDate(endDate);
									if((endTime.getTime() <= startTime.getTime())&&(startTime !='')){
										new H.widget.msgBox({
											    title:"错误提示",
											    content:'结束时间不能小于开始时间，请重新选择',
											    type:"info"
											});
										//S.one('#J_endDate').val('');
									}else{
										S.one('#J_endDate').val(e.text);
									}
			     	         });
			     	        
			     	       Event.on('.J_IsItem','click',function(ev){
			              	 if(DOM.query('.J_IsItem')[0].checked){
			              		DOM.show('.J_IsItemBox');
			              	 }	else{
			              		DOM.hide('.J_IsItemBox');
			              	 }
			               })
						
						if(isEdit){
							var all_type_list = {
								mianyouka : {ALL:'207',PART:'208',PART_NOT:'209'},
								dazheka : {ALL:'201',PART:'202',PART_NOT:'203'},
								youhuiquan : {ALL:'204',PART:'205',PART_NOT:'206'},
								shenrika : {ALL:'210',PART:'211',PART_NOT:'212'}
    	    				}
	    	    			var type_name_list = {
								201: '打折卡[全店参与]',202 : '打折卡[部分商品参与]',203 : '打折卡[部分商品不参与]',
								207 : '免邮卡[全店参与]',208 : '免邮卡[部分商品参与]',209 : '免邮卡[部分商品不参与]',
								204 : '优惠券[全店参与]',205 : '优惠券[部分商品参与]',206 : '优惠券[部分商品不参与]',
								210 : '生日卡[全店参与]',211 : '生日卡[部分商品参与]',212 : '生日卡[部分商品不参与]'
		    				}
							Event.on('.J_RangeType','click',function(ev){
	    						var rangeType = ev.target.value;
	    						var parentType = DOM.val('#J_ParentType');
	    						if(DOM.val('#J_TypeId')==all_type_list[parentType][rangeType]){
									return;
		    					}
	    						DOM.val('#J_TypeId', all_type_list[parentType][rangeType]);
	    						//DOM.html('#J_TypeName', type_name_list[DOM.val('#J_TypeId')]);
								if(rangeType == 'ALL'){
		    						DOM.hide('#J_Step_4');
		    						DOM.hide('#J_Step_3');
									DOM.show('#J_Step_2');
									DOM.show('#J_BtnPublish_1');
									DOM.hide('#J_BtnPublish_0');
			    				}else if(rangeType == 'PART'){
			    					DOM.hide('#J_Step_4');
			    					DOM.hide('#J_Step_2');
			    					DOM.show('#J_Step_3');	
									DOM.show('#J_BtnPublish_0');
									DOM.hide('#J_BtnPublish_1');
				    			}else{
				    				DOM.hide('#J_Step_3');
			    					DOM.hide('#J_Step_2');
			    					DOM.show('#J_Step_4');
									DOM.show('#J_BtnPublish_0');
									DOM.hide('#J_BtnPublish_1');
					    		}
							});
						}
						Event.on('.J_BtnPublish','click',function(ev){
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
						})
					    //处理 input 状态
						promotionControl.handleInputs();               
			        },
					
					/*活动名称 验证*/
					PromoNameAction : function(name){
						var result = promotionControl.isNull(name);
						var error = result[0];
						var msg = result[1];
						if(error){
							DOM.addClass(promotionForm.promo_name,'text-error');
							DOM.html('#J_PromoNameError',msg);
							DOM.hide('#J_PromoNameSucess');
							DOM.show('#J_PromoNameError');
							return promotionControl.NameError = true;
						}
						DOM.removeClass(promotionForm.promo_name,'text-error');
						DOM.show('#J_PromoNameSucess');
						DOM.hide('#J_PromoNameError');
						return promotionControl.NameError = false;
					},
					/*卡片数量 验证*/
					CardNumAction : function(name){
						var result = promotionControl.isNull(name);
						var error = result[0];
						var msg = result[1];
						if(error){
							DOM.addClass(promotionForm.card_num,'text-error');
							DOM.html('#J_CardNumError',msg);
							DOM.hide('#J_CardNumSucess');
							DOM.show('#J_CardNumError');
							return promotionControl.CardNumError = true;
						}
						var result = H.util.checkPrice(name);
						var error = result[0];
						var msg = result[1];
						if(error){
							DOM.addClass(promotionForm.card_num,'text-error');
							DOM.html('#J_CardNumError',msg);
							DOM.hide('#J_CardNumSucess');
							DOM.show('#J_CardNumError');
							return promotionControl.CardNumError = true;
						}
						DOM.removeClass(promotionForm.promo_name,'text-error');
						DOM.show('#J_CardNumSucess');
						DOM.hide('#J_CardNumError');
						return promotionControl.CardNumError = false;
					},
					
					save : function(){
						var S = KISSY , DOM = S.DOM ,Event = S.Event;
						promotionControl.msg = new H.widget.msgBox({
								    title:"",
									dialogType : 'loading',
								    content:'正在保存中，请稍候'	
								});
						ParamsErrorBox = KISSY.one('#J_ParamsErrorBox');
						
						var promoName = promotionForm.promo_name.value;
						promotionControl.PromoNameAction(promoName);
						if(promotionControl.NameError == true){
							
							promotionControl.msg.hide();
							DOM.html('#J_ParamsErrorMsg','名称不能为空，请检查');
							if (ParamsErrorBox.css("display")==="none") {
								ParamsErrorBox.slideDown();
							}
							return ;
						}
						
						//卡片数量
						if(promotionForm.card_num_type[1].checked){
							var card_num = document.getElementsByName('card_num')[0].value;
							var result = H.util.isNull(card_num);
							var error = result[0];
							var msg = result[1];
							if(error){
								DOM.addClass(promotionForm.card_num,'text-error');
								promotionControl.msg.hide();
								DOM.html('#J_ParamsErrorMsg',msg);
								if (ParamsErrorBox.css("display")==="none") {
									ParamsErrorBox.slideDown();
								}
								return ;
							}
							var result = H.util.checkPrice(card_num);
							var error = result[0];
							var msg = result[1];
							if(error){
								DOM.addClass(promotionForm.card_num,'text-error');
								promotionControl.msg.hide();
								DOM.html('#J_ParamsErrorMsg',msg);
								if (ParamsErrorBox.css("display")==="none") {
									ParamsErrorBox.slideDown();
								}
								return ;
							}
						}
						//使用条件
						if(promotionForm.use_type[1].checked){
							var use_type_num = document.getElementsByName('use_type_num')[0].value;
							var result = H.util.isNull(use_type_num);
							var error = result[0];
							var msg = result[1];
							if(error){
								DOM.addClass(promotionForm.use_type_num,'text-error');
								promotionControl.msg.hide();
								DOM.html('#J_ParamsErrorMsg',msg);
								if (ParamsErrorBox.css("display")==="none") {
									ParamsErrorBox.slideDown();
								}
								return ;
							}
							var result = H.util.checkPrice(use_type_num);
							var error = result[0];
							var msg = result[1];
							if(error){
								DOM.addClass(promotionForm.use_type_num,'text-error');
								promotionControl.msg.hide();
								DOM.html('#J_ParamsErrorMsg',msg);
								if (ParamsErrorBox.css("display")==="none") {
									ParamsErrorBox.slideDown();
								}
								return ;
							}
						}
						//日期
						if (promotionForm.date_type[0].checked) {
							if (S.one("#J_startDate")) {
								var startDate = DOM.val('#J_startDate');
								var endDate = S.one('#J_endDate').val();
								if ((endDate != '') && (startDate >= endDate)) {
									promotionControl.msg.hide();
									DOM.html('#J_ParamsErrorMsg', '开始时间不能大于结束时间，请重新选择');
									if (ParamsErrorBox.css("display") === "none") {
										ParamsErrorBox.slideDown();
									}
									DOM.addClass('#J_startDate', 'text-error');
									return;
								}
							}
							if (S.one("#J_endDate")) {
								var endDate = S.one('#J_endDate').val();
								var nowDate = new Date();
								var startTime = H.util.StringToDate(S.one('#J_startDate').val());
								var endTime = H.util.StringToDate(endDate);
								//var invalidate = H.app.smart.StringToDate('');
								
								if (endTime.getTime() <= nowDate.getTime() || endTime.getTime() <= startTime) {
									promotionControl.msg.hide();
									DOM.html('#J_ParamsErrorMsg', '结束时间不能小于开始时间，请重新选择');
									if (ParamsErrorBox.css("display") === "none") {
										ParamsErrorBox.slideDown();
									}
									DOM.addClass('#J_endDate', 'text-error');
									return;
								}
							}
						}
						//打折时长
//						if (DOM.get('#J_discount_last').checked === true) {
//								var discount_last_value = DOM.val('#J_discount_last');;
//								var result = H.util.isNull(discount_last_value);
//								var error = result[0];
//								var msg = result[1];
//								if(error){
//									DOM.addClass(promotionForm.discount_last_value,'text-error');
//									promotionControl.msg.hide();
//									DOM.html('#J_ParamsErrorMsg',msg);
//									if (ParamsErrorBox.css("display")==="none") {
//										ParamsErrorBox.slideDown();
//									}
//									return ;
//								}
//								var result = H.util.checkPrice(discount_last_value);
//								var error = result[0];
//								var msg = result[1];
//								if(error){
//									DOM.addClass(promotionForm.discount_last_value,'text-error');
//									promotionControl.msg.hide();
//									DOM.html('#J_ParamsErrorMsg',msg);
//									if (ParamsErrorBox.css("display")==="none") {
//										ParamsErrorBox.slideDown();
//									}
//									return ;
//								}
//						}
						//打折次数
//						if (DOM.get('#J_discount_num').checked === true && promotionForm.discount_num[1].checked) {
//							var discount_num_value = document.getElementsByName('discount_num_value')[0].value;
//							var result = H.util.isNull(discount_num_value);
//							var error = result[0];
//							var msg = result[1];
//							if(error){
//								DOM.addClass(promotionForm.discount_num_value,'text-error');
//								promotionControl.msg.hide();
//								DOM.html('#J_ParamsErrorMsg',msg);
//								if (ParamsErrorBox.css("display")==="none") {
//									ParamsErrorBox.slideDown();
//								}
//								return ;
//							}
//							var result = H.util.checkPrice(discount_num_value);
//							var error = result[0];
//							var msg = result[1];
//							if(error){
//								DOM.addClass(promotionForm.discount_num_value,'text-error');
//								promotionControl.msg.hide();
//								DOM.html('#J_ParamsErrorMsg',msg);
//								if (ParamsErrorBox.css("display")==="none") {
//									ParamsErrorBox.slideDown();
//								}
//								return ;
//							}
//						}
						var typeId = promotionForm.type_id.value;
						switch(typeId) {
								case '201':
					    		case '202':
					    		case '203':
									var discount_value = document.getElementsByName('discount_value')[0].value;
									var result = H.util.isNull(discount_value);
									var error = result[0];
									var msg = result[1];
									if(error){
										DOM.addClass(promotionForm.discount_value,'text-error');
										promotionControl.msg.hide();
										DOM.html('#J_ParamsErrorMsg',msg);
										if (ParamsErrorBox.css("display")==="none") {
											ParamsErrorBox.slideDown();
										}
										return ;
									}
									var result = promotionControl.checkDiscount(discount_value);
									var error = result[0];
									var msg = result[1];
									if(error){
										DOM.addClass(promotionForm.discount_value,'text-error');
										promotionControl.msg.hide();
										DOM.html('#J_ParamsErrorMsg',msg);
										if (ParamsErrorBox.css("display")==="none") {
											ParamsErrorBox.slideDown();
										}
										return ;
									}
								break;
								case '204':
					    		case '205':
					    		case '206':
								
								break;
								case '207':
					    		case '208':
					    		case '209':
										promotionControl.checkPost(0);
										if(promotionControl.free_post_num.length == 0){
											var str = "免邮地区未设置!!";
											promotionControl.msg.hide();
											DOM.html('#J_ParamsErrorMsg',str);
											if (ParamsErrorBox.css("display")==="none") {
												ParamsErrorBox.slideDown();
											}
											return ;
										}
								break;
							}
							
							//宝贝价格
							if (DOM.get('#J_is_item1').checked === true) {
							
								var item_price = document.getElementsByName('item_price')[0].value;
								var result = H.util.isNull(item_price);
								var error = result[0];
								var msg = result[1];
								if (error) {
									DOM.addClass(promotionForm.item_price, 'text-error');
									promotionControl.msg.hide();
									DOM.html('#J_ParamsErrorMsg', msg);
									if (ParamsErrorBox.css("display") === "none") {
										ParamsErrorBox.slideDown();
									}
									return;
								}
								var result = H.util.checkPrice(item_price);
								var error = result[0];
								var msg = result[1];
								if (error) {
									DOM.addClass(promotionForm.item_price, 'text-error');
									promotionControl.msg.hide();
									DOM.html('#J_ParamsErrorMsg', msg);
									if (ParamsErrorBox.css("display") === "none") {
										ParamsErrorBox.slideDown();
									}
									return;
								}
							}

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
								promotionControl.backCheckForm();
								 
					 		};
					 		var data = '';
					  	    new H.widget.asyncRequest().setURI(savePromoAjaxUrl).setMethod("POST").setForm('#promotion_edit_form').setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
							return true;
	    			},
						/*将checkbox 值传过去*/
					checkForm : function(){
						var checks = DOM.filter(DOM.query('input'),function(i){if(i.type =='checkbox' && DOM.hasClass(i,'J_checkForm'))return true;})
						KISSY.each(checks,function(item){
							if(item.checked == false){
								item.checked = true;
								DOM.val(item,0);
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
					handleInputs : function(){
						var inputs = DOM.filter (DOM.query('input'),function(i){if(i.type =='text')return true;})
						Event.on(inputs,'focus blur',function(ev){
							if(ev.type == 'focus'){
									DOM.removeClass(ev.target,'text-error');
									DOM.addClass(ev.target,'input-text-on');
							} else if(ev.type == 'blur'){
									DOM.removeClass(ev.target,'input-text-on');
							}
						})
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
					},
					/*是否为空*/
					isNull : function(str){
						var result = [];
						var error = false;
						var msg = null;
						if(str == null ||str == ""){
							error = true;
							msg = '请填写，此项不能为空！';
						}
						result.push(error);
						result.push(msg);
						return result;
					}
				
					
		    	};
}, {
    requires: ['bui/calendar','bui/select','utils/beautifyForm/index']
});
