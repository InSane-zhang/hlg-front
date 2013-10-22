/*
combined files : 

utils/showPages/index
utils/beautifyForm/index
page/renum-init

*/
/**
 * @分页组件
 * @author  @sjs_stef
 */
KISSY.add('utils/showPages/index',function (S) {
    var DOM = S.DOM, Event = S.Event, doc = document;
  
    function showPages(name) { //初始化属性 
        var self = this; 
        if (!(self instanceof showPages)) { 
            return new showPages(name); 
        }   
        this.pageNum = 4 ;   
        this.name = name;      //对象名称
        this.page = 1;         //当前页数
        this.pageCount = 200;    //总页数
        this.argName = 'page'; //参数名    
    }

    S.mix(showPages.prototype,{
        jump: function() {
            return undefined;
        },
        
        //进行当前页数和总页数的验证
        checkPages: function() { 
            if (isNaN(parseInt(this.page))) this.page = 1;
            if (isNaN(parseInt(this.pageCount))) this.pageCount = 1;
            if (this.page < 1) this.page = 1;
            if (this.pageCount < 1) this.pageCount = 1;
            if (this.page > this.pageCount) this.page = this.pageCount;
            this.page = parseInt(this.page);
            this.pageCount = parseInt(this.pageCount);
        },
        
        //生成html代码    
        _createHtml: function(mode) { 
       
            var self = this, strHtml = '', prevPage = this.page - 1, nextPage = this.page + 1;   
            if (mode == '' || typeof(mode) == 'undefined') mode = 1;
        
            switch (mode) {
                case 1: 
                    //模式1 (页数)
                     strHtml += '<div class="page-bottom"> <div class="sabrosus">';
	   					strHtml += '<font class="number">';
	   					strHtml += '共'+this.pageCount+'页&nbsp;';
	   					strHtml += '<input style="" type="text"  class="page-input" id="pageInput' + self.name + '"  value="页码" onkeypress="return window.' + self.name + '.formatInputPage(event);" onfocus="this.className=\'page-input page-input-text-on \';if(this.value==\'页码\'){this.value = \'\';}" onblur="this.className=\'page-input\';if(this.value==\'\'){this.value = \'页码\'}">';
	   					strHtml += '<input type="button" value="Go" class="btm-go" onclick="javascript:var page = document.getElementById(\'pageInput' + self.name + '\').value; if(isNaN(Number(page))|| Number(page)==0) { var turnTo = 1;} else if(page>'+this.pageCount+'){ var turnTo = '+this.pageCount+';} else{var turnTo = page;}  window.' + self.name + '.toPage(turnTo);" >';
	   					strHtml += '</font>';	
	   				    if (prevPage < 1) {
	                        strHtml += '<span class="pre-none page-pic-no"></span>';
	                    } else {
	                        strHtml += '<span title="上一页" class="pre page-pic-no" onclick="' + self.name + '.toPage(' + prevPage + ');"></span>';
	                    }
	   					if (nextPage > this.pageCount) {
	                    	strHtml += '<span class="next-none page-pic-no"></span>';
	                    } else {
	                    	strHtml += '<span title="下一页" class="next page-pic-no" onclick="' + self.name + '.toPage(' + nextPage + ');"></span>';
	                    }
	   				 strHtml += '<div style="clear:both"></div></div></div> '; 
                    break;
                                 
                    case 2: 
    					//模式2 (前后缩略,页数,首页,前页,后页,尾页)
                    	
    					if(this.pageCount > 1){
    	                    strHtml += '<div class="page-bottom"> <div class="sabrosus">';
    	                    
    	                    if (this.pageCount > 5) {
    		   					strHtml += '<font class="number">';
    		   					strHtml += '共'+this.pageCount+'页&nbsp;';
    		   					strHtml += '<input style="" type="text"  class="page-input" id="pageInput' + self.name + '"  value="页码" onkeypress="return window.' + self.name + '.formatInputPage(event);" onfocus="this.className=\'page-input page-input-text-on \';if(this.value==\'页码\'){this.value = \'\';}" onblur="this.className=\'page-input\';if(this.value==\'\'){this.value = \'页码\'}">';
    		   					strHtml += '<input type="button" value="Go" class="btm-go" onclick="javascript:var page = document.getElementById(\'pageInput' + self.name + '\').value; if(isNaN(Number(page))|| Number(page)==0) { var turnTo = 1;} else if(page>'+this.pageCount+'){ var turnTo = '+this.pageCount+';} else{var turnTo = page;}  window.' + self.name + '.toPage(turnTo);" >';
    		   					strHtml += '</font>';	
    	                    }
    	                    
    	                    
    	                    if (prevPage < 1) {
    	                        strHtml += '<span class="pre-none page-pic-no"></span>';
    	                    } else {
    	                        strHtml += '<span title="上一页" class="pre page-pic-no" onclick="' + self.name + '.toPage(' + prevPage + ');"></span>';
    	                    }
    	                    
    	                    if (this.page != 1) {
    							//strHtml += ' <a class="a-padding" href="javascript:' + self.name  + '.toPage(1);">1</a>';
    						}
    						if(this.page - 2<=0){
    							var start = 1;
    								if (this.pageCount > this.page + 4) {
    	                           		var endPage = this.page + 4;
    	                           } else {
    	                             	var endPage = this.pageCount; 
    	                            }
    						}else if(this.page + 2>=this.pageCount){
    							var start = this.pageCount-4;
    							if (this.pageCount > this.page + 4) {
    	                       		var endPage = this.page + 4;
    	                        } else {
    	                         	var endPage = this.pageCount; 
    	                        }
    						}else {
    							var start = this.page - 2;
    							if (this.pageCount > this.page + 2) {
    		                           		var endPage = this.page + 2;
    		                           } else {
    		                             	var endPage = this.pageCount; 
    		                             }
    						}
    	                    for (var i = start; i <= endPage; i++) {
    	                    if (i > 0) {
    	                       	if (i == this.page) {
    	                           	strHtml += '<span class="current a-padding">'+ i + '</span>';
    	                        } else {
    	                           // if (i != 1 && i != this.pageCount) {
    	                              	strHtml += '<a class="a-padding" href="javascript:' + self.name + '.toPage(' + i + ');">' + i + '</a>';
    	                           // }
    						      }
    	                    }
    	                    }
    	                    if (this.page + 5 < this.pageCount) {
    							strHtml += '<a class="a-padding" title="" href="javascript:' + self.name + '.toPage(' + (this.page + 3) + ');">...</a>';
    						}
    				  	    if (this.page != this.pageCount) {
    							//strHtml += '<span title="Page ' + this.pageCount + '"><a href="javascript:' + self.name + '.toPage(' + this.pageCount + ');">' + this.pageCount + '</a></span>';
    						}
    						if (nextPage > this.pageCount) {
    	                    	strHtml += '<span class="next-none page-pic-no"></span>';
    	                    } else {
    	                    	strHtml += '<span title="下一页" class="next page-pic-no" onclick="' + self.name + '.toPage(' + nextPage + ');"></span>';
    	                      }
    						
    						
    						
    	                   strHtml += '<div style="clear:both"></div></div></div> ';
    					}
                       break;
    			   case 3 :
    				   strHtml += '<div class="page-top"><div class="sabrosus"><span class="count">' + this.page + ' / ' + this.pageCount + '</span>';
                       if (prevPage < 1) {
                           strHtml += ' <span class="pre-none page-pic-no"></span>';
                       } else {
                           strHtml += '<a class="border-left-dedede" href="javascript:' + self.name + '.toPage(' + prevPage + ');" title="上一页"><span class="pre page-pic-no"></span></a>';
                         }
                       if (nextPage > this.pageCount) {
                       	strHtml += '<span class="next-none page-pic-no"></span>';
                       } else {
                           strHtml += '<a href="javascript:' + self.name + '.toPage(' + nextPage + ');" title="下一页"><span class="next page-pic-no"></span></a>';
                         }
                      strHtml += '<div style="clear:both"></div></div></div>';
                      break;
                    
            }
            return strHtml; 
               
        },
         //限定输入页数格式
        formatInputPage : function(e){
            var ie = navigator.appName=="Microsoft Internet Explorer"?true:false;
            if(!ie) var key = e.which;
            else var key = event.keyCode;
            if (key == 8 || key == 46 || (key >= 48 && key <= 57)) return true;
            return false;
        },
      
        //页面跳转 返回将跳转的页数
        toPage: function( page ,flag) { 
            var turnTo = 1;
            var self = this;    
            if (typeof(page) == 'object') {
                turnTo = page.options[page.selectedIndex].value;
            } else {
                turnTo = page;
              }
            
            self.jump(turnTo,flag,'');
              
        },
              
        //显示html代码
        printHtml: function(contian, mode) {  
            this.checkPages();
            DOM.html(contian,this._createHtml(mode));
            return this;
        },
                   
        //设置总页数           
        setPageCount: function( pagecount ) {
            this.pageCount=pagecount;
            return this;
        },              
        
        getPageCount: function() {
            return this.pageCount;
        },
        
        //设置跳转 执行函数
        setRender: function(fn) {
            this.jump = fn;
            return this;
        },  
        setPageNum:function(page_num){
            this.pageNum = page_num;
            return this;
         },
        setPage:function(page){
            this.page = page;  
            return this; 
        }          

               
    });

    return showPages;
  
});
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

KISSY.add('page/renum-init',function (S,showPages,beautifyForm,Select) {
    // your code here
	var DOM = S.DOM, Event = S.Event;
    
	return renum = {
	    	paginator : null,
	    	panel : null,
	    	msg : null,
			checkBoxs : null,
			previewed : false,
			init : function() {	
				renum.Form = new beautifyForm();
				//选择分类
				promoSelect = new Select.Select({  
				    render:'#J_SelectItemCidBox',
			      	valueField:'#J_SelectItemCid',
			      	items:S.JSON.parse(sellerCats),
			      	visibleMode : 'display'
				});
				promoSelect.render();
				promoSelect.setSelectedValue('0');
				DOM.css(DOM.get('.bui-list-picker'),{'left':'-999px','top':'-999px'});
				//默认排序
				var items3 = [
					{text:'最新上架',value:'0'},
					{text:'最晚上架',value:'1'}
						     
				],
				sortSelect = new Select.Select({  
					render:'#J_SelectOrder',
					valueField:'#J_SelectItemOrder',
					items:items3
				});
				sortSelect.render();
				sortSelect.setSelectedValue('0');
				sortSelect.on('change', function(ev){
					renum.searchTbItems();
				});
				// 全部 出售中 库中
				var Sellingitems = [
			      {text:'全部',value:'0'},
			      {text:'出售中',value:'1'},
			      {text:'库中',value:'2'}
			    ],
			    SellingSelect = new Select.Select({  
				    render:'#J_SearchItemSelling',
			      	valueField:'#J_SearchSelling',
			      	items:Sellingitems
				});
				SellingSelect.render();
				SellingSelect.setSelectedValue('0');
				SellingSelect.on('change', function(ev){
					renum.searchTbItems();
				});
				//条数
				var items4 = [
					{text:'10条',value:'10'},
					{text:'20条',value:'20'},
					{text:'50条',value:'50'},
					{text:'100条',value:'100'}
						     
				],
				statusSelect = new Select.Select({  
					render:'#J_SelectPage',
					valueField:'#J_SelectItemPage',
					items:items4
				});
				statusSelect.render();
				statusSelect.setSelectedValue('10');
				statusSelect.on('change', function(ev){
					rename.searchTbItems();
				});
				
				renum.searchTbItems();
				Event.on('#J_SearchBtn','click',renum.searchTbItems); //搜索宝贝 
			    Event.on('#J_TCheckAll','click',renum.CheckAll); //活动中宝贝全选   
			    
    		},
    		
    		searchTbItems : function() {
		        var submitHandle = function(o) {
					DOM.hide('#J_RightLoading');
					DOM.show('#J_MainRightContent');
		    	    totalRecords = o.payload.totalRecords;
					DOM.css(DOM.get('#J_NoteIcon') ,'display','none');
					if(totalRecords > 0){
						DOM.css(DOM.get('#J_REmpty') ,'display','none');
						DOM.css(DOM.query(".J_PromotionItemBtnHolder") ,'display' , '');
					} else {
						DOM.css(DOM.get('#J_REmpty'), 'display' , '');
						DOM.css(DOM.query(".J_PromotionItemBtnHolder") , 'display' , 'none');
						DOM.css(DOM.query(".J_ControlBtm") , 'display' , 'none');
					}
					DOM.html('#J_PromotionItemList' ,o.payload.body);
					DOM.attr('#J_TCheckAll','checked',false);
					var oTriggers = DOM.query('#J_PromotionItemList .J_CheckBox');
					selectItemNum = 0;
		            Event.on(oTriggers, "click", function(ev){
						if(!this.checked){
							DOM.attr('#J_TCheckAll','checked',false);
							selectItemNum -=1;
						} else{
							selectItemNum +=1;
						}
						DOM.text('#J_SelectedItemNum',selectItemNum);
					});
					var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					renum.paginator = new showPages('renum.paginator').setRender(renum.handlePagination).setPageCount(pageCount).printHtml('#J_BottomPaging',2);
					renum.paginator.printHtml('#J_TopPaging',3);
			    };
		    	if(DOM.val(DOM.get("#J_SearchTitle")) != '关键字、商品链接、商品编码'){
			    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
			    }else{
			    	var title ='';
			    }
	    	 	var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
				var cid = DOM.val(DOM.get("#J_SelectItemCid")); //类目
		    	var type = DOM.val(DOM.get("#J_SearchSelling")); //出售中 库中
		    	var itemOrder = DOM.val(DOM.get("#J_SelectItemOrder"));//排序方式
		    	
		    	var data = "q="+title+"&cid="+cid+"&type="+type;
	        	    data +="&itemOrder="+itemOrder+"&pageSize="+itemPage;
		    	if (type == 0) {
					//价格区间
					var startPrice = DOM.val(DOM.get("#J_StartPrice"));
					var endPrice = DOM.val(DOM.get("#J_EndPrice"));
					data += "&start_price="+startPrice+"&end_price="+endPrice;
				}
				DOM.show('#J_RightLoading');
				DOM.hide('#J_MainRightContent');
				new H.widget.asyncRequest().setURI(getItemsFromTbUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			handlePagination : function(turnTo) {
		    	pageId = turnTo;
				var submitHandle = function(o) {
					DOM.attr('#J_TCheckAll','checked',false);
					DOM.hide('#J_RightLoading');
					DOM.show('#J_MainRightContent');
		    	    totalRecords = o.payload.totalRecords;
					DOM.css(DOM.get('#J_NoteIcon') ,'display','none');
					if(totalRecords > 0){
						DOM.css(DOM.get('#J_REmpty') ,'display','none');
						DOM.css(DOM.query(".J_PromotionItemBtnHolder") ,'display' , '');
					} else {
						DOM.css(DOM.get('#J_REmpty'), 'display' , '');
						DOM.css(DOM.query(".J_PromotionItemBtnHolder") , 'display' , 'none');
					}
					DOM.html('#J_PromotionItemList' ,o.payload.body);
					var oTriggers = DOM.query('#J_PromotionItemList .J_CheckBox');
		            Event.on(oTriggers, "click", function(ev){
						if(!this.checked){
							DOM.attr('#J_TCheckAll','checked',false);
						}
					});
					var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					renum.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_BottomPaging',2);
					renum.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_TopPaging',3);
		    	};
		    	 if(DOM.val(DOM.get("#J_SearchTitle")) != '关键字、商品链接、商品编码'){
			    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
			    }else{
			    	var title ='';
			    }
				var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
					var cid = DOM.val(DOM.get("#J_SelectItemCid")); //类目
			    	var type = DOM.val(DOM.get("#J_SearchSelling")); //出售中 库中
			    	var itemOrder = DOM.val(DOM.get("#J_SelectItemOrder"));//排序方式
			    	
			    	var data = "q="+title+"&cid="+cid+"&type="+type;
		        	    data +="&itemOrder="+itemOrder+"&pageSize="+itemPage+"&page_id="+pageId;
			    	if (type == 0) {
						//价格区间
						var startPrice = DOM.val(DOM.get("#J_StartPrice"));
						var endPrice = DOM.val(DOM.get("#J_EndPrice"));
						data += "&start_price="+startPrice+"&end_price="+endPrice;
					}
		        DOM.show('#J_RightLoading');
				DOM.hide('#J_MainRightContent');
			    new H.widget.asyncRequest().setURI(getItemsFromTbUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			//宝贝全选
			CheckAll : function(e) {
				if(!renum.checkBoxs){
					var checkBoxs = DOM.query('#J_PromotionItemList .J_CheckBox');
				}else{
					var checkBoxs = renum.checkBoxs;
				}
				var len = checkBoxs.length;
				if(e.currentTarget.checked){
					selectItemNum =len;
				} else {
					selectItemNum =0;
				}
				DOM.text('#J_SelectedItemNum',selectItemNum);
				for(i=0; i<len; i++){
					var iid = checkBoxs[i].value;
					if(checkBoxs[i].disabled) continue;
					if(this.checked){
						checkBoxs[i].checked = true;
					} else {
						checkBoxs[i].checked = false;
					}
				}
			} ,
			changeType : function(type){
				DOM.val('#J_Type',type);
				if(type == 1){
					DOM.attr('#J_ChangeNum','checked',true);
				}else if(type == 2){
					DOM.attr('#J_AddNum','checked',true);
				}else if(type == 3){
					DOM.attr('#J_DelNum','checked',true);
				}
			},
			previewNum : function(){
				renum.previewed = true;
				if(!DOM.attr('#J_ChangeNum','checked') && !DOM.attr('#J_AddNum','checked') && !DOM.attr('#J_DelNum','checked')){
					new H.widget.msgBox({
		                title: "",
		                content: "请选择代码修改方式！",
		                type: "error",
		                buttons: [{ value: "Ok"}],
						autoClose:true,
						timeOut :2000
		               
		            });
					return false;
				}
				if((DOM.attr('#J_ChangeNum','checked')&&DOM.val('#J_Direct_Num')=='')||(DOM.attr('#J_AddNum','checked')&&DOM.val('#J_Add_Num')=='')||(DOM.attr('#J_DelNum','checked')&&DOM.val('#J_Del_Num')=='')){
					new H.widget.msgBox({
		                title: "",
		                content: "已选项代码区域不能为空，请检查！",
		                type: "error",
		                buttons: [{ value: "Ok"}],
						autoClose:true,
						timeOut :2000
		                
		            });
					return false;
				}
				renum.changeNum();
				
			},
			changeNum : function(){
				if(!renum.checkBoxs){
					var checkBoxs = DOM.query('#J_PromotionItemList .J_CheckBox');
				}else{
					var checkBoxs = renum.checkBoxs;
				}
				
				var directNum = Number(DOM.val(DOM.get('#J_Direct_Num')));
				var addNum = Number(DOM.val(DOM.get('#J_Add_Num')));
				var delNum = Number(DOM.val(DOM.get('#J_Del_Num')));
				var minNum = Number(DOM.val(DOM.get('#J_Min_Num')));
				var type = DOM.val(DOM.get('#J_Type'));
				var len = checkBoxs.length;
				var m=0;
				if(type == 1){
					for(var i=0; i<len; i++){
						if(checkBoxs[i].checked){
							id = checkBoxs[i].value;
							if (DOM.get('#J_ItemSkus_' + id) == null) {
								DOM.val(DOM.get('#J_new_item_num_'+id), directNum);
								renum.checkNumNotice(directNum,id,1);
								m++;
							}else{
								var origPriceEls = DOM.query('#J_SkuTable_'+id+' .J_SkuOrigNum');
								var promoPriceEls = DOM.query('#J_SkuTable_'+id+' .J_SkuPromoPrice');
								var slen = origPriceEls.length;
								for (var n=0; n<slen ;n++) {
				    				spp = Number(promoPriceEls[n].value);
				    				sop = Number(origPriceEls[n].value);
									promoPriceEls[n].value = directNum;
									m++;
								}
								renum.checkNumNotice(directNum,id,1);
							}	
							
							
						}
					}
				}
				if (type == 2) {
					for (var i = 0; i < len; i++) {
						if (checkBoxs[i].checked) {
							id = checkBoxs[i].value;
							if (DOM.get('#J_ItemSkus_' + id) == null) {
								var protoNum = Number(DOM.val(DOM.get('#J_ItemNum_' + id)));
								var num = protoNum + addNum;
								DOM.val(DOM.get('#J_new_item_num_' + id), num);
								renum.checkNumNotice(num, id,1);
								m++;
							}
							else {
								var origPriceEls = DOM.query('#J_SkuTable_' + id + ' .J_SkuOrigNum');
								var promoPriceEls = DOM.query('#J_SkuTable_' + id + ' .J_SkuPromoPrice');
								var slen = origPriceEls.length;
								for (var n= 0; n < slen; n++) {
									sop = Number(origPriceEls[n].value);
									spp = sop + addNum
									promoPriceEls[n].value = spp;
									if ((H.util.checkPrice(spp)[0] && spp!=0) || (spp > 999999 || spp < 0)) {
										DOM.html(DOM.get('#J_Notice_' + id), '亲，库存范围为0-999999！');
										DOM.addClass(promoPriceEls[n], 'text-error');
										DOM.replaceClass('#J_Opertion_' + id, 'J_Abled', 'J_DisAbled');
										DOM.attr('#J_check' + id, 'disabled', true);
										DOM.css('#J_Zs_' + id, 'display', 'none');
									}
									m++;
								}
							}
						}
					}
				}
				if(type == 3){
					for(var i=0; i<len; i++){
						if(checkBoxs[i].checked){
							id = checkBoxs[i].value;
							if (DOM.get('#J_ItemSkus_' + id) == null) {
								var protoNum = Number(DOM.val(DOM.get('#J_ItemNum_'+id)));
								var num = protoNum-delNum;
								if(!H.util.checkPrice(minNum)[0]){
								  num =	num > minNum ? num : minNum;
								} 
								num = num > 1 ? num : 1;
								DOM.val(DOM.get('#J_new_item_num_'+id), num);
								renum.checkNumNotice(num,id,1);
								m++;
							}else{
								var origPriceEls = DOM.query('#J_SkuTable_'+id+' .J_SkuOrigNum');
								var promoPriceEls = DOM.query('#J_SkuTable_'+id+' .J_SkuPromoPrice');
								var slen = origPriceEls.length;
								for (var n=0; n<slen ;n++) {
				    				sop = Number(origPriceEls[n].value);
									spp = sop-delNum
									
									if(!H.util.checkPrice(minNum)[0]){
									  spp =	spp > minNum ? spp : minNum;
									} 
									spp = spp > 1 ? spp : 1;
									promoPriceEls[n].value = spp;
									if((H.util.checkPrice(spp)[0] && spp!=0) || (spp > 999999 || spp < 0)){
										DOM.html(DOM.get('#J_Notice_'+id), '亲，库存范围为0-999999！');
										DOM.addClass(promoPriceEls[n], 'text-error');
										DOM.replaceClass('#J_Opertion_'+id,'J_Abled','J_DisAbled');
										DOM.attr('#J_check'+id,'disabled',true);
										DOM.css('#J_Zs_'+id,'display','none');
									}
									m++;
								}
							}
						}
					}
				}
				if(m == 0){
						new H.widget.msgBox({
								    title:"错误提示",
								    content:'未选择任何宝贝！',
								    type:"error",
									autoClose:true,
									timeOut :2000
								
								});
				
				return false;
				}
				return true;
			},
			revertItemNum : function() {
				if(!showPermissions('editor_tool','工具箱')){return ;}
				if(isVersionPer('tool')){return ;}	
				if(!renum.checkBoxs){
					var checkBoxs = DOM.query('#J_PromotionItemList .J_CheckBox');
				}else{
					var checkBoxs = renum.checkBoxs;
				}
				
				var len = checkBoxs.length;
				var m=0;
				for(i=0; i<len; i++){
					if(checkBoxs[i].checked && !checkBoxs[i].disabled){
						id = checkBoxs[i].value;
						if (DOM.get('#J_ItemSkus_' + id) == null) {
							var protoNum = Number(DOM.val(DOM.get('#J_ItemNum_' + id)));
							var num = protoNum ;
							DOM.val(DOM.get('#J_new_item_num_' + id), num);
							renum.checkNumNotice(num, id,1);
							m++;
						}else{
							var origPriceEls = DOM.query('#J_SkuTable_' + id + ' .J_SkuOrigNum');
							var promoPriceEls = DOM.query('#J_SkuTable_' + id + ' .J_SkuPromoPrice');
							var slen = origPriceEls.length;
							for (var n= 0; n < slen; n++) {
								sop = Number(origPriceEls[n].value);
								spp = sop
								promoPriceEls[n].value = spp;
								if ((H.util.checkPrice(spp)[0] && spp!=0) || (spp > 999999 || spp < 0)) {
									DOM.html(DOM.get('#J_Notice_' + id), '亲，库存范围为0-999999！');
									DOM.addClass(promoPriceEls[n], 'text-error');
									DOM.replaceClass('#J_Opertion_' + id, 'J_Abled', 'J_DisAbled');
									DOM.attr('#J_check' + id, 'disabled', true);
									DOM.css('#J_Zs_' + id, 'display', 'none');
								}
								m++;
							}
						}
					}
				}
				if(m == 0){		
	 				new H.widget.msgBox({
								    title:"错误提示",
								    content:'未选择任何宝贝！',
								    type:"error",
									autoClose:true,
									timeOut :2000
								
								});
				
	 				return;
				}
				var json = [];
				for(i=0; i<len; i++){
					if(checkBoxs[i].checked && !checkBoxs[i].disabled){
						id = checkBoxs[i].value;
						var r = renum.generalSpecParams(id);
						var itemTitle = H.util.strProcess(DOM.val(DOM.get('#J_ItemTitle_'+id)));
						var pic_url = DOM.val(DOM.get('#J_ItemPic_'+id));
						var	error = r[0];
						var params = r[1];
							paramsStr = ', "params":' + KISSY.JSON.stringify(params);
						if (error === false) {
							var o = '{"id":"' + id + '"'+ paramsStr + ',"title":"'+itemTitle+ '", "pic_url":"' + pic_url+'"}';
							o = eval('(' + o + ')');
			            	json.push(o);
						}else{
							return ;
						}
					}
				}
				var itemsJson = KISSY.JSON.stringify(json);
				var data = "items="+itemsJson+"&form_key="+FORM_KEY;
		
		        var submitHandle = function(o) {
						DOM.attr('#J_TCheckAll','checked',false);
						renum.msg.hide();
		        	 	new H.widget.msgBox({ 
				 			type: "sucess", 
				 			content: "取消成功",
							dialogType:"msg", 
							autoClose:true, 
							timeOut:3000
						});
			    };
			    var errorHandle = function(o){
						renum.msg.hide();
			    		new H.widget.msgBox({
						    title:"错误提示",
						    content:o.desc,
						    type:"error"
						});	
					return;
			    };
				new H.widget.asyncRequest().setURI(updateTitleUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
				
			},
			checkNumNotice : function(el ,id,type) {
				if(type == 1 ){
					var str = Number(el);	
				}else{
					var str = Number(el.value);	
				}
				if((H.util.checkPrice(str)[0] && str!=0) || (str > 999999 || str < 0)){
					DOM.html(DOM.get('#J_Notice_'+id), '亲，库存范围为0-999999！');
					DOM.addClass(el, 'text-error');
					DOM.replaceClass('#J_Opertion_'+id,'J_Abled','J_DisAbled');
					DOM.attr('#J_check'+id,'disabled',true);
					DOM.css('#J_Zs_'+id,'display','none');
					return ;
				}			
				DOM.html(DOM.get('#J_Notice_'+id), '');
				DOM.replaceClass('#J_Opertion_'+id,'J_DisAbled','J_Abled');
				DOM.attr('#J_check'+id,'disabled',false);
				DOM.css('#J_Zs_'+id,'display','none');
				DOM.removeClass(el, 'text-error');
			},
			//单个上传
			updateNum : function(id) {
				if(!showPermissions('editor_tool','工具箱')){return ;}
				if(isVersionPer('tool')){return ;}	
				//renum.previewNum();
				if(DOM.attr('#J_ChangeNum','checked') || DOM.attr('#J_AddNum','checked') || DOM.attr('#J_DelNum','checked')){
					if((DOM.attr('#J_ChangeNum','checked')&&DOM.val('#J_Direct_Num')=='')||(DOM.attr('#J_AddNum','checked')&&DOM.val('#J_Add_Num')=='')||(DOM.attr('#J_DelNum','checked')&&DOM.val('#J_Del_Num')=='')){
						new H.widget.msgBox({
			                title: "",
			                content: "已选项代码区域不能为空，请检查！",
			                type: "error",
			                buttons: [{ value: "Ok"}],
							autoClose:true,
							timeOut :1000
			                
			            });
						return false;
					}
					renum.changeNum();
				}
				
				DOM.attr('#J_check'+id,'checked',true);
				var r = renum.generalSpecParams(id);
				var itemTitle = H.util.strProcess(DOM.val(DOM.get('#J_ItemTitle_'+id)));
				var pic_url = DOM.val(DOM.get('#J_ItemPic_'+id));
				var	error = r[0];
				var params = r[1];
					paramsStr = ', "params":' + KISSY.JSON.stringify(params);
				var json = [];
				if (error === false) {
					var o = '{"id":"' + id + '"'+ paramsStr + ',"title":"'+itemTitle+ '", "pic_url":"' + pic_url+'"}';
					o = eval('(' + o + ')');
		        	json.push(o);
				}else{
					return ;
				}		
				var itemsJson = KISSY.JSON.stringify(json);
				var data = "items="+itemsJson+"&form_key="+FORM_KEY;	
		        var submitHandle = function(o) {
		        	  new H.widget.msgBox({ 
				 			type: "sucess", 
				 			content: "成功修改",
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
					return;
			    };
				new H.widget.asyncRequest().setURI(updateTitleUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},			
			//批量上传
			addSelectItemsUpdateNum : function() {
				if(!showPermissions('editor_tool','工具箱')){return ;}
				if(isVersionPer('tool')){return ;}	
				if(!renum.checkBoxs){
					var checkBoxs = DOM.query('#J_PromotionItemList .J_CheckBox');
				}else{
					var checkBoxs = renum.checkBoxs;
				}
				
		//		if(!DOM.attr('#J_ChangeNum','checked') && !DOM.attr('#J_AddNum','checked') && !DOM.attr('#J_DelNum','checked')){
		//			H.renum.msg.setMsg('<div class="point relative"><div class="point-w-1">请选择代码修改方式！</div></div>').showDialog();
		//			return;
		//		}
		//		if((DOM.attr('#J_ChangeNum','checked')&&DOM.val('#J_Direct_Num')=='')||(DOM.attr('#J_AddNum','checked')&&DOM.val('#J_Add_Num')=='')||(DOM.attr('#J_DelNum','checked')&&DOM.val('#J_Del_Num')=='')){
		//			H.renum.msg.setMsg('<div class="point relative"><div class="point-w-1">已选项代码区域不能为空，请检查！</div></div>').showDialog();
		//			return;
		//		}
//				renum.previewed = true;
//				if(renum.previewed){
//					var flag = renum.changeNum();
//					if(!flag){
//						return ;
//					}
//				}
				if(DOM.attr('#J_ChangeNum','checked') || DOM.attr('#J_AddNum','checked') || DOM.attr('#J_DelNum','checked')){
					if((DOM.attr('#J_ChangeNum','checked')&&DOM.val('#J_Direct_Num')=='')||(DOM.attr('#J_AddNum','checked')&&DOM.val('#J_Add_Num')=='')||(DOM.attr('#J_DelNum','checked')&&DOM.val('#J_Del_Num')=='')){
						new H.widget.msgBox({
			                title: "",
			                content: "已选项代码区域不能为空，请检查！",
			                type: "error",
			                buttons: [{ value: "Ok"}],
							autoClose:true,
							timeOut :1000
			                
			            });
						return false;
					}
					renum.changeNum();
				}
				renum.msg = new H.widget.msgBox({ type: "error",
	                content: "系统正在处理中",
	 				dialogType:"loading"
	            });
				var len = checkBoxs.length;
				var m=0;
				var json = [];
				for(i=0; i<len; i++){
					if(checkBoxs[i].checked && !checkBoxs[i].disabled){
						id = checkBoxs[i].value;
						var r = renum.generalSpecParams(id);
						var itemTitle = H.util.strProcess(DOM.val(DOM.get('#J_ItemTitle_'+id)));
						var pic_url = DOM.val(DOM.get('#J_ItemPic_'+id));
						var	error = r[0];
						var params = r[1];
							paramsStr = ', "params":' + KISSY.JSON.stringify(params);
						if (error === false) {
							var o = '{"id":"' + id + '"'+ paramsStr + ',"title":"'+itemTitle+ '", "pic_url":"' + pic_url+'"}';
							o = eval('(' + o + ')');
			            	json.push(o);
						}else{
							return ;
						}
						m++;
					}
				}
				if(m == 0){
					
					renum.msg.hide();
						new H.widget.msgBox({
								    title:"错误提示",
								    content:'未选择任何宝贝！',
								    type:"error",
									autoClose:true,
									timeOut :2000
								
								});
						return;
				}
				var itemsJson = KISSY.JSON.stringify(json);
				var data = "items="+itemsJson+"&form_key="+FORM_KEY;
		
		        var submitHandle = function(o) {
					DOM.attr('#J_TCheckAll','checked',false);
					renum.msg.hide();
	        	 	new H.widget.msgBox({ 
			 			type: "sucess", 
			 			content: "成功修改",
						dialogType:"msg", 
						autoClose:true, 
						timeOut:3000
					});
	        	 	
	        	 	if (renum.paginator) {
	        	 		renum.paginator.toPage(renum.paginator.page);
                    }else {
                    	renum.searchTbItems();
                    }
	        	 	
			    };
			    var errorHandle = function(o){
						renum.msg.hide();
			    		new H.widget.msgBox({
						    title:"错误提示",
						    content:o.desc,
						    type:"error"
						});	
					return;
			    };
				new H.widget.asyncRequest().setURI(updateTitleUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			toggleSku : function(id) {
				var skuTable = DOM.get('#J_SkuTable_'+id);
				if (DOM.hasClass(skuTable, 'ks-hidden')) {
					DOM.removeClass(skuTable, 'ks-hidden');
				} else {
					DOM.addClass(skuTable, 'ks-hidden');
				}
				
			},
			generalSpecParams : function(id) {
				var r = [];
				var params = [];
				var error = false;
				if (DOM.get('#J_ItemSkus_'+id) == null) {
					var itemNum =  Number(DOM.val(DOM.get('#J_new_item_num_'+id)));
					if((H.util.checkPrice(itemNum)[0] && itemNum!=0) || (itemNum > 999999 || itemNum < 0)){
						DOM.html(DOM.get('#J_Notice_'+id), '亲，库存范围为0-999999！');
						DOM.addClass('#J_new_item_num_'+id, 'text-error');
						DOM.replaceClass('#J_Opertion_'+id,'J_Abled','J_DisAbled');
						DOM.attr('#J_check'+id,'disabled',true);
						DOM.css('#J_Zs_'+id,'display','none');
						error = true ;
					}		
					params.push(itemNum);
					r.push(error);
					r.push(params);
					return r;
				}else{
					var skusProperties = DOM.val(DOM.get('#J_ItemSkus_'+id));
					var skusPropName = DOM.val(DOM.get('#J_PropsName_'+id));
					var skusPropValue = H.util.strProcess(DOM.val(DOM.get('#J_PropsValue_'+id)));
		
					var skus = [];
					var skuOrigPrices = '';
					var skuPromoPrices = '';
					var origPriceEls = DOM.query('#J_SkuTable_'+id+' .J_SkuOrigNum');
					var promoPriceEls = DOM.query('#J_SkuTable_'+id+' .J_SkuPromoPrice');
					var len = origPriceEls.length;
					for (var i=0; i<len ;i++) {
						spp = Number(promoPriceEls[i].value);
						sop = Number(origPriceEls[i].value);
						if((H.util.checkPrice(spp)[0] && spp!=0) || (spp > 999999 || spp < 0)){
							DOM.html(DOM.get('#J_Notice_'+id), '亲，库存范围为0-999999！');
							DOM.addClass(promoPriceEls[i], 'text-error');
							DOM.replaceClass('#J_Opertion_'+id,'J_Abled','J_DisAbled');
							DOM.attr('#J_check'+id,'disabled',true);
							DOM.css('#J_Zs_'+id,'display','none');
							error = true ;
							r.push(error);
							r.push(params);
							return r;
						}
						skuPromoPrices += promoPriceEls[i].value + ',';
						skuOrigPrices += origPriceEls[i].value + ',';
					}
					skuOrigPrices = skuOrigPrices.substring(0, (skuOrigPrices.length-1));
					skuPromoPrices = skuPromoPrices.substring(0, (skuPromoPrices.length-1));
					skus.push(skuOrigPrices);
					skus.push(skuPromoPrices);
					skus.push(skusProperties);
					skus.push(skusPropName);
					skus.push(skusPropValue);
					params.push(skus);
					r.push(error);
					r.push(params);
					return r;
				}
				DOM.html(DOM.get('#J_Notice_'+id), '');
				DOM.replaceClass('#J_Opertion_'+id,'J_DisAbled','J_Abled');
				DOM.attr('#J_check'+id,'disabled',false);
				DOM.css('#J_Zs_'+id,'display','none');
				DOM.removeClass(el, 'text-error');
			}
};
},{
    requires: ['utils/showPages/index','utils/beautifyForm/index','bui/select']
});
