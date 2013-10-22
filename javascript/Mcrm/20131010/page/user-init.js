/*
combined files : 

utils/showPages/index
page/user-init

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
KISSY.add('page/user-init',function (S,showPages,Overlay,Select) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return userControl = {
			paginator : null,
			panel:null,
			init : function() {
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
					userControl.searchTbItems();
					Event.delegate(document,'mouseover','.manage',function(ev){
						DOM.removeClass('.manage','current');
						DOM.addClass(ev.currentTarget,'current');
					})
					Event.on('#J_SearchMembers','click',userControl.searchTbItems);
					Event.on('#J_BatchDeleteMembers','click',userControl.addSelectItemsDeleteMembers);
					Event.on('#J_AllMembers','click',userControl.membersCheckAll); //活动中宝贝全选 
					// 添加用户
				    Event.on('#J_AddGroup','click',userControl.addGroup);

			},
			addGroup : function(){
	    		var submitHandle = function(o) {
        	    	KISSY.later(function(){
        	    		if(userControl.paginator){
    						userControl.paginator.toPage(userControl.paginator.page);
    					}else{
    						userControl.searchTbItems();
    					}
            	    },1000,false)
					 new H.widget.msgBox({ 
					 			type: "sucess", 
					 			content: "添加成功",
								dialogType:"msg", 
								autoClose:true, 
								timeOut:3000
							});
	    		};
	    		var errorHandle = function(o){
	            		var cont = '<div class="ui-msg" style="margin-bottom: 10px;"><div class="success-msg"><div class="img-success"></div><div class="text-16">'+o.desc+'</div></div></div>'
	            		DOM.html('#messages',cont);
	    		};
	    		var nick = DOM.val('#J_Nick');
	    		if(nick == '请输入添加用户昵称'){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:'请输入添加用户昵称',
					    type:"error"
					});	
					return false;
	    		}
	    		var group_id = DOM.val('#J_groupId');
	    		var tb_group_id = DOM.val('#J_tbGroupId');
	    		//var type_Id = DOM.val('#J_typeId');
	    		var data = "nick="+nick+"&group_id="+group_id+"&tb_group_id="+tb_group_id;
	    		new H.widget.asyncRequest().setURI(addMembersUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();	
			},
		       //搜索淘宝宝贝
	        searchTbItems : function() {
                var submitHandle = function(o) {
	        	    totalRecords = o.payload.totalRecords;
					if(totalRecords > 0){
						DOM.get('#J_LEmpty').style.display = 'none';
						DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'');
					} else {
						DOM.get('#J_LEmpty').style.display = '';
						DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'none');
					}
					userControl.renderItems(o.payload.body);
					pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					userControl.paginator = new showPages('userControl.paginator').setRender(userControl.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
					userControl.paginator = new showPages('userControl.paginator').setRender(userControl.handlePagination).setPageCount(pageCount).printHtml('#J_TopPaging',3);
  					DOM.hide('#J_LeftLoading');
 					DOM.show('#J_MainLeftContent');
 					DOM.hide('.ui-msg');
        	    };
        	    var errorHandle = function(o){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});	
        	    	
        	    };
        	    if(DOM.val(DOM.get("#J_SearchBuyerNick")) != '输入买家昵称'){
        	    	var buyerNick = encodeURIComponent(DOM.val(DOM.get("#J_SearchBuyerNick"))); //买家昵称
        	    }else{
        	    	var buyerNick ='';
        	    }
        	    var groupId = DOM.val('#J_groupId');
        	    var tbGroupId = DOM.val('#J_tbGroupId');
        	    var type = DOM.val('#J_typeId');
//        	    var groupId = <?php echo $this->getGroupId()?>;
//        	    var tbGroupId = <?php echo $this->getTbGroupId()?>;
//        	    var type = <?php echo $this->getType()?>;
    	    	var itemPage = 40;//每页多少条
				DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
				var data ="buyer_nick="+buyerNick+"&group_id="+groupId+"&tb_group_id="+tbGroupId+"&pageSize="+itemPage+"&type="+type;
        	    new H.widget.asyncRequest().setURI(getItemsFromTbUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).setDataType('json').send();
			},
			// 渲染 TbItems
			renderItems: function(c) {
        	    DOM.html(DOM.get("#J_TbItemList"), c,true);
			},
			handlePagination : function(turnTo) {
		    	pageId = turnTo;
	    		var submitHandle = function(o) {
						DOM.attr('#J_AllMembers','checked',false);
	    			 totalRecords = o.payload.totalRecords;
					 if(totalRecords > 0){
						DOM.get('#J_LEmpty').style.display = 'none';
						DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'');
					} else {
						DOM.get('#J_LEmpty').style.display = '';
						DOM.css(DOM.query(".J_ItemSelectBtnHolder"),'display' ,'none');
					}
					 pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					 userControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
					 userControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_TopPaging',3);
					 userControl.renderItems(o.payload.body);
  					 DOM.hide('#J_LeftLoading');
 					 DOM.show('#J_MainLeftContent');
		    	};
	    	   var errorHandle = function(o){
	    		   	DOM.hide('#J_LeftLoading');
					 DOM.show('#J_MainLeftContent');
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});	
        	    	
        	    };
		    	if(DOM.val(DOM.get("#J_SearchBuyerNick")) != '输入买家昵称'){
        	    	var buyerNick = encodeURIComponent(DOM.val(DOM.get("#J_SearchBuyerNick"))); //买家昵称
        	    }else{
        	    	var buyerNick ='';
        	    }
        	    var groupId = DOM.val('#J_groupId');
        	    var tbGroupId = DOM.val('#J_tbGroupId');
        	    var type = DOM.val('#J_typeId');		    	
    	    	var itemPage = 40;
				DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
    	    	var data = "buyer_nick="+buyerNick+"&group_id="+groupId+"&tb_group_id="+tbGroupId+"&page_id="+pageId+"&pageSize="+itemPage+"&type="+type;
        	    new H.widget.asyncRequest().setURI(getItemsFromTbUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			
			addSelectItemsDeleteMembers : function() {
				checkBoxs = DOM.query("#J_TbItemList .J_CheckBox");
				var len = checkBoxs.length;
				var m=0;
				var json = [];
				var array = [];
				for(i=0; i<len; i++){
					if(checkBoxs[i].checked){
						id = checkBoxs[i].value;						
						array.push(id);						
						m++;
					}
				}
				if(m == 0){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:'没有选择客户！',
					    type:"error",
						autoClose : true,
						timeOut : 1000
					});					
					DOM.show(DOM.query('.J_addItem'));
					DOM.hide(DOM.query('.J_adding'));
					return;
				}				 
				var itemsJson = array.join(',');
        	    var groupId = DOM.val('#J_groupId');
        	    var tbGroupId = DOM.val('#J_tbGroupId');
				var data = "items="+itemsJson+"&form_key="+FORM_KEY+"&group_id="+groupId+"&tb_group_id="+tbGroupId;
                var submitHandle = function(o) {
        	    	KISSY.later(function(){
        	    		if(userControl.paginator){
    						userControl.paginator.toPage(userControl.paginator.page);
    					}else{
    						userControl.searchTbItems();
    					}
            	    },1000,false)
					 new H.widget.msgBox({ 
					 			type: "sucess", 
					 			content: "删除成功",
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
					return;
        	    };
				new H.widget.asyncRequest().setURI(batchDeleteMembersUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			
			deleteMember : function(id) {	
				var json = []		 
				json.push(id);	
				var itemsJson = json.join(',');
        	    var groupId = DOM.val('#J_groupId');
        	    var tbGroupId = DOM.val('#J_tbGroupId');
				var data = "items="+itemsJson+"&form_key="+FORM_KEY+"&group_id="+groupId+"&tb_group_id="+tbGroupId;
                var submitHandle = function(o) {
        	    	KISSY.later(function(){
        	    		if(userControl.paginator){
    						userControl.paginator.toPage(userControl.paginator.page);
    					}else{
    						userControl.searchTbItems();
    					}
            	    },1000,false)
					 new H.widget.msgBox({ 
					 			type: "sucess", 
					 			content: "删除成功",
								dialogType:"msg", 
								autoClose:true, 
								timeOut:2000
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
				new H.widget.asyncRequest().setURI(batchDeleteMembersUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			//出售中宝贝全选
			membersCheckAll : function(e) {
				checkBoxs = DOM.query("#J_TbItemList .J_CheckBox");
				var len = checkBoxs.length;
				for(i=0; i<len; i++){
					var iid = checkBoxs[i].value;
					if(checkBoxs[i].disabled) continue;
					if(this.checked){
						checkBoxs[i].checked = true;
					} else {
						checkBoxs[i].checked = false;
					}
				}
			}

	}
}, {
    requires: ['utils/showPages/index','bui/overlay','bui/select']
});
