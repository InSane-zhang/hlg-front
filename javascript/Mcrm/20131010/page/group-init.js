/*
combined files : 

utils/showPages/index
page/group-init

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
KISSY.add('page/group-init',function (S,showPages,Overlay) {
	
	var S= KISSY,DOM = S.DOM, Event = S.Event;
	return  groupManage = {
			paginator : null,
			panel: null,
			init : function() {
//				Event.on('#J_SearchGroup','click',groupManage.searchItems);
				Event.on('.group','click',function(ev){
					DOM.removeClass('.group','current');
					DOM.addClass(ev.currentTarget,'current');
					var type_id = DOM.attr(ev.currentTarget,'data');
					if(type_id =='2'){
						DOM.hide('.J_AddGroupe');
						DOM.show('.J_Add');
					}else{
						DOM.show('.J_AddGroupe');
						DOM.hide('.J_Add');
					}
					groupManage.searchItems();
				})
				//手动添加
				Event.on('.J_Add','click',function(ev){
		 	          var dialog = new Overlay.Dialog({
			 	             title:'新建分组',
			 	             width:350,
			 	             height:150,
			 	             mask:false,
		     	             buttons:[
			     	                   {
			     	                     text:'确定',
			     	                     elCls : 'bui-button bui-button-primary',
			     	                     handler : function(){
			     	                       this.hide();
			     	                     }
			     	                   },{
			     	                     text:'取消',
			     	                     elCls : 'bui-button',
			     	                     handler : function(){
			     	                       this.hide();
			     	                     }
			     	                   }
			     	                 ],
			 	             bodyContent:'<div style="width: 240px;margin: auto;">分组名称：<input id="J_GroupName" type="text" class="input-text-2" name="group_name" value=""></div>'
			 	           });
			 	           dialog.show();
			 	           Event.on('.bui-button-primary','click',function(){
								var submitHandle = function(o) {
			 	            		var cont = '<div class="ui-msg" style="margin-bottom: 10px;"><div class="success-msg"><div class="img-success"></div><div class="text-16">'+o.desc+'</div></div></div>'
			 	            		DOM.html('#messages',cont);
			 	            		groupManage.searchItems();
				        	    };
				        	    var errorHandle = function(o){
									new H.widget.msgBox({
									    title:"错误提示",
									    content:o.desc,
									    type:"error"
									});
				        	    };
				        	    var group_name = DOM.val('#J_GroupName');
				        	    var data = "group_name="+group_name+"&group_type=2";
								new H.widget.asyncRequest().setURI(editorSaveUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			 	           })
				})
				Event.delegate(document,'mouseover mouseleave','.J_Market',function(ev){
					//var group_id = DOM.attr(ev.currentTarget,'pid');
					//window.location.href=planAddUrl+'&group_id='+group_id+'&is_group=1'; 
					if(ev.type == 'mouseover'){
						DOM.removeClass('.J_Market','active');
						DOM.addClass(ev.currentTarget,'active');
					}else{
						DOM.removeClass('.J_Market','active');
					}
				})				
				Event.on('.J_AddGroupe','click',function(ev){
					var type_id = DOM.attr('#J_Tab .current','data');
					window.location.href=createRuleUrl+'&group_type='+type_id;
				})				
				groupManage.searchItems();
				Event.delegate(document,'click','.J_LoadRule', function(ev) {
					var group_type = DOM.attr(ev.currentTarget,'tid');
					var tb_group_id = DOM.attr(ev.currentTarget,'data');
					var group_id = DOM.attr(ev.currentTarget,'pid');
					var submitHandle = function(o) {
			 	          var dialog = new Overlay.Dialog({
			 	             title:'条件',
			 	             width:350,
			 	             height:270,
			 	             mask:false,
		     	             buttons:[
			     	                   {
			     	                     text:'确定',
			     	                     elCls : 'bui-button bui-button-primary',
			     	                     handler : function(){
			     	                       this.hide();
			     	                     }
			     	                   },{
			     	                     text:'取消',
			     	                     elCls : 'bui-button',
			     	                     handler : function(){
			     	                       this.hide();
			     	                     }
			     	                   }
			     	                 ],
			 	             bodyContent:o.payload.body
			 	           });
			 	           dialog.show();
	        	    };

	        	    var errorHandle = function(o){
			 	          var dialog = new Overlay.Dialog({
				 	             title:'错误提示',
				 	             width:350,
				 	             height:270,
				 	             mask:false,
			     	             buttons:[
				     	                   {
				     	                     text:'确定',
				     	                     elCls : 'bui-button bui-button-primary',
				     	                     handler : function(){
				     	                       this.hide();
				     	                     }
				     	                   },{
				     	                     text:'取消',
				     	                     elCls : 'bui-button',
				     	                     handler : function(){
				     	                       this.hide();
				     	                     }
				     	                   }
				     	                 ],
				 	             bodyContent:o.desc
				 	           });
				 	           dialog.show();		        	    
						return;
	        	    };
	        	    var data = "group_id="+group_id+"&form_key="+FORM_KEY+"&tb_group_id="+tb_group_id+"&group_type="+group_type;
					new H.widget.asyncRequest().setURI(loadRuleUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
				});

				Event.delegate(document,'click','.J_DelGroup',function(ev){
					var group_type = DOM.attr(ev.currentTarget,'tid');
					var tb_group_id = DOM.attr(ev.currentTarget,'data');
					var group_id = DOM.attr(ev.currentTarget,'pid');
					new H.widget.msgBox({
					    title: "删除分组",
					    content: '确定要删除？',
					    type: "confirm",
					    buttons: [{ value: "确定删除" }, { value: "取消" }],
					    success: function (result) {
					        if (result == "确定删除") {
									groupManage.deleteGroup(group_id,tb_group_id,group_type)
					        }
					    }
					});
				});

//				Event.on('#J_AllUpdate','click',function(ev){
//
//					str = '<div class="point"><span>由于淘宝接口限制，如会员数较多，需较长时间，请耐心等待，是否继续？</span><br/><div style="width:160px;_width:170px;" class="btm-content btm-margin-30auto"><input name="" type="button" value="更新" class="btm-68-orange fl" id="update"/><input name="" type="button" value="不更新" class="btm-68-gray fl" id="NoUpdate" /></div></div>'; 
//					groupManage.msg.setHeader('更新所有分组').setMsg(str).showDialog();
//					Event.remove('#update');
//					Event.remove('#NoUpdate');
//					Event.on('#update','click',function(ev){
//						groupManage.batchUpdateGroup()
//					})
//					Event.on('#NoUpdate','click',function(ev){
//						ev.preventDefault();
////						groupManage.msg.hide();
//					})
//				});
				Event.delegate(document,'click','.J_Update',function(ev){
					var group_id = DOM.attr(ev.currentTarget,'pid');
					new H.widget.msgBox({
					    title: "更新分组",
					    content: '更新后分组中只会含有当前满足筛选条件的用户，是否继续？',
					    type: "confirm",
					    buttons: [{ value: "更新"}, { value: "取消"}],
					    success: function (result) {
					        if (result == "更新") {
					        	groupManage.updateGroup(group_id)
					        }
					    }
					});
				});
				
			},
		    //搜索会员
	        searchItems : function() {
                var submitHandle = function(o) {
	        	    totalRecords = o.payload.totalRecords;
	        	    if(totalRecords > 0){
						DOM.get('#J_LEmpty').style.display = 'none';
						DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'');
					} else {
						DOM.get('#J_LEmpty').style.display = '';
						DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'none');
					}
					groupManage.renderItems(o.payload.body);
					pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					groupManage.paginator = new showPages('groupManage.paginator').setRender(groupManage.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
					groupManage.paginator = new showPages('groupManage.paginator').setRender(groupManage.handlePagination).setPageCount(pageCount).printHtml('#J_TopPaging',3);
  					DOM.hide('#J_LeftLoading');
 					DOM.show('#J_MainLeftContent');
        	    };
        	    var errorHandle = function(o){
 					DOM.hide('#J_Loading');
 					DOM.show('#J_MainLeftContent');
        	    	new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
        	    };

    	    	var itemPage = 10;//每页多少条
    	    	var type_id = DOM.attr('#J_Tab .current','data');
				var data = "pageSize="+itemPage+'&type_id='+type_id;
 				DOM.show('#J_LeftLoading');
 				DOM.hide('#J_MainLeftContent');
        	    new H.widget.asyncRequest().setURI(getGroupUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
			},
			// 渲染 TbItems
			renderItems: function(c) {
        	    DOM.html(DOM.get("#J_TbItemList"), c,true);
			},
			handlePagination : function(turnTo) {
		    	pageId = turnTo;
	    		var submitHandle = function(o) {
	    			 totalRecords = o.payload.totalRecords;
					 if(totalRecords > 0){
						DOM.get('#J_LEmpty').style.display = 'none';
					} else {
						DOM.get('#J_LEmpty').style.display = '';
					}
					 pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					 groupManage.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
					 groupManage.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_TopPaging',3);
					 groupManage.renderItems(o.payload.body);
 					 DOM.hide('#J_LeftLoading');
 					 DOM.show('#J_MainLeftContent');
		    	};

    	    	var itemPage = 10;
    	    	var type_id = DOM.attr('#J_Tab .current','data');
    	    	var data = "page_id="+pageId+"&pageSize="+itemPage+'&type_id='+type_id;
 				DOM.show('#J_LeftLoading');
 				DOM.hide('#J_MainLeftContent');
        	    new H.widget.asyncRequest().setURI(getGroupUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			
			deleteGroup : function(groupId,tbGroupId,type) {	

				var data = "group_id="+groupId+"&form_key="+FORM_KEY+"&tb_group_id="+tbGroupId+"&type="+type;
                var submitHandle = function(o) {
        	    	KISSY.later(function(){
        	    		if(groupManage.paginator){
    						groupManage.paginator.toPage(groupManage.paginator.page);
    					}else{
    						groupManage.searchItems();
    					}
            	    },2000,false)
    				new H.widget.msgBox({
					    title:"",
						dialogType : 'loading',
					    content:'删除成功',
					    autoClose:true,
					    timeOut:1000
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
				new H.widget.asyncRequest().setURI(deleteGroupUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},

			updateGroup : function(groupId) {	
				var data = "group_id="+groupId+"&form_key="+FORM_KEY;
                var submitHandle = function(o) {
        	    	DOM.html('#J_tip_'+groupId,'(正在更新...)')
        	    };
        	    var errorHandle = function(o){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
					return;
        	    };
				new H.widget.asyncRequest().setURI(updateGroupUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			batchUpdateGroup : function() {	

                var submitHandle = function(o) {
//        	    	groupManage.msg.hide();
//        	    	groupManage.msg.setMsg('更新成功！').show();
        	    	KISSY.later(function(){
//        	    		groupManage.msg.hide();
        	    		if(groupManage.paginator){
    						groupManage.paginator.toPage(groupManage.paginator.page);
    					}else{
    						groupManage.searchItems();
    					}
            	    },2000,false)
        	    	
        	    	
        	    };
        	    var errorHandle = function(o){
//        	    	groupManage.msg.hide();
        	    	groupManage.msg.setMsg('<div class="point relative"><div class="point-w-1">'+o.desc+'</div></div>').showDialog();
					return;
        	    };
				new H.widget.asyncRequest().setURI(batchUpdateGroupUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).send();
			}
	}
   
}, {
    requires: ['utils/showPages/index','bui/overlay']
});
