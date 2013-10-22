/*
combined files : 

utils/showPages/index
page/smsRecord-init

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
KISSY.add('page/smsRecord-init',function (S,showPages,O) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	return smsRecord = {
	    	paginator : null,
			handlePagination :null,
            panel:null,
            littlePopup : null,
	    	init : function() {
                if(!smsRecord.panel){
                    smsRecord.panel = new O.Dialog({
                        width: 370,
                        headerContent: '提醒手机',
                        bodyContent: '<div style="padding:30px 0;"><ul><li class="min-height-30"><span class="fl color-red" style="margin-left:20px;_display: inline;">测试会消耗一条短信</span></li><li class="min-height-40"><div class="active-add-edit-title w-80">提醒手机：</div><div class="active-add-edit-edit w-180"><input id="J_MobileText" type="text" value="" class="input-text w-200"></div></li><li class="min-height-40"><div class="active-add-edit-title w-80">提醒方式：</div><div class="active-add-edit-edit w-200">短信少于&nbsp;&nbsp;<input id="J_remindNum" value="" type="text" class="input-text w-70">&nbsp;&nbsp;条提醒我</div></li><li><div class="ui-msg" style="display: none; width:300px; margin: 15px auto;" id="J_ParamsErrorBox"><div class="error-msg"><div class="img-16-1"></div><div class="text-16 color-red" id="J_ParamsErrorMsg"></div></div></div><div class="ui-msg" style="display: none;width:300px;margin: 15px auto;" id="J_ParamsSucessBox"><div class="success-msg"><div class="img-16-6"></div><div class="text-16" id="J_ParamsSucessMsg"></div></div></div></li><li class="min-height-40"><div style="width:160px;_width:170px;" class="btm-content m-auto"><input name="" type="button" value="确定" class="btm-68-orange fl" id="J_determine"/><input type="button" value="测试" class="btm-68-gray fl" id="J_test" /></div></li></ul></div>',
                        mask: false,
                        align: {
                            points: ['cc', 'cc']
                        },
                        closable :true,
                        draggable: true,
                        aria:true
                    }); 
                };
                if(!smsRecord.littlePopup){
                    KISSY.use("node, overlay", function(S, Node, O) {
                        smsRecord.littlePopup = new O({
                                elStyle : {
                                    border : "1px solid #ddd",
                                    lineHeight : "30px"
                                },
                                zIndex : 1000004,
                                effect : {
                                    effect : "slide", //popup层显示动画效果，slide是展开，也可以"fade"渐变
                                    duration : 0.5
                                }
                            });
                    });
                };
                Event.on("#J_remind", "click", function(){
                    smsRecord.panel.show();
                    smsRecord.getPanelData();
                    Event.remove('#J_determine');
                    Event.remove('#J_test');
                    Event.on('#J_determine','click',function(ev){
                        var phoneNum = DOM.val('#J_phoneNum');
                        var MobileText = DOM.val('#J_MobileText');
                        var remindNum = DOM.val('#J_remindNum');
                        var noteNum = DOM.val('#J_noteNum');
                        if(phoneNum == MobileText && remindNum == noteNum){
                            smsRecord.panel.hide();
                        }else{
                            smsRecord.determine();
                        };
                    });
                    Event.on('#J_test','click',function(ev){
                        smsRecord.remindTest();
                    });
                });
        	    smsRecord.searchTbItems();
                smsRecord.Calendar('J_StartTime');
                smsRecord.Calendar('J_EndTime');
				Event.on("#J_Search", "click", function(){
					smsRecord.searchTbItems();
				});
				Event.on("#J_RetryAll", "click", function(){
					smsRecord.allretry();
				});
				Event.on("#J_GetRetryCount", "click", function(){
				    smsRecord.getRetryCount();
				});
				Event.delegate(document,"mouseenter mouseleave", ".J_ShowMore", function(ev){
				    if(ev.type  == "mouseenter"){
    				    var data = DOM.attr(ev.currentTarget,'data');
    				    var num = DOM.attr(ev.currentTarget,'num');
    				    smsRecord.showMore(num,data);
				    }else{
				        smsRecord.littlePopup.hide();
				    }
				});
	        },
            remindTest : function(){
                var ParamsErrorBox = KISSY.one('#J_ParamsErrorBox');
                var ParamsSucessBox = KISSY.one('#J_ParamsSucessBox');
                var submitHandle = function(o) {
                    new H.widget.msgBox({
                        type: "sucess",
                        content: o.payload,
                        dialogType:"msg",
                        autoClose:true,
                        timeOut:3000,
                    });
                    smsRecord.panel.hide();
                };
                var errorHandle = function(o){                          
                    DOM.html('#J_ParamsErrorMsg',o.desc);
                    if (ParamsErrorBox.css("display")==="none") {
                        ParamsErrorBox.slideDown();
                    }
                    return ;
                };
                var mobile = DOM.val('#J_MobileText');
                var data = "mobile="+mobile;
                new H.widget.asyncRequest().setURI(testRemindInfoUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
            },
            //查看更多
            showMore : function(num,data) {
                var str = '<div class="proj-dialog ks-clear" style="padding:0;">'+
                                '<div class="relative"><div class="dialog-triangle2"></div></div>'+
                                '<div class="dialog-c ks-clear" style="padding:8px;">'+data+
                                '</div>'+
                            '</div>';
                smsRecord.littlePopup.set("content", str);
                smsRecord.littlePopup.set('align', {
                    node : "#J_ShowMore"+num,
                    points : ["br", "tr"],
                    offset: [0, 10]
                });
                smsRecord.littlePopup.show();
                Event.remove('.J_SaveSuggestToBug');
                Event.on('.J_SaveSuggestToBug','click',function(ev){
                    var activity_id = DOM.val('#J_ActivityId');
                    var data = "activity_id="+activity_id;
                    var submitHandle = function(o) {
                        smsRecord.littlePopup.hide();
                        smsRecord.msg.hide();
                        smsRecord.msg.setMsg('删除成功！').show();
                        smsRecord.msg.hide(500);
                        S.later(function(){
                            location.href=comeBackPlanListURL;
                        },500,false);
                    };
                    var errorHandle = function(o){
                        smsRecord.littlePopup.hide();
                        smsRecord.msg.hide();
                        smsRecord.msg.setMsg('<div class="point relative"><div class="point-w-1">'+o.desc+'</div></div>').showDialog();
                        return;
                    };
                    new H.widget.asyncRequest().setURI(deleteDetailURL).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
                })
                Event.remove('.J_DontChangeType');
                Event.on('.J_DontChangeType','click',function(ev){
                    smsRecord.littlePopup.hide();
                })
            },
	        getPanelData : function(){
                var submitHandle = function(o) {
                    DOM.val('#J_MobileText',o.payload.mobile);
                    DOM.val('#J_noteNum',o.payload.sms_remind);
                    DOM.val('#J_remindNum',o.payload.sms_remind);
                    DOM.val('#J_phoneNum',o.payload.mobile);
                };
                new H.widget.asyncRequest().setURI(getRemindInfoUrl).setMethod("GET").setHandle(submitHandle).setData(null).setDataType('json').send();
            },
            determine : function(){
                var mobile = DOM.val('#J_MobileText');
                var sms_remind = DOM.val('#J_remindNum');
                var ParamsErrorBox = KISSY.one('#J_ParamsErrorBox');
                var ParamsSucessBox = KISSY.one('#J_ParamsSucessBox');
                var submitHandle = function(o) {
                    new H.widget.msgBox({
                        type: "sucess",
                        content: o.payload,
                        dialogType:"msg",
                        autoClose:true,
                        timeOut:3000,
                    });
                    smsRecord.panel.hide();
                };
                var errorHandle = function(o){
                    DOM.html('#J_ParamsErrorMsg',o.desc);
                    if (ParamsErrorBox.css("display")==="none"){
                        ParamsErrorBox.slideDown();
                    }
                    return;
                };
                data = 'mobile='+mobile+'&sms_remind='+sms_remind;
                new H.widget.asyncRequest().setURI(saveRemindInfoUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
            },
	        searchTbItems : function() {
	            var submitHandle = function(o) {
					DOM.hide('#J_Loading');
					DOM.show('#J_MainContent');
	        	    totalRecords = o.payload.totalRecords;
					if(totalRecords > 0){
                        DOM.hide('#J_Empty');
                        DOM.show(".J_ItemSelectBtnHolder");
                    } else {
                        DOM.show('#J_Empty');
                        DOM.hide(".J_ItemSelectBtnHolder");
					}
					smsRecord.renderItems(o.payload.body);
					var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
					smsRecord.paginator = new showPages('smsRecord.paginator').setRender(smsRecord.handlePagination).setPageCount(pageCount).printHtml('#J_Paging',2);
	    	    };
                var data = smsRecord.getData();
	    	    data += "&page_size=10";
    	   		DOM.show('#J_Loading');
				DOM.hide('#J_MainContent');
				new H.widget.asyncRequest().setURI(loadSmsUrl).setMethod("POST").setHandle(submitHandle).setData(data).send();
			},
            renderItems: function(c) {
                DOM.html(DOM.get("#J_PromotionItemList"), c);
            },
            getData : function(){
                var phone = DOM.val('#J_Phone');
                if(phone == '手机号码'){
                    var phone ='';
                }
                var start_at = DOM.val('#J_StartTime');
                var end_at = DOM.val('#J_EndTime');
               var data = "phone="+phone+"&start_at="+start_at+"&end_at="+end_at;                      
               return data ;
           },
            handlePagination : function(turnTo) {
                pageId = turnTo;
                var submitHandle = function(o) {
                     totalRecords = o.payload.totalRecords;
                    if(totalRecords > 0){
                        DOM.hide('#J_Empty');
                        DOM.show(".J_ItemSelectBtnHolder");
                    } else {
                        DOM.show('#J_Empty');
                        DOM.hide(".J_ItemSelectBtnHolder");
                    }
                    var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
                    smsRecord.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_Paging',2);
                    smsRecord.renderItems(o.payload.body);
                    DOM.hide('#J_Loading');
                    DOM.show('#J_MainContent');
                };
                var data = smsRecord.getData();
                data += "&page_size=10"+"&page_id="+pageId;
                DOM.show('#J_Loading');
                DOM.hide('#J_MainContent');
                new H.widget.asyncRequest().setURI(loadSmsUrl).setMethod("POST").setHandle(submitHandle).setData(data).send();
            },
			retry :function(id){
				var submitHandle = function(o) {
					if(smsRecord.paginator){
						smsRecord.paginator.toPage(smsRecord.paginator.page);
					}else{
						smsRecord.loadPromotionItems();
					}
				};
				var data = "sms_id="+id;
				new H.widget.asyncRequest().setURI(retryUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			//根据时间和短信类型批量重试
			getRetryCount :function(){
			    var submitHandle = function(o) {
			        if(o.payload.sms_balance == -1){
			            if(o.payload.sms_total <= 0){
    			            new H.widget.msgBox({
    			                title: "温馨提示",
    			                type: "error",
    			                content: "没有符合条件的记录需要重试."
    			            });
			            }else {
    			            new H.widget.msgBox({
    		                    title: "重试",
    		                    type: "confirm",
    		                    content: "需要重试的数目为"+o.payload.sms_total+"条，确定重试？",
    		                    buttons: [{ value: "确定" }],
    		                    success: function (result) {
    		                        if (result == "确定") {
    		                            smsRecord.allretry();
    		                        }
    		                    }
    		                });
			            }
			        }else{
    			        new H.widget.msgBox({
    	                    title: "重试",
    	                    type: "confirm",
    	                    content: "需要重试的数目为"+o.payload.sms_total+"条，当前余额为"+o.payload.sms_balance+"条！重试只能发送一部分用户，确定重试？",
    	                    buttons: [{ value: "充值" }, { value: "重试" }],
    	                    success: function (result) {
        			            if (result == "充值") {
        			                window.location.href=smsOrderUrl;
        			            }else if (result == "重试") {
    	                            smsRecord.allretry();
    	                        }
    	                    }
    	                });
			        }
			    };
			    var errorHandle = function(o){
			        new H.widget.msgBox({
			            title:"错误提示",
			            content:o.desc,
			            type:"error"
			        });
			    };
			    var data = smsRecord.getData();
			    new H.widget.asyncRequest().setURI(getRetryCountUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			//重试
			allretry :function(){
				var submitHandle = function(o) {
					new H.widget.msgBox({
					    title:"成功提示",
					    content:o.payload,
					    type:"error",
						autoClose : true,
						timeOut : 1000
					});
	        	    window.location.reload(true);
				};
				var errorHandle = function(o){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
	    	    };
        	    var data = smsRecord.getData();
				new H.widget.asyncRequest().setURI(retryallUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
            //修改活动时间日历
            Calendar : function($id){
                var c =new KISSY.Calendar('#'+$id,{
                            popup:true,
                            triggerType:['click'],
//                            showTime:true,
                            date :new Date(),
                            maxDate:new Date()
                        }).on('select timeSelect',function(e){
                                var id = this.id,self = this;
                                if(e.type == 'select'){
                                    var startDate = KISSY.Date.format(e.date,'yyyy-mm-dd');
                                }else{
                                    var startDate = KISSY.Date.format(e.date,'yyyy-mm-dd');
                                }
                                KISSY.one('#'+$id).val(startDate);
                                self.hide();
                        });
            }
	}
}, {
    requires: ['utils/showPages/index','overlay']
});
