/*
combined files : 

utils/showPages/index
page/delivery-init

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
KISSY.add('page/delivery-init',function (S,showPages,O,LinkSelect) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	return deliveryControl = {
	    	paginator : null,
			handlePagination :null,
	    	isFisrst : true,
	    	panel :null,
	    	panel2 :null,
	    	init : function() {
				deliveryControl.searchTbItems();
				var a = new LinkSelect(["#s1","#s2","#s3"],tdist, {
	            	defval: {
						text: "全部地区", val: "0"
				 	},
					rootid: 1 //根节点的ID，默认为0
				});
				Event.on('#J_Search','click',function(){
					deliveryControl.searchTbItems();
				})
				Event.on('#J_BatchSet','click',function(){
  					checked = DOM.query("#J_TbItemList .checked");
					var length = checked.length;
					if(length == 0){
						new H.widget.msgBox({
						    title:"提示",
						    content:'请至少选择一条订单',
						    type:"error"
						});
					}else{
						deliveryControl.batchSet();
					}
				})
				deliveryControl.Calendar('J_startDate');
				deliveryControl.Calendar('J_endDate');
				Event.delegate(document,'click','.edit',function(ev){
					var logisticCompany = DOM.attr(ev.currentTarget,'value'); 
					var expressId = DOM.attr(ev.currentTarget,'title');
					var type = DOM.attr(ev.currentTarget,'type');
					deliveryControl.edit(logisticCompany,expressId,type);
				})			
				Event.on('#J_Manage','click',function(){
					deliveryControl.manage();
				})	
				Event.on('#J_Delivery','click',function(){
  					checked = DOM.query("#J_TbItemList .checked");
					var length = checked.length;
					if(length == 0){
						new H.widget.msgBox({
						    title:"提示",
						    content:'请至少选择一条订单',
						    type:"error"
						});
					}else{
						deliveryControl.deliver();
					}					
				})				
				Event.on(DOM.query('.printFile'),'click',function(ev){
					if(DOM.hasClass(ev.currentTarget,'current')){
						
					}else{
						DOM.removeClass(DOM.query('.printFile'),'current')
						DOM.addClass(ev.currentTarget,'current');
					}
				})
				Event.delegate(document,'click','.J_CheckBox',function(ev){
					if(DOM.attr(ev.currentTarget,'checked')){
						DOM.addClass(ev.currentTarget,'checked')
					}else{
						DOM.removeClass(ev.currentTarget,'checked')
					}
					checkBoxs = DOM.query("#J_TbItemList .J_CheckBox");
					var len = checkBoxs.length;
					checked = DOM.query("#J_TbItemList .checked");
					var length = checked.length;	
					if(len == length){
						DOM.attr('.J_CheckedAll','checked','checked')
					}else if(length < len){
						DOM.attr('.J_CheckedAll','checked',false)
					}
				})				
	        },
	        deliver : function() {
  				var submitHandle = function(o) {

				};
				var errorHandle = function(o){
					new H.widget.msgBox({
							    title:"错误提示",
							    content:o.desc,
							    type:"error"
							});
				};	  
				var json = [];
				var checked = DOM.query("#J_TbItemList .checked");
				var length = checked.length;
				for(i=0; i<length; i++){
					var expressId = DOM.attr(DOM.parent(checked[i]),'title');
					var tid = DOM.attr(DOM.parent(checked[i]),'type'); 
					var logisticCompany = DOM.attr(DOM.parent(checked[i]),'value'); 
					var o = '{"expressId":"' + expressId + '","tid":"' + tid + '","logisticCompany":"' + logisticCompany + '"}';
					o = eval('(' + o + ')');						
					json.push(o);
				}
				var itemsJson = KISSY.JSON.stringify(json);
				var data = "delivers="+itemsJson;
				new H.widget.asyncRequest().setURI(loadSearchUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},	        
	        CheckAll : function(ev){
				checkBoxs = DOM.query("#J_TbItemList .J_CheckBox");
				var len = checkBoxs.length;
				for(i=0; i<len; i++){
					var iid = checkBoxs[i].value;
					if(checkBoxs[i].disabled) continue;
					if(ev.checked){
						checkBoxs[i].checked = true;
						DOM.addClass(checkBoxs[i],'checked')
					} else {
						checkBoxs[i].checked = false;
						DOM.removeClass(checkBoxs[i],'checked')
					}					
//					if(checkBoxs[i].checked = true){alert(i)}
				}
				
	        },  
	        batchSet : function(){
	        	var submitHandle = function(o) {
					if(!deliveryControl.panel2){
			        	deliveryControl.panel2 = new O.Dialog({
						      width: 360,
						      headerContent: '批量设置',
						      bodyContent: '',
						      mask: true,
						      align: {
						          points: ['cc', 'cc']
						      },
						      closable :true,
						      draggable: true,
						      aria:true
						  });
		        	}
					var cont = '<div id="" style="padding:15px;width:300px;margin:auto;"><ul style="overflow:hidden">'
					+'<li class="min-height-30 fl">'
					+'<div class="w-70 align-right fl">快递:</div>'
					+'<div class="fl ml6">'
					+o.payload.body
					+'</div>'
					+'</li>'
					+'<li class="min-height-30 fl">'
					+'<div class="w-70 align-right fl">起始单号:</div>'
					+'<div class="fl ml6 input-text"><input type="text" class="w-200 input-none" value="" name="expressId" id="J_ExpressNum"></div>'
					+'</li>'
					+'<li class="min-height-30 fl">'
					+'<div class="w-70 align-right fl">规则:</div>'
					+'<div class="fl ml6">依次递增</div><div class="fl ml6 input-text"><input type="text" class="w-100 input-none" value="1" name="regex" id="J_Regex"></div>'
					+'</li>'
					+'</ul><div style="width:160px;margin:15px auto 0 auto;overflow:hidden;"><input id="J_SaveExpressNum" class="btm-68-orange fl" type="button" name="确定" value="确定"><input class="btm-68-gray fl cancle" type="button" name="取消" value="取消"></div></div>';
					deliveryControl.panel2.set('bodyContent',cont);
					deliveryControl.panel2.show();
					Event.on('.cancle','click',function(){
						deliveryControl.panel2.hide();
					})	  
					Event.remove('#J_SaveExpressNum');
					Event.on('#J_SaveExpressNum','click',function(){
						deliveryControl.batchNum();
						deliveryControl.panel2.hide();
					})	
				};
        	    var errorHandle = function(o){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
        	    };
				var listCompanies = 1; 
				var data = "listCompanies="+listCompanies;				
        	    new H.widget.asyncRequest().setURI(loadManageUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
	        },
	        batchNum : function(){
	        	var submitHandle = function(o) {
	        		DOM.html('#J_TbItemList',o.payload.body);
	        		DOM.attr('.J_CheckedAll','checked',false);
	        	};
        	    var errorHandle = function(o){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
        	    };
				checked = DOM.query("#J_TbItemList .checked");
				var length = checked.length;
				var json = [];
        	    for(i=0; i<length; i++){ 
        	    	var id = checked[i].value
					var o = '{"tid":"' + id + '"}';
					o = eval('(' + o + ')');	
					json.push(o);
        	    }
				var itemsJson = KISSY.JSON.stringify(json);        	    
				var expressId = DOM.val('#J_ExpressNum');
				var logisticCompany = DOM.val('#J_Express');
				var regex = DOM.val('#J_Regex');
				var data = "logisticCompany="+logisticCompany+"&expressId="+expressId+"&regex="+regex+"&tids="+itemsJson;				
        	    new H.widget.asyncRequest().setURI(loadSearchUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
	        },	        
	        edit : function(id,num,type){
	        	var submitHandle = function(o) {
					if(!deliveryControl.panel){
			        	deliveryControl.panel = new O.Dialog({
						      width: 360,
						      headerContent: '编辑',
						      bodyContent: '',
						      mask: true,
						      align: {
						          points: ['cc', 'cc']
						      },
						      closable :true,
						      draggable: true,
						      aria:true
						  });
		        	}
					var cont = '<div id="" style="padding:15px;width:200px;margin:auto;"><ul><li class="min-height-30">选择快递：'
						+o.payload.body
						+'</li><li class="min-height-30">快递单号：<input id="J_ExpressText" type="text" value="" style="color:#666;"></li></ul><div style="width:160px;margin:15px auto 0 auto;overflow:hidden;"><input id="J_Modify" class="btm-68-orange fl" type="button" name="确定" value="确定"><input class="btm-68-gray fl cancle" type="button" name="取消" value="取消"></div></div>';
					deliveryControl.panel.set('bodyContent',cont);
					deliveryControl.panel.show();
					DOM.val('#J_ExpressText',num)
					DOM.val('#J_LogisticCompany',id)
					Event.on('.cancle','click',function(){
						deliveryControl.panel.hide();
					})	
					Event.remove('#J_Modify')
					var tid = type;
					Event.on('#J_Modify','click',function(type){
						DOM.html('#J_SinpleExpress_'+tid,DOM.val('#J_Express'));
						DOM.html('#J_SinpleNum_'+tid,DOM.val('#J_ExpressText'));
						deliveryControl.panel.hide();
					})
				};
        	    var errorHandle = function(o){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
        	    };
				var listCompanies = 1; 
				var data = "listCompanies="+listCompanies;				
        	    new H.widget.asyncRequest().setURI(loadManageUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();				
	        },
			Calendar : function($id){
				var c =new KISSY.Calendar('#'+$id,{
							popup:true,
							triggerType:['click'],
							showTime:true,
							date :new Date(),
							maxDate:new Date()
						}).on('select timeSelect',function(e){
								var id = this.id,self = this;
								var startDate   = KISSY.Date.format(e.date,'yyyy-mm-dd HH:MM:ss');
								KISSY.one('#'+$id).val(startDate);
								self.hide();
							});
			},
	        searchTbItems : function() {
	            var submitHandle = function(o) {
					DOM.hide('#J_LeftLoading');
					DOM.show('#J_MainLeftContent');
	        	    totalRecords = o.payload.totalRecords;
	        	    DOM.html('#J_TotalRecords',totalRecords)
					if(totalRecords > 0){
						DOM.css(DOM.get('#J_LEmpty') ,'display','none');
						DOM.css(DOM.query(".J_ItemSelectBtnHolder") ,'display' , '');
					} else {
						DOM.css(DOM.get('#J_LEmpty'), 'display' , '');
						DOM.css(DOM.query(".J_ItemSelectBtnHolder") , 'display' , 'none');
					}
					deliveryControl.renderItems(o.payload.body);
					var pageCount = Math.ceil(totalRecords/o.payload.pageSize); 
					deliveryControl.paginator = new showPages('deliveryControl.paginator').setRender(deliveryControl.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
	    	    };
	    	    var errorHandle = function(o){
					new H.widget.msgBox({
							    title:"错误提示",
							    content:o.desc,
							    type:"error"
							});
	    	    };	    	    
   	    	    if(DOM.val(DOM.get("#J_SearchNick")) != '输入买家昵称'){
   	    	    	var nick = encodeURIComponent(DOM.val(DOM.get("#J_SearchNick")));
   	    	    }else{
   	    	    	var nick ='';
   	    	    }    	    	
	    	    var starttime = DOM.val('#J_startDate');
	    	    var endtime = DOM.val('#J_endDate');
	    	    var state = DOM.val('#s1');
	    	    var pagesize = DOM.val('#J_PageSize');
	 			DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
				var data = "starttime="+starttime+"&endtime="+endtime+"&state="+state+"&buyernick="+nick+"&pagesize="+pagesize;
	    	    new H.widget.asyncRequest().setURI(loadSearchUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
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
	 				var pageCount = Math.ceil(totalRecords/o.payload.pageSize); 
	 				deliveryControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
	 				deliveryControl.renderItems(o.payload.body);
	 				DOM.hide('#J_LeftLoading');
					DOM.show('#J_MainLeftContent');
		    	};
   	    	    if(DOM.val(DOM.get("#J_SearchNick")) != '输入买家昵称'){
   	    	    	var nick = encodeURIComponent(DOM.val(DOM.get("#J_SearchNick")));
   	    	    }else{
   	    	    	var nick ='';
   	    	    }    	    	
	    	    var starttime = DOM.val('#J_startDate');
	    	    var endtime = DOM.val('#J_endDate');
	    	    var state = DOM.val('#s1');
	    	    var pagesize = DOM.val('#J_PageSize');
				data ="page_id="+pageId+"&starttime="+starttime+"&endtime="+endtime+"&state="+state+"&buyernick="+nick+"&pagesize="+pagesize;;
				DOM.show('#J_LeftLoading');
				DOM.hide('#J_MainLeftContent');
	    	    new H.widget.asyncRequest().setURI(loadSearchUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			}			
	}
}, {
    requires: ['utils/showPages/index','overlay','gallery/province/1.0/index']
});
