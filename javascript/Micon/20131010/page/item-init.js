/*
combined files : 

utils/showPages/index
utils/beautifyForm/index
page/item-init

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
/**
 * @fileOverview 
 * @author  
 */
KISSY.add('page/item-init',function (S,showPages,beautifyForm,Select,Switchable) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
       return  	iconControl = {
	         		panel : null,
	                msg : null,
	         		paginator : null,
	         		currentMode : step,
					promotionItemPaginator: null,
					isTarget : false,
	                init : function(){
    	   
    	   				iconControl.Form = new beautifyForm();
			    	   window.tabs = new Switchable.Tabs('#J_main',{
							triggerType: 'click',
							contentCls:'main-content',
							activeTriggerCls: 'current'
						}).on('beforeSwitch',function(ev){
								var index = ev.toIndex;
								if(index == 1){
									if(iconControl.hasItems() && !iconControl.isTarget){
										iconControl.isTarget = true;
										new H.widget.msgBox({
										    title: "操作提示",
										    content: "将勾选的宝贝加入列表吗",
										    type: "confirm",
										    buttons: [{ value: "确定" }, { value: "取消" }],
										    success: function (result) {
										        if (result == "确定") {
										        	iconControl.addSelectItemsToPromotion();
										        }
										    },
										    beforeClose: function () { tabs.switchTo(1);}
										});
										return  false;
									}else{
										iconControl.currentMode = '2';
										DOM.hide('.J_Seach_1');
										DOM.show('.J_Seach_2');
										if(iconControl.promotionItemPaginator){
											iconControl.promotionItemPaginator.toPage(iconControl.promotionItemPaginator.page);
										}else{
											iconControl.loadPromotionItems();
										}
									}
									
								}else{
									iconControl.currentMode = '1';
									DOM.show('.J_Seach_1');
									DOM.hide('.J_Seach_2');
									if(DOM.val('#J_Item_Local') == 0){
										DOM.show('.J_TaoBaoItem');
								  		DOM.hide('.J_LocalItem');
									}else{
										DOM.hide('.J_TaoBaoItem');
										DOM.show('.J_LocalItem');
									}
									iconControl.isTarget = false;
									if(iconControl.paginator){
										iconControl.paginator.toPage(iconControl.paginator.page);
									}else{
										iconControl.searchTbItems();
									}
								}
							})
							if(iconControl.currentMode == 1){
								iconControl.searchTbItems();
							}else{
								tabs.switchTo(1);
							}
							   /*下一步*/
				   	         Event.on('#J_NextStep','click',function(ev){
				   	        	tabs.switchTo(1);
								 });	
								 /*上一步*/
				   	         Event.on('#J_BaceStep','click',function(ev){
				   	        	tabs.switchTo(0);
								 });
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
							// 全部 出售中 库中
							var Sellingitems = [
						      {text:'全部',value:'0'},
						      {text:'出售中',value:'1'},
						      {text:'库中',value:'2'}
						    ],
						    SellingSelect = new Select.Select({  
							    render:'#J_SelectItemSelling',
						      	valueField:'#J_SearchSelling',
						      	items:Sellingitems
							});
							SellingSelect.render();
							SellingSelect.setSelectedValue('0');
							
							//默认排序
							var items3 = [
								{text:'默认排序',value:'3'},
								{text:'上架时间:早',value:'0'},
								{text:'上架时间:晚',value:'1'}
									     
							],
							sortSelect = new Select.Select({  
								render:'#J_SelectItemSort',
								valueField:'#J_SelectItemSortHide',
								items:items3
							});
							sortSelect.render();
							sortSelect.setSelectedValue('0');
							sortSelect.on('change', function(ev){
								iconControl.searchTbItems();
							});
    	   
							//店铺的宝贝
							var items6 = [
								{text:'店铺中宝贝',value:'0'},
								{text:'活动中宝贝',value:'1'}
							];
							var typeSelect1 = new Select.Select({  
								render:'#J_SelectTypeBox2',
								valueField:'#J_Item_Local',
								items:items6
							}).render().disable();
							DOM.css(typeSelect1.get('picker').get('el'),'display','none');
							var typeSelect2 = new Select.Select({  
								render:'#J_SelectTypeBox3',
								valueField:'#J_Item_Local',
								items:items6
							}).render().disable();
							DOM.css(typeSelect2.get('picker').get('el'),'display','none');
							
							var typeSelect = new Select.Select({  
								render:'#J_SelectTypeBox',
								valueField:'#J_Item_Local',
								items:items6
							}).render();
							typeSelect.on('change', function(ev){
								if(ev.value == 0){
									DOM.show('.J_TaoBaoItem');
							  		DOM.hide('.J_LocalItem');
								}else{
									DOM.hide('.J_TaoBaoItem');
									DOM.show('.J_LocalItem');
								}
							});
							
							if(S.one('#J_PromoListBox')){
								//选择活动
								var promoSelect = new Select.Select({  
									render:'#J_PromoListBox',
									valueField:'#J_PromoId',
									items:S.JSON.parse(promoList)
								}).render().on('change', function(ev){
									iconControl.searchTbItems();
								});
								//promoSelect.setSelectedValue(0);
							}
							
	    					var items4 = [
								{text:'状态',value:'0'},
								{text:'等待处理',value:'2'},
								{text:'处理失败',value:'1'},
								{text:'成功加入',value:'3'}
									     
							],
							statusSelect = new Select.Select({  
								render:'#J_SearchStatusBox',
								valueField:'#J_SearchStatus',
								items:items4
							});
							statusSelect.render();
							statusSelect.setSelectedValue(status);
							statusSelect.on('change', function(ev){
								iconControl.loadPromotionItems();
							});
							Event.on(DOM.query('.J_Tiger'),'mouseenter mouseleave',function(ev){
   		     	        	  if(ev.type == 'mouseenter'){
   		     	        		  DOM.addClass(ev.currentTarget,'current');
   		     	        	  }else{
   		     	        		 DOM.removeClass(ev.currentTarget,'current');
   		     	        	  }
	   		     	          })
	   		     	          Event.on(DOM.query('.J_Page'),'click',function(ev){
	   		     	        	  var v = DOM.attr(ev.currentTarget,'data');
	   			 					if (iconControl.currentMode == '1' ) {
	   			 						 DOM.removeClass(DOM.query('#J_TopLeft .J_Page'),'active');
	   			 						 DOM.addClass(ev.currentTarget,'active');
	   			 						DOM.html(DOM.get('#J_TopLeft .value'),v);
	   			 						 DOM.val('#J_SelectItemPage',v);
	   			 						iconControl.searchTbItems();
	   			 					}else{
	   			 						DOM.removeClass(DOM.query('#J_TopRight .J_Page'),'active');
	   			 						DOM.addClass(ev.currentTarget,'active');
	   			 						DOM.html(DOM.get('#J_TopRight .value'),v);
	   			 						 DOM.val('#J_RightSelectItemPage',v);
	   			 						iconControl.loadPromotionItems();
	   			 					}
	   		     	          })
    	   
						var timeFunName = null;
					    Event.delegate(document,'click dblclick','#J_TopAddToPromo',function(ev){
					    	if(ev.type == 'click'){
					        	 clearTimeout(timeFunName);
					        	 timeFunName = setTimeout(function () {
					                 //console.log('单击');
					                 iconControl.addSelectItemsToPromotion();
					              }, 300); 
					    	}
					         if(ev.type == 'dblclick') {
					        	 clearTimeout(timeFunName); 
					        	 //console.log('双击');
					        	 iconControl.addSelectItemsToPromotion();
					         }
					    });
						Event.on(doc, 'keydown', function(evt) {
							if ( evt.which === 13) {
								if(iconControl.paginator){
									iconControl.paginator.toPage(iconControl.paginator.page);
								}else{
									iconControl.searchTbItems();
								}
							}
						})
		                /*编辑宝贝授权 批量重试*/
		                Event.delegate(document,'click dblclick','.J_removeToPromo',function(ev){
		                    if(!showPermissions('editor_icon','促销图标')){
		                        return ;
		                     }
	                        var type = DOM.attr(ev.currentTarget,'tid');
	                        DOM.val('#J_ExpiredActionType',type);
                            iconControl.batchRetry();
		                })
		    	    	Event.on('#J_TopCheckAll','click',iconControl.checkAll);  //淘宝宝贝全选
		    	    	
						Event.on("#J_RightCheckAll", "click", iconControl.rightCheckAll);
				    	Event.on("#J_RightBottonCheckAll", "click", iconControl.rightCheckAll);
				    	
				    	Event.on('#J_RightSearchBtn','click',function(ev){
							if(iconControl.currentMode == '1'){
								iconControl.searchTbItems();
							} else if(iconControl.currentMode == '2'){
								iconControl.loadPromotionItems();
							}
						});	
				    	
		 	    	    //Event.on('#J_BatchAddBtn','click',iconControl.batchAddItems); //批量添加到活动中
		 	    	    Event.on('#J_RemovePromotionItems','click',iconControl.removePromotionItemHandle); //从活动
	                }, 	
	                hasItems: function() {
	    				checkBoxs = DOM.query("#J_TbItemList .J_CheckBox");
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
	         		searchTbItems : function(flag) {
		                var submitHandle = function(o) {
		                	DOM.removeClass(".J_ItemSelectBtnHolder",'ks-hidden');
			        	    totalRecords = o.payload.totalRecords;
							if(totalRecords > 0){
								DOM.get('#J_LEmpty').style.display = 'none';
								DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'');
							} else {
								DOM.get('#J_LEmpty').style.display = '';
								DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'none');
							}
							iconControl.renderItems(o.payload.body);
							pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
							iconControl.paginator = new showPages('iconControl.paginator').setRender(iconControl.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
							iconControl.paginator.printHtml('#J_TopPaging',3);
							DOM.hide('#J_LeftLoading');
					    	DOM.show('#J_MainLeftContent');
		        	    };
		        	    var errorHandle = function(o){
							DOM.hide('#J_LeftLoading');
					    	DOM.show('#J_MainLeftContent');
		        	    	new H.widget.msgBox({
							    title:"错误提示",
							    content:o.desc,
							    type:"error",
								autoClose : true,
								timeOut : 3000
							});
		        	    };
						var itemType = DOM.val('#J_Item_Local');
			        	 if(DOM.val(DOM.get("#J_SearchTitle")) != '关键字、商品链接、商品编码'){
		        	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
		        	    }else{
		        	    	var title ='';
		        	    }
						var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
						if(itemType == '1'){
							var promoId = DOM.val(DOM.get("#J_PromoId"));
							var data = "q="+title+"&pageSize="+itemPage;
								data +="&pid="+pid+"&promoId="+promoId;
						}else{
							var cid = DOM.val(DOM.get("#J_SelectItemCid")); //类目
			    	    	var type = DOM.val(DOM.get("#J_SearchSelling")); //出售中 库中
			    	    	var itemOrder = DOM.val(DOM.get("#J_SelectItemOrder"));//排序方式
			    	    	
			    	    	var data = "q="+title+"&cid="+cid+"&type="+type;
			            	    data +="&itemOrder="+itemOrder+"&pageSize="+itemPage;
								data +="&pid="+pid
			    	    	if (type == 0) {
								//价格区间
								var startPrice = DOM.val(DOM.get("#J_StartPrice"));
								var endPrice = DOM.val(DOM.get("#J_EndPrice"));
								data += "&start_price="+startPrice+"&end_price="+endPrice;
							}
						}
						data +="&itemType="+itemType;
						if(itemType == 1 && title == ''){
							var url = PROMO_URL+'&pid='+promoId+'&add=1'
							var promoName =  '';
							var str ='<div><div  class="no-details-pic no-details-cry"></div>'+
				            		 '<div class="prompt-1"><span>'+promoName+'活动中没有任何宝贝,<a href="'+url+'">点此添加</a>。</span></div></div>';
							DOM.html('#J_LEmpty',str);
						}else{
							var str ='<div><div class="no-details-pic no-details-cry"></div>'+
				            		 '<div class="prompt-1"><span>没有找到任何宝贝。</span></div></div>';
							DOM.html('#J_LEmpty',str);
						}
						DOM.show('#J_LeftLoading');
					    DOM.hide('#J_MainLeftContent');
		        	    new H.widget.asyncRequest().setURI(getItemsFromTbUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
					},
					renderItems: function(c) {
						DOM.html(DOM.get("#J_TbItemList"), c ,true);
			            var lis = DOM.query("#J_TbItemList .J_TbItem");
			        	Event.on(lis, "mouseenter mouseleave click", function(ev){
			        		var el = DOM.get('.J_CheckBox',ev.currentTarget);
        					if(el.disabled) return;
			        			if(ev.type == 'mouseenter' ){
				            		DOM.addClass(ev.currentTarget, 'mouseover');
				        		}else if(ev.type == 'mouseleave'){
				        			DOM.removeClass(ev.currentTarget, 'mouseover');
				            	}else if(ev.type == 'click'){
							      	if(el.checked == false){
			        				DOM.addClass(ev.currentTarget,'selected');
			        				el.checked = true;
			        			}else{
			        				DOM.removeClass(ev.currentTarget,'selected');
			        				iconControl.Form.setCheckboxOff(DOM.get('#J_TopCheckAll'));
			        				el.checked = false;
			        			}
			        		}
			        	});
	    				iconControl.Form.setCheckboxOff(DOM.get('#J_TopCheckAll'));
					},
					checkAll : function(e) {
						checkBoxs = DOM.query('#J_TbItemList .J_CheckBox');
						len = checkBoxs.length;
						for(i=0; i<len; i++){
							var iid = checkBoxs[i].value;
							if(checkBoxs[i].disabled) continue;
							if(this.checked){
								checkBoxs[i].checked = true;
								DOM.addClass('#J_TbItem_'+iid,'selected');
							} else {
								checkBoxs[i].checked = false;
								DOM.removeClass('#J_TbItem_'+iid,'selected');
							}
						}
					},
					handlePagination : function(turnTo) {
				    	pageId = turnTo;
			    		var submitHandle = function(o) {
			    			 totalRecords = o.payload.totalRecords;
							 DOM.attr('#J_TopCheckAll','checked',false);
							if(totalRecords > 0){
								DOM.get('#J_LEmpty').style.display = 'none';
								DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'');
							} else {
								DOM.get('#J_LEmpty').style.display = '';
								DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'none');
							}
							 pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
			    			iconControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
			    			iconControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_TopPaging',3);
			    			iconControl.renderItems(o.payload.body);
							DOM.hide('#J_LeftLoading');
					    	DOM.show('#J_MainLeftContent');
				    	};
							var itemType = DOM.val('#J_Item_Local');
			        	 if(DOM.val(DOM.get("#J_SearchTitle")) != '关键字、商品链接、商品编码'){
		        	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
		        	    }else{
		        	    	var title ='';
		        	    }
						var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
						if(itemType == '1'){
							var promoId = DOM.val(DOM.get("#J_PromoId"));
							var data = "q="+title+"&pageSize="+itemPage;
								data +="&pid="+pid+"&promoId="+promoId+"&page_id="+pageId;
						}else{
							var cid = DOM.val(DOM.get("#J_SelectItemCid")); //类目
			    	    	var type = DOM.val(DOM.get("#J_SearchSelling")); //出售中 库中
			    	    	var itemOrder = DOM.val(DOM.get("#J_SelectItemOrder"));//排序方式
			    	    	
			    	    	var data = "q="+title+"&cid="+cid+"&type="+type;
			            	    data +="&itemOrder="+itemOrder+"&pageSize="+itemPage;
								data +="&pid="+pid+"&page_id="+pageId
			    	    	if (type == 0) {
								//价格区间
								var startPrice = DOM.val(DOM.get("#J_StartPrice"));
								var endPrice = DOM.val(DOM.get("#J_EndPrice"));
								data += "&start_price="+startPrice+"&end_price="+endPrice;
							}
						}
						data +="&itemType="+itemType;
						DOM.show('#J_LeftLoading');
					    DOM.hide('#J_MainLeftContent');
		        	    new H.widget.asyncRequest().setURI(getItemsFromTbUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
					},
					addSelectItemsToPromotion :function(iid){
						if(!showPermissions('editor_icon','促销图标')){
							return ;
						}
						if ( DOM.hasClass('#J_TopAddToPromo', 'ing' )){
		                    	return;
			             } 
		                DOM.addClass( '#J_TopAddToPromo', 'ing');
						//DOM.removeClass( '#J_TopAddToPromo', 'ing');
		                DOM.attr('#J_TopAddToPromo','disabled',true);
						DOM.addClass('#J_TopAddToPromo','button-disabled');
						checkBoxs = DOM.query("#J_TbItemList .J_CheckBox");
						var json = [];
						len = checkBoxs.length;
						var translateDiv = DOM.get("#J_Translate");
						for(i=0; i<len; i++){
							var flag = false;
								if(checkBoxs[i].checked && !checkBoxs[i].disabled)
									 flag = true;
							if(flag == true){
		                        var id = checkBoxs[i].value;
		                        var title = H.util.strProcess(DOM.val(DOM.get('#J_ItemTitle_'+id)));
		        				var picUrl = DOM.val(DOM.get('#J_ItemPic_'+id));
		        				var price = DOM.val(DOM.get('#J_ItemPrice_'+id));
		        				var promoItmeId = DOM.val(DOM.get('#J_PromoItemId_'+id));
		        				var iconId = DOM.val(DOM.get('#J_ItemIconId_'+id));
								var outId = H.util.strProcess(DOM.val(DOM.get('#J_ItemOuterId_'+id)));
		        				var iconType = DOM.val(DOM.get('#J_ItemIconType_'+id));
		        				o = '{"id":"' + id + '", "outer_id":"' + outId + '", "title":"' + title + '", "price":"' + price + '", "pic_url":"' + picUrl +'", "promo_itme_id":"' + promoItmeId +'", "icon_id":"' + iconId +'", "icon_type":"' + iconType +'"}';
								o = eval('(' + o + ')');
		                        json.push(o);
	//	        				if(iid!=undefined){
	//	        					break;
	//	        				}
							}
			            }
						//alert(KISSY.JSON.stringify(json));
						if(json.length == 0){
							new H.widget.msgBox({
									    title:"错误提示",
									    content:'未选择任何宝贝！',
									    type:"error",
										autoClose:true,
										timeOut :2000
									
									});
							DOM.attr('#J_TopAddToPromo','disabled',false);
							DOM.removeClass('#J_TopAddToPromo','button-disabled');
							DOM.removeClass( '#J_TopAddToPromo', 'ing' )
							return;
						}
						
			            var itemsJson = KISSY.JSON.stringify(json);
			            var submitHandle = function(o) {
			            	DOM.attr('#J_TopAddToPromo','disabled',false);
							DOM.removeClass('#J_TopAddToPromo','button-disabled');
			            	if (o.payload.limit != null) {
								status= '操作失败';
								new H.widget.msgBox({
								    title:"操作失败",
								    content:o.payload.limit,
								    type:"error"
								});
		    				} 
	   						if(iconControl.paginator){
								iconControl.paginator.toPage(iconControl.paginator.page);
							}else{
								iconControl.searchTbItems();
							}
							DOM.removeClass( '#J_TopAddToPromo', 'ing' )
		        	    };
		        	    var errorHandle = function(o) {
		        	    	DOM.attr('#J_TopAddToPromo','disabled',false);
							DOM.removeClass('#J_TopAddToPromo','button-disabled');
							DOM.replaceClass('#J_TopAddToPromo','btm-caozuo-gray-none','btm-caozuo-orange');
							new H.widget.msgBox({
									    title:"错误提示",
									    content:o.desc,
									    type:"error"
									});
		            	};
		         	    var data = "pid="+pid+"&items="+itemsJson+"&form_key="+FORM_KEY;
		         	    new H.widget.asyncRequest().setURI(addPromoItemsUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
					},
	
					//搜索活动中宝贝
			    	loadPromotionItems :function() {
				    	var submitHandle = function(o) {
			        	    totalRecords = o.payload.totalRecords;
			        	    if(totalRecords > 0){
								DOM.get('#J_REmpty').style.display = 'none';	
								DOM.css(DOM.query(".J_PromotionItemBtnHolder"),'display','');
							} else {
								DOM.get('#J_REmpty').style.display = '';
								DOM.css(DOM.query(".J_PromotionItemBtnHolder"),'display','none');
							}
			        	    DOM.html(DOM.get("#J_PromotionItemList"), o.payload.body,true);
							DOM.hide('#J_RightLoading');
							DOM.show('#J_MainRightContent');
			        	    pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
							iconControl.renderPromoItems();
							iconControl.promotionItemPaginator = new showPages('iconControl.promotionItemPaginator').setRender(iconControl.promotionItemPaginationHandle).setPageCount(pageCount).printHtml('#J_PromotionItemPaging',2);
				    	};
				    	 if(DOM.val(DOM.get("#J_RightSearchTitle")) != '关键字、商品链接、商品编码'){
	        	    		var title = encodeURIComponent(DOM.val(DOM.get("#J_RightSearchTitle"))); //标题
	        	   		 }else{
	        	    		var title ='';
	        	   		 }
		        	    var status = DOM.val(DOM.get('#J_SearchStatus'));
		        	    var itemPage = DOM.val(DOM.get("#J_RightSelectItemPage"));//每页多少条
		        	    var status = DOM.val(DOM.get('#J_SearchStatus'));
		        	    var data = "pid="+pid+"&status="+status+"&q="+title+"&pageSize="+itemPage;
						DOM.show('#J_RightLoading');
						DOM.hide('#J_MainRightContent');
		        	    new H.widget.asyncRequest().setURI(loadPromotionItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
					},
					
					renderPromoItems : function(){
						var lis = DOM.query("#J_PromotionItemList .J_TbItem");
			        	Event.on(lis, "mouseenter mouseleave", function(ev){
			        		var el = DOM.get('.J_CheckBox' ,ev.currentTarget);
			        		if(el.disabled) return;
			        		if(ev.type == 'mouseenter'){
								DOM.addClass(ev.currentTarget,'hover');
			        		}else if(ev.type == 'mouseleave'){
								DOM.removeClass(ev.currentTarget,'hover')
							}
			        	})
			        	iconControl.Form.setCheckboxOff(DOM.get('#J_RightBottonCheckAll'));
	    				iconControl.Form.setCheckboxOff(DOM.get('#J_RightCheckAll'));
	    				iconControl.Form.renderAll('#J_PromotionItemList');
			        	Event.on(DOM.query('#J_PromotionItemList .J_CheckBox'),'click',function(ev){
			        		//ev.stopPropagation();
			        		var iid = ev.currentTarget.value;
			        		if(this.checked){
			        			var checkBoxs = DOM.query("#J_PromotionItemList .J_CheckBox");
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
			        				iconControl.Form.setCheckboxOn(DOM.get('#J_RightBottonCheckAll'));
									iconControl.Form.setCheckboxOn(DOM.get('#J_RightCheckAll'));
			        			}
			        		}else{
			        			iconControl.Form.setCheckboxOff(DOM.get('#J_RightBottonCheckAll'));
			        			iconControl.Form.setCheckboxOff(DOM.get('#J_RightCheckAll'));
			        		}
			        	});
					},
					promotionItemPaginationHandle : function(turnTo) {
						pageId = turnTo;
			    		var submitHandle = function(o) {
			    			DOM.get("#J_RightCheckAll").checked = false;
			    			totalRecords = o.payload.totalRecords;
			        	     if(totalRecords > 0){
								DOM.get('#J_REmpty').style.display = 'none';	
								DOM.css(DOM.query(".J_PromotionItemBtnHolder"),'display','');
							} else {
								DOM.get('#J_REmpty').style.display = '';
								DOM.css(DOM.query(".J_PromotionItemBtnHolder"),'display','none');
							}
				    		pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
			    			iconControl.promotionItemPaginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_PromotionItemPaging',2);
			    			DOM.html(DOM.get("#J_PromotionItemList"), o.payload.body);
							iconControl.renderPromoItems();
							DOM.hide('#J_RightLoading');
							DOM.show('#J_MainRightContent');
				    	};
						DOM.show('#J_RightLoading');
						DOM.hide('#J_MainRightContent');
				    	 if(DOM.val(DOM.get("#J_RightSearchTitle")) != '关键字、商品链接、商品编码'){
	        	    		var title = encodeURIComponent(DOM.val(DOM.get("#J_RightSearchTitle"))); //标题
	        	   		 }else{
	        	    		var title ='';
	        	   		 }
		        	    var status = DOM.val(DOM.get('#J_SearchStatus'));
		        	    var itemPage = DOM.val(DOM.get("#J_RightSelectItemPage"));//每页多少条
		        	    var status = DOM.val(DOM.get('#J_SearchStatus'));
		        	    var data = "pid="+pid+"&status="+status+"&q="+title+"&pageSize="+itemPage+"&page_id="+pageId;
			        	new H.widget.asyncRequest().setURI(loadPromotionItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
					},
					
					//将活动中宝贝移除
					removePromotionItemHandle : function(promo_itemid,pidi,type) {
						if(!showPermissions('editor_icon','促销图标')){
							return ;
						}
						DOM.attr('#J_RemovePromotionItems','disabled',true);
						DOM.addClass('#J_RemovePromotionItems','button-disabled');
						itemIds = [];
						if(promo_itemid && pidi){
							itemIds.push(promo_itemid);
							pid = pidi;
						}else{
							checkBoxs = DOM.query("#J_PromotionItemList .J_CheckBox");
							len = checkBoxs.length;
							for(i=0; i<len; i++){
			                    if(checkBoxs[i].checked && !checkBoxs[i].disabled){
			                    	itemIds.push(checkBoxs[i].value);
			                    }
							}
						}
						if(itemIds.length == 0){
								new H.widget.msgBox({
									    title:"错误提示",
									    content:'未选择任何宝贝！',
									    type:"error",
										autoClose:true,
										timeOut :2000
									
									});
								DOM.attr('#J_RemovePromotionItems','disabled',false);
								DOM.removeClass('#J_RemovePromotionItems','button-disabled');
							return ;
						}
						var submitHandle = function(o) {
							DOM.attr('#J_RemovePromotionItems','disabled',false);
							DOM.removeClass('#J_RemovePromotionItems','button-disabled');
							DOM.replaceClass('#J_RemovePromotionItems','btm-caozuo-gray-none','btm-caozuo-orange');
							if(iconControl.promotionItemPaginator){
								iconControl.promotionItemPaginator.toPage(iconControl.promotionItemPaginator.page);
							}else{
								iconControl.loadPromotionItems();
							}
		        	    };
		        	    var data = "pid="+pid+"&item_ids="+itemIds+"&form_key="+FORM_KEY;
		        	    new H.widget.asyncRequest().setURI(removePromotionItemUrl).setMethod("POST").setHandle(submitHandle).setData(data).send();
					},
					//活动中宝贝全选
					rightCheckAll : function(e) {
						checkBoxs = DOM.query("#J_PromotionItemList .J_CheckBox");
						len = checkBoxs.length;
						for(i=0; i<len; i++){
							var iid = checkBoxs[i].value;
							if(checkBoxs[i].disabled) continue;
							if(this.checked){
								if(e.currentTarget.id == 'J_RightCheckAll'){
									iconControl.Form.setCheckboxOn(DOM.get('#J_RightBottonCheckAll'));
								}else{
									iconControl.Form.setCheckboxOn(DOM.get('#J_RightCheckAll'));
								}
								iconControl.Form.setCheckboxOn(checkBoxs[i]);
							} else {
								if(e.currentTarget.id == 'J_RightCheckAll'){
									iconControl.Form.setCheckboxOff(DOM.get('#J_RightBottonCheckAll'));
								}else{
									iconControl.Form.setCheckboxOff(DOM.get('#J_RightCheckAll'));
								}
								iconControl.Form.setCheckboxOff(checkBoxs[i]);
							}
						}
					},
					forceDelItem :function(itemId){
						if(!showPermissions('editor_icon','促销图标')){
							return ;
						}
						var submitHandle = function(o) {
							iconControl.msg.hide();
							if(iconControl.promotionItemPaginator){
								iconControl.promotionItemPaginator.toPage(iconControl.promotionItemPaginator.page);
							}else{
								iconControl.loadPromotionItems();
							}
						};
						var data = "promo_item_id="+itemId;
						iconControl.msg = new H.widget.msgBox({
								    title:"",
									dialogType : 'loading',
								    content:'系统正在处理中，请稍候'	
								});
		        	    new H.widget.asyncRequest().setURI(forceDelUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
					},
					retry : function(itemId,force){
						if(!showPermissions('editor_icon','促销图标')){
							return ;
						}
						var submitHandle = function(o) {
							iconControl.msg.hide();
							if(iconControl.promotionItemPaginator){
								iconControl.promotionItemPaginator.toPage(iconControl.promotionItemPaginator.page);
							}else{
								iconControl.loadPromotionItems();
							}
						};
						var data = "promo_item_id="+itemId+"&force="+force;
						iconControl.msg = new H.widget.msgBox({
								    title:"",
									dialogType : 'loading',
								    content:'系统正在处理中，请稍候'	
								});
		        	    new H.widget.asyncRequest().setURI(retryUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
					},
		            batchRetry :function(){
		                var submitHandle = function(o) {
		                    iconControl.msg.hide();
		                    if(iconControl.promotionItemPaginator){
		                        iconControl.promotionItemPaginator.toPage(iconControl.promotionItemPaginator.page);
		                    }else{
		                        iconControl.loadPromotionItems();
		                    }
		                };
		                var data = "pid="+pid;
		                iconControl.msg = new H.widget.msgBox({
		                                    title:"",
		                                    dialogType : 'loading',
		                                    content:'正在处理中，请稍候' 
		                                });
		                new H.widget.asyncRequest().setURI(batchRetryUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
		            }
	        }
	
}, {
    requires: ['utils/showPages/index','utils/beautifyForm/index','bui/select','switchable']
});
