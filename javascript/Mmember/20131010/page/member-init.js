/*
combined files : 

utils/showPages/index
page/member-init

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
KISSY.add('page/member-init',function (S,showPages,Overlay,Tooltip,Select) {
	
	var S= KISSY,DOM = S.DOM, Event = S.Event;
	return MemberList = {
	    	paginator : null,
	    	msg :null,
	    	isFisrst : true,
	    	init : function() {
				Event.on("#J_LeftSearch", "click", function(){
					MemberList.searchTbItems();
				});
				Event.on(".J_Import", "click", function(){
					window.location.href = DataImportUrl;
				});
				Event.on(doc, 'keydown', function(evt) {
					if ( evt.which === 13) {
						if(MemberList.paginator){
							MemberList.paginator.toPage(MemberList.paginator.page);
						}else{
							MemberList.searchTbItems();
						}
					}
				})
				
				var items = [
				  {text:'会员等级',value:'5'},
				  {text:'潜在会员',value:'0'},
				  {text:'普通客户',value:'1'},
				  {text:'高级会员',value:'2'},
				  {text:'VIP会员',value:'3'},
				  {text:'至尊VIP会员',value:'4'}						  
				],
				select = new Select.Select({  
				  render:'#J_Member',   
				  valueField:'#J_Grade',
				  items:items
				});
				select.render();
				select.setSelectedValue('5');
				
				MemberList.searchTbItems();
				
				Event.delegate(document,'click','.J_Detail',function(ev){
					var member_id = DOM.attr(ev.currentTarget,'data');
	 	        	var submitHandle = function(o) {
		     	        var dialog = new Overlay.Dialog({
		     	            title:'用户信息',
		     	            width:700,
		     	            height:500,
		     	            mask:false,
		     	            buttons:[
		     	                     {
		     	                     text:'关闭',
		     	                     elCls : 'bui-button',
		     	                     handler : function(){
		     	                       this.hide();
		     	                     }
		     	                   }
		     	                 ],
		     	            
		     	            bodyContent:o.payload.body
		     	          });
		     	          dialog.show();
	 	        	}
	         	    var errorHandle = function(o){
						new H.widget.msgBox({
						    title:"错误提示",
						    content:o.desc,
						    type:"error",
							autoClose : true,
							timeOut : 3000
						});
	         	    };	
	         	    data = 'member_id='+member_id;
	         	    new H.widget.asyncRequest().setURI(detailDataUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
				})
				
				 var promptHelp = new Tooltip.Tip({
					 trigger : '#J_MemberDataHelp',
					 alignType : 'top', 
					 offset : 10,
					 elCls : 'ui-tip',
					 title : '<div class="ui-tip-text">开启后新交易用户联系信息将自动<br/>导入该列表，关闭交易期间用户信<br/>息可手动导入！</div>'   
				 })
				 promptHelp.render();
				 
				 var promptHelp = new Tooltip.Tip({
					 trigger : '#J_MemberDataHelp_1',
					 alignType : 'top', 
					 offset : 10,
					 elCls : 'ui-tip',
					 title : '<div class="ui-tip-text">关闭后新交易用户联系信息将不会<br/>自动导入该列表，但你可以右侧手<br/>动导入！！</div>'   
				 })
				 promptHelp.render();
				
	        },
	        searchTbItems : function() {
		        
	            var submitHandle = function(o) {
					DOM.hide('#J_LeftLoading');
					DOM.show('#J_MainLeftContent');
	        	    totalRecords = o.payload.totalRecords;
					if(totalRecords > 0){
						DOM.css(DOM.get('#J_LEmpty') ,'display','none');
						DOM.css(DOM.query(".J_ItemSelectBtnHolder") ,'display' , '');
					} else {
						DOM.css(DOM.get('#J_LEmpty'), 'display' , '');
						DOM.css(DOM.query(".J_ItemSelectBtnHolder") , 'display' , 'none');
					}
					MemberList.renderItems(o.payload.body);
					var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					MemberList.paginator = new showPages('MemberList.paginator').setRender(MemberList.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
	    	    };
	    	    var data = MemberList.getData();
	 			DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
	    	    new H.widget.asyncRequest().setURI(loadTbItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			renderItems: function(c) {
	    	    DOM.html(DOM.get("#J_TbItemList"), c);
	        	
			},
			
	    	handlePagination : function(turnTo) {
		    	var pageId = turnTo;
	    		var submitHandle = function(o) {
	    			 totalRecords = o.payload.totalRecords;
	 				if(totalRecords > 0){
	 					DOM.css(DOM.get('#J_LEmpty') ,'display','none');
	 					DOM.css(DOM.query(".J_ItemSelectBtnHolder") ,'display' , '');
	 				} else {
	 					DOM.css(DOM.get('#J_LEmpty'), 'display' , '');
	 					DOM.css(DOM.query(".J_ItemSelectBtnHolder") , 'display' , 'none');
	 				}
	 				var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
	 				MemberList.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
	 				MemberList.renderItems(o.payload.body);
	 				DOM.hide('#J_LeftLoading');
					DOM.show('#J_MainLeftContent');
		    	};
		    	var data = MemberList.getData();
				data +="&page_id="+pageId;
				DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
	    	    new H.widget.asyncRequest().setURI(loadTbItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			getData : function(){
    	    	if(DOM.val(DOM.get("#J_SearchNick")) != '输入旺旺名称'){
   	    	    	var nick = encodeURIComponent(DOM.val(DOM.get("#J_SearchNick"))); //标题
   	    	    }else{
   	    	    	var nick ='';
   	    	    }
   	    	    var data = "nick="+nick;
   	    	    if(DOM.val(DOM.get("#J_SearchName")) != '输入姓名'){
   	    	    	var name = encodeURIComponent(DOM.val(DOM.get("#J_SearchName"))); //标题
   	    	    }else{
   	    	    	var name ='';
   	    	    }
   	    	    data += "&name="+name;
		        return data;  
	
			},
			open:function(){
				 var submitHandle = function(o) {
				 		//var str = '<span style="color: #FB8534;float:left;margin-right:10px">自动将在淘宝新交易的用户加入列表</span>'+ 
	              		 // 		  '<input class="btm-caozuo-orange" type="button" name="" value="关闭" onclick="MemberList.close()">';
						//DOM.html('#J_SaveConfigButton',str);
							new H.widget.msgBox({ 
					 			type: "sucess", 
					 			content: "成功开启！",
								dialogType:"msg", 
								autoClose:true, 
								timeOut:3000
							});
							window.location.reload();
					
		    	    };
		    	    var data = 'no_auto=0';
		    	    new H.widget.asyncRequest().setURI(saveConfigUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			close:function(){
				 var submitHandle = function(o) {
			 		//var str = '<span style="color: #FB8534;float:left;margin-right:10px">自动将在淘宝新交易的用户加入列表</span>'+ 
              		//  		  '<input class="btm-caozuo-orange" type="button" name="" value="启用" onclick="MemberList.open()">';
					//DOM.html('#J_SaveConfigButton',str);
						new H.widget.msgBox({ 
				 			type: "sucess", 
				 			content: "成功关闭！",
							dialogType:"msg", 
							autoClose:true, 
							timeOut:3000
						});
			 		window.location.reload();
	    	    };
	    	    var data = 'no_auto=1';
	    	    new H.widget.asyncRequest().setURI(saveConfigUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();

				
			}
			
		
	

}
   
}, {
    requires: ['utils/showPages/index','bui/overlay','bui/tooltip','bui/select']
});
