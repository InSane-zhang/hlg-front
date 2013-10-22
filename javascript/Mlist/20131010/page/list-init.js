/*
combined files : 

utils/showPages/index
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
KISSY.add('page/list-init',function (S,showPages,Select) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return listControl = {
			init : function() {
				var items = [
				  {text:'投放位置',value:'0'},
		   	      {text:'位置1',value:'1'},
		   	      {text:'位置2',value:'2'},
		   	      {text:'位置3',value:'3'},
		   	      {text:'位置4',value:'4'},
		   	      {text:'位置5',value:'5'},
		   	      {text:'位置6',value:'6'}
		   	    ],
		   	    select = new Select.Select({  
		   		    render:'#J_Pos',
		   	      	valueField:'#hide',
		   	      	items:items
		   		});
		   		select.render();
		   		if(pos){
		   			select.setSelectedValue(pos);						
		   		}else{
		   			select.setSelectedValue('0');
		   		}
		   		var items1 = [
   		   	      {text:'素材类型',value:'00'},
   		   	      {text:'海报',value:'2'},
   		   	      {text:'关联列表',value:'3'},
   		   	      {text:'搭配套餐',value:'7'},
   		   	      {text:'团购模版',value:'6'},
   		   	      {text:'客服模板',value:'8'},
   		   	      {text:'分类模板',value:'9'},
   		   	      {text:'自定义',value:'1'}
   		   	    ],
   		   	    select1 = new Select.Select({  
   		   		    render:'#J_Mtype',
   		   	      	valueField:'#hide1',
   		   	      	items:items1
   		   		});
   		   		select1.render();
	   		   	if(mt){
		   			select1.setSelectedValue(mt);						
		   		}else{
		   			select1.setSelectedValue('00');
			   	}
		   		
				var Temple = DOM.query('.J_Height');
				for(i=0;i<10;i++){
					Height = DOM.height(Temple[i]);
					if(Height>300){
						aa = 'temple_'+[i];
						Parent = DOM.parent('.'+aa);
						DOM.replaceClass(Parent,'normal','overflow');
					}
				}
				Event.on('.float-icon','click',function(ev){
					var Parent = DOM.parent(ev.currentTarget,'.J_Height');
					if(DOM.hasClass(Parent,'overflow')){
						DOM.replaceClass(Parent,'overflow','normal');
					}else{
						DOM.replaceClass(Parent,'normal','overflow');
					}
				})
				
				var oTriggers = DOM.query('.J_Delete');
		    	Event.on(oTriggers, "click",function(ev){
		    		var id = DOM.attr(ev.currentTarget,'data');
		    		listControl.deleteHandle(id)
		    	})
				Event.on('#J_Release','click',function(e){
					 e.preventDefault();
					 if(!showPermissions('editor_material','促销素材')){
					 	return ;
					 }else{
						var url = DOM.attr(e.currentTarget,"data-url");
						if(isVersionPer('material',false)){
//							new H.widget.msgBox({
//								    title:"温馨提示",
//								    content:'只提供制作体验，尊享版才能享受素材投放功能',
//								    type:"info",
//									buttons: [{ value: "继续体验" }, { value: "关闭" }],
//									success: function (result) {
//									        if (result == "继续体验") {
//												window.location.href = url;
//									        }
//				    				}
//								});
							isVersionPer('material')
							return 
						}else{
							window.location.href = url;
						}
					}
				})
			},
			
			deleteHandle :function(id){
				new H.widget.msgBox({
				    title: "删除列表",
				    content: "系统将为您取消此活动设置的列表信息",
				    type: "confirm",
				    buttons: [{ value: "删除" }, { value: "取消" }],
				    success: function (result) {
				        if (result == "删除") {
							var submitHandle = function(o) {
								window.location.href = currentUrl;
							};
							var errorHandle = function(o){
								new H.widget.msgBox({
								    title:"错误提示",
								    content:o.desc,
								    type:"error"
								});
							}
							var data = "id="+id+"&form_key="+FORM_KEY;
						  	new H.widget.asyncRequest().setURI(deleteUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			
				        }
				    }
				});
			
						
			},
			
			search : function(){
				var list_id = DOM.val('#J_SearchListId');
				var pos = DOM.val('#hide');
				var mt = DOM.val('#hide1');	
				if(DOM.val(DOM.get("#J_SearchName")) != '输入素材关键字'){
					var searchName = encodeURIComponent(DOM.val(DOM.get("#J_SearchName"))); //标题
		    	}else{
		    	    var searchName ='';
		    	}
				var url = currentUrl+"&pos="+pos+"&mt="+mt+"&searchName="+searchName+"&list_id="+list_id;
			  	window.location.href=url;
			}
		
	}
}, {
    requires: ['utils/showPages/index','bui/select']
});
