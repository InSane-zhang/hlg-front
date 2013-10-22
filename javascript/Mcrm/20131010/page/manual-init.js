/*
combined files : 

utils/beautifyForm/index
page/manual-init

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
KISSY.add('page/manual-init',function (S,beautifyForm,Overlay,Calendar,Tooltip) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return manualControl = {
				msg : null,
				init : function(){
		 			count = DOM.html('.J_NumCount');
		 			Event.on('.J_Send','click',function(){
	 	            	var content = DOM.val('#J_ContentBox');
	 	            	var signContent = DOM.val('#J_SignContent');
	 	            	var number = DOM.val('.msgbox-1');   
	 	            	if(signContent == ''||content == '请输入短信内容...'||number == '请输入短信号码，一行一个'){
				 			  DOM.remove('.bui-dialog');
				 	          var dialog = new Overlay.Dialog({
				 	             title:'提示',
				 	             width:230,
				 	             height:160,
				 	             mask:false,
			     	             buttons:[
				     	                   {
				     	                     text:'确定',
				     	                     elCls : 'bui-button bui-button-primary',
				     	                     handler : function(){
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
				 	             bodyContent:''
				 	           });	 	
				 	           dialog.show();
				 	           if(content == '请输入短信内容...'){
				 	        	  dialog.set('bodyContent','<div style="text-align: center;font-size:14px;font-weight:bold;">请输入短信内容</div>');
				 	        	  return false;
				 	           }else if(signContent == ''){
				 	        	  dialog.set('bodyContent','<div style="text-align: center;font-size:14px;font-weight:bold;">请输入店铺名称</div>');
				 	        	  return false;
				 	           }else if(number == '请输入短信号码，一行一个'){
					 	        	 dialog.set('bodyContent','<div style="text-align: center;font-size:14px;font-weight:bold;">请输入短信号码</div>');
					 	        	 return false;
					 	       }
	 	             	} 
		 				var num = DOM.val('.msgbox-1');
			 			DOM.val('#msg-num',num);
	 	            	var sucessHandle = function(o) {
	 	            		var cont = '<div class="ui-msg" style="margin-bottom: 10px;"><div class="success-msg"><div class="img-success"></div><div class="text-16">短信已发送</div></div></div>'
	 	            		DOM.html('#messages',cont);
	 	            		DOM.val('.msgbox-1','请输入短信号码，一行一个');
				 		};
				 		var errorHandle = function(o){
	 	            		var cont = '<div class="ui-msg" style="margin-bottom: 10px;"><div class="success-msg"><div class="img-success"></div><div class="text-16">'+o.desc+'</div></div></div>'
	 	            		DOM.html('#messages',cont);
				 		};
				  	    new H.widget.asyncRequest().setURI(planManualSendFromTbUrl).setMethod("POST").setForm('#J_Marketing').setHandle(sucessHandle).setErrorHandle(errorHandle).setData(null).send();
	 	            	return false;
		 			})

		 	         Event.delegate(document, 'click', '.J_AddReplace', function(ev){
						var tem = DOM.html(ev.currentTarget);
						var textarea = DOM.get('#J_ContentBox')
						var pos = manualControl.getCursorPosition(textarea);
						manualControl.add(textarea,pos,tem);
						manualControl.checkTitleLen(DOM.val('#J_ContentBox'));
					 });	
			 	     Event.on('.J_Setting','click',function(){
			 			  DOM.remove('.bui-dialog');
			 	          var dialog = new Overlay.Dialog({
			 	             title:'买家地址设置',
			 	             width:500,
			 	             height:390,
			 	             mask:false,
		     	             buttons:[
			     	                   {
			     	                     text:'确定',
			     	                     elCls : 'bui-button bui-button-primary',
			     	                     handler : function(){
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
			 	             bodyContent:''
			 	           });
				          var cont = '<div id="J_hlgArea" class="hlg-area"><p style="margin:20px 0;"><button id="J_CheckAll" class="btm-small button-gray">全选</button>&nbsp;&nbsp;<button id="J_UncheckAll" class="btm-small button-gray">重选</button></p><p><label data-id="9" class="beautify_check"><input class="checked_1 J_CheckBox" name="上海" value="310000" id="J_Area_2" type="checkbox">上海</label><label data-id="10" class="beautify_check"><input name="江苏" class="checked_1 J_CheckBox" value="320000" id="J_Area_3" type="checkbox" >江苏</label><label data-id="11" class="beautify_check"><input name="浙江" class="checked_1 J_CheckBox" value="330000" id="J_Area_4" type="checkbox" >浙江</label><label data-id="12" class="beautify_check"><input name="安徽" class="checked_1 J_CheckBox" value="340000" id="J_Area_5" type="checkbox" >安徽</label><label data-id="13" class="beautify_check"><input name="福建" class="checked_1 J_CheckBox" value="350000" id="J_Area_6" type="checkbox" >福建</label><label data-id="14" class="beautify_check"><input name="江西" class="checked_1 J_CheckBox" value="360000" id="J_Area_7" type="checkbox" >江西</label></p><p><label data-id="1" class="beautify_check"><input name="北京" value="110000" id="J_Area_9" type="checkbox" class="J_CheckBox" >北京</label><label data-id="2" class="beautify_check"><input name="天津" value="120000" id="J_Area_10" type="checkbox" class="J_CheckBox" >天津</label><label data-id="3" class="beautify_check"><input name="河北" value="130000" id="J_Area_11" type="checkbox" class="J_CheckBox" >河北</label><label data-id="15" class="beautify_check"><input name="山东" value="370000" id="J_Area_12" type="checkbox" class="J_CheckBox" >山东</label><label data-id="4" class="beautify_check"><input name="山西" value="140000" id="J_Area_13" type="checkbox" class="J_CheckBox" >山西</label><label data-id="5" class="beautify_check"><input name="内蒙古" value="150000" id="J_Area_14" type="checkbox" class="J_CheckBox" >内蒙古</label></p><label data-id="19" class="beautify_check"><input name="广东" value="440000" id="J_Area_16" type="checkbox" class="J_CheckBox" >广东</label><label data-id="20" class="beautify_check"><input name="广西" value="450000" id="J_Area_17" type="checkbox" class="J_CheckBox" >广西</label><label data-id="21" class="beautify_check"><input name="海南" value="460000" id="J_Area_18" type="checkbox" class="J_CheckBox" >海南</label></p><p><label data-id="16" class="beautify_check"><input name="河南" value="410000" id="J_Area_20" type="checkbox" class="J_CheckBox" >河南</label><label data-id="17" class="beautify_check"><input name="湖北" value="420000" id="J_Area_21" type="checkbox" class="J_CheckBox" >湖北</label><label data-id="18" class="beautify_check"><input name="湖南" value="430000" id="J_Area_22" type="checkbox" class="J_CheckBox" >湖南</label></p><p><label data-id="6" class="beautify_check"><input name="辽宁" value="210000" id="J_Area_24" type="checkbox" class="J_CheckBox" >辽宁</label><label data-id="7" class="beautify_check"><input name="吉林" value="220000" id="J_Area_25" type="checkbox" class="J_CheckBox" >吉林</label><label data-id="8" class="beautify_check"><input name="黑龙江" value="230000" id="J_Area_26" type="checkbox" class="J_CheckBox" >黑龙江</label></p><p><label data-id="22" class="beautify_check"><input name="重庆" value="500000" id="J_Area_28" type="checkbox" class="J_CheckBox" >重庆</label><label data-id="23" class="beautify_check"><input name="四川" value="510000" id="J_Area_29" type="checkbox" class="J_CheckBox" >四川</label><label data-id="24" class="beautify_check"><input name="贵州" value="520000" id="J_Area_30" type="checkbox" class="J_CheckBox" >贵州</label><label data-id="25" class="beautify_check"><input name="云南" value="530000" id="J_Area_31" type="checkbox" class="J_CheckBox" >云南</label></p><p><label data-id="27" class="beautify_check"><input name="陕西" value="610000" id="J_Area_33" type="checkbox" class="J_CheckBox" >陕西</label><label data-id="28" class="beautify_check"><input name="甘肃" value="620000" id="J_Area_34" type="checkbox" class="J_CheckBox" >甘肃</label><label data-id="29" class="beautify_check"><input name="青海" value="630000" id="J_Area_35" type="checkbox" class="J_CheckBox" >青海</label><label data-id="30" class="beautify_check"><input name="宁夏" value="640000" id="J_Area_36" type="checkbox" class="J_CheckBox" >宁夏</label></p><p><label data-id="26" class="beautify_check"><input name="西藏" value="540000" id="J_Area_38" type="checkbox" class="J_CheckBox" >西藏</label><label data-id="31" class="beautify_check"><input name="新疆" value="650000" id="J_Area_39" type="checkbox" class="J_CheckBox" >新疆</label><label data-id="33" class="beautify_check"><input name="香港" value="" id="J_Area_40" type="checkbox" class="J_CheckBox" >香港</label><label data-id="34" class="beautify_check"><input name="澳门" value="" id="J_Area_41" type="checkbox" class="J_CheckBox" >澳门</label><label data-id="32" class="beautify_check"><input name="台湾" value="" id="J_Area_42" type="checkbox" class="J_CheckBox" >台湾</label><label data-id="35" class="beautify_check"><input name="海外" value="" id="J_Area_43" type="checkbox" class="J_CheckBox" >海外</label></p></div>'
				        	  dialog.set('bodyContent',cont);
			 	          dialog.show();
			 	          manualControl.Form = new beautifyForm();
			 	          Event.on("#J_CheckAll", "click", manualControl.checkAll);
			 	          Event.on("#J_UncheckAll", "click", manualControl.uncheckAll);
			 	          Event.on(".bui-button-primary","click",function(){
								var checkBoxs = DOM.query("#J_hlgArea .c_on");
								len = checkBoxs.length;
								var json = [];
								for(i=0; i<len; i++){
									var iid = DOM.attr(checkBoxs[i],'data-id');
									json.push(iid);
								}
								DOM.val('#J_Province',json);
								
			 	          });
			 		})
			 	    Event.on('.J_Test','click',function(){
			 			  DOM.remove('.bui-dialog');
			 	          var dialog = new Overlay.Dialog({
			 	             title:'测试',
			 	             width:330,
			 	             height:160,
			 	             mask:false,
		     	             buttons:[
			     	                   {
			     	                     text:'确定',
			     	                     elCls : 'bui-button bui-button-primary',
			     	                     handler : function(){
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
			 	             bodyContent:'手机号码：<input type="text" id="J_Cellphone" class="input-text-2 J_Placeholder" value="" placeholder="请输入手机号码">'
			 	           });
			 	          dialog.show();
			 	          Event.on('.bui-button-primary','click',function(){
			 	            	var content = DOM.val('#J_ContentBox');
			 	            	var signContent = DOM.val('#J_SignContent');
			 	            	var cellphone = DOM.val('#J_Cellphone');
			 	            	if(cellphone.search(/(^((0[1,2]{1}\d{1}-?\d{8})|(0[3-9]{1}\d{2}-?\d{7,8}))$)|(^0?(13[0-9]|15[0-35-9]|18[0123456789]|14[57])[0-9]{8}$)/) == -1){
									new H.widget.msgBox({
									    title:"错误提示",
									    content:'手机号格式有误，请重新输入！',
									    type:"error"
									});
									return;
								}
			 	            	if(signContent == '' || content == '请输入短信内容...' || cellphone == ''){
						 			  DOM.remove('.bui-dialog');
						 	          var dialog = new Overlay.Dialog({
						 	             title:'提示',
						 	             width:230,
						 	             height:150,
						 	             mask:false,
					     	             buttons:[
						     	                   {
						     	                     text:'确定',
						     	                     elCls : 'bui-button bui-button-primary',
						     	                     handler : function(){
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
						 	             bodyContent:''
						 	           });	 	
						 	           dialog.show();
						 	           if(content == '请输入短信内容...'){
						 	        	  dialog.set('bodyContent','<div style="text-align: center;font-size:14px;font-weight:bold;">请输入短信内容</div>');
						 	        	  return false;
						 	           }else if(signContent == ''){
						 	        	 dialog.set('bodyContent','<div style="text-align: center;font-size:14px;font-weight:bold;">请输入店铺名称</div>');
						 	        	 return false;
						 	           }else if(cellphone == ''){
						 	        	 dialog.set('bodyContent','<div style="text-align: center;font-size:14px;font-weight:bold;">请输入手机号码</div>');
						 	        	 return false;
							 	       }
			 	             	}
			 	            	var sucessHandle = function(o) {
			 						new H.widget.msgBox({ 
							 			type: "sucess", 
							 			content: "短信已发送",
										dialogType:"msg", 
										autoClose:true, 
										timeOut:3000
									});
			 	            	};
						 		var errorHandle = function(o){
									new H.widget.msgBox({
									    title:"错误提示",
									    content:o.desc,
									    type:"error"
									});
						 		};
						 		var mobiles = DOM.val('#J_Cellphone');
						 		var sign_content = DOM.val('#J_SignContent');
						 		var content = DOM.val('#J_ContentBox');
						 		var data = 'mobiles='+mobiles+'&sign_content='+sign_content+'&content='+content;
						  	    new H.widget.asyncRequest().setURI(planManualSendFromTbUrl).setMethod("POST").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
			 	          })
			 		})
			 		
				},
				onkeyup : function(e) {
					var str = DOM.val('.msgbox-1');
					var reg=/\n$/gi;
					var len = 0;
					str=str.replace(reg,"");
					var arr = str.match(/[\n]/g);
					if(arr){
						len = arr.length;
					}
					DOM.html('.J_NumCount',len+1);
					DOM.val('#msg-num',str.split('\n'));
				}, 
				checkAll : function(e) {
					//e.stopPropagation();
					checkBoxs = DOM.query("#J_hlgArea .J_CheckBox");
					len = checkBoxs.length;
					for(i=0; i<len; i++){
						var iid = checkBoxs[i].value;
						if(checkBoxs[i].disabled) continue;
						if(this.checked){
							
							manualControl.Form.setCheckboxOff(checkBoxs[i]);
						} else {
							manualControl.Form.setCheckboxOn(checkBoxs[i]);
						}
					}
				}, 	 
				uncheckAll : function(e) {
					//e.stopPropagation();
					checkBoxs = DOM.query("#J_hlgArea .J_CheckBox");
					len = checkBoxs.length;
					for(i=0; i<len; i++){
						var iid = checkBoxs[i].value;
						if(checkBoxs[i].disabled) continue;
						if(this.checked){
							manualControl.Form.setCheckboxOn(checkBoxs[i]);
							
						} else {
							manualControl.Form.setCheckboxOff(checkBoxs[i]);
						}
					}
				}, 				
				getCursorPosition: function(textarea){
					var rangeData = {
						text: "",
						start: 0,
						end: 0
					};
					textarea.focus();
					if (textarea.setSelectionRange) { // W3C
						rangeData.start = textarea.selectionStart;
						rangeData.end = textarea.selectionEnd;
						rangeData.text = (rangeData.start != rangeData.end) ? textarea.value.substring(rangeData.start, rangeData.end) : "";
					}
					else 
						if (document.selection) { // IE
							var i, oS = document.selection.createRange(),   // Don't: oR = textarea.createTextRange()
							oR = document.body.createTextRange();
							oR.moveToElementText(textarea);
							rangeData.text = oS.text;
							rangeData.bookmark = oS.getBookmark();
							// object.moveStart(sUnit [, iCount])
							// Return Value: Integer that returns the number of units moved.
							for (i = 0; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart("character", -1) !== 0; i++) {
								// Why? You can alert(textarea.value.length)
								if (textarea.value.charAt(i) == '\n') {
									i++;
								}
							}
							rangeData.start = i;
							rangeData.end = rangeData.text.length + rangeData.start;
						}
					return rangeData;
				},
				checkTitleLen: function(str){
					var len = str.replace(/【买家姓名】/g, "123").replace(/【店铺名称】/g, DOM.val('#J_SignContent')).length ;
					var signContent = DOM.val('#J_SignContent');
					DOM.html(DOM.get('#J_Zs_Num'),len);
					var num = Math.ceil(len/67);
					DOM.html(DOM.get('.J_MsgNum'),num);
					str = str.replace(/【店铺名称】/g,DOM.val('#J_SignContent'));
					DOM.html('.J_CurrentMsg',str);
					var signContent = DOM.val('#J_SignContent');
				},			
				add: function (textarea, rangeData, text) {
					var oValue, nValue, oR, sR, nStart, nEnd, st;
					if (textarea.setSelectionRange) { // W3C
						oValue = textarea.value;
						nValue = oValue.substring(0, rangeData.start) + text + oValue.substring(rangeData.end);
						nStart = nEnd = rangeData.start + text.length;
						st = textarea.scrollTop;
						textarea.value = nValue;
						// Fixbug:
						// After textarea.values = nValue, scrollTop value to 0
						if(textarea.scrollTop != st) {
							textarea.scrollTop = st;
						}
						textarea.setSelectionRange(nStart, nEnd);
					} else if (textarea.createTextRange) { // IE
						sR = document.selection.createRange();
						sR.text = text;
						sR.setEndPoint('StartToEnd', sR);
						sR.select();
					}
				}				
		}
}, {
    requires: ['utils/beautifyForm/index','bui/overlay','bui/calendar','bui/tooltip']
});      
