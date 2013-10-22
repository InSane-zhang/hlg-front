/*
combined files : 

utils/showPages/index
page/smsList-init

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
KISSY.add('page/smsList-init',function (S,showPages,O) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
 	return smsControl = {
 	    	paginator : null,
 	    	panel: null,
 	    	init : function() {
 	    	    Event.on('#J_SearchBtn','click',smsControl.searchTbItems); 
 	    	    smsControl.searchTbItems(1); 
 	    	    Event.delegate(document,'click','.J_Delete',function(ev){
 	    	    	var name = DOM.attr(ev.currentTarget,'name');
 	    	    	smsControl.deleteMember(name)
 	    	    });
 	    	    Event.delegate(document,'click','.J_View',function(ev){
 	    	    	var name = DOM.attr(ev.currentTarget,'name');
 	    	    	smsControl.viewMember(name);
 	    	    });
 	    	    Event.delegate(document,'click','.J_retry',function(ev){
 	    	    	var name = DOM.attr(ev.currentTarget,'name');
 	    	    	
 	    	    	smsControl.retry(name);
 	    	    });
 	    	    Event.on(DOM.query('#J_Sort a'),'click',function(ev){
 	    			if(!DOM.hasClass(ev.currentTarget,'current')){
 	    				DOM.removeClass(DOM.query('#J_Sort a'),'current')
 	    				DOM.addClass(ev.currentTarget,'current');	
 	    			}	
 	    			var name = DOM.attr(ev.currentTarget,'name');
 	    			if(name == '1'){
 	    				DOM.hide('.J_user');
 	    			}else{
 	    				DOM.show('.J_user');
 	    				DOM.hide('.J_Modify');
 	    			}
 	    			smsControl.searchTbItems(name); 
 	    		})
 	        },
 	        retry : function(name){
                var submitHandle = function(o) {

        	    };
        	    var errorHandle = function(o){

        	    };  
        	    var data ="plan_id="+name;
        	    new H.widget.asyncRequest().setURI(retryPlanUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
 	        }, 	        
 	        viewMember : function(name){
 	        	smsControl.panel = new O.Dialog({
				      width: 460,
				      headerContent: '查看用户',
				      bodyContent: '', 
				      mask: false,
				      align: {
				          points: ['cc', 'cc']
				      },
				      closable :true,
				      draggable: true,
				      aria:true
				});	 
 	        	var el = DOM.val('.content_'+name)
 	        	var cont = '<ul class="hlg-dialog-content" style="width:440px;">'+el+'</ul>'
 	        	smsControl.panel.set('bodyContent',cont);
 	        	smsControl.panel.show();	
 	        	Event.on('.hlg-cancle','click',function(){
 	        		smsControl.panel.hide();	
 	        	}); 
 	        },
 	        deleteMember : function(id){
				
 	        	smsControl.panel = new O.Dialog({
				      width: 350,
				      headerContent: '删除',
				      bodyContent: '', 
				      mask: false,
				      align: {
				          points: ['cc', 'cc']
				      },
				      closable :true,
				      draggable: true,
				      aria:true
				});	  
 	        	var cont = '<div class="hlg-dialog-content">删除后无法恢复，确定删除吗？</div><div class="hlg-dialog-btn"><input class="hlg-submit" type="button" value="确定删除"><input class="hlg-cancle" type="button" value="取消"></div>'
 	        	smsControl.panel.set('bodyContent',cont);
 	        	smsControl.panel.show();	
 	        	Event.on('.hlg-cancle','click',function(){
 	        		smsControl.panel.hide();	
 	        	}); 
 	        	Event.on('.hlg-submit','click',function(){
	 	        	var submitHandle = function(o) {
	 	        		smsControl.panel.hide();
	 	        		window.location.reload();
	 	        	}
	         	    var errorHandle = function(o){

	         	    };	
	         	    var data ="plan_id="+id; 
	         	    new H.widget.asyncRequest().setURI(deletePlanUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
 	        	}); 
	        }, 	        
 	        searchTbItems : function(name) {
                 var submitHandle = function(o) {
                 	//DOM.removeClass(".J_ItemSelectBtnHolder",'ks-hidden');
 	        	    totalRecords = o.payload.totalRecords;
 					if(totalRecords > 0){
 						DOM.hide('#J_LEmpty');
 						DOM.show('.J_ItemSelectBtnHolder');
 					} else {
 						DOM.show('#J_LEmpty');
 						DOM.hide('.J_ItemSelectBtnHolder');
 					}
 					smsControl.renderItems(o.payload.body);  
 					pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
 					smsControl.paginator = new showPages('smsControl.paginator').setRender(smsControl.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
  					DOM.hide('#J_LeftLoading');
 					DOM.show('#J_MainLeftContent');
 	    			if(name == '1'){
 	    				DOM.show('.J_waitSend');
 	    				DOM.hide('.J_hasSend');
 	    			}else{
 	    				DOM.show('.J_hasSend');
 	    				DOM.hide('.J_waitSend');
 	    			}
         	    };
         	    var errorHandle = function(o){
 					DOM.hide('#J_Loading');
 					DOM.show('#J_MainLeftContent');
         	    };
         	    var pageSize = 10;
 				DOM.show('#J_LeftLoading');
 				DOM.hide('#J_MainLeftContent');
 				var data ="status="+name;
         	    new H.widget.asyncRequest().setURI(getItemsFromTbUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
 			},
 			
 			// 渲染 TbItems
 			renderItems: function(c) {
         	    DOM.html(DOM.get("#J_PromotionItemList"), c,true);
 			},
 	    	handlePagination : function(turnTo) {
 		    	pageId = turnTo;
 	    		var submitHandle = function(o) {
 	    			 totalRecords = o.payload.totalRecords;
 					 if(totalRecords > 0){
 						DOM.get('#J_LEmpty').style.display = 'none';
 						DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'');
 					} else {
 						DOM.get('#J_LEmpty').style.display = '';
 						DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'none');
 					}
 					pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
 	    			smsControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
 	        	    smsControl.renderItems(o.payload.body);
 					DOM.hide('#J_LeftLoading');
 					DOM.show('#J_MainLeftContent');
 		    	};
     	    	var data ="page_id="+pageId+"&pageSize="+pageSize;
 				DOM.show('#J_LeftLoading');
 				DOM.hide('#J_MainLeftContent');
         	    new H.widget.asyncRequest().setURI(getItemsFromTbUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
 			}
 	}
}, {
    requires: ['utils/showPages/index','overlay']
});
