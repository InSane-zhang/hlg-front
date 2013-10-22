/*
combined files : 

utils/showPages/index
utils/beautifyForm/index
page/recats-init

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
/***
 * 
 * 批量改归类 item js
 * 
 * **/
KISSY.add('page/recats-init',function(S,showPages,beautifyForm,Select){
		var S = KISSY,DOM = S.DOM, Event = S.Event, catsType = 1;	
		return recats = {
	    	paginator : null,
	    	panel : null,
	    	msg : null,
			checkBoxs : null,
	    	
	    	init : function() {
				recats.Form = new beautifyForm();
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
				    render:'#J_SearchItemSelling',
			      	valueField:'#J_SearchSelling',
			      	items:Sellingitems
				});
				SellingSelect.render();
				SellingSelect.setSelectedValue('0');
				SellingSelect.on('change', function(ev){
					recats.searchTbItems();
				});
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
					recats.searchTbItems();
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
					recats.searchTbItems();
				});
				
				recats.searchTbItems();
				var cats = DOM.query('#J_CatsTree input');
	       		var addCats = '';
	       		var selectCats = DOM.prop('#J_SelectCats','title');
	       		Event.on(cats,'click',function(ev){
	   				if(ev.currentTarget.checked){
	   					addCats += DOM.prop(ev.currentTarget,'title') + ',';
	   					DOM.html('#J_changeCats',addCats);
	   					
	   					selectCats += DOM.val(ev.currentTarget) + ',';
	   					DOM.prop('#J_SelectCats','title',selectCats);
	   					recats.previewCats();
	   				} else {
	   				    var title = recats.escape(DOM.prop(ev.currentTarget,'title'));
	   					var reg = new RegExp(title+",","g");
	   					addCats = addCats.replace(reg,'');
	   					DOM.html('#J_changeCats',addCats);
	   					
	   					var reg1 = new RegExp(ev.currentTarget.value+",","g");
	   					selectCats = selectCats.replace(reg1,'');
	   					DOM.prop('#J_SelectCats','title',selectCats);
	   				}
	       		})
				Event.on('#J_SearchBtn','click',recats.searchTbItems); //活动中宝贝全选   	 
			    Event.on('#J_TCheckAll','click',recats.CheckAll); //活动中宝贝全选   	 
			    
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
						DOM.css(DOM.query(".J_ControlBtm") , 'display' , '');
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
							recats.revertItemCats(DOM.val(ev.currentTarget));
						} else{
							selectItemNum +=1;
							recats.previewCats();
						}
						DOM.text('#J_SelectedItemNum',selectItemNum);
					});
					var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					recats.paginator = new showPages('recats.paginator').setRender(recats.handlePagination).setPageCount(pageCount).printHtml('#J_BottomPaging',2);
					recats.paginator.printHtml('#J_TopPaging',3);
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
							recats.revertItemCats(DOM.val(ev.currentTarget));
						}else{
							recats.previewCats();
						}
					});
					var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					recats.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_BottomPaging',2);
					recats.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_TopPaging',3);
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
				if(!recats.checkBoxs){
					var checkBoxs = DOM.query('#J_PromotionItemList .J_CheckBox');
				}else{
					var checkBoxs = recats.checkBoxs;
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
			chooseCatsType : function(chooseCatsType){
				if(chooseCatsType == 2){
					catsType = 2;
				} else if(chooseCatsType == 3){
					catsType = 3;
				} else {
					catsType = 1;
				}
				recats.previewCats();
			},
			previewCats : function(){
				if(DOM.attr('#J_AddType','checked')){
					recats.addItemCats();
				}
				if(DOM.attr('#J_ReplaceType','checked')){
					recats.replaceItemCats();
				} 
				if(DOM.attr('#J_KeyType','checked')){
					recats.removeItemCats();
				}
				
				
			},
			addItemCats : function() {
				if(!recats.checkBoxs){
					var checkBoxs = DOM.query('#J_PromotionItemList .J_CheckBox');
				}else{
					var checkBoxs = recats.checkBoxs;
				}
				var len = checkBoxs.length;
				var m=0;
				for(i=0; i<len; i++){
					if(checkBoxs[i].checked){
						id = checkBoxs[i].value;
						
						var delComma = new RegExp(",$","g");
						var catsChangeSpan = DOM.html(DOM.get("#J_changeCats"));
						var catsChangeSpan = catsChangeSpan.replace(delComma,'');
						var catsTitleArray = catsChangeSpan.split(',');
						var catsChangeId = DOM.attr('#J_SelectCats','title');
						var catsChangeId = catsChangeId.replace(delComma,'');
						var catsChangeIdArray = catsChangeId.split(',');
						var catsProtoCatsP = DOM.query('#J_Cats_'+id+' p');
						var catsProtoId = '';
						var catsProtoTitle = '';
						for(var a=0;a<catsProtoCatsP.length;a++){
							catsProtoId += DOM.attr(catsProtoCatsP[a],'id') + ',';
							catsProtoTitle += DOM.text(catsProtoCatsP[a]) + ',';
						}
						var catsProtoId = catsProtoId.replace(delComma,'');
						var catsProtoIdArray = catsProtoId.split(',');
						var catsProtoTitle = catsProtoTitle.replace(delComma,'');
						var catsProtoTitleArray = catsProtoTitle.split(',');
						var itemCats = DOM.html(DOM.get('#J_Cats_'+id));
						var mixCats = itemCats;
						var catsTitleP = '';
						for(var b=0;b<catsProtoIdArray.length;b++){
							for(var c=0;c<catsChangeIdArray.length;c++){
								if(catsChangeIdArray[c] == catsProtoIdArray[b]){
									catsChangeIdArray[c] = ''; //已知小bug：当前置空，未删除，在下一步时会有空 <p></p>
									catsTitleArray[c] = '';
								}
							}
						}
						for(var d=0;d<catsChangeIdArray.length;d++){
							catsTitleP = catsTitleP+'<p id="'+catsChangeIdArray[d]+'">'+catsTitleArray[d]+'</p>';							
						}
						var mixCats = mixCats+catsTitleP;
						DOM.html(DOM.get('#J_Cats_'+id), mixCats);
						m++;
					}
				}
//				if(m == 0){
//					H.recats.msg.hide();
//					H.recats.msg.setMsg('<div class="point relative"><div class="point-w-1">未选择任何宝贝</div></div>').showDialog();
//					return;
//				}
			},
			replaceItemCats : function() {
				if(!recats.checkBoxs){
					var checkBoxs = DOM.query('#J_PromotionItemList .J_CheckBox');
				}else{
					var checkBoxs = recats.checkBoxs;
				}
				var len = checkBoxs.length;
				var m=0;
				for(i=0; i<len; i++){
					if(checkBoxs[i].checked){
						id = checkBoxs[i].value;
						var catsChangeSpan = DOM.html(DOM.get("#J_changeCats"));
						var reg = new RegExp(",","g");
						var catsChange = catsChangeSpan.replace(reg,'<br/>');
						DOM.html(DOM.get('#J_Cats_'+id), catsChange);
						m++;
					}
				}
//				if(m == 0){
//					H.recats.msg.hide();
//					H.recats.msg.setMsg('<div class="point relative"><div class="point-w-1">未选择任何宝贝</div></div>').showDialog();
//					return;
//				}
			},
			removeItemCats : function() {
				if(!recats.checkBoxs){
					var checkBoxs = DOM.query('#J_PromotionItemList .J_CheckBox');
				}else{
					var checkBoxs = recats.checkBoxs;
				}
				var len = checkBoxs.length;
				var m=0;
				for(i=0; i<len; i++){
					if(checkBoxs[i].checked){
						id = checkBoxs[i].value;
						var delComma = new RegExp(",$","g");
						var catsChangeSpan = DOM.html(DOM.get("#J_changeCats"));
						var catsChangeSpan = catsChangeSpan.replace(delComma,'');
						var catsTitleArray = catsChangeSpan.split(',');
						var catsChangeId = DOM.attr('#J_SelectCats','title');
						var catsChangeId = catsChangeId.replace(delComma,'');
						var catsChangeIdArray = catsChangeId.split(',');
						var catsProtoCatsP = DOM.query('#J_ProtoCats_'+id+' p');
						var catsProtoId = '';
						var catsProtoTitle = '';
						for(var a=0;a<catsProtoCatsP.length;a++){
							catsProtoId += DOM.attr(catsProtoCatsP[a],'id') + ',';
							catsProtoTitle += DOM.text(catsProtoCatsP[a]) + ',';
						}
						var catsProtoId = catsProtoId.replace(delComma,'');
						var catsProtoIdArray = catsProtoId.split(',');
						var catsProtoTitle = catsProtoTitle.replace(delComma,'');
						var catsProtoTitleArray = catsProtoTitle.split(',');
						for(var b=0;b<catsProtoIdArray.length;b++){
							for(var c=0;c<catsChangeIdArray.length;c++){
								if(catsChangeIdArray[c] == catsProtoIdArray[b]){
									catsProtoIdArray[b] = '';
									catsProtoTitleArray[b] = '';
								}
							}
						}
						var catsProtoTitleArray = catsProtoTitleArray.toString();
						var Comma = new RegExp(",","g");
						var catsProtoTitleArray = catsProtoTitleArray.replace(Comma,'<br/>');
						DOM.html(DOM.get('#J_Cats_'+id), catsProtoTitleArray);
						m++;
					}
				}
				if(m == 0){
					new H.widget.msgBox({
							    title:"错误提示",
							    content:'未选择任何宝贝！',
							    type:"error",
								autoClose:true,
								timeOut :1000
							});
			                  return;
			              }	
			},
			revertItemCats : function(flag) {
				if(!showPermissions('editor_tool','工具箱')){return ;}
				if(isVersionPer('tool')){return ;}	
				if(!recats.checkBoxs){
					var checkBoxs = DOM.query('#J_PromotionItemList .J_CheckBox');
				}else{
					var checkBoxs = recats.checkBoxs;
				}
				if(flag){
					id = flag;
					var json = [];
					var itemCats =DOM.html(DOM.get('#J_ProtoCats_'+id));
					DOM.html(DOM.get('#J_Cats_'+id), itemCats);
					var itemTitle =H.util.strProcess(DOM.val(DOM.get('#J_ItemTitle_'+id)));
					var selectCats = '';
					var protoCats = DOM.val('#J_ItemProtoSellerCIds_'+id);
					var delComma = new RegExp(",$","g");
					var selCatsArray = selectCats.replace(delComma,'');
					var proCatsArray = protoCats.replace(delComma,'');
						selCatsArray = selCatsArray.split(',');
						proCatsArray = proCatsArray.split(',');
					for(var a = 0;a<proCatsArray.length;a++){
						for(var z = 0;z<selCatsArray.length;z++){
							if(selCatsArray[z] == proCatsArray[a]){
								selCatsArray.splice(z,1);
							}
						}
					}
					if(selCatsArray.length + proCatsArray.length > 10){
						//recats.msg.hide();
						new H.widget.msgBox({
			                title: "",
			                content: "当前所属目录修改最多为10个，即(原目录+现目录-重复目录<=10)！",
			                type: "error",
			                buttons: [{ value: "Ok"}]
			                
			            });
						return;
					}
					var pic_url = DOM.val(DOM.get('#J_ItemPic_'+id));
					var o = '{"id":"' + id + '","catsType":"' + catsType + '","protoCats":"' + protoCats + '", "title":"' + itemTitle + '", "selectCats":"' + selectCats + '", "pic_url":"' + pic_url + '"}';
					o = eval('(' + o + ')');						
					json.push(o);
					var m=1;
				}else{
					
					var len = checkBoxs.length;
					var m=0;
					var json = [];
					for(i=0; i<len; i++){
						if(checkBoxs[i].checked){
							id = checkBoxs[i].value;
							var itemCats =DOM.html(DOM.get('#J_ProtoCats_'+id));
							DOM.html(DOM.get('#J_Cats_'+id), itemCats);
							var itemTitle =H.util.strProcess(DOM.val(DOM.get('#J_ItemTitle_'+id)));
							var selectCats = '';
							var protoCats = DOM.val('#J_ItemProtoSellerCIds_'+id);
							var delComma = new RegExp(",$","g");
							var selCatsArray = selectCats.replace(delComma,'');
							var proCatsArray = protoCats.replace(delComma,'');
								selCatsArray = selCatsArray.split(',');
								proCatsArray = proCatsArray.split(',');
							for(var a = 0;a<proCatsArray.length;a++){
								for(var z = 0;z<selCatsArray.length;z++){
									if(selCatsArray[z] == proCatsArray[a]){
										selCatsArray.splice(z,1);
									}
								}
							}
							if(selCatsArray.length + proCatsArray.length > 10){
								//recats.msg.hide();
								new H.widget.msgBox({
					                title: "",
					                content: "当前所属目录修改最多为10个，即(原目录+现目录-重复目录<=10)！",
					                type: "error",
					                buttons: [{ value: "Ok"}]
					                
					            });
								return;
							}
							var pic_url = DOM.val(DOM.get('#J_ItemPic_'+id));
							var o = '{"id":"' + id + '","catsType":"' + catsType + '","protoCats":"' + protoCats + '", "title":"' + itemTitle + '", "selectCats":"' + selectCats + '", "pic_url":"' + pic_url + '"}';
							o = eval('(' + o + ')');						
							json.push(o);
							m++;
						}
					}
				}
				if(m == 0){
					//recats.msg.hide();
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
				var data = "items="+itemsJson+"&form_key="+FORM_KEY;
				var submitHandle = function(o) {
						//recats.msg.hide();
					 	new H.widget.msgBox({ 
						 			type: "sucess", 
						 			content: "取消成功",
									dialogType:"msg", 
									autoClose:true, 
									timeOut:3000
								});
				};
				var errorHandle = function(o){
						//recats.msg.hide();
						new H.widget.msgBox({
						    title:"错误提示",
						    content:o.desc,
						    type:"error"
						});	
				};
				new H.widget.asyncRequest().setURI(updateCatsUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			
			updateCats : function(id) {
				if(!showPermissions('editor_tool','工具箱')){return ;}
				if(isVersionPer('tool')){return ;}	
//				if(showToCouUpdateDialog()){return ;}
				var itemTitle =H.util.strProcess(DOM.val(DOM.get('#J_ItemTitle_'+id)));
				var selectCats = DOM.prop('#J_SelectCats','title');
				var protoCats = DOM.val('#J_ItemProtoSellerCIds_'+id);
				var delComma = new RegExp(",$","g");
				var selectCatsArray = selectCats.replace(delComma,'');
				var protoCatsArray = protoCats.replace(delComma,'');
				    selectCatsArray = selectCatsArray.split(',');
				    protoCatsArray = protoCatsArray.split(',');
				if(selectCatsArray.length + protoCatsArray.length > 10){	
					new H.widget.msgBox({
		                content: "当前所属目录修改最多为10个，即(原目录+现目录-重复目录<=10)！",
		                type: "error"
		            });
					return;
				}
				var pic_url = DOM.val(DOM.get('#J_ItemPic_'+id));
				var json = [];
				var o = '{"id":"' + id + '","catsType":"' + catsType + '","protoCats":"' + protoCats + '", "title":"' + itemTitle + '", "selectCats":"' + selectCats + '", "pic_url":"' + pic_url + '"}';
				o = eval('(' + o + ')');						
				json.push(o);
				var itemsJson = KISSY.JSON.stringify(json);
				var data = "items="+itemsJson+"&form_key="+FORM_KEY;
                var submitHandle = function(o) {
        	    	recats.msg.hide();
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
        	    };
				new H.widget.asyncRequest().setURI(updateCatsUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			addSelectItemsUpdateCats : function() {
				if(!showPermissions('editor_tool','工具箱')){return ;}
				if(isVersionPer('tool')){return ;}	
//				if(showToCouUpdateDialog()){return ;}
				if(!recats.checkBoxs){
					var checkBoxs = DOM.query('#J_PromotionItemList .J_CheckBox');
				}else{
					var checkBoxs = recats.checkBoxs;
				}
				if(DOM.text('#J_changeCats')==''){
					new H.widget.msgBox({
		                content: "亲，请选择归类！",
		                type: "error"
		            });
					return;
				}
				recats.msg = new H.widget.msgBox({ type: "error",
		            content: "系统正在处理中",
					dialogType:"loading"
		           
		        });
				var len = checkBoxs.length;
				var m=0;
				var json = [];
				for(i=0; i<len; i++){
					if(checkBoxs[i].checked && !checkBoxs[i].disabled){
						id = checkBoxs[i].value;
						var itemTitle =H.util.strProcess(DOM.val(DOM.get('#J_ItemTitle_'+id)));
						var selectCats = DOM.prop('#J_SelectCats','title');
						var protoCats = DOM.val('#J_ItemProtoSellerCIds_'+id);
						var delComma = new RegExp(",$","g");
						var selCatsArray = selectCats.replace(delComma,'');
						var proCatsArray = protoCats.replace(delComma,'');
							selCatsArray = selCatsArray.split(',');
							proCatsArray = proCatsArray.split(',');
						for(var a = 0;a<proCatsArray.length;a++){
							for(var z = 0;z<selCatsArray.length;z++){
								if(selCatsArray[z] == proCatsArray[a]){
									selCatsArray.splice(z,1);
								}
							}
						}
						if(selCatsArray.length + proCatsArray.length > 10){
							recats.msg.hide();
							new H.widget.msgBox({
				                title: "",
				                content: "当前所属目录修改最多为10个，即(原目录+现目录-重复目录<=10)！",
				                type: "error",
				                buttons: [{ value: "Ok"}]
				                
				            });
							return;
						}
						var pic_url = DOM.val(DOM.get('#J_ItemPic_'+id));
						var o = '{"id":"' + id + '","catsType":"' + catsType + '","protoCats":"' + protoCats + '", "title":"' + itemTitle + '", "selectCats":"' + selectCats + '", "pic_url":"' + pic_url + '"}';
						o = eval('(' + o + ')');						
						json.push(o);
						m++;
					}
				}
				if(m == 0){
					recats.msg.hide();
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
				var data = "items="+itemsJson+"&form_key="+FORM_KEY;
                var submitHandle = function(o) {
						recats.msg.hide();
                	 	new H.widget.msgBox({ 
						 			type: "sucess", 
						 			content: "成功修改",
									dialogType:"msg", 
									autoClose:true, 
									timeOut:3000
								});
        	    };
        	    var errorHandle = function(o){
						recats.msg.hide();
        	    		new H.widget.msgBox({
						    title:"错误提示",
						    content:o.desc,
						    type:"error"
						});	
        	    };
				new H.widget.asyncRequest().setURI(updateCatsUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
            //转义 正则
            escape : function(str){
                if (str == null){
                    return ""; 
                } else{
                    return  str.replace(/\//g,'\\/').replace(/\./g,"\\.").replace(/\*/g,"\\*").replace(/\+/g,"\\+").replace(/\(/g,"\\(").replace(/\)/g,"\\)").replace(/\$/g,"\\$").replace(/\?/g,"\\?").replace(/\[/g,"\\[").replace(/\]/g,"\\]").replace(/\^/g,"\\^").replace(/\{/g,"\\{").replace(/\}/g,"\\}"); 
                }
            }
			
    	};
	
},{
    requires: ['utils/showPages/index','utils/beautifyForm/index','bui/select']
});
