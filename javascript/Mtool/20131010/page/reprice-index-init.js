/*
combined files : 

utils/beautifyForm/index
page/reprice-index-init

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
KISSY.add('page/reprice-index-init',function (S,O,beautifyForm,Overlay,Select) {
    // your code here
    var DOM = S.DOM, Event = S.Event;	
	return reprice = {
			panel : null,
			msg : null,
			checkBoxs : null,  	
			init : function() {
				//状态
				var items3 = [
					{text:'全部',value:'-1'},
					{text:'等待执行',value:'0'},
					{text:'正在执行',value:'1'},
					{text:'成功',value:'2'},
					{text:'失败',value:'4'}    
				],
				sortSelect = new Select.Select({  
					render:'#J_Selectstatus',
					valueField:'#choose_status',
					items:items3
				});
				sortSelect.render();
				sortSelect.setSelectedValue(status);
				
				Event.on('#J_CheckAll','click',reprice.CheckAll); //活动中宝贝全选  
				reprice.panel = new Overlay.Dialog({
						      width: 500,
						      title: '确认提交',
						      bodyContent: '',
						      mask: false,
						      buttons:[
			     	                   {
			     	                     text:'确定',
			     	                     elCls : 'bui-button J_Sure bui-button-primary',
			     	                     handler : function(){
			     	                       this.hide();
			     	                     }
			     	                   },{
			     	                     text:'关闭',
			     	                     elCls : 'bui-button J_Cancel',
			     	                     handler : function(){
			     	                       this.hide();
			     	                     }
			     	                   }
			     	          ],
						      align: {
						          points: ['cc', 'cc']
						      },
						      closable :true,
						      draggable: true,
						      aria:true
				});
						
				Event.on('#J_BtnPublish','click',function(){
					if(!showPermissions('editor_tool','工具箱')){return ;}
					if(isVersionPer('tool')){return ;}
			  	  		var diff  = IsExpired();
				 		if(diff > -5000){
							var sucessHandle = function(o) {
									var str = '';
									var scheMe = "您当前设置的改价方案为：<br>";
									if(DOM.attr('#J_Modifytype_1','checked')) {
										scheMe += '统一价:<font color="red">'+DOM.val('#J_Samevalue')+'</font>';
									}else{
										scheMe += '原价 X <font color="red">'+DOM.val('#J_Percent')+'</font>%';
										var priceDiff = parseFloat(DOM.val('#J_PriceDiff'));
										if (priceDiff>=0) {
											scheMe += ' + <font color="red">'+priceDiff+'</font>.';
										} else {
											scheMe += ' - <font color="red">'+priceDiff*(-1)+'</font>.';
										}
										scheMe += ' <br>如原价=100，改后价='+ (parseFloat(DOM.val('#J_Percent'))+priceDiff)+'.';
									}
									scheMe += "<br>点击【确定】开始修改价格，改完后无法恢复，您确认要进行修改吗？";
									str = '<div class="point relative" style="height: 150px;"><div class="point-w-2" style="height: auto;"><span class="point-img-2"></span><span class=""><span id="J_ScheMess">'+scheMe+'</span></div></div>';
								reprice.panel.set('bodyContent',str);
								reprice.panel.show();		
								Event.remove('.J_Sure');
								Event.remove('.J_Cancel');
								Event.on('.J_Sure','click',function(ev){
									if(isVersionPer('tool')){return ;}
									ev.preventDefault();
									if(!reprice.checkForm()){
										reprice.panel.hide();
										return false;
									}
									reprice.msg = new H.widget.msgBox({ type: "error",
										                content: "系统正在处理中",
										 				dialogType:"loading"
										            });
									DOM.get('#J_subform').submit();
								})
								Event.on('.J_Cancel','click',function(ev){
									ev.preventDefault();
									reprice.panel.hide();
									return;
								})
								return;
				 			};
				 		var errorHandle = function(o){
				 			KISSY.Event.fire('.J_TopExpired','click');
				 		};
				 		var data = '';
				  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
					}else{
							var str = '';
									var scheMe = "您当前设置的改价方案为：<br>";
									if(DOM.attr('#J_Modifytype_1','checked')) {
										scheMe += '统一价:<font color="red">'+DOM.val('#J_Samevalue')+'</font>';
									}else{
										scheMe += '原价 X <font color="red">'+DOM.val('#J_Percent')+'</font>%';
										var priceDiff = parseFloat(DOM.val('#J_PriceDiff'));
										if (priceDiff>=0) {
											scheMe += ' + <font color="red">'+priceDiff+'</font>.';
										} else {
											scheMe += ' - <font color="red">'+priceDiff*(-1)+'</font>.';
										}
										scheMe += ' <br>如原价=100，改后价='+ (parseFloat(DOM.val('#J_Percent'))+priceDiff)+'.';
									}
									scheMe += "<br>点击【确定】开始修改价格，改完后无法恢复，您确认要进行修改吗？";
									str = '<div class="point relative" style="height: 150px;"><div class="point-w-2" style="height: auto;"><span class="point-img-2"></span><span class=""><span id="J_ScheMess">'+scheMe+'</span></div></div>';
								reprice.panel.set('bodyContent',str);
								reprice.panel.show();		
								Event.remove('.J_Sure');
								Event.remove('.J_Cancel');
								Event.on('.J_Sure','click',function(ev){
									if(isVersionPer('tool')){return ;}
									ev.preventDefault();
									if(!reprice.checkForm()){
										reprice.panel.hide();
										return false;
									}
									reprice.msg = new H.widget.msgBox({ type: "error",
										                content: "系统正在处理中",
										 				dialogType:"loading"
										            });
									DOM.get('#J_subform').submit();
								})
								Event.on('.J_Cancel','click',function(ev){
									ev.preventDefault();
									reprice.panel.hide();
									return;
								})
						
					}
					
				});
				
				
			},
			
			//宝贝全选
			CheckAll : function(e) {
				if(!reprice.checkBoxs){
					var checkBoxs = DOM.query('#J_PromotionItemList1 .J_CheckBox');
				}else{
					var checkBoxs = rebaseprop.checkBoxs;
				}
				var len = checkBoxs.length;
				for(i=0; i<len; i++){
					var iid = checkBoxs[i].value;
					if(checkBoxs[i].disabled) continue;
					if(this.checked){
						checkBoxs[i].checked = true;
					} else {
						checkBoxs[i].checked = false;
					}
				}
			},
			//批量上传重试
			addSelectItemsRetryReprice : function() {
				if(!showPermissions('editor_tool','工具箱')){return ;}
				if(isVersionPer('tool')){return ;}
				var diff  = IsExpired();
				if(diff > -5000){
					var sucessHandle = function(o) {
						if(!reprice.checkBoxs){
							var checkBoxs = DOM.query('#J_PromotionItemList1 .J_CheckBox');
						}else{
							var checkBoxs = rebaseprop.checkBoxs;
						}
						reprice.msg = new H.widget.msgBox({ type: "error",
				            content: "系统正在处理中",
							dialogType:"loading"
				           
				        });
						var len = checkBoxs.length;
						var m=0;
						var json = [];
						for(i=0; i<len; i++){
							if(checkBoxs[i].checked && !checkBoxs[i].disabled){
								id = checkBoxs[i].value;
								var reprice_item_id = DOM.val(DOM.get('#J_Repriceitem_'+id));
								var new_price = DOM.val(DOM.get('#J_NewPrice_'+id));
								var o = '{"item_id":"' + id + '","reprice_item_id":"' + reprice_item_id +'", "new_price":"' + new_price + '"}';
								o = eval('(' + o + ')');						
								json.push(o);
								m++;
							}
						}
						if(m == 0){
							reprice.msg.hide();
							new H.widget.msgBox({
									    title:"错误提示",
									    content:'未选择任何宝贝！',
									    type:"error",
										autoClose:true,
										timeOut :1000						
									});
					
					                return;
					    }				 
						var itemsJson = KISSY.JSON.stringify(json);
						var data = "itemIds="+itemsJson;
						var submitHandle = function(o) {
							reprice.msg.hide();
		        	 		new H.widget.msgBox({ 
					 			type: "sucess", 
					 			content: "成功修改",
								dialogType:"msg", 
								autoClose:true, 
								timeOut:3000
							});
					    };
					    var errorHandle = function(o){
					    	reprice.msg.hide();
					    	new H.widget.msgBox({
									    title:"错误提示",
									    content:o.desc,
									    type:"error"
							});	
					    };
					    new H.widget.asyncRequest().setURI(retryRepriceUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
					    return;
					};
			 		var errorHandle1 = function(o){
			 			KISSY.Event.fire('.J_TopExpired','click');
			 		};
			 		var data = '';
			  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle1).setData(data).send();
				}else{
					if(!reprice.checkBoxs){
						var checkBoxs = DOM.query('#J_PromotionItemList1 .J_CheckBox');
					}else{
						var checkBoxs = rebaseprop.checkBoxs;
					}
					reprice.msg = new H.widget.msgBox({ type: "error",
			            content: "系统正在处理中",
						dialogType:"loading"
			           
			        });
					var len = checkBoxs.length;
					var m=0;
					var json = [];
					for(i=0; i<len; i++){
						if(checkBoxs[i].checked && !checkBoxs[i].disabled){
							id = checkBoxs[i].value;
							var reprice_item_id = DOM.val(DOM.get('#J_Repriceitem_'+id));
							var new_price = DOM.val(DOM.get('#J_NewPrice_'+id));
							var o = '{"item_id":"' + id + '","reprice_item_id":"' + reprice_item_id +'", "new_price":"' + new_price + '"}';
							o = eval('(' + o + ')');						
							json.push(o);
							m++;
						}
					}
					if(m == 0){
						reprice.msg.hide();
						new H.widget.msgBox({
								    title:"错误提示",
								    content:'未选择任何宝贝！',
								    type:"error",
									autoClose:true,
									timeOut :1000						
								});
				
				                return;
				    }
					
					var itemsJson = KISSY.JSON.stringify(json);
					var data = "itemIds="+itemsJson;
					var submitHandle = function(o) {
						reprice.msg.hide();
	        	 		new H.widget.msgBox({ 
				 			type: "sucess", 
				 			content: "成功修改",
							dialogType:"msg", 
							autoClose:true, 
							timeOut:3000
						});
				    };
				    var errorHandle = function(o){
				    	reprice.msg.hide();
				    	new H.widget.msgBox({
								    title:"错误提示",
								    content:o.desc,
								    type:"error"
						});	
				    };
				    new H.widget.asyncRequest().setURI(retryRepriceUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
				}
			},
			//单个宝贝失败—--重试
			RetryItemReprice : function(id) {
				if(!showPermissions('editor_tool','工具箱')){return ;}
				if(isVersionPer('tool')){return ;}
				var diff  = IsExpired();
				if(diff > -5000){
					var sucessHandle = function(o) {
						reprice.msg = new H.widget.msgBox({ type: "error",
				            content: "系统正在处理中",
							dialogType:"loading"
				           
				        });
						var json = [];
						var reprice_item_id = DOM.val(DOM.get('#J_Repriceitem_'+id));
						var new_price = DOM.val(DOM.get('#J_NewPrice_'+id));
						var o = '{"item_id":"' + id + '","reprice_item_id":"' + reprice_item_id +'", "new_price":"' + new_price + '"}';
						o = eval('(' + o + ')');						
						json.push(o);
						var itemsJson = KISSY.JSON.stringify(json);
						var data = "itemIds="+itemsJson;
						var submitHandle = function(o) {
							reprice.msg.hide();
		        	 		new H.widget.msgBox({ 
					 			type: "sucess", 
					 			content: "成功修改",
								dialogType:"msg", 
								autoClose:true, 
								timeOut:3000
							});
					    };
					    var errorHandle = function(o){
					    	reprice.msg.hide();
					    	new H.widget.msgBox({
									    title:"错误提示",
									    content:o.desc,
									    type:"error"
							});	
					    };
					    new H.widget.asyncRequest().setURI(retryRepriceUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
					    return;
					};
			 		var errorHandle1 = function(o){
			 			KISSY.Event.fire('.J_TopExpired','click');
			 		};
			 		var data = '';
			  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle1).setData(data).send();
				}else{
						reprice.msg = new H.widget.msgBox({ type: "error",
				            content: "系统正在处理中",
							dialogType:"loading"
				           
				        });
						var json = [];
						var reprice_item_id = DOM.val(DOM.get('#J_Repriceitem_'+id));
						var new_price = DOM.val(DOM.get('#J_NewPrice_'+id));
						var o = '{"item_id":"' + id + '","reprice_item_id":"' + reprice_item_id +'", "new_price":"' + new_price + '"}';
						o = eval('(' + o + ')');						
						json.push(o);
						var itemsJson = KISSY.JSON.stringify(json);
						var data = "itemIds="+itemsJson;
						var submitHandle = function(o) {
							reprice.msg.hide();
		        	 		new H.widget.msgBox({ 
					 			type: "sucess", 
					 			content: "成功修改",
								dialogType:"msg", 
								autoClose:true, 
								timeOut:3000
							});
					    };
					    var errorHandle = function(o){
					    	reprice.msg.hide();
					    	new H.widget.msgBox({
									    title:"错误提示",
									    content:o.desc,
									    type:"error"
							});	
					    };
					    new H.widget.asyncRequest().setURI(retryRepriceUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
				}
			},
			toggleCal : function(){
				if (DOM.attr('#J_Modifytype_1', 'checked')) {
					DOM.hide('.J_CalStrategy');
				} else {
					DOM.show('.J_CalStrategy');
				}
			},
			checkForm: function(){ 	

			  	if(!reprice.checkCategory()){
					new H.widget.msgBox({
									    title:"错误提示",
									    content:'请选择要修改的分类！',
									    type:"error",
										autoClose:true,
										timeOut :2000
									});
			    	return false;
			    }
			    
			    if(!DOM.attr('#J_Modifyonsale', 'checked') && !DOM.attr('#J_Modifyinstock', 'checked')){
			    	
						new H.widget.msgBox({
									    title:"错误提示",
									    content:'请选择要修改的范围！',
									    type:"error",
										autoClose:true,
										timeOut :2000
									});
//						alert("选择要修改的范围！");
			    	return false;
			    }
			    
			    if (DOM.attr('#J_Modifytype_1', 'checked')) {
			    	if (S.trim(DOM.val('#J_Samevalue')) == '') {
			    			new H.widget.msgBox({
									    title:"错误提示",
									    content:'对不起，请输入统一价！',
									    type:"error",
										autoClose:true,
										timeOut :2000
									});
					  	return false;
			    	}
			    } else {
			    	var percent = S.trim(DOM.val('#J_Percent'));
			    	var priceDiff = S.trim(DOM.val('#J_PriceDiff'));
			    	var patt = /^[\+\-]?[0-9]+(\.[0-9]{1,2})?$/;
			    	if( parseInt(percent)<=0 ){
			    			new H.widget.msgBox({
									    title:"错误提示",
									    content:'百分比必须大于0，请确认！',
									    type:"error",
										autoClose:true,
										timeOut :2000
									});
					  	return false;
			    	}
					if (priceDiff != '') {
						if (!patt.test(priceDiff)) {
								new H.widget.msgBox({
									    title:"错误提示",
									    content:'对不起，您输入的差价必须是数字，可以支持小数点后2位！',
									    type:"error",
										autoClose:true,
										timeOut :2000
									});
					  		return false;
						}
					}
			    }
				return true;
			},

			checkCategory: function (){
				var cates = document.getElementsByName('category[]');
				for(var i=0; i<cates.length; i++){
					if(cates[i].checked){
						return true;
					}
				}
				return false;
			}
		}
}, {
    requires: ['overlay','utils/beautifyForm/index','bui/overlay','bui/select']
});
