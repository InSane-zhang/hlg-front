/*
combined files : 

utils/showPages/index
utils/beautifyForm/index
page/configure-cates-init

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
 * 自动分类设置js
 * @author  
 */
KISSY.add('page/configure-cates-init',function (S,showPages,Select,beautifyForm,Overlay,JSON) {
	var DOM = S.DOM, Event = S.Event;	
	var pid;
	var cate_id;
	var clssListBox;
	var cate_name;
	return  catesControl = {
				dialog:null,
				dialog1:null,
				msg : null,
				msg1:null,
				msg2:null,
				select : null,
				init : function() {
		        catesControl.Form = new beautifyForm();
			    catesControl.searchCatesTab();
  			 	if(!catesControl.msg1){
	   			   	catesControl.msg1 = new Overlay.Dialog({
	   			   	mask:true,
		   			   	buttons:[
		   			   	{
		   			   	text:'确定',
		   			   	elCls : 'bui-button bui-button-primary',
			   			   	handler : function(){
		   			     	catesControl.submitNums();
		   			     	this.hide();
			   			   	}
		   			   	},{
		   			   	text:'取消',
		   			   	elCls : 'bui-button',
			   			   	handler : function(){   		   			   		
		   			   			this.hide();
			   			   	}
		   			   	}
		   			   	]
	   			   	}); 
   			   	}else{
   			   		catesControl.msg1.show();	
   			   	} 	
  			  Event.delegate(document,'click','.add_number',function(ev){
	  				cate_name=DOM.attr(ev.currentTarget,'cate_name');
	  				DOM.val('#J_cate_name',cate_name);
	  				cate_id=DOM.attr(ev.currentTarget,'data');
	  				catesControl.addNums();
  			  });
	  			 
		 		
		       //删除子帐号弹框
		   	   Event.delegate(document,'click','.J_delBtn',function(ev){
		   		var account_id=DOM.attr(ev.currentTarget,'data');
		   		var dialog = new Overlay.Dialog({
	 	             width:330,
	 	             mask:true,
  	                 buttons:[
	     	                   {
	     	                     text:'确定',
	     	                     elCls : 'bui-button bui-button-primary',
	     	                     handler : function(){
	     	                	  var submitHandle = function(o){
		  		 						new H.widget.msgBox({ 
		  							 			type: "sucess", 
		  							 			content: "删除成功",
		  										dialogType:"msg", 
		  										autoClose:true, 
		  										timeOut:3000
		  									});
		  		 						catesControl.searchCatesTab();
		  			         	     };		     	        	 
		  		 	         	    var errorHandle = function(o){
		  								new H.widget.msgBox({
		  								    title:"错误提示",
		  								    content:o.desc,
		  								    type:"error"
		  								});
		  			         	    };	     	                	 
	     	                	  var data ='&account_id='+account_id;
	     	      	  		      new H.widget.asyncRequest().setURI(delAccountUrl).setHandle(submitHandle).setErrorHandle(errorHandle).setMethod("GET").setData(data).send();
	     	      	  		      this.hide();
	     	      	  		      this.destroy(); 
	     	                     }
	     	                   },{
	     	                     text:'取消',
	     	                     elCls : 'bui-button',
	     	                     handler : function(){
	     	                      this.hide();
	     	                     }
	     	                   }
	     	                 ],
	 	             bodyContent:'<div style="text-align:center;"><div class="icon-doubt"></div><div class="ui-confirm-message-content" style="color:#656D7A;font-size:15px;height:20px;line-height:20px;margin-bottom:5px;font-weight:bold;">是否确认删除该帐号？</div></div>'
	 	           });
	 	           dialog.show();
	  			 });
		    	//添加类别
				 Event.delegate(document,'click','.add_class',function(ev){ 
				  	pid = DOM.attr(ev.currentTarget,'pid');
				 	if(!catesControl.msg){
		   			   	catesControl.msg = new Overlay.Dialog({
		   			   	    mask:true,
			   			   	buttons:[
			   			   	{
			   			   	text:'确定',
			   			   	elCls : 'bui-button bui-button-primary',
				   			   	handler : function(){
			   			         var sucessHandle = function(o){
			   			        	catesControl.searchCatesTab();
			   			        	DOM.val('#inp_val','请输入类别名称');   
				   			    	}; 
				   			       var errorHandle = function(o){
					        		 new H.widget.msgBox({
						        		 title:"",
						        		 content:o.desc,
						        		 type:"error"
						        		 });
					        		 }; 
			   			   		
			   			   		if(pid == 2){
			   			   		      var cate_name=DOM.val('#inp_val');
				   			   		  ParamsErrorBox = KISSY.one('#J_Suggest_ParamsErrorBox');
						        	    if(cate_name == "" || cate_name == "undefined"||cate_name == "请输入类别名称"){
						    	    		DOM.html('#J_Suggest_ParamsErrorMsg','类别名称不能为空');
						    	    		if (ParamsErrorBox.css("display")==="none") {
						    	    			ParamsErrorBox.slideDown();														
											}
						    	    		S.later(function(){
						    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
											},2000,false);
											return;
										}
		    		   			      var data ='cate_name='+cate_name+'&type='+pid;
		    		   			      new H.widget.asyncRequest().setURI(addCateUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
		    		   			      this.hide();
		    		   			      DOM.hide('#J_LEmpty');
			   			   		  }else if(pid==-2){
			   			   		      var cate_name=DOM.val('#inp_val');
				   			   		  ParamsErrorBox = KISSY.one('#J_Suggest_ParamsErrorBox');
						        	    if(cate_name == "" || cate_name == "undefined"||cate_name == "请输入类别名称"){
						    	    		DOM.html('#J_Suggest_ParamsErrorMsg','类别名称不能为空');
						    	    		if (ParamsErrorBox.css("display")==="none") {
						    	    			ParamsErrorBox.slideDown();														
											}
						    	    		S.later(function(){
						    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
											},2000,false);
											return;
										}
		    		   			      var data ='cate_name='+cate_name+'&type='+pid;
		    		   			      new H.widget.asyncRequest().setURI(addCateUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
		    		   			      this.hide();
		    		   			      DOM.hide('#J_LEmpty');
			   			   		    }
				   			   	}
			   			   	},{
			   			   	text:'取消',
			   			   	elCls : 'bui-button',
				   			   	handler : function(){   		   			   		
			   			   			this.hide();
				   			   	}
			   			   	}
			   			   	]
		   			 });
		   			   	 var str = '<div style="padding:30px 20px;"><ul><li style="margin-bottom:10px;width:100%;float:left;"><span style="float:left;width:65px;height:28px;line-height:28px;">资金流向：</span><div class="miniPop" id="J_income" style="float:left;"><input type="hidden" value="'+pid+'" id="J_CateType"/></div></li><li><span style="float:left;width:65px;height:26px;line-height:26px;">类别名称：</span><input type="text" value="请输入类别名称" name="amount_1" class="input-text-2" id="inp_val"></li>'+
		   			   	   '<li  class="fl"  style="margin-top:5px;width:300px;line-height:0;min-height:0;margin-bottom:0;">'+
					       '<div id="J_Suggest_ParamsErrorBox" style="display: none; width:300px;" class="ui-msg mt15">'+
							'<div class="error-msg"><div class="img-16-1"></div>'+
							'<div id="J_Suggest_ParamsErrorMsg" class="text-16 color-red">内容不能为空</div></div>'+
							'</div>'+
							'<div id="J_Suggest_ParamsSucessBox" style="display: none;width:300px;" class="ui-msg mt15">'+
						     '<div class="success-msg"><div class="img-16-6"></div></div>'+
				           '</li></ul></div>'	;
		   			   	
		      			 catesControl.msg.set('title','添加类别');
		      			 catesControl.msg.set('width',400);
		      			 catesControl.msg.set('bodyContent',str);
		      			 catesControl.msg.render();
		      			 var items =[
	  					  {text:'收入',value:'2'},
	  			   	      {text:'支出',value:'-2'}
	  			   	    ];
	  			   	    catesControl.select123 = new Select.Select({  
	  			   		    render:'#J_income',
	  			   	      	valueField:'#J_CateType',
	  			   	      	items:items
	  			   		});
		      			catesControl.select123.render();
	  			   	    catesControl.msg.show();
		  			   	 Event.on('#inp_val','focus',function(ev){
					    	if(DOM.val('#inp_val')=='请输入类别名称'){
					    		DOM.val('#inp_val','');
					    	} 
					 	 });
					     Event.on('#inp_val','blur',function(ev){
					    	if(DOM.val('#inp_val')==''){
					    		DOM.val('#inp_val','请输入类别名称');
					    	} 
					 	 });
	  			
	 			   	}else{
	 			   		catesControl.msg.show();	
	 			   	} 
				    if(pid == 2){
				    	catesControl.select123.setSelectedValue(2);
				   	}else{
				   		catesControl.select123.setSelectedValue(-2);
				   	}
				 }); 
	  			 
		   	 //修改类别
 		   	  Event.delegate(document,'click','.Jalter',function(ev){
 		   		 var cate_id=DOM.attr(ev.currentTarget,'data-id');
 		   		  DOM.show('#J_InEidtBox'+cate_id);
		   		  DOM.hide('#J_title'+cate_id);
 		   	  });
 		   	 Event.delegate(document,'click','.J_surbt',function(e){
		   			var cate_id=DOM.attr(e.currentTarget,'data-id');
	 		   	    var cate_name=DOM.val('#J_InEidtBox'+cate_id+' .J_Val');
		 		   	var submitHandle = function(o){
			 		   	 DOM.html('#J_title'+cate_id,cate_name);
			 		   	 DOM.hide('#J_InEidtBox'+cate_id);
				   		 DOM.show('#J_title'+cate_id);
		    	    };
	 		   	    var data = "cate_id="+cate_id+"&cate_name="+cate_name;
	 		   	    new H.widget.asyncRequest().setURI(saveCateUrl).setMethod("GET").setHandle(submitHandle).setData(data).send(); 
 		   	 });
 		   	  
 		   	  
 		   	 //删除类别 
 		   	 Event.delegate(document,'click','.del',function(ev){
 		   		 var pid = DOM.attr(ev.currentTarget,'data-id');
 		   		 var type = DOM.attr(ev.currentTarget,'data-type'); 
 		   		 DOM.val('#J_cates',type);
 			     var typeCatesHandle = function(o){
 			    	       var type_id=DOM.val('#J_cates');
	    		   			clssListBox=o.payload;
	    		   			catesControl.msg2 = new Overlay.Dialog({
	 		   			   		mask:true,
	 		   			   		width : 400,
	 		   			   		height : 230,
	 		   			   		closeAction : 'destroy',
	 			   			   	buttons:[
	 			   			   	{
	 			   			   	text:'确认',
	 			   			   	elCls : 'bui-button bui-button-primary',
	 				   			   	handler : function(){
		 				   			    	var sucessHandle = function(o){
		 				   			    		catesControl.searchCatesTab();
		 				   			    	};
		 				   			      var new_id=DOM.val('#J_cate');
		 				   			   	  var data ='&cate_id='+pid+'&new_id='+new_id+'&type='+type;
		 			      	  		      new H.widget.asyncRequest().setURI(delCateUrl).setMethod("GET").setHandle(sucessHandle).setData(data).send();
		 			      	  		      this.hide();
		 			      	  		      this.destroy();
		 			      	  		      catesControl.searchCatesTab();
	 				   			   	}
	 			   			   	},{
	 			   			   	text:'取消',
	 			   			   	elCls : 'bui-button',
	 				   			   	handler : function(){   		   			   		
	 				   			   		this.hide();
	 				   			     	this.destroy();
	 				   			   	}
	 			   			   	}
	 			   			   	]
	 		   			   	}); 
    		 		   		 var str ='<div style="text-align:center;">'+
    			            	 '<div class="x-icon-doubt"></div>'+
    		 	            	' <div class="ui-confirm-message-content" style="color:#656D7A;font-size:15px;height:20px;line-height:20px;margin-bottom:5px;font-weight:bold;">是否确认删除该类别？</div>'+
    		 	            	' <p class="font-size:12px;color:#AAB2BD;">删除类别后，所属该类别的所有明细移至：</p><div class="miniPop" id="J_Classity" style="margin-top:5px;"><input type="hidden" value="" id="J_cate" /></div>'+
    		 	            	'</div>';
			      			 catesControl.msg2.set('bodyContent',str);
			      			 catesControl.msg2.render();
			      			 catesControl.select = new Select.Select({  
					   		    render:'#J_Classity',
					   	      	valueField:'#J_cate',
					   	        items:clssListBox
		 		   			 });
			      			 catesControl.select.render();
		      				 if(type_id == 2){
		      					catesControl.select.setSelectedValue('10');
						   	 }else if(type_id==-2){
						   		catesControl.select.setSelectedValue('20');
						   	 }
		 		   			 catesControl.msg2.show();	
	   			 }; 		
	 		   	 var data ='&type='+type+'&old_id='+pid;	
			     new H.widget.asyncRequest().setURI(getTypeCatesUrl).setMethod("GET").setHandle(typeCatesHandle).setData(data).send();	  
			 }); 	   	  

		},
		
		addNums:function(){
			   var catename=DOM.val('#J_cate_name');
			   var str2 = '<div style="padding:30px 20px;" id="J_addNum_pop">'+
				'<ul><li style="margin-bottom:10px;"><span style="float:left;width:80px;text-align:center;">类别：</span><span>'+catename+'</span></li>'+
				'<li style="margin-bottom:10px;"><span style="float:left;width:65px;">账号类型：</span>'+
				'<input type="hidden" value="bank" id="J_radios_type">'+
			   ' <label class="beautify_radio r_off" for="radio-01" style="display:none;"><input type="radio" name="sample-radio" id="radio-01" value="1" checked="checked" class="J_radio_type" data="aliyun">支付宝id</label>'+
			    '<label class="beautify_radio r_on" for="radio-02"><input type="radio" name="sample-radio" id="radio-02" value="2" data="bank" class="J_radio_type" checked="checked">银行卡账号</label>'+
			    '<label class="beautify_radio r_off" for="radio-03"><input type="radio" name="sample-radio" id="radio-03" value="3" data="person" class="J_radio_type">对象名称</label>'+
			   '</li>'+
		       '<li class="J_bank_account" style="margin-bottom:10px;height:35px;line-height:35px;"><span style="float:left;width:65px;">银行卡号：</span>'+
		       '<input type="text" class="input-text-2" name="name_for_it"  value="输入对方银行卡帐号" id="J_payNum">'+
			  '</li>'+
			 '<li class="J_other_name" style="margin-bottom:10px;display:none;height:35px;line-height:35px;"><span style="float:left;width:65px;">对方名称：</span>'+
		       '<input type="text" class="input-text-2" name="name_for_it"  value="输入对方名称或公司名称" id="J_payName">'+
			  '</li>'+
			  '<li style="width:300px;line-height:0;min-height:0;margin-bottom:0;" class="fl">'+
			  '<div class="ui-msg mt15" style="display: none; width:300px;" id="J_Suggest_ParamsErrorBox"><div class="error-msg">'+
			  '<div class="img-16-1"></div><div class="text-16 color-red" id="J_Suggest_ParamsErrorMsg">内容不能为空</div></div></div>'+
			  '<div class="ui-msg mt15" style="display: none;width:300px;" id="J_Suggest_ParamsSucessBox">'+
			  '<div class="success-msg"><div class="img-16-6"></div></div></div></li></ul></div>';
	  			 catesControl.msg1.set('title','添加账号');
	  			 catesControl.msg1.set('width',400);
	  			 catesControl.msg1.set('bodyContent',str2);
	   			 catesControl.msg1.render();
			   	 catesControl.msg1.show();	    			   	 
			   	 catesControl.Form.renderAllRadio('#J_addNum_pop');
			     Event.on('#J_payNum','focus',function(ev){
			    	if(DOM.val('#J_payNum')=='输入对方银行卡帐号'){
			    		DOM.val('#J_payNum','');
			    	} 
			 	 });
			     Event.on('#J_payNum','blur',function(ev){
			    	if(DOM.val('#J_payNum')==''){
			    		DOM.val('#J_payNum','输入对方银行卡帐号');
			    	} 
			 	 });
			 	 Event.on('#J_payName','focus',function(ev){
			    	if(DOM.val('#J_payName')=='输入对方名称或公司名称'){
			    		DOM.val('#J_payName','');
			    	} 
		   		 });
			 	Event.on('#J_payName','blur',function(ev){
			    	if(DOM.val('#J_payName')==''){
			    		DOM.val('#J_payName','输入对方名称或公司名称');
			    	} 
			 	 });
			   	 Event.on('.J_radio_type','click',function(ev){
			   		 var radio_type=DOM.attr(ev.currentTarget,'data');
			   		 DOM.val('#J_radios_type',radio_type);
			   		 if(radio_type=='bank'){
			   			 DOM.show('.J_bank_account');
			   			 DOM.hide('.J_other_name');
			   		 }else if(radio_type=='person'){
			   			 DOM.hide('.J_bank_account');
			   			 DOM.show('.J_other_name');
			   		 } 
			   	 });
			
		},
		submitNums:function(){
			 var sucessHandle = function(o){
					var account_id = o.payload.items;
			   	    var con='<div style="width: 24%;float:left;padding-left:5px;overflow:hidden;"><span class="mr5" id="">'+account+'</span><a class="delBtn J_delBtn" data="'+account_id+'">删除</a></div>';
			        //类别									
			        var c=DOM.create(con);
		   	        DOM.append(c,'.cate-li'+cate_id);
		   	        DOM.val('#J_payNum','输入对方银行卡帐号');
		   	        DOM.val('#J_payName','输入对方名称或公司名称');
		        	catesControl.searchCatesTab();	
			    	}; 
			       var errorHandle = function(o){
	        		 new H.widget.msgBox({
		        		 title:"",
		        		 content:o.desc,
		        		 type:"error"
		        		 });
	        		 }; 
	        	ParamsErrorBox = KISSY.one('#J_Suggest_ParamsErrorBox');
	        	 if(DOM.val('#J_radios_type')=='bank'){
  			        var account=DOM.val('#J_payNum');
  			        if(!isNaN(account)){
	        	    	}else{
	        	    		DOM.html('#J_Suggest_ParamsErrorMsg','银行账户必须是数字');
		    	    		if (ParamsErrorBox.css("display")==="none"){
		    	    			ParamsErrorBox.slideDown();														
							}
		    	    		S.later(function(){
		    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
							},2000,false);
							return;
	        	    	}
  			    }else if(DOM.val('#J_radios_type')=='person'){
  			        var account=DOM.val('#J_payName');
  			    }
                var account_type=DOM.val('#J_radios');
  			    var types=DOM.val('#J_radios_type');
  			    if(types=='bank'){
		        	    if(account == "" || account == "undefined"){
		    	    		DOM.html('#J_Suggest_ParamsErrorMsg','请填写对方银行账号');
		    	    		if (ParamsErrorBox.css("display")==="none"){
		    	    			ParamsErrorBox.slideDown();														
							}
		    	    		S.later(function(){
		    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
							},2000,false);
							return;
						}   
  			    }else if(types=='person'){
  			    	if(account == "" || account == "undefined"){
		    	    		DOM.html('#J_Suggest_ParamsErrorMsg','请输入对方名称');
		    	    		if (ParamsErrorBox.css("display")==="none") {
		    	    			ParamsErrorBox.slideDown();														
							}
		    	    		S.later(function(){
		    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
							},2000,false);
							return;
						}
  			    }
			   	    var data ='account='+account+'&cate_id='+cate_id+'&account_type='+account_type;
			  	    new H.widget.asyncRequest().setURI(addAccountUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send(); 
			  	    
		},
	 
		 searchCatesTab:function(){
            var submitHandle = function(o) {
	            var totalCates=o.payload.totalCates;
	            var totalAccounts=o.payload.totalAccounts;
				catesControl.renderItems(o.payload.body);
				DOM.html('#J_addNums',totalAccounts);
				DOM.html('#J_cateNums',totalCates);
				DOM.hide('#J_LeftLoading');
				DOM.show('#J_MainLeftContent');
    	    };  
    	    DOM.show('#J_LeftLoading');
			DOM.hide('#J_MainLeftContent');
    	    new H.widget.asyncRequest().setURI(loadCatesUrl).setMethod("GET").setHandle(submitHandle).setData(null).send();
		},
		renderItems: function(c) {
    	    DOM.html(DOM.get("#J_CatesItemList"), c);		 	 
		},	
    	handlePagination : function(turnTo) {
	    	pageId = turnTo;
    		var submitHandle = function(o) {
    			totalRecords = o.payload.totalRecords;
 				var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
 				var totalCates=o.payload.totalCates;
 	            var totalAccounts=o.payload.totalAccounts;
        	    catesControl.renderItems(o.payload.body);
	    	};  
    	    new H.widget.asyncRequest().setURI(loadCatesUrl).setMethod("GET").setHandle(submitHandle).setData(null).send();
		}

	}				
}, 
{
    requires: ['utils/showPages/index','bui/select','utils/beautifyForm/index','bui/overlay','json']
});
