/*
combined files : 

utils/showPages/index
page/mods/check
utils/beautifyForm/index
page/list-init

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
 * @fileOverview 
 * @author  
 */
KISSY.add('page/mods/check',function (S) {
    // your code here
	
	return checkUtil = {
			/*违禁词限制*/
			checkSpecTitle : function(str){
				var result = [];
				var error = false;
				var msg = null;
				var re =/(淘宝)|(限时折扣)|(限时打折)|(良品)|(淘金币)|(天天特价)|(满就送)/i;
				if(re.test(str)){
				    var rt = re.exec(str);
				    if(rt != null){
						error = true;
						msg = '含有违禁字'+rt[0]+'！';
					}
				}
				result.push(error);
				result.push(msg);
				return result;
			},
			/*验证活动名称*/
			checkPromoName : function(promoName){
				var result = [];
				var error = false;
				var msg = null;
				var re=/^[\u4E00-\u9FA5\uf900-\ufa2d\A-Za-z0-9]{2,5}$/;
				if(!re.test(promoName)){
					if(promoName.length<2 || promoName.length >5){
						error = true;
						msg = '长度2~5个字符！';
					}else {
						var reg=/[^\u4E00-\u9FA5\uf900-\ufa2d\A-Za-z0-9]+/;
						var rt = promoName.match(reg);
						if(rt != null){
							error = true;
							msg = '含有非法字符'+rt[0]+'！';
						}
					}
				}
				result.push(error);
				result.push(msg);
				return result;
			},
			/*验证活动备注*/
			checkPromoDesc : function(promoDesc){
				var result = [];
				var error = false;
				var msg = null;
				var re=/^[\u4E00-\u9FA5\uf900-\ufa2d\w\s\，！。《》（）、—]{0,30}$/;
				if(!re.test(promoDesc)){
					if(promoDesc.length>30){
						error = true;
						msg = '长度30个字以内！';
					}else {
						var reg=/[^\u4E00-\u9FA5\uf900-\ufa2d\w\s\，！。《》（）、—]+/;
						var rt = promoDesc.match(reg);
						if(rt != null){
							error = true;
							msg = '含有非法字符'+rt[0]+'！';
						}
					}
				}
				result.push(error);
				result.push(msg);
				return result;
			},
			/*URL验证*/
			checkUrl : function(v){
				var result = [];
				var error = false;
				var msg = null;
				var reUrl = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/ ;
				if(!reUrl.test(v)){
						error = true;
						msg = '非法URl地址！';
				}
				result.push(error);
				result.push(msg);
				return result;
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
	         /**
	         * JSON ajax 传参转换
	         * @param {Object} str
	         * @return {Object}
	         */
	        strProcess : function(str){
	                return str.replace(/\\/g, '\\\\').replace(/\"/g, '\\"').replace(/[\t\n&]/g, '%26').replace(/%/g, '%25');
	        },
            /**
             * 格式化数字
             * @example formatNumber(100.888,2); //结果为100.88
             * @param {Object} str
             * @return {date}
             */
	        FormatNumber: function(srcStr,nAfterDot){
                    var srcStr,nAfterDot;
                    var resultStr,nTen;
                    srcStr = ""+srcStr+"";
                    strLen = srcStr.length;
                    dotPos = srcStr.indexOf(".",0);
                    if (dotPos == -1){
                        resultStr = srcStr+".";
                        for (i=0;i<nAfterDot;i++){
                            resultStr = resultStr+"0";
                        }
                        return resultStr;
                    }else{if ((strLen - dotPos - 1) >= nAfterDot){
                            nAfter = dotPos + nAfterDot + 1;
                            nTen =1;
                            for(j=0;j<nAfterDot;j++){
                            nTen = nTen*10;
                            }
                            resultStr = Math.floor(parseFloat(srcStr)*nTen)/nTen;
                            return resultStr;
                        }else{
                            resultStr = srcStr;
                                for (i=0;i<(nAfterDot - strLen + dotPos + 1);i++){
                                resultStr = resultStr+"0";
                                }
                            return resultStr;
                        }
                    }
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
	}
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
KISSY.add('page/list-init',function (S,showPages,checkUtil,Calendar,Overlay,beautifyForm) {
	var S = KISSY,DOM = S.DOM, Event = S.Event;
	return  promotionControl = {
		msg :null ,
		msg1 : null,
		isLoad : false,
		paginator:null,
		x : new beautifyForm,
		init : function(){
		
				var Timer = S.later(promotionControl.getPromoItemWait('已暂停'),5000,true,null);
		
				//更新店铺折扣
				promotionControl.getPromoItemNum();
				Event.on('#J_updateDiscount','click',function(){
					DOM.val('#J_isDiscount','1');
				    var diff  = IsExpired();
					if(diff > -5000 ){
						var sucessHandle = function(o) {
							promotionControl.getPromoItemNum();
				 		};
				 		var errorHandle = function(o){
				 			KISSY.Event.fire('.J_TopExpired','click');
				 		};
				 		var data = '';
				  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
		   			}else{
		   				promotionControl.getPromoItemNum();
		   			}
			   });	
				
				Event.on('#J_past','click',function(){
					promotionControl.setExpiredPromo();
			    });
		
				//展开活动类型
				Event.on('.J_promoTypeBtn','mouseenter mouseleave',function(ev){
					 var id = DOM.attr(ev.currentTarget,'pid');
					 var downMore = S.one('#J_promoTypeItems'+id);
					 var display = downMore.css('display');	
					 if(ev.type == 'mouseenter'){
						 downMore.slideDown(0.3);
					 }else{
						 downMore.slideUp(0.1);
					 }
				})
		
				//展示活动列表更多操作
				Event.on('.J_downIcon','mouseenter mouseleave',function(ev){
					 var id = DOM.attr(ev.currentTarget,'pid');
					 if(ev.type == 'mouseenter'){
						 DOM.show('#J_downMore'+id)
					 }else{
						 DOM.hide('#J_downMore'+id)
					 }
				 })

				 Event.delegate(document,'mouseenter mouseleave','.J_listItem',function(ev){
					 if(ev.type == 'mouseenter'){
						 DOM.addClass(ev.currentTarget,'current')
					 }else{
						 DOM.removeClass(ev.currentTarget,'current')
					 }
				});
				 
				 //选择时间
				 new Calendar.DatePicker({
   	               trigger:'.J_tiems',
   	               showTime:true,
   	               autoRender : true,
   	               autoSetValue :true,
   	               delegateTigger :true
				})
				
				 //销毁弹窗						
//				Event.delegate(document,'click','.bui-ext-close',function(){
//					DOM.remove('.bui-dialog');
//				});
				 
				//点击搜索活动隐藏列表
				Event.delegate(document,'click','.J_BackTo',function(){
					DOM.show('#promoList');
					DOM.show('#J_PromoDetail');
	            	DOM.hide('#itemList');
	            	DOM.hide('#J_BackToPromoList');
				})
				
				//修改活动备注hover
				Event.delegate(document,'mouseenter mouseleave','.J_OnClickShopDesc',function(ev){
					 if(ev.type == 'mouseenter'){
						 DOM.addClass(ev.currentTarget,'current')
					 }else{
						 DOM.removeClass(ev.currentTarget,'current')
					 }
				})
				
			 	//获取代码
			 	Event.on(DOM.query('.J_GetTemplet'), "click", function(){
					var getTempletHandle = function(o) {
						promotionControl.msg.hide();
						var str = '<div class="pop-getCode">'+
									'<textarea id="J_Templet_Content" onclick="this.select()">'+o.payload+'</textarea></br>'+
									'鼠标于框内CTRL+C：复制、CTRL+V：粘贴 <a class="J_Copy">点此复制</a>'+
								'</div>';
						var TempletPanel = new Overlay.Dialog({
							title : '获取海报代码',
							width : 440,
							mask:true,
							footerStyle :{'display' : 'none'},
	     	                bodyContent:str
						})
						TempletPanel.show()
						promotionControl.clipboard('.J_Copy','#J_Templet_Content');
					};
					var error = function(o){
						promotionControl.msg.hide();
						new H.widget.msgBox({
						    title:"错误提示",
						    content:o.desc,
						    type:"error"
						});
					};
					var pid = DOM.attr(this,'data');
					var data = "pid="+pid+"&form_key="+FORM_KEY;
					promotionControl.msg = new H.widget.msgBox({
					    title:"",
						dialogType : 'loading',
					    content:'获取代码中，请稍候'	
					});
			 	    new H.widget.asyncRequest().setURI(getTempletUrl).setMethod("GET").setHandle(getTempletHandle).setErrorHandle(error).setData(data).send();
				});
				
				//结束活动
		    	Event.on(DOM.query('.J_Delete'), "click", function(){
		    		 if(!showPermissions('editor_promotion',"促销活动")){
		    			return ;
		    		 }
		    		 var pid = DOM.attr(this,'data');
		    		 var type = DOM.val('#J_TypeId_'+pid);
					 var diff  = IsExpired();
	       			 if(diff > -5000 && type == 10 ){
	      					var sucessHandle = function(o) {
	      						promotionControl.deleteHandle(pid);
	      			 		};
	      			 		var errorHandle = function(o){
	      			 			KISSY.Event.fire('.J_TopExpired','click');
	      			 		};
	      			 		var data = '';
	      			  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
	      			}else{
	  					promotionControl.deleteHandle(pid);
	      			}
			    });
				
				//活动暂停
				Event.on(DOM.query('.J_Pause'), "click", function(){
					 if(!showPermissions('editor_promotion',"编辑促销活动")){
		    			return ;
		    		 }
					 var pid = DOM.attr(this,'data');
					 var diff  = IsExpired();
	       			 if(diff > -5000 ){
	      					var sucessHandle = function(o) {
	      						promotionControl.pausePromo(pid);
	      			 		};
	      			 		var errorHandle = function(o){
	      			 			KISSY.Event.fire('.J_TopExpired','click');
	      			 		};
	      			 		var data = '';
	      			  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
	      			}else{
	  					promotionControl.pausePromo(pid);
	      			}
			    });
				
				/*重启活动授权*/
				Event.on(DOM.query('.J_Restart'), "click", function(){
					if(!showPermissions('editor_promotion',"重启促销活动")){
		    			return ;
		    		 }
					 var pid = DOM.attr(this,'data');
					 var diff  = IsExpired();
	       			 if(diff > -5000 ){
	      					var sucessHandle = function(o) {
	      						promotionControl.restartPromo(pid);
	      			 		};
	      			 		var errorHandle = function(o){
	      			 			KISSY.Event.fire('.J_TopExpired','click');
	      			 		};
	      			 		var data = '';
	      			  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
	      			}else{
	  					promotionControl.restartPromo(pid);
	      			}
		    	});
				
				/*更新卖家备注*/
			 	 Event.delegate(document,'click','.J_OnClickShopDesc', function(ev) {
			 		if(!showPermissions('editor_promotion',"编辑促销活动")){
			   			return ;
			   		}
			  		DOM.hide(ev.currentTarget);
			 		var pid = DOM.attr(ev.currentTarget,'data');
			 		var SshopDesc = KISSY.trim(DOM.val('#J_SouceShopDesc_'+pid));
			
					if(!KISSY.one('#J_EditorShopDesc_'+pid)){
						var str ='<input type="text"  class="edit-desc-input" data ="'+pid+'" id="J_InputShopDesc_'+pid+'">';
						DOM.html('#J_ShowEditorDesc_'+pid,str);
					}
					DOM.show('#J_ShowEditorDesc_'+pid);
					Event.on('#J_InputShopDesc_'+pid,'blur',function(){
						KISSY.later(function(){
							DOM.hide('#J_ShowEditorDesc_'+pid);
			 				DOM.show('#J_Promo_'+pid+' .J_OnClickShopDesc');
			 			},200,false,null);
				 	});
					DOM.get('#J_InputShopDesc_'+pid).focus();
					DOM.val('#J_InputShopDesc_'+pid,SshopDesc);
					Event.on('#J_InputShopDesc_'+pid,'focusout',function(ev){
						var pid = DOM.attr(ev.currentTarget,'data');
						var SshopDesc = KISSY.trim(DOM.val('#J_SouceShopDesc_'+pid));
						var shopDesc = KISSY.trim(DOM.val('#J_InputShopDesc_'+pid));
						if(SshopDesc == shopDesc){
							DOM.hide('#J_ShowEditorDesc_'+pid);
					 		DOM.show('#J_Promo_'+pid+' .J_OnClickShopDesc');
							return ;
						}
					 	var sucessHandle = function(o) {
				 			DOM.hide('#J_ShowEditorDesc_'+pid);
				 			if(!shopDesc){
				 				DOM.html('#J_Promo_'+pid+' .J_OnClickShopDesc','<span class="edit-tip">填备注</span>');
					 		}else{
					 			DOM.html('#J_Promo_'+pid+' .J_OnClickShopDesc','注：<em>'+shopDesc+'</em>');
					 		}
				 			DOM.show('#J_Promo_'+pid+' .J_OnClickShopDesc');
				 			DOM.val('#J_SouceShopDesc_'+pid,shopDesc);
				 		};
					 	var error = function(o){
							new H.widget.msgBox({
							    title:"错误提示",
							    content:o.desc,
							    type:"error",
								autoClose : true,
								timeOut : 3000
							});
				 		};
				 		var data = "pid="+pid+"&shop_desc="+encodeURI(shopDesc)+"&form_key="+FORM_KEY;
				  	    new H.widget.asyncRequest().setURI(saveShopDescUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(error).setData(data).send();
					})
			 	 });
			 	 
			 	/*更改活动名称*/
			 	 Event.delegate(document,'click mouseenter mouseleave','.J_EditorPromoName', function(ev) {
					if(ev.type == 'mouseenter'){
						DOM.addClass(ev.currentTarget,'hover');
					}else if(ev.type == 'mouseleave'){
						DOM.removeClass(ev.currentTarget,'hover');
					}else if(ev.type == 'click'){
						if(!showPermissions('editor_promotion',"编辑促销活动")){
				   			return ;
				   		 }
						var pid = DOM.attr(ev.currentTarget,'data');
						var diff  = IsExpired();
		       			 if(diff > -5000 ){
		      					var sucessHandle = function(o) {
		      						promotionControl.editorPromoName(pid);	
		      			 		};
		      			 		var errorHandle = function(o){
		      			 			KISSY.Event.fire('.J_TopExpired','click');
		      			 		};
		      			 		var data = '';
		      			  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
		      			}else{
	  						promotionControl.editorPromoName(pid);
		      			}
					}
			 	});

			 	/*更改活动时间*/
			 	 Event.delegate(document,'click mouseenter mouseleave','.J_EditorPromoTime', function(ev) {
					if(ev.type == 'mouseenter'){
						DOM.addClass(ev.currentTarget,'edit-activity-hover');
					}else if(ev.type == 'mouseleave'){
						DOM.removeClass(ev.currentTarget,'edit-activity-hover');
					}else if(ev.type == 'click'){
						if(!showPermissions('editor_promotion',"编辑促销活动")){
				   			return ;
				   		 }
				 		/*活动授权*/
						var pid = DOM.attr(ev.currentTarget,'data');
						 var diff  = IsExpired();
		       			 if(diff > -5000 ){
		      					var sucessHandle = function(o) {
		      						promotionControl.editorPromoTime(pid);
		      			 		};
		      			 		var errorHandle = function(o){
		      			 			KISSY.Event.fire('.J_TopExpired','click');
		      			 		};
		      			 		var data = '';
		      			  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
		      			}else{
	  						promotionControl.editorPromoTime(pid);
		      			}
					}
			 	});
			},
			
			//暂停等待处理
	        getPromoItemWait : function(txt){
				var list = DOM.query('.J_Refresh_Flag');
				if(list.length > 0){
					var sucess = function(o){
		        		var items = o.payload;
						var len = items.length; 
						for (var i=0; i<len; i++) {
							DOM.html('#J_promoStatus'+items[i].id,txt);
							DOM.removeClass('#J_Refresh_'+items[i].id,'J_Refresh_Flag');
						}
					};
			 		var ids = [];
			 		S.each(list,function(item){
			 			var id = DOM.val(item);
			 			ids.push(id);
			 		});
			 		var promo_ids = ids.join(',');
			 		var data = 'promo_ids='+promo_ids;
			  	    new H.widget.asyncRequest().setURI(getPromoStatusUrl).setMethod("POST").setHandle(sucess).setData(data).send(); 
				}
	        },
			
			//获取店铺设置的折扣
	        getPromoItemNum : function(discount){
	        	var sucess = function(o){
	        		DOM.hide('#J_loadingDiscount');
	        		DOM.show('#J_storeDiscount');
	        		DOM.text('#J_storeDiscount',o.payload+' 折');
				};
		 		var error = function(o){
		 			DOM.hide('#J_loadingDiscount');
		 			DOM.show('#J_storeDiscount');
		 			DOM.text('#J_storeDiscount','获取不到');
		 		};
		 		DOM.show('#J_loadingDiscount');
		 		DOM.hide('#J_storeDiscount');
		 		var isLoading = DOM.val('#J_isDiscount');
		 		var data = 'fg='+isLoading;
		  	    new H.widget.asyncRequest().setURI(getLowestDisUrl).setMethod("GET").setHandle(sucess).setErrorHandle(error).setData(data).send(); 
	        },
			
			/*复制功能*/
			clipboard: function(el,contain){
				Event.on(el,'click',function(ev){
					var copy = DOM.val(contain);
					if (window.clipboardData){
						 window.clipboardData.clearData();
						 window.clipboardData.setData("Text", copy);
						 new H.widget.msgBox({ 
						 			type: "success", 
						 			content: "已成功复制",
									dialogType:"msg", 
									autoClose:true, 
									timeOut:3000
								});
						
					}else if (window.netscape){
							 try{
									netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
								}catch(e){
									 new H.widget.msgBox({ 
							 			type: "error", 
							 			content: "您的firefox安全限制限制您进行剪贴板操作，请打开'about:config'将signed.applets.codebase_principal_support'设置为true'之后重试，相对路径为firefox根目录/greprefs/all.js",
										dialogType:"msg", 
										autoClose:true, 
										timeOut:5000
									});
									return false;
								}
							var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
							if (!clip) return;
							var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
							if (!trans) return;
							trans.addDataFlavor('text/unicode');
							var str = new Object();
							var len = new Object();
							var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
							var copytext=copy;
							str.data=copytext;
							trans.setTransferData("text/unicode",str,copytext.length*2);
							var clipid=Components.interfaces.nsIClipboard;
							if (!clip) return false;
							clip.setData(trans,null,clipid.kGlobalClipboard);
							 new H.widget.msgBox({ 
					 			type: "success", 
					 			content: "已成功复制",
								dialogType:"msg", 
								autoClose:true, 
								timeOut:3000
							});
						}else if(KISSY.UA.core == 'webkit'){
							 new H.widget.msgBox({ 
					 			type: "error", 
					 			content: "该浏览器暂不支持，请用 Ctrl+c 复制",
								dialogType:"msg", 
								autoClose:true, 
								timeOut:3000
							});
						}
					return false;
				})
			},
			
			pausePromo : function(pid){
				var pauseHandle = function(o) {
					new H.widget.msgBox({
					    title: "暂停活动",
					    content: "暂停活动将会取消您设置的促销活动",
					    type: "confirm",
					    buttons: [{ value: "暂停" }, { value: "取消" }],
					    success: function (result) {
					        if (result == "暂停") {
					            var data = "pid="+pid+"&form_key="+FORM_KEY;
								var successHandle = function(o){
//									 new H.widget.msgBox({
//									    type:"sucess",
//										dialogType : 'msg',
//									    content:'活动暂停成功',
//									    autoClose:true,
//									    timeOut:3000
//									});
//								  	window.location.href=currentPageUrl;
									DOM.text('#J_promoStatus'+pid,'正在暂停');
									DOM.hide('#J_listAddItem'+pid);
									DOM.addClass('#J_Refresh_'+pid,'J_Refresh_Flag');
									S.later(promotionControl.getPromoItemWait('已暂停'),5000,true,null);
								}
								var errorHandle = function(o){
									if(o.desc == 'need-oauth'){
										 KISSY.Event.fire('.J_TopExpired','click');
										 return ;
									}
									new H.widget.msgBox({
									    title:"错误提示",
									    content:o.desc,
									    type:"error"
									});
								}
					     	    new H.widget.asyncRequest().setURI(pauseUrl).setMethod("GET").setHandle(successHandle).setErrorHandle(errorHandle).setData(data).send();
					        }
					    }
					})
	    		};
	    		var error = function(o){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					})
	    		};
	    		var data = "pid="+pid+"&form_key="+FORM_KEY;
	     	    new H.widget.asyncRequest().setURI(getPromoTimeUrl).setMethod("GET").setHandle(pauseHandle).setErrorHandle(error).setData(data).send();
			},
			
			restartPromo : function(pid){
				var changeTimeHandle = function(o) {
	    			promotionControl.msg.hide();
					var typeId = DOM.val('#J_TypeId_'+pid);
					if(typeId == 10){
						var title = '开始时间 ：立即开始';
						var inputType = 'hidden';
					}else{
						var title = '开始时间：';
						var inputType = 'text';
					}
					var str = '<div class="pop-restart">'+
								'<div class="restart-tiem">开始时间： <input type="'+ inputType +'" value="'+ o.payload.stime +'" id="J_stime" class="input-text-1 input-text J_tiems"/></div>'+
								'<div class="restart-tiem">结束时间： <input type="text" value="'+ o.payload.etime +'" id="J_etime" class="input-text-1 input-text J_tiems"/></div>'+
							'</div>';
					new Overlay.Dialog({ 
						title : '重启活动',
						width : 480,
						height : 230,
						mask:true,
		 	            buttons:[
			                   {
			                     text:'确定修改',
			                     elCls : 'bui-button bui-button-primary',
			                     handler : function(){
			                	   var successHandle = function(o){
										 new H.widget.msgBox({
										    type:"sucess",
											dialogType : 'msg',
										    content:'活动重启成功',
										    autoClose:true,
										    timeOut:3000
										});
									  	window.location.href=currentPageUrl;
									}
									var errorHandle = function(o){
										if(o.desc == 'need-oauth'){
											 KISSY.Event.fire('.J_TopExpired','click');
											 return ;
										}
										new H.widget.msgBox({
										    title:"错误提示",
										    content:o.desc,
										    type:"error"
										});
									}
									
									var stime = DOM.val(DOM.get('#J_stime'));
									var etime = DOM.val(DOM.get('#J_etime'));
									var startTime = H.util.stringToDate(S.one('#J_stime').val());
									var endTime = H.util.stringToDate(S.one('#J_etime').val());
									if((endTime !='') && (startTime.getTime() >= endTime.getTime())){
										new H.widget.msgBox({ 
								 			type: "error", 
								 			content: "开始时间不能大于结束时间，请重新选择",
											dialogType:"msg", 
											autoClose:true, 
											timeOut:3000
										});
										return ;
									}
									if((startTime !='') && (endTime.getTime() <= startTime.getTime())){
										new H.widget.msgBox({ 
								 			type: "error", 
								 			content: "结束时间不能小于开始时间，请重新选择",
											dialogType:"msg", 
											autoClose:true, 
											timeOut:3000
										});
										return ;
									}

									var data = "pid="+pid+"&etime="+etime+"&stime="+stime+"&form_key="+FORM_KEY;
						     	    new H.widget.asyncRequest().setURI(restartUrl).setMethod("GET").setHandle(successHandle).setErrorHandle(errorHandle).setData(data).send();
			                	   	this.destroy();
			                     }
			                   },{
			                     text:'取消修改',
			                     elCls : 'bui-button J_buttonCancel',
			                     handler : function(){
			                       	this.destroy();
			                     }
			                   }
			                 ],
			                bodyContent:str
					}).show();
	    		};
	    		var error = function(o){
	    			promotionControl.msg.hide();
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					})
	    		};
	    		promotionControl.msg = new H.widget.msgBox({
				    title:"",
					dialogType : 'loading',
				    content:'获取活动时间，请稍候'	
				})
	    		var data = "pid="+pid+"&form_key="+FORM_KEY;
	     	    new H.widget.asyncRequest().setURI(getPromoTimeUrl).setMethod("GET").setHandle(changeTimeHandle).setErrorHandle(error).setData(data).send();
			},
			
			editorPromoName : function(pid){
				if(DOM.hasClass('#J_Promo_'+pid,'ing')){
					 new H.widget.msgBox({
					    type:"error",
						dialogType : 'msg',
					    content:'活动正在编辑中！',
					    autoClose:true,
					    timeOut:3000
					});
					return ;
				}else{
					DOM.addClass('#J_Promo_'+pid,'ing');
				}
				
		 		DOM.hide('#J_PromoNameBox_'+pid);	
		 		var SpromoName = KISSY.trim(DOM.val('#J_SoucePromoName_'+pid));
		 		var str ='<input type="text" class="edit-name-input" data ="'+pid+'" id="J_InputPromoName_'+pid+'">';
				DOM.html('#J_ShowEditorPromoName_'+pid,str);
				DOM.show('#J_ShowEditorPromoName_'+pid);
				Event.on('#J_InputPromoName_'+pid,'blur',function(){
					DOM.removeClass('#J_Promo_'+pid,'ing');
					KISSY.later(function(){
						DOM.hide('#J_ShowEditorPromoName_'+pid);
		 				DOM.show('#J_PromoNameBox_'+pid);
		 			},200,false,null);
			 	});
				DOM.get('#J_InputPromoName_'+pid).focus();
				DOM.val('#J_InputPromoName_'+pid,SpromoName);
				Event.on('#J_InputPromoName_'+pid,'focusout',function(ev){
						var pid = DOM.attr(ev.currentTarget,'data');
						var SpromoName = KISSY.trim(DOM.val('#J_SoucePromoName_'+pid));
						var NpromoName = KISSY.trim(DOM.val('#J_InputPromoName_'+pid));
						if(SpromoName == NpromoName){
							DOM.hide('#J_ShowEditorPromoName_'+pid);
							DOM.show('#J_PromoNameBox_'+pid);
							DOM.removeClass('#J_Promo_'+pid,'ing');
							return ;
						}
						var result = H.util.isNull(NpromoName);
						var error = result[0];
						var msg = result[1];
						if(error){
							new H.widget.msgBox({
								    title:"错误提示",
								    content:'出错了：'+msg,
								    type:"error"
								});
							DOM.removeClass('#J_Promo_'+pid,'ing');	
				 			return ;
						}
						result = checkUtil.checkSpecTitle(NpromoName);
						error = result[0];
						msg = result[1];
						if(error){
							new H.widget.msgBox({
								    title:"错误提示",
								    content:'出错了：'+msg,
								    type:"error"
								});
							DOM.removeClass('#J_Promo_'+pid,'ing');	
				 			return ;
						}
						var typeId = DOM.val('#J_TypeId_'+pid);
						if(typeId == '2' || typeId == '9' || typeId == '20' ||  typeId == '22'){
							result = checkUtil.checkPromoName(NpromoName);
							error = result[0];
							msg = result[1];
							if(error){
								new H.widget.msgBox({
								    title:"错误提示",
								    content:'出错了：'+msg,
								    type:"error"
								});
								DOM.removeClass('#J_Promo_'+pid,'ing');
					 			return ;
							}
						}
				 		var sucessHandle = function(o) {
				 			DOM.text('#J_editpromoName'+pid,NpromoName);
				 			DOM.val('#J_SoucePromoName_'+pid,NpromoName);
				 		};
				 		var error = function(o){
				 			new H.widget.msgBox({
							    title:"错误提示",
							    content:o.desc,
							    type:"error"
							});
							DOM.removeClass('#J_Promo_'+pid,'ing');
				 		};
				 		var data = "pid="+pid+"&promo_name="+encodeURI(NpromoName)+"&form_key="+FORM_KEY;
				  	    new H.widget.asyncRequest().setURI(savePromoNameUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(error).setData(data).send();
				})	
			},
			
			editorPromoTime : function(pid){
				var SpromoTime = KISSY.trim(DOM.val('#J_SoucePromoStartTime_'+pid));
				var EpromoTime = KISSY.trim(DOM.val('#J_SoucePromoEndTime_'+pid));
				var isPauseing = DOM.val('#J_isPauseing_'+pid);
				var isWillEnd = DOM.val('#J_isWillEnd_'+pid);
				var str = '<div class="pop-restart '+ isPauseing +' '+ isWillEnd +'" id="J_restarts'+ pid +'">'+
							'<div class="restart-tiem">开始时间： <input type="text" value="'+ SpromoTime +'" id="J_startDate_'+ pid +'" class="input-text-1 input-text J_tiems"/></div>'+
							'<div class="restart-tiem">结束时间： <input type="text" value="'+ EpromoTime +'" id="J_endDate_'+ pid +'" class="input-text-1 input-text J_tiems"/>&nbsp;&nbsp;&nbsp;<a id="J_prolong'+ pid +'">立即延长7天</a></div>'+
							'<div class="restart-check"><label for="J_IsRestart'+ pid +'" class="beautify_check"><input type="checkbox" id="J_IsRestart'+ pid +'" value="1">启动活动（该活动处于暂停状态）</label></div>'+
						'</div>'; 
				new Overlay.Dialog({
					title : '编辑活动时间',
					width : 480,
					height : 250,
					mask:true,
	 	            buttons:[
		                   {
		                     text:'保存',
		                     elCls : 'bui-button bui-button-primary',
		                     handler : function(){
		                	   var sucessHandle = function(o) {
		       			  			//window.location.reload();
									DOM.text('#J_listTime'+pid,residue);
									DOM.text('#J_timeS'+pid,s);
									DOM.text('#J_timeE'+pid,e);
									DOM.val('#J_SoucePromoStartTime_'+pid,NSpromoTime);
									DOM.val('#J_SoucePromoEndTime_'+pid,NEpromoTime);
			       		 		};
			       		 		var error = function(o){
			       					new H.widget.msgBox({
			       					    title:"错误提示",
			       					    content:o.desc,
			       					    type:"error"
			       					});
			       		 		};
			       				NSpromoTime = KISSY.trim(DOM.val('#J_startDate_'+pid)),
			       				NEpromoTime = KISSY.trim(DOM.val('#J_endDate_'+pid));
			       				var startTime = H.util.stringToDate(S.one('#J_startDate_'+pid).val());
								var endTime = H.util.stringToDate(S.one('#J_endDate_'+pid).val());
								
								var residue = Math.floor((endTime.getTime() - startTime.getTime())/86400000);
								var s = new Date(startTime).format("MM月dd日 hh:mm");
								var e = new Date(endTime).format("MM月dd日 hh:mm");
								
								if((endTime !='') && (startTime.getTime() >= endTime.getTime())){
									new H.widget.msgBox({ 
							 			type: "error", 
							 			content: "开始时间不能大于结束时间，请重新选择",
										dialogType:"msg", 
										autoClose:true, 
										timeOut:3000
									});
									return ;
								}
								if((startTime !='') && (endTime.getTime() <= startTime.getTime())){
									new H.widget.msgBox({ 
							 			type: "error", 
							 			content: "结束时间不能小于开始时间，请重新选择",
										dialogType:"msg", 
										autoClose:true, 
										timeOut:3000
									});
									return ;
								}
								if((SpromoTime == NSpromoTime) && (EpromoTime == NEpromoTime)){
			       		  	    	this.destroy();
			       					return ;
			       				}
			       				if(DOM.hasClass('#J_restarts'+pid,'pauseing')){
									var isReStart = DOM.prop('#J_IsRestart'+pid,"checked") ? 1 : 0; 
								}else{
									var isReStart = 0; 
								}
			       		 		var data = "pid="+pid+"&start_date="+NSpromoTime+"&end_date="+NEpromoTime+"&isReStart="+isReStart+"&form_key="+FORM_KEY;
			       		  	    new H.widget.asyncRequest().setURI(savePromoTimeUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(error).setData(data).send();
		                	   	this.destroy();
		                     }
		                   },{
		                     text:'取消',
		                     elCls : 'bui-button J_buttonCancel',
		                     handler : function(){
		                       	this.destroy();
		                     }
		                   }
		                 ],
		                bodyContent:str
				}).show();
				promotionControl.x.renderAllCheckbox('#J_restarts'+pid);
				
				//立即延长7天
				Event.on('#J_prolong'+pid,'click',function(ev){
					var start = new Date().format("yyyy-MM-dd hh:mm:ss");
					var e = new Date().getTime() + (86400000 * 7);
					var end = new Date(e).format("yyyy-MM-dd hh:mm:ss")
					DOM.val('#J_startDate_'+pid,start);
					DOM.val('#J_endDate_'+pid,end);
				})
			},
			
			deleteHandle : function(pid) {
				new H.widget.msgBox({
				    title: "删除活动",
				    content: '系统将为您取消此活动设置的促销信息',
				    type: "confirm",
				    buttons: [{ value: "确定删除" }, { value: "取消" }],
				    success: function (result) {
				        if (result == "确定删除") {
							var submitHandle = function(o) {
								 new H.widget.msgBox({
								    type:"sucess",
									dialogType : 'msg',
								    content:'活动已删除',
								    autoClose:true,
								    timeOut:3000
								});
							  	window.location.reload();
							};
							var error = function(o){
								new H.widget.msgBox({
								    title:"错误提示",
								    content:o.desc,
								    type:"error"
								});
							};
							var data = "pid="+pid+"&form_key="+FORM_KEY;
				     	    new H.widget.asyncRequest().setURI(deleteUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(error).setData(data).send();
				        }
				    }
				});
			},
			
			//搜索活动中宝贝
	        searchPromoItems : function() {
				if(!promotionControl.isLoad){
						promotionControl.isLoad = true;		
				}
				DOM.hide('#promoList');
				DOM.show('#itemList');
	            var submitHandle = function(o) {
	            	DOM.hide('#J_LeftLoading');
					DOM.show('#J_MainLeftContent');
					DOM.hide('#J_PromoDetail');
					DOM.show('#J_BackToPromoList');
	        	    totalRecords = o.payload.totalRecords;
					if(totalRecords > 0){
						DOM.get('#J_LEmpty').style.display = 'none';
						DOM.removeClass(DOM.query(".J_PromotionItemBtnHolder"),'ks-hidden');
					} else {
						DOM.get('#J_LEmpty').style.display = '';
						DOM.addClass(DOM.query(".J_PromotionItemBtnHolder"),'ks-hidden');
					}
					DOM.html('#J_PromoItems',o.payload.body);
					pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					promotionControl.paginator = new showPages('promotionControl.paginator').setRender(promotionControl.handlePagination).setPageCount(pageCount).printHtml('#J_PromotionItemPaging',2);
	    	    };
	    	    var errorHandle = function(o){
	    	    	DOM.show('#promoList');
	    	    	DOM.show('#J_PromoDetail');
	            	DOM.hide('#itemList');
	            	DOM.hide('#J_BackToPromoList');
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
	    	    };
	    	    if(DOM.val(DOM.get("#J_SearchTitle")) != '关键字、链接、商品编码'){
	    	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
	    	    }else{
	    	    	var title ='';
	    	    }
	    	    var status = DOM.val(DOM.get("#J_SearchStatus"));
		    	var data = "keytitle="+title+'&status='+status;
				DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
	    	    new H.widget.asyncRequest().setURI(getPromoItemsUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
			},
	    	handlePagination : function(turnTo) {
		    	pageId = turnTo;
	    		var submitHandle = function(o) {
	    			 totalRecords = o.payload.totalRecords;
	   				if(totalRecords > 0){
	   					DOM.get('#J_LEmpty').style.display = 'none';
	   					DOM.removeClass(DOM.get(".J_PromotionItemBtnHolder"),'ks-hidden');
	   				} else {
	   					DOM.get('#J_LEmpty').style.display = '';
	   					DOM.addClass(DOM.get(".J_PromotionItemBtnHolder"),'ks-hidden');
	   				}
					pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					DOM.html('#J_PromoItems',o.payload.body);
					promotionControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_PromotionItemPaging',2);
					DOM.hide('#J_LeftLoading');
					DOM.show('#J_MainLeftContent');
		    	};
		    	 if(DOM.val(DOM.get("#J_SearchTitle")) != '关键字、链接、商品编码'){
	    	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
	    	    }else{
	    	    	var title ='';
	    	    }
		   	    var status = DOM.val(DOM.get("#J_SearchStatus"));
		    	var data = "keytitle="+title+'&status='+status+"&page_id="+pageId;
		        DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
	    	    new H.widget.asyncRequest().setURI(getPromoItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			
			//将活动中宝贝移除
			removePromotionItemHandle : function(promo_itemid,pidi,type) {
				if(!showPermissions('editor_promotion',"编辑促销活动")){
		   			return ;
		   		 }
				 if (type == 'promoItems') {
				 	var typeId = DOM.val('#J_TypeIdItem_'+promo_itemid);
				 }
				 if(typeId == 10){
				 	var diff  = IsExpired();
					 if(diff > -5000 ){
							var sucessHandle = function(o) {
								promotionControl.deletePromotionItemHandle(promo_itemid,pidi,type);
					 		};
					 		var errorHandle = function(o){
					 			KISSY.Event.fire('.J_TopExpired','click');
					 		};
					 		var data = '';
					  	    new H.widget.asyncRequest().setURI(isExpiredUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
					 }else{
						promotionControl.deletePromotionItemHandle(promo_itemid,pidi,type);	
					 }
				 }else{
					promotionControl.deletePromotionItemHandle(promo_itemid,pidi,type);
				 }
			},
			
			deletePromotionItemHandle : function(promo_itemid,pidi,type){
				itemIds = [];
				if(type == 'promoItems'){
					DOM.hide('#J_RemovePromo_'+promo_itemid);
					DOM.show('#J_MinLoading_'+promo_itemid);
				}
				if(promo_itemid && pidi){
					itemIds.push(promo_itemid);
					pid = pidi;
				}
				var submitHandle = function(o) {
					if (promotionControl.paginator) {
						promotionControl.paginator.toPage(promotionControl.paginator.page);
					}
					else {
						promotionControl.searchPromoItems();
					}
        	    };
        	    var data = "pid="+pid+"&item_ids="+itemIds+"&form_key="+FORM_KEY;
        	    new H.widget.asyncRequest().setURI(removePromotionItemUrl).setMethod("POST").setHandle(submitHandle).setData(data).send();
			},
			
			//已过期活动数量
			setExpiredPromo : function(){
				var submitHandle = function(o) {
					window.location.href = ExpiredUrl;
				};
				var error = function(o){
					alert(o.desc)
				};
				var data = "";
	     	    new H.widget.asyncRequest().setURI(setExpiredPromoUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(error).setData(data).send();
			}
	}
}, {
    requires: ['utils/showPages/index','./mods/check','bui/calendar','bui/overlay','utils/beautifyForm/index']
});
