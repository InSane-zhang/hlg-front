/*
combined files : 

utils/showPages/index
utils/beautifyForm/index
page/defense-init

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
KISSY.add('page/defense-init',function(S,showPages,Overlay,Calendar,Tooltip,beautifyForm){
	var S = KISSY,DOM = S.DOM, Event = S.Event;	
	return defenseControl = {
			panel : null,
		   	msg : null,
		   	msgTip : null,
		   	init : function() {
				defenseControl.Form = new beautifyForm();
				defenseControl.searchTbItems();
				Event.delegate(document,'mouseenter','.J_BuyerNick',function(ev){
						var tid = DOM.attr(ev.currentTarget,'data-tid');
						var buyer_nick = DOM.attr(ev.currentTarget,'data-nick');
						var submitHandle = function(o) {
							if(!defenseControl.msgTip){
								defenseControl.msgTip = new Tooltip.Tip({
									trigger : '.J_BuyerNick',
									alignType : 'top', 
									offset : 10,
									elCls : 'ui-tip',
									title : '<div class="time"></div>'
								})
								defenseControl.msgTip.render();	
							}
							DOM.html('.time',o.payload.body)
						};
						var errorHandle = function(o){
							
						};
						var data = "tid="+tid+"&buyer_nick="+buyer_nick;
						new H.widget.asyncRequest().setURI(buyerDetailTbItemsUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();						
				})
				Event.on('.J_Open','click',function(){
					window.location.href = openTbItemsUrl;
				})
				Event.on('.search-btn','click',function(){
					defenseControl.searchTbItems();
				})
				Event.delegate(document,'click','.list-item',function(ev){
					var id = DOM.attr(ev.currentTarget,'data-id');
					//DOM.attr('.J_CheckBox_'+id,'checked',true);
                    var liCheckbox = DOM.get('#J_CheckBox_'+id);
                    if(!liCheckbox.disabled){
	                    if(!liCheckbox.checked){					
	                    	defenseControl.Form.setCheckboxOn('#J_CheckBox_'+id);
	                    }else{
	                    	defenseControl.Form.setCheckboxOff('#J_CheckBox_'+id);
	                    }
                    }
				})
		        var starttime = new Calendar.DatePicker({
			            trigger:'.timing',
			            autoRender : true,
			            showTime : true
			    });					
				Event.delegate(document,'click','.lists',function(ev){
					var type = DOM.attr(ev.currentTarget,'data-type');
					var buyer_nick = DOM.attr(ev.currentTarget,'data-nick');
		 	        var dialog = new Overlay.Dialog({
		 	             title:'加入',
		 	             width:330,
		 	             height:200,
		 	             mask:false,
	     	             buttons:[
		     	                   {
		     	                     text:'确定',
		     	                     elCls : 'bui-button bui-button-primary',
		     	                     handler : function(){
		     	                       this.hide();
		     	                       var memo = DOM.val('#J_TestPlaceholder');
		     	                       defenseControl.add(type,buyer_nick,memo);
		     	                       
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
		 	           if(type == '1'){
		 	        	  dialog.set('bodyContent','<div style="text-align: center;font-size:14px;font-weight:bold;"><a class="caps-icon"></a>&nbsp;确定将用户加入黑名单吗？<br/><br/><input type="text" id="J_TestPlaceholder" class="input-text-2 J_Placeholder" name="name_for_it" value="" placeholder="添加备注（10字以内）" style="width:180px;"></div>');
		 	        	  return false;
		 	           }else if(type == '2'){
		 	        	 dialog.set('bodyContent','<div style="text-align: center;font-size:14px;font-weight:bold;"><a class="caps-icon"></a>&nbsp;确定将用户加入白名单吗？<br/><br/><input type="text" id="J_TestPlaceholder" class="input-text-2 J_Placeholder" name="name_for_it" value="" placeholder="添加备注（10字以内）" style="width:180px;"></div>');
		 	        	 return false;
		 	           }		 	           
				})
				Event.on("#J_BottonCheckAll", "click", defenseControl.checkAll);
				
 	    	    Event.on('.J_BatchDelete','click',defenseControl.batchDelete); 			
 	    	    Event.on('.J_BatchAddBlack','click',defenseControl.batchAddBlack); 
 	    	    Event.on('.J_BatchAddWhite','click',defenseControl.batchAddWhite); 
		 	           
			},
			//批量加入黑名单
			batchAddBlack : function() {
	    	    var CheckBox = DOM.query('#J_TbItemList .c_on');
		    	    var len = CheckBox.length;
					var json = [];
	        	    for(i=0; i<len; i++){ 
						var buyer_nick = DOM.attr(CheckBox[i],'data-nick');
						var o = '{"buyer_nick":"' + buyer_nick+ '"}';
						o = eval('(' + o + ')');	
						json.push(o);
	        	    }
					var itemsJson = KISSY.JSON.stringify(json);
	        	var submitHandle = function(o) {
	        		defenseControl.searchTbItems();
	        		defenseControl.Form.setCheckboxOff(DOM.get('#J_BottonCheckAll'));
	        	};
        	    var errorHandle = function(o){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
        	    	return;
        	    };
				new H.widget.msgBox({ 
			 			type: "sucess", 
			 			content: "系统处理中，请稍等...",
						dialogType:"loading", 
						autoClose:true
						//timeOut:3000
					});
				var data = "items="+itemsJson+"&type="+1;
	        	new H.widget.asyncRequest().setURI(batchAddTbItemsUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			}, 	
			//批量加入白名单
			batchAddWhite : function() {
	    	    var CheckBox = DOM.query('#J_TbItemList .c_on');
		    	    var len = CheckBox.length;
					var json = [];
	        	    for(i=0; i<len; i++){ 
						var buyer_nick = DOM.attr(CheckBox[i],'data-nick');
					var o = '{"buyer_nick":"' + buyer_nick+ '"}';
					o = eval('(' + o + ')');	
					json.push(o);
	        	    }
					var itemsJson = KISSY.JSON.stringify(json);
	        	var submitHandle = function(o) {
	        		defenseControl.searchTbItems();
	        		defenseControl.Form.setCheckboxOff(DOM.get('#J_BottonCheckAll'));
	        	};
        	    var errorHandle = function(o){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
        	    	return;
        	    };
				new H.widget.msgBox({ 
			 			type: "sucess", 
			 			content: "系统处理中，请稍等...",
						dialogType:"loading", 
						autoClose:true
						//timeOut:3000
					});
				var data = "items="+itemsJson+"&type="+2;
	        	new H.widget.asyncRequest().setURI(batchAddTbItemsUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			}, 			
			//批量删除
			batchDelete : function() {
		    	    var CheckBox = DOM.query('#J_TbItemList .c_on');
 		    	    var len = CheckBox.length;
 					var json = [];
 	        	    for(i=0; i<len; i++){ 
 						var log_id = DOM.attr(CheckBox[i],'data-id');
						var o = '{"log_id":"' + log_id+ '"}';
						o = eval('(' + o + ')');	
						json.push(o);
 	        	    }
 					var itemsJson = KISSY.JSON.stringify(json);
		        	var submitHandle = function(o) {
		        		defenseControl.searchTbItems();
		        		defenseControl.Form.setCheckboxOff(DOM.get('#J_BottonCheckAll'));
		        	};
	        	    var errorHandle = function(o){
						new H.widget.msgBox({
						    title:"错误提示",
						    content:o.desc,
						    type:"error"
						});
	        	    	return;
	        	    };
					new H.widget.msgBox({ 
				 			type: "sucess", 
				 			content: "系统处理中，请稍等...",
							dialogType:"loading", 
							autoClose:true
							//timeOut:3000
						});
					var data = "items="+itemsJson;
		        	new H.widget.asyncRequest().setURI(batchDeleteTbItemsUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			}, 			
			checkAll : function(e) {
				checkBoxs = DOM.query("#J_TbItemList .J_CheckBox");
				len = checkBoxs.length;
				for(i=0; i<len; i++){
					var iid = checkBoxs[i].value;
					if(checkBoxs[i].disabled) continue;
					if(this.checked){
						defenseControl.Form.setCheckboxOn(checkBoxs[i]);
					} else {
						defenseControl.Form.setCheckboxOff(checkBoxs[i]);
					}
				}
			}, 	 			
			add : function(type,buyer_nick,memo){
                var submitHandle = function(o) {
                	defenseControl.searchTbItems();
        	    };
        	    var errorHandle = function(o){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
        	    };
				var data = "type="+type+"&buyer_nick="+buyer_nick+"&memo="+memo;
        	    new H.widget.asyncRequest().setURI(blackAddTbItemsUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();				
			},
	        searchTbItems : function() {
                var submitHandle = function(o) {
	        	    totalRecords = o.payload.totalRecords;
					if(totalRecords > 0){
						DOM.hide('#J_Empty');
					} else {
						DOM.show('#J_Empty');
					}
					defenseControl.renderItems(o.payload.body);
					pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					defenseControl.paginator = new showPages('defenseControl.paginator').setRender(defenseControl.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
					//defenseControl.paginator = new showPages('defenseControl.paginator').setRender(defenseControl.handlePagination).setPageCount(pageCount).printHtml('#J_TopPaging',3);
  					DOM.hide('#J_LeftLoading');
 					DOM.show('#J_MainContent');
 					defenseControl.Form = new beautifyForm();
        	    };
        	    var errorHandle = function(o){
        	    	defenseControl.msg.setMsg(o.desc).show();
        	    };
				DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainContent');
				var start_time = DOM.val('#J_start_date');
				var end_time = DOM.val('#J_end_date');
				var q = DOM.val('#J_Search');
				if(q == '订单号、用户昵称'){
					var q = '';
				}else{
					q = q;
				}
				
				var data = "start_time="+start_time+"&end_time="+end_time+"&q="+q+'&page_size='+10;
        	    new H.widget.asyncRequest().setURI(loadTbItemsUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
			},
			// 渲染 TbItems
			renderItems: function(c) {
        	    DOM.html(DOM.get("#J_TbItemList"), c,true);
	        	Event.on(DOM.query('#J_TbItemList .J_CheckBox'),'click',function(ev){
	        		if(this.checked){
	        			var checkBoxs = DOM.query("#J_TbItemList .J_CheckBox");
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
	        				defenseControl.Form.setCheckboxOn(DOM.get('#J_BottonCheckAll'));
	        			}
	        		}else{
	        			defenseControl.Form.setCheckboxOff(DOM.get('#J_BottonCheckAll'));
	        		}
	        	});          	    
			},
			handlePagination : function(turnTo) {
		    	pageId = turnTo;
	    		var submitHandle = function(o) {
	    			 totalRecords = o.payload.totalRecords;
					 if(totalRecords > 0){
						DOM.hide('#J_Empty');
					 } else {
						DOM.show('#J_Empty');
					 }
					 pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					 defenseControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
					 defenseControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_TopPaging',3);
					 defenseControl.renderItems(o.payload.body);
					 defenseControl.Form = new beautifyForm();
					 defenseControl.Form.setCheckboxOff(DOM.get('#J_BottonCheckAll'));
  					 DOM.hide('#J_LeftLoading');
 					 DOM.show('#J_MainContent');
		    	};
				var start_time = DOM.val('#J_start_date');
				var end_time = DOM.val('#J_end_date');
				var q = DOM.val('#J_Search');
				if(q == '订单号、用户昵称'){
					var q = '';
				}else{
					q = q;
				}
				
				var data = "start_time="+start_time+"&end_time="+end_time+"&q="+q+'&page_size='+10+"&page_id="+pageId;
				DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainContent');    	    	
        	    new H.widget.asyncRequest().setURI(loadTbItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			}			
					 	
    	}
	
},{
	requires : ['utils/showPages/index','bui/overlay','bui/calendar','bui/tooltip','utils/beautifyForm/index']
});
