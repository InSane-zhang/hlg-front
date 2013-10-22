/*
combined files : 

utils/showPages/index
utils/beautifyForm/index
page/relistCreate-init

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
KISSY.add('page/relistCreate-init',function(S,showPages,beautifyForm,Select,Calendar){
	var S = KISSY,DOM = S.DOM,Event = S.Event,doc = document,focusElemVal = 0;
	return relistCreate = {
			paginator : null,
			toPageNum : 1,
			paginator2 : null,
			msg : null,
			planCats : null,//分类
			timer : null,
			planIdFromUrl : null,
			x : new beautifyForm,
			init : function(){
				//relistCreate.x.renderAll('#J_Step1check');
				relistCreate.planIdFromUrl = DOM.val('#J_PlanIdFromUrl');
				var stepFromUrl = DOM.val('#J_StepFromUrl'); 
				if(relistCreate.planIdFromUrl && relistCreate.planIdFromUrl>0){
					if(stepFromUrl == 1){
						DOM.show('#J_StepCont1');
					}
					if(stepFromUrl == 2){
						relistCreate.setStep2BaseHtml();
					}
					if(stepFromUrl == 3){
						relistCreate.searchStep3();
					}
					if(stepFromUrl == 4){
						DOM.removeClass(DOM.query('.ui-step-item'),'current');
						DOM.addClass('#J_Step4','current');
						var step4PreviewHtml = DOM.html('#J_StepCont4Preview');
						DOM.html('#J_StepCont',step4PreviewHtml);
						relistCreate.showRelistView();
						relistCreate.getPlanItems();
						scroll(0,0);
						var items = [
							{text:'全部',value:'0'},
							{text:'已排除',value:'1'},
							{text:'待调整',value:'2'},
							{text:'调整成功',value:'3'},
							{text:'调整失败',value:'4'}
						],
						select = new Select.Select({  
							render:'#J_Step4Status',
							valueField:'#hide3',
							items:items
						});
						select.render();
						select.setSelectedValue('0');
						var items = [
							{text:'星期',value:'0'},
							{text:'周一',value:'1'},
							{text:'周二',value:'2'},
							{text:'周三',value:'3'},
							{text:'周四',value:'4'},
							{text:'周五',value:'5'},
							{text:'周六',value:'6'},
							{text:'周日',value:'7'}
						],
						select = new Select.Select({  
							render:'#J_Step4Week',
							valueField:'#hide4',
							items:items
						});
						select.render();
						select.setSelectedValue('0');
					}
				}else{	
					DOM.show('#J_StepCont1');
				}
				//第一步勾选自动加入提示
				Event.on('#J_Step1PromptClick','click',function(ev){
					if(DOM.prop('#J_AtuoRadio','checked')){
						DOM.css('#J_Step1PromptCont','visibility','visible');
					}else{
						DOM.css('#J_Step1PromptCont','visibility','hidden');
					}
				})
				Event.on('#J_BtnPublish','click',function(){
					relistCreate.saveStep1();
					scroll(0,0);
				})
				Event.delegate(doc,'click','#J_Step2Save',function(){
					relistCreate.saveStep2();
					scroll(0,0);
				})
				Event.delegate(doc,'click','#J_Step3Save',function(){
					relistCreate.saveStep3();
					scroll(0,0);
				})
				Event.delegate(doc,'click','#J_Step3To5',function(){
					relistCreate.stepTo5();
					scroll(0,0);
				})
				Event.delegate(doc,'click','#J_Step4Save',function(){
					relistCreate.step4Save();
					scroll(0,0);
				})
				Event.delegate(doc,'click','#J_CreateAgain',function(){
					window.location.href=createAgainUrl;
					scroll(0,0);
				})
				Event.delegate(doc,'click','#J_ComeToList',function(){
					window.location.href=indexListUrl;
					scroll(0,0);
				})
				
				//add by gaolou 2013-02-20
				Event.delegate(document,'click mouseenter mouseleave','.J_EditorListTime', function(ev) {
					if(ev.type == 'mouseenter'){
						DOM.addClass(ev.currentTarget,'edit-activity-hover');
					}else if(ev.type == 'mouseleave'){
						//DOM.removeClass(ev.currentTarget,'edit-activity-hover');
						DOM.addClass(ev.currentTarget,'edit-activity-hover');
					}else if(ev.type == 'click'){
						var pid = DOM.attr(ev.currentTarget,'data');
						relistCreate.editorListTime(pid);
					}
				})
			},
			saveStep1 : function(){
				if(isVersionPer('tool')){return ;}
				if(!showPermissions('editor_tool','工具箱')){return ;}
				var submitHandle = function(o){
					relistCreate.msg.hide();
					DOM.val('#J_PlanId',o.payload);
					relistCreate.setStep2BaseHtml();
				}
				var errorHandle = function(o){
					relistCreate.msg.hide();
        	    	new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
					return;
					
				}
				var planName = DOM.val('#J_PlanName');
				if(planName == ''){
					DOM.css('#J_PlanName','border','1px solid red');
					return;
				}
				if(DOM.prop('#J_AtuoRadio','checked') == true){
					var add_way = 0;
				}else{
					var add_way = 1;
				}
				if(relistCreate.planIdFromUrl){
					relistCreate.setStep2BaseHtml();
				}else{
					var data = 'plan_id=0&step=1&planName='+planName+'&add_way='+add_way;
					relistCreate.msg = new H.widget.msgBox({ 
						type: "error",
						content: "系统正在处理中",
						dialogType:"loading"
					});
					new H.widget.asyncRequest().setURI(saveUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setForm(J_subform).setData(data).send();
				}
			},
			setStep2BaseHtml : function(){
				DOM.removeClass(DOM.query('.ui-step-item'),'current');
				DOM.addClass('#J_Step2','current');
				var step2Html = DOM.html('#J_StepCont2');
//				var step2Html = '<div class="p10"><div class="clear ks-clear mt15"><div class="fl color-gray">已排除<span id="J_Step2ExcludeNum">0</span>个宝贝</div><ul class="fr"><li class="fl mr8"><input type="text"value="关键字、商品链接、商品编码"id="J_Step2SearchTitle"class="input-text w-180"onfocus="this.className=\'input-text input-text-on w-180\';if(this.value==\'关键字、商品链接、商品编码\'){this.value = \'\';}"onblur="this.className=\'input-text w-180\';if(this.value==\'\'){this.value = \'关键字、商品链接、商品编码\'}"></li><li class="fl mr8"><select id="J_Step2Status"><option value="0">全部</option><option value="1">已排除</option></select></li><li class="fl mr8"><select id="J_Step2Cat"style="display:none;"></select></li><li class="fl"><a id="J_Step2Search"href="#2"onclick="relistCreate.searchStep2()"><span class="btm-sousuo"title="搜索"></span></a></li></ul></div><div class="ui-list-title mt15"><ul><li style="width:40%;">宝贝标题</li><li style="width:30%;">下架时间</li><li style="width:30%;">操作</li></ul></div><div style="display:none;"id="J_Step2Loading"class="center loading"></div><div id="J_Step2Cont"class="ui-list"style=""><!--ui-list start--><div id="J_Step2Empty"class="no-details"style="display:none;"><div><span class="no-details-pic"></span><span class="prompt-1">亲，没有找到任何宝贝</span></div></div><ul id="J_Step2List"class="list-view"></ul><div class="J_Step2Holder"><div style="height:40px; padding-bottom:15px"class="ui-page"id="J_Step2Paging"></div></div><div style="text-align:center;margin:15px auto;"><input type="button"class="btm-orange"value="下一步，配置"id="J_Step2Save"style="font-size:13px;"></div></div></div>';
				DOM.html('#J_StepCont',step2Html);
				var items = [
					{text:'全部',value:'0'},
					{text:'已排除',value:'1'},
					{text:'未排除',value:'5'}
				],
				select = new Select.Select({  
					render:'#J_Step2Status',
					valueField:'#hide1',
					items:items
				});
				select.render();
				select.setSelectedValue('0');
				
				var items = [
					{text:'全部',value:'0'},
					{text:'已排除',value:'1'}
				],
				select = new Select.Select({  
					render:'#J_Step2Status_1',
					valueField:'#hide1',
					items:items
				});
				select.render();
				select.setSelectedValue('0');
				
				if(!relistCreate.planCats){
					relistCreate._getPlanCats();
				}
			},
			searchStep2 : function(){
				var submitHandle = function(o){
					DOM.hide('#J_Step2Loading');
					DOM.show('#J_Step2Cont');
					
					DOM.html('#J_Step2List',o.payload.body);
	        	    totalRecords = o.payload.totalRecords;
					if(totalRecords > 0){
						DOM.css(DOM.get('#J_Step2Empty') ,'display','none');
						DOM.css(DOM.query(".J_Step2Holder") ,'display' , '');
					} else {
						DOM.css(DOM.get('#J_Step2Empty'), 'display' , '');
						DOM.css(DOM.query(".J_Step2Holder") , 'display' , 'none');
					}
					var pageCount = Math.ceil(totalRecords/o.payload.pageNum);
					relistCreate.paginator = new showPages('relistCreate.paginator').setRender(relistCreate.pagination).setPageCount(pageCount).printHtml('#J_Step2Paging',2);
				}
				var errorHandle = function(o){
					DOM.html('#J_StepCont','<div class="point relative"><div class="point-w-1">'+o.desc+'&nbsp;&nbsp;<a href="#2" onclick="relistCreate.saveStep1()">重试</a>&nbsp;&nbsp;<a href="javascript:location.reload();">重新创建</a></div></div>');
				}
				var q = DOM.val('#J_Step2SearchTitle');
				if(q == '关键字、商品链接、商品编码'){
					q = '';
				}
				var status = DOM.val('#hide1');
				var cid = DOM.val('#J_Step2Cat');
				var plan_id = relistCreate.planIdFromUrl||DOM.val('#J_PlanId');
				var data = 'plan_id='+plan_id+'&pageSize=10&q='+q+'&status='+status+'&cid='+cid;
				DOM.hide('#J_Step2Loading');
				DOM.show('#J_Step2Cont');
				new H.widget.asyncRequest().setURI(getItemsFromTbUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
				relistCreate.getExcludeItemNum();
			},
			//第二步获取分类
			_getPlanCats : function(){
				var sHandle = function(e){
					relistCreate.planCats = e.payload;
					
					/*promoSelect = new Select.Select({  
					    render:'#J_Step2Cat',
				      	valueField:'#hide2',
				      	items:e.payload,
				      	visibleMode : 'display'
					});
					promoSelect.render();
					promoSelect.setSelectedValue('0');
					DOM.css(DOM.get('.bui-list-picker'),{'left':'-999px','top':'-999px'});*/
					
					DOM.html('#J_Step2Cat',relistCreate.planCats);
					DOM.show('#J_Step2Cat');
					relistCreate.searchStep2();
				}
				var eHandle = function(){
					relistCreate._getPlanCats();
				}
				var plan_id = relistCreate.planIdFromUrl||DOM.val('#J_PlanId');
				var info = 'plan_id='+plan_id;
				new H.widget.asyncRequest().setURI(getPlanCatsUrl).setMethod("POST").setHandle(sHandle).setErrorHandle(eHandle).setData(info).send();
			},
	    	pagination : function(turnTo) {
		    	pageId = turnTo;
		    	relistCreate.toPageNum = turnTo;
		    	var sHandle = function(o){
					DOM.hide('#J_Step2Loading');
					scroll(0,0);
					DOM.show('#J_Step2Cont');
					DOM.html('#J_Step2List',o.payload.body);
	        	    totalRecords = o.payload.totalRecords;
					if(totalRecords > 0){
						DOM.css(DOM.get('#J_Step2Empty') ,'display','none');
						DOM.css(DOM.query(".J_Step2Holder") ,'display' , '');
					} else {
						DOM.css(DOM.get('#J_Step2Empty'), 'display' , '');
						DOM.css(DOM.query(".J_Step2Holder") , 'display' , 'none');
					}
					var pageCount = Math.ceil(totalRecords/o.payload.pageNum);
					relistCreate.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Step2Paging',2);
				}
				var eHandle = function(o){
        	    	new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
					return;
				}
				var q = DOM.val('#J_Step2SearchTitle');
				if(q == '关键字、商品链接、商品编码'){
					q = '';
				}
				var status = DOM.val('#hide1');
				var cid = DOM.val('#J_Step2Cat');
				var plan_id = relistCreate.planIdFromUrl||DOM.val('#J_PlanId');
				var data = 'plan_id='+plan_id+'&pageSize=10&q='+q+'&status='+status+'&cid='+cid+'&page_id='+pageId;
				DOM.hide('#J_Step2Loading');
				DOM.show('#J_Step2Cont');
				new H.widget.asyncRequest().setURI(getItemsFromTbUrl).setMethod("POST").setHandle(sHandle).setErrorHandle(eHandle).setData(data).send();
			},
			getExcludeItemNum : function(){
				var sHandle = function(o){
					DOM.html('#J_Step2ExcludeNum',o.payload);
				}
				var plan_id = relistCreate.planIdFromUrl||DOM.val('#J_PlanId');
				var data = 'plan_id='+plan_id;
				new H.widget.asyncRequest().setURI(getExcludeItemNumUrl).setMethod("POST").setHandle(sHandle).setData(data).send();
			},
			excludeItem : function(item_id){
				var submitHandle = function(o){
					relistCreate.msg.hide();
					relistCreate.getExcludeItemNum();
					relistCreate.paginator.toPage(relistCreate.toPageNum);
				}
				var errorHandle = function(o){
					relistCreate.msg.hide();
        	    	new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
					return;
				}
				var item_ids = item_id;
				var plan_id = relistCreate.planIdFromUrl||DOM.val('#J_PlanId');
				var data = 'plan_id='+plan_id+'&item_ids='+item_id;
				relistCreate.msg = new H.widget.msgBox({ type: "error",
											                content: "系统正在处理中",
											 				dialogType:"loading"
											            });
				new H.widget.asyncRequest().setURI(excludeItemUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			cancelExclude : function(item_id){
				var submitHandle = function(o){
					relistCreate.msg.hide();
					relistCreate.getExcludeItemNum();
					relistCreate.paginator.toPage(relistCreate.toPageNum);
				}
				var errorHandle = function(o){
					relistCreate.msg.hide();
        	    	new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
					return;
				}
				var item_ids = item_id;
				var plan_id = relistCreate.planIdFromUrl||DOM.val('#J_PlanId');
				var data = 'plan_id='+plan_id+'&item_ids='+item_id;
				relistCreate.msg = new H.widget.msgBox({ type: "error",
											                content: "系统正在处理中",
											 				dialogType:"loading"
											            });
				new H.widget.asyncRequest().setURI(cancelExcludeUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			saveStep2 : function(){
				var submitHandle = function(o){
					relistCreate.msg.hide();
					relistCreate.searchStep3();
				}
				var errorHandle = function(o){
					relistCreate.msg.hide();
        	    	new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
					return;
				}
				var plan_id = relistCreate.planIdFromUrl||DOM.val('#J_PlanId');
				var data = 'plan_id='+plan_id+'&step=2';
				relistCreate.msg = new H.widget.msgBox({ type: "error",
											                content: "系统正在处理中",
											 				dialogType:"loading"
											            });
				new H.widget.asyncRequest().setURI(saveUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			_getPlanItemNum : function(){
				var submitHandle = function(o){
					DOM.val('#J_Step3AllNumTmp',o.payload[0]);
					DOM.val('#J_Step3DistriNumTmp',o.payload[1]);
					DOM.val('#J_Step3UndistriNumTmp',o.payload[2]);
				}
				var errorHandle = function(o){
					relistCreate._getPlanItemNum();
					return;
				}
				var plan_id = relistCreate.planIdFromUrl||DOM.val('#J_PlanId');
				var data = 'plan_id='+plan_id;
				new H.widget.asyncRequest().setURI(getPlanItemNumUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			//第二步--移除
			quitFromPlan : function(relistItemId){
				var submitHandle = function(o){
					relistCreate.searchStep2();
				}
				var errorHandle = function(o){
        	    	new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
					return;
				}
				var plan_id = relistCreate.planIdFromUrl||DOM.val('#J_PlanId');
				var data = 'plan_id='+plan_id+'&relistItemId='+relistItemId;
				new H.widget.asyncRequest().setURI(quitFromPlanUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			searchStep3 : function(){
				relistCreate._getPlanItemNum();
				var submitHandle = function(o){
					DOM.removeClass(DOM.query('.ui-step-item'),'current');
					DOM.addClass('#J_Step3','current');
					DOM.html('#J_StepCont',o.payload.body);
					S.later(function(){
						DOM.html('#J_Step3AllNum',DOM.val('#J_Step3AllNumTmp'));
						DOM.html('#yfpNum',DOM.val('#J_Step3DistriNumTmp'));
						DOM.html('#wfpNum',DOM.val('#J_Step3UndistriNumTmp'));
					},500);
					var $ = KISSY.Node.all;
					window.onscroll=function() {
						var TLheight = DOM.offset('#J_Step_5')['top']+70;
						var windowHeight = $(window).scrollTop();
						if(windowHeight > TLheight) {
							DOM.addClass('#J_Step3Week','fix-top');
							DOM.css('#J_Step3Week','width',DOM.width('#J_Step_5')+'px');
						}else{
							DOM.removeClass('#J_Step3Week','fix-top');
						}
					};
					Event.on('.J_OnClickEdit','mouseover',function(ev){
						var data = DOM.attr(ev.currentTarget,'data');
						DOM.hide(ev.currentTarget);
						DOM.show('#seg_'+data);
						DOM.get('#seg_'+data).focus();
					})
					Event.on('.J_EditNum','mouseover',function(ev){
						DOM.get(ev.currentTarget).focus();
					})
//					Event.on('.J_EditNum','mouseout',function(ev){
//						relistCreate.inputBlur(DOM.get(ev.currentTarget));
//						console.log(ev.value)
//						if(ev.value==''||ev.value==0){
//							DOM.hide(ev);
//						}
//					})
				}
				var errorHandle = function(o){
        	    	new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
					return;
				}
				var plan_id = relistCreate.planIdFromUrl||DOM.val('#J_PlanId');
				var data = 'plan_id='+plan_id;
				new H.widget.asyncRequest().setURI(distriUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			//均匀分配
			uniformDistri : function(start,end){
				var start = parseInt(DOM.val('#J_DistriStart'));
				var end = parseInt(DOM.val('#J_DistriEnd'));
				if(isNaN(start) == true || start<0 || start>23){
					DOM.css('#J_DistriStart','border','1px solid red');
					return;
				}
				if(isNaN(end) == true || end<0 || end<start || end>23){
					DOM.css('#J_DistriEnd','border','1px solid red');
					return;
				}
//				var yfpNum = parseInt(DOM.html("#yfpNum"));
//				var wfpNum = parseInt(DOM.html("#wfpNum"));
				var allNum = parseInt(DOM.html("#J_Step3AllNum"));
				if(allNum<1){
        	    	new H.widget.msgBox({
					    title:"宝贝总数不足，请确认!",
					    content:o.desc,
					    type:"error"
					});
					return;
				}
				
//				高楼
				var distriTotalNum = (end-start+1)*7;
				var baseNum = Math.floor(allNum / distriTotalNum);
				var yushu = allNum % distriTotalNum;
				for(var h=0;h<=23;h++){
					for(var w=1;w<=7;w++){
						if(h>=start && h<=end){
							if(yushu > 0){
								DOM.val("#seg_"+w+'_'+h,baseNum+1);
								DOM.html("#J_ShowNum_"+w+'_'+h,baseNum+1);
								DOM.show("#J_ShowNum_"+w+'_'+h);
								yushu--;
							}else{
								DOM.val("#seg_"+w+'_'+h,baseNum);
								if(baseNum==0){
									DOM.html("#J_ShowNum_"+w+'_'+h,'&nbsp;');
								}else{
									DOM.html("#J_ShowNum_"+w+'_'+h,baseNum);
								}
								DOM.show("#J_ShowNum_"+w+'_'+h);
							}
						}else{
							DOM.val("#seg_"+w+'_'+h,0);
							DOM.html("#J_ShowNum_"+w+'_'+h,'&nbsp;');
							DOM.show("#J_ShowNum_"+w+'_'+h);
						}
					}
				}
				
//				for(;wfpNum>0;){
//					for(var h=start;h<=end;h++){
//						for(var w=1;w<=7;w++){
//							var v =  parseInt(DOM.val("#seg_"+w+'_'+h))<=0||isNaN(parseInt(DOM.val("#seg_"+w+'_'+h)))?0:parseInt(DOM.val("#seg_"+w+'_'+h));
//							if(wfpNum>0){
//								DOM.val("#seg_"+w+'_'+h,v+1);
//								DOM.html("#J_ShowNum_"+w+'_'+h,v+1);
//								DOM.show("#J_ShowNum_"+w+'_'+h);
//								wfpNum--;
//								yfpNum++;
//							}
//						}
//					}
//				}
				DOM.html("#yfpNum",allNum);
				DOM.html("#wfpNum",0);
				relistCreate.countSum();
				return;
			},
			//清空设置
			reset : function(){
				for(var h=0;h<=23;h++){
					for(var w=1;w<=7;w++){
						DOM.val("#seg_"+w+'_'+h,'');
						DOM.html("#J_ShowNum_"+w+'_'+h,'&nbsp;');
						DOM.show("#J_ShowNum_"+w+'_'+h);
					}
				}
				DOM.val('#J_DistriStart','');
				DOM.val('#J_DistriEnd','');
				DOM.html("#yfpNum",DOM.val('#J_Step3DistriNumTmp'));
				DOM.html("#wfpNum",DOM.val('#J_Step3UndistriNumTmp'));
				relistCreate.countSum();
				return;
			},
			plus : function(week, hour){
				var yfpNum = parseInt(DOM.html("#yfpNum"));
				var wfpNum = parseInt(DOM.html("#wfpNum"));
				if(wfpNum<1){
                    new H.widget.msgBox({
                        title:"错误提示",
                        content:"未分配的数量不足，请确认!",
                        type:"error"
                    });
					return;
				}
				
				if(week==''){
					for(var i=1;i<=7;i++){
						var v =  parseInt(DOM.val("#seg_"+i+'_'+hour))<=0||isNaN(parseInt(DOM.val("#seg_"+i+'_'+hour)))?0:parseInt(DOM.val("#seg_"+i+'_'+hour));
						if(wfpNum>0){
							DOM.val("#seg_"+i+'_'+hour,v+1);
							DOM.html("#J_ShowNum_"+i+'_'+hour,v+1);
							DOM.show("#J_ShowNum_"+i+'_'+hour);
							wfpNum--;
							yfpNum++;
						}
					}
				}else{
					if(hour==''){
						for(var i=0;i<=23;i++){
							var v =  parseInt(DOM.val("#seg_"+week+'_'+i))<=0||isNaN(parseInt(DOM.val("#seg_"+week+'_'+i)))?0:parseInt(DOM.val("#seg_"+week+'_'+i));
							if(wfpNum>0){
								DOM.val("#seg_"+week+'_'+i,v+1);
								DOM.html("#J_ShowNum_"+week+'_'+i,v+1);
								DOM.show("#J_ShowNum_"+week+'_'+i);
								wfpNum--;
								yfpNum++;
							}
						}
					}
				}
				DOM.html("#yfpNum",yfpNum);
				DOM.html("#wfpNum",wfpNum);
				relistCreate.countSum();
				return;
			},
			minus : function(week, hour){
				var yfpNum = parseInt(DOM.html("#yfpNum"));
				var wfpNum = parseInt(DOM.html("#wfpNum"));
				
				if(week==''){
					for(var i=1;i<=7;i++){
						var v = parseInt(DOM.val("#seg_"+i+'_'+hour))<=0||isNaN(parseInt(DOM.val("#seg_"+i+'_'+hour)))?0:parseInt(DOM.val("#seg_"+i+'_'+hour));
						if(v>0){
							DOM.val("#seg_"+i+'_'+hour,v-1);
							DOM.html("#J_ShowNum_"+i+'_'+hour,v-1);
							if(v-1<=0){
								DOM.val("#seg_"+i+'_'+hour,'');
								DOM.html("#J_ShowNum_"+i+'_'+hour,'&nbsp;');
							}
							DOM.show("#J_ShowNum_"+i+'_'+hour);
							wfpNum++;
							yfpNum--;
						}
					}
				}else{
					if(hour==''){
						for(var i=0;i<=23;i++){
							var v =  parseInt(DOM.val("#seg_"+week+'_'+i))<=0||isNaN(parseInt(DOM.val("#seg_"+week+'_'+i)))?0:parseInt(DOM.val("#seg_"+week+'_'+i));
							if(v>0){
								DOM.val("#seg_"+week+'_'+i,v-1);
								DOM.html("#J_ShowNum_"+week+'_'+i,v-1);
								if(v-1<=0){
									DOM.val("#seg_"+week+'_'+i,'');
									DOM.html("#J_ShowNum_"+week+'_'+i,'&nbsp;');
								}
								DOM.show("#J_ShowNum_"+week+'_'+i);
								wfpNum++;
								yfpNum--;
							}
						}
					}
				}
				DOM.html("#yfpNum",yfpNum);
				DOM.html("#wfpNum",wfpNum);
				relistCreate.countSum();
				return;
			},
			formatInputNum : function(e){
			    var ie = navigator.appName=="Microsoft Internet Explorer"?true:false;
				if(!ie) var key = e.which;
				else var key = event.keyCode;
				if (key == 8 || key == 46 || (key >= 48 && key <= 57)) return true;
				return false;
			},
			changeVal : function(elem){
				var data = DOM.attr(elem,'data');
				var showNum = DOM.get('#J_ShowNum_'+data);
				var yfpNum = parseInt(DOM.html("#yfpNum"));
				var wfpNum = parseInt(DOM.html("#wfpNum"));
				if(isNaN(elem.value)||elem.value==''||elem.value<0||!relistCreate.isInteger(elem.value)){
					elem.value = 0;
				}
				var diff = elem.value - focusElemVal;
				if(diff>wfpNum){
                    new H.widget.msgBox({
                        title:"错误提示",
                        content:"未分配的数量不足，请确认!",
                        type:"error"
                    });
					elem.value = focusElemVal;
				}else{
					DOM.html("#yfpNum",yfpNum+diff);
					DOM.html("#wfpNum",wfpNum-diff);
					DOM.html(showNum,elem.value);
					relistCreate.countSum();
				}
				return;
			},
			segFocus : function(elem){
				focusElemVal = Number(elem.value==''?0:elem.value);
				DOM.get(elem).select();
			},
			inputBlur : function(elem){
				var data = DOM.attr(elem,'data');
				var showNum = DOM.get('#J_ShowNum_'+data);
				if(isNaN(elem.value)||elem.value==''||elem.value===0||elem.value=='0'||elem.value<0||!relistCreate.isInteger(elem.value)){
					elem.value = '';
					DOM.html(showNum,'&nbsp;');
					DOM.hide(elem);
				}else{
					DOM.html(showNum,elem.value);
					DOM.hide(elem);
					relistCreate.countSum();
				}
				DOM.show(showNum);
			},
			isInteger : function(str ){
			    var regu = /^[-]{0,1}[0-9]{1,}$/;
			    return regu.test(str);
			},
			countSum : function(){
				for(var w=1;w<=7;w++){
					var sum = 0;
					for(var h=0;h<=23;h++){
						sum += (isNaN(DOM.val("#seg_"+w+'_'+h)) || DOM.val("#seg_"+w+'_'+h) == ''|| parseInt(DOM.val("#seg_"+w+'_'+h))<0)?0:parseInt(DOM.val("#seg_"+w+'_'+h));
					}
					DOM.html('#J_SumWeek'+w,sum)
				}
			},
			//第四步操作--预览
			saveStep3 : function(){
				var wfpNum = parseInt(DOM.html("#wfpNum"));
				if(wfpNum>1){
        	    	new H.widget.msgBox({
					    title:"错误提示",
					    content:"还有宝贝等待分配，请确认!",
					    type:"error"
					});
					return;
				}
				var submitHandle = function(o){
					relistCreate.msg.hide();
					DOM.removeClass(DOM.query('.ui-step-item'),'current');
					DOM.addClass('#J_Step4','current');
					var step4Html = DOM.html('#J_StepCont4');
					DOM.html('#J_StepCont',step4Html);
					relistCreate.getGenerateSchedule();
					relistCreate.timer = S.later(function(){
						relistCreate.getGenerateSchedule();
					},2000,true);
				}
				var errorHandle = function(o){
					relistCreate.msg.hide();
        	    	new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
					return;
				}
				var plan_id = relistCreate.planIdFromUrl||DOM.val('#J_PlanId');
				var data = 'plan_id='+plan_id+'&step=3&operate=preview';
				relistCreate.msg = new H.widget.msgBox({ type: "error",
											                content: "系统正在处理中",
											 				dialogType:"loading"
											            });
				new H.widget.asyncRequest().setURI(saveUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setForm(J_Step3Form).setData(data).send();
			},
			//第四步操作--执行
			stepTo5 : function(){
				var wfpNum = parseInt(DOM.html("#wfpNum"));
				if(wfpNum>1){
                    new H.widget.msgBox({
                        title:"错误提示",
                        content:"还有宝贝等待分配，请确认!",
                        type:"error"
                    });
					return;
				}
				var submitHandle = function(o){
					relistCreate.msg.hide();
					DOM.removeClass(DOM.query('.ui-step-item'),'current');
					DOM.addClass('#J_Step5','current');
					var step5Html = DOM.html('#J_StepCont5');
					DOM.html('#J_StepCont',step5Html);
					relistCreate.getGenerateSchedule();
				}
				var errorHandle = function(o){
					relistCreate.msg.hide();
        	    	new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
					return;
				}
				var plan_id = relistCreate.planIdFromUrl||DOM.val('#J_PlanId');
				var data = 'plan_id='+plan_id+'&step=3&operate=save';
				relistCreate.msg = new H.widget.msgBox({ type: "error",
												            content: "系统正在处理中",
															dialogType:"loading"
												        });
				new H.widget.asyncRequest().setURI(saveUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setForm(J_Step3Form).setData(data).send();
			},
			//第四步--获取进度
			getGenerateSchedule : function(){
				var submitHandle = function(o){
					if(o.payload.success == 1){
						if(o.payload.percent == 100){
							relistCreate.timer.cancel();
							//第四步--下一步，预览
							DOM.replaceClass('#J_Step4ToPreview','button-disabled','button-green');
//							Event.on('#J_Step4ToPreview','click',function(){
								var step4PreviewHtml = DOM.html('#J_StepCont4Preview');
								DOM.html('#J_StepCont',step4PreviewHtml);
								relistCreate.showRelistView();
								relistCreate.getPlanItems();
								scroll(0,0);
//							})
						}
						var percent = o.payload.percent+'%';
						DOM.css('#J_GeneratePercent','width',percent);
						DOM.html('#J_GeneratePercent2',percent);
						DOM.html('#J_TimeLeft',o.payload.remain);
					}else{
						relistCreate.timer.cancel();
						DOM.html('#J_StepCont','<div class="point relative"><div class="point-w-1">'+o.desc+'&nbsp;&nbsp;<a href="#2" onclick="relistCreate.getGenerateSchedule();">重试</a>&nbsp;&nbsp;<a href="'+indexListUrl+'">返回计划列表</a></div></div>');
					}
				}
				var errorHandle = function(o){
					relistCreate.timer.cancel();
					DOM.html('#J_StepCont','<div class="point relative"><div class="point-w-1">'+o.desc+'&nbsp;&nbsp;<a href="'+indexListUrl+'">返回计划列表</a></div></div>');
				}
				var plan_id = relistCreate.planIdFromUrl||DOM.val('#J_PlanId');
				var data = 'plan_id='+plan_id;
				new H.widget.asyncRequest().setURI(getGenerateScheduleUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			//第四步操作--（保存）执行
			step4Save : function(){
				var wfpNum = parseInt(DOM.html("#wfpNum"));
				if(wfpNum>1){
                    new H.widget.msgBox({
                        title:"错误提示",
                        content:"还有宝贝等待分配，请确认!",
                        type:"error"
                    });
					return;
				}
				var submitHandle = function(o){
					relistCreate.msg.hide();
					DOM.removeClass(DOM.query('.ui-step-item'),'current');
					DOM.addClass('#J_Step5','current');
					var step5Html = DOM.html('#J_StepCont5');
					DOM.html('#J_StepCont',step5Html);
				}
				var errorHandle = function(o){
					relistCreate.msg.hide();
					DOM.html('#J_StepCont','<div class="point relative"><div class="point-w-1">'+o.desc+'&nbsp;&nbsp;<a href="#2" onclick="relistCreate.saveStep3()">重试</a>&nbsp;&nbsp;<a href="javascript:location.reload();">重新创建</a></div></div>');
					return;
				}
				var plan_id = relistCreate.planIdFromUrl||DOM.val('#J_PlanId');
				var data = 'plan_id='+plan_id+'&step=4&operate=open';
				relistCreate.msg = new H.widget.msgBox({ type: "error",
												            content: "系统正在处理中",
															dialogType:"loading"
												        });
				new H.widget.asyncRequest().setURI(saveUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
	        showRelistView :function() {
		    	var submitHandle = function(o) {
					if(relistCreate.chart){
						relistCreate.chart.destroy();
					}
					relistCreate.chart = new Highcharts.Chart({
							chart: {
								renderTo: 'J_BaoBiao',
								height:400,
								marginBottom: 60
							},
							title: {
								text: '计划中宝贝上架前后对比'
							},
							credits :{
								enabled :false
							},
							legend :{
					            floating: true,
					            align: 'left',
					            x : 450,
					            y : 5
							},
							xAxis: {
								categories: o.payload.xdata,
								labels: {
						            step: o.payload.xkuadu
						        }
							},
							 yAxis: [{
								 	lineWidth: 1,
							        tickWidth: 1,
							        title: {
							            align: 'high',
							            offset: 0,
							            text: '',
							            rotation: 0,
							            y: -10
							        },
						            min : 0
						        }],
							tooltip: {
								formatter: function(e) {
									var s;
										s = ''+this.x  +': '+ this.y;
									return s;
								}
							},
							series: [{
								type: 'spline',
								name: '调整前',
								data: o.payload.raw
							},{
								type: 'spline',
								name: '调整后',
								data: o.payload.relist
							}
							]
						});
		    	};
		    	var errorHandle = function(o){
		    		DOM.html(DOM.get("#J_BaoBiao"), o.desc,true);
	        	};
				var plan_id = relistCreate.planIdFromUrl||DOM.val('#J_PlanId');
				var data = 'plan_id='+plan_id;
        	    new H.widget.asyncRequest().setURI(getPlanReportDatasUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			//第四步预览获取宝贝
			getPlanItems : function() {
	            var submitHandle = function(o) {
					DOM.hide('#J_RightLoading');
					DOM.show('#J_MainRightContent');
	        	    totalRecords = o.payload.totalRecords;
					if(totalRecords > 0){
						DOM.css(DOM.get('#J_REmpty') ,'display','none');
						DOM.css(DOM.query(".J_PromotionItemBtnHolder") ,'display' , '');
					} else {
						DOM.css(DOM.get('#J_REmpty'), 'display' , '');
						DOM.css(DOM.query(".J_PromotionItemBtnHolder") , 'display' , 'none');
					}
					DOM.html('#J_PromotionItemList' ,o.payload.body);
					var pageCount = Math.ceil(totalRecords/o.payload.pageNum);
					relistCreate.paginator2 = new showPages('relistCreate.paginator2').setRender(relistCreate.handlePagination).setPageCount(pageCount).printHtml('#J_BottomPaging',2);
	    	    };
				var plan_id = relistCreate.planIdFromUrl||DOM.val('#J_PlanId');
				var q = DOM.val('#J_Step4SearchTitle');
				if(q == '关键字、商品链接'){
					q = '';
				}
				var status = DOM.val('#hide3');
				var week = DOM.val('#hide4');
				var data = 'plan_id='+plan_id+"&pageSize=10"+"&status="+status+"&week="+week+"&q="+q;
	 			DOM.show('#J_RightLoading');
				DOM.hide('#J_MainRightContent');
	    	    new H.widget.asyncRequest().setURI(getPlanItemsUrl).setMethod("POST").setHandle(submitHandle).setData(data).send();
			},
	    	handlePagination : function(turnTo) {
		    	pageId = turnTo;
	    		var submitHandle = function(o) {
					
					DOM.hide('#J_RightLoading');
					DOM.show('#J_MainRightContent');
	        	    totalRecords = o.payload.totalRecords;
					if(totalRecords > 0){
						DOM.css(DOM.get('#J_REmpty') ,'display','none');
						DOM.css(DOM.query(".J_PromotionItemBtnHolder") ,'display' , '');
					} else {
						DOM.css(DOM.get('#J_REmpty'), 'display' , '');
						DOM.css(DOM.query(".J_PromotionItemBtnHolder") , 'display' , 'none');
					}
					DOM.html('#J_PromotionItemList' ,o.payload.body);
					var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					relistCreate.paginator2.setPage(pageId).setPageCount(pageCount).printHtml('#J_BottomPaging',2);
		    	};
		    	var plan_id = relistCreate.planIdFromUrl||DOM.val('#J_PlanId');
				var q = DOM.val('#J_Step4SearchTitle');
				if(q == '关键字、商品链接'){
					q = '';
				}
				var status = DOM.val('#hide3');
				var week = DOM.val('#hide4');
				var data = 'plan_id='+plan_id+"&pageSize=10"+"&status="+status+"&week="+week+"&q="+q+"&page_id="+pageId;
    	        DOM.show('#J_RightLoading');
				DOM.hide('#J_MainRightContent');
        	    new H.widget.asyncRequest().setURI(getPlanItemsUrl).setMethod("POST").setHandle(submitHandle).setData(data).send();
			},
			retryPlanItem : function(relist_item_id){
				var submitHandle = function(o){
					relistCreate.getPlanItems();
				}
				var errorHandle = function(o){
					DOM.html('#J_StepCont','<div class="point relative"><div class="point-w-1">'+o.desc+'&nbsp;&nbsp;<a href="#2" onclick="relistCreate.saveStep3()">重试</a>&nbsp;&nbsp;<a href="javascript:location.reload();">重新创建</a></div></div>');
					return;
				}
				var plan_id = relistCreate.planIdFromUrl||DOM.val('#J_PlanId');
				var data = 'plan_id='+plan_id+'&relist_item_id='+relist_item_id;
				new H.widget.asyncRequest().setURI(retryPlanItemUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			//add by gaolou 2013-02-20
			editorListTime : function(pid){
				DOM.hide(DOM.get('.J_EditorListTime','#J_Promo_'+pid));	
		 		var SpromoTime = KISSY.trim(DOM.val('#J_SouceListTime_'+pid));
				var str = '<div class="bianji-shijian w-170">'+
		            '<span class="block riqi">&nbsp;<input style="*width:135px;" type="text" readonly="readonly" id="J_ScheListDate_'+pid+'" name="start_date" class="calendarImg input-day-2" value="'+SpromoTime+'" title="上架时间">'+
		            '</span>'+
		            '<span class="block clear"></span>'+
		        	'<div style=" margin:0px 2px 0px 4px; _display:inline;" class="btm-small button-green w-70 fl" id="J_SaveTime_'+pid+'" data="'+pid+'">保存</div><div class="btm-small button-green w-70" id="J_CancelTime_'+pid+'" data="'+pid+'">取消</div>'+
		        	'</div>';
				DOM.html('#J_ShowEditorListTime_'+pid,str);
				DOM.show('#J_ShowEditorListTime_'+pid);
				DOM.hide('#J_ListTimeBox_'+pid);
				relistCreate.Calendar('J_ScheListDate_',pid);

				Event.remove('#J_SaveTime_'+pid);
				Event.remove('#J_CancelTime_'+pid);
				Event.on('#J_SaveTime_'+pid,'click',function(ev){
					var pid = DOM.attr(ev.currentTarget,'data');
					var SpromoTime = KISSY.trim(DOM.val('#J_SouceListTime_'+pid)),
						NSpromoTime = KISSY.trim(DOM.val('#J_ScheListDate_'+pid));
					if(SpromoTime == NSpromoTime){
						DOM.hide('#J_ShowEditorListTime_'+pid);
						DOM.hide('#J_ListTimeBox_'+pid);
						DOM.show('#J_ListTimeBox_'+pid);
						return ;
					}
					KISSY.later(function(){
						DOM.hide('#J_ShowEditorListTime_'+pid);
						DOM.show('#J_ListTimeBox_'+pid);
		 			},200,false,null);
					
			 		var sucessHandle = function(o) {
			 			DOM.show('#J_ListTimeBox_'+pid);
			 			relistCreate.getPlanItems();
			 			//重新加载
			 			//var url = "<?php echo $this->getUrl('*/*/index/')?>";
					  	//window.location.href=url;
			 		};
			 		var error = function(o){
	        	    	new H.widget.msgBox({
						    title:"错误提示",
						    content:o.desc,
						    type:"error"
						});
	        	    	return;
			 		};
			 		var data = "relistItemId="+pid+"&scheListTime="+NSpromoTime+"&form_key="+FORM_KEY;
			 		//alert(data);
			  	    new H.widget.asyncRequest().setURI(saveScheListTimeUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(error).setData(data).send();
				})
				Event.on('#J_CancelTime_'+pid,'click',function(ev){
					var pid = DOM.attr(ev.currentTarget,'data');
					DOM.hide('#J_ShowEditorListTime_'+pid);
					DOM.show('#J_ListTimeBox_'+pid);
					return ;
				})
			},
			//修改活动时间日历
			Calendar : function($id,pid){
				var datepicker = new Calendar.DatePicker({
   	              trigger:'#'+$id+pid,
   	              showTime:true,
	              autoRender : true,
	              date :new Date(),
	              minDate:new Date(),
	              autoSetValue :false,
	              textField  : '2'
   	            });
				  
     	        datepicker.on('selectedchange',function (e) {
     	        		var nowDate = new Date();
     	        		var startDate   = e.value;
     	        		var id = this.id,self = this;
     	        		if(startDate<=nowDate){
     	        			new H.widget.msgBox({
							    title:"上架时间不能小于当前时间，请重新选择",
							    content:o.desc,
							    type:"error"
							});
				 			relistCreate.msg.hide(true);
						}else{
							S.one('#J_ScheListDate_'+pid).val(e.text);
							self.hide();
						}
     	         });
				/*var c =new S.Calendar('#'+$id+pid,{
							popup:true,
							triggerType:['click'],
							showTime:true,
							date :new Date(),
							minDate:new Date()
						
						}).on('timeSelect',function(e){
								var id = this.id,self = this;
								var nowDate = new Date();
								var startDate   = KISSY.Date.format(e.date,'yyyy-mm-dd HH:MM:ss');
								if(startDate<=nowDate){
				        	    	new H.widget.msgBox({
									    title:"上架时间不能小于当前时间，请重新选择",
									    content:o.desc,
									    type:"error"
									});
						 			relistCreate.msg.hide(true);
								}else{
									S.one('#J_ScheListDate_'+pid).val(startDate);
									DOM.html('#J_ListTime_'+pid, startDate);
									self.hide();
								}
								
						});*/
			}		
	};
},{
	requires : ['utils/showPages/index','utils/beautifyForm/index','bui/select','bui/calendar']
});
