/*
combined files : 

utils/showPages/index
page/acount-init

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
KISSY.add('page/acount-init',function (S,showPages,Select,Calendar) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return acountControl = {
				msg : null,
				paginator : null , //订购分页
				paginatorGive : null , //赠送分页
				initDinggouFlag : false,
				initGiveFlag : false,
				initIntegralFlag : false,
				currentMode : 'dinggou',
				init : function(){
					
					var items = [
	 	                  {text:'10条',value:'10'},
	 	                  {text:'20条',value:'20'},
	 	                  {text:'30条',value:'30'},
	 	                 {text:'40条',value:'40'}
	 	                ],
	 	                select = new Select.Select({  
	 	                  render:'#J_Select',
	 	                  valueField:'#hide',
	 	                  items:items
	 	                });
		 	            select.render();
		 	            select.on('change', function(ev){
		 	            });
		 	           select.setSelectedValue('10');
						var items1 = [
	     	                  {text:'全部',value:'100'},
	     	                  {text:'积分消费',value:'0'},
	     	                  {text:'兑换积分',value:'1'},
	     	                 {text:'提现',value:'2'},
	     	                {text:'登陆赠送积分',value:'3'},
	     	                {text:'邀请赠送积分',value:'4'}
	     	                ],
	     	                select1 = new Select.Select({  
	     	                  render:'#J_leibie',
	     	                  valueField:'#hide1',
	     	                  items:items1
	     	                });
	     	            select1.render();
	     	            select1.on('change', function(ev){
	     	            });
	     	           select1.setSelectedValue('100');
	     	           
	     	          var datepicker = new Calendar.DatePicker({
	     	              trigger:'#J_startDate',
	     	              showTime:true,
	     	              autoRender : true,
	     	              autoSetValue :false,
	     	              textField  : '2'
	     	            });
	     	         var datepicker2 = new Calendar.DatePicker({
	     	              trigger:'#J_endDate',
	     	              showTime:true,
	     	              autoRender : true,
	     	              autoSetValue :false,
	     	              textField  : '2'
	     	            });
	     	         
	     	        datepicker.on('selectedchange',function (e) {
	     	        	 	var endDate = H.util.stringToDate(S.one('#J_endDate').val());
							var startDate   = e.value;
							if((endDate !='')&&(startDate.getTime() >= endDate.getTime()))
							{
								new H.widget.msgBox({
									    title:"错误提示",
									    content:'开始时间不能大于结束时间，请重新选择',
									    type:"info"
									});
								//S.one('#J_startDate').val('');
							}else{
								S.one('#J_startDate').val(e.text);
							}
	     	         });
	     	        datepicker2.on('selectedchange',function (e) {
			     	       	var endDate   =  e.value;
							var startTime = H.util.stringToDate(S.one('#J_startDate').val());
							var endTime = H.util.stringToDate(endDate);
							if((endTime.getTime() <= startTime.getTime())&&(startTime !='')){
								new H.widget.msgBox({
									    title:"错误提示",
									    content:'结束时间不能小于开始时间，请重新选择',
									    type:"info"
									});
								//S.one('#J_endDate').val('');
							}else{
								S.one('#J_endDate').val(e.text);
							}
	     	         });
					Event.on('.J_Tab','click',function(ev){
						var v =DOM.attr(ev.currentTarget,'data');
						DOM.removeClass('.J_Tab','current');
						DOM.addClass(ev.currentTarget,'current');
						if(v == '1'){
							acountControl.show('dinggou');
						}else{
							acountControl.show('give');
						}
						
						
					})	
					Event.on('#J_RightSearchBtn','click',function(ev){
						if(acountControl.currentMode == 'dinggou'){
							acountControl.dingGou();
						} else if(acountControl.currentMode == 'give'){
							acountControl.Give();
						}
							
					});	
					Event.fire('#J_RightSearchBtn','click');
					
//					myCalendar('J_startDate',0);
//					myCalendar('J_endDate',7);
					
				},
				show : function(mode){
					acountControl.currentMode = mode;
					if (mode == 'dinggou' ) {
						if(!acountControl.initDinggouFlag){
							acountControl.dingGou();
							acountControl.initDinggouFlag = true;
						}
						DOM.get('#main-content-div-1').style.display = '';
						DOM.get('#main-content-div-2').style.display = 'none';
					}
					if (mode == 'give') {
						if(!acountControl.initGiveFlag){
							acountControl.Give();
							acountControl.initGiveFlag = true;	
						}
						DOM.get('#main-content-div-1').style.display = 'none';
						DOM.get('#main-content-div-2').style.display = '';
					}
				},
		
				dingGou : function(){
					var submitHandle = function(o) {
		        	    totalRecords = o.payload.totalRecords;
		        	    if(totalRecords > 0){
		   					DOM.get('#J_LEmpty').style.display = 'none';
							DOM.removeClass('.J_DinggouHolder','ks-hidden');
						} else {
							DOM.get('#J_LEmpty').style.display = '';
							DOM.addClass('.J_DinggouHolder','ks-hidden');
						}
						acountControl.render(o.payload.body);
						var pageCount = Math.ceil(totalRecords/o.payload.pageSize); 
						acountControl.paginator = new showPages('acountControl.paginator').setRender(acountControl.renderDinggou).setPageCount(pageCount).printHtml('#J_DingPaging',2);
						DOM.hide('#J_LeftLoading');
						DOM.show('#J_MainLeftContent');
		    	    };
					DOM.show('#J_LeftLoading');
					DOM.hide('#J_MainLeftContent');
		    	    var start_created = DOM.val('#J_startDate');
		    	    var end_created = DOM.val('#J_endDate');
		    	    var page_size = DOM.val('#hide');
		    	    var nick = DOM.val('#J_NickName');	    	    
		    	    data = 'start_created='+start_created+'&end_created='+end_created+'&page_size='+page_size+'&nick='+encodeURIComponent(nick);
		    	    new H.widget.asyncRequest().setURI(buyDetailUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
				},
				renderDinggou :function(turnTo){
					pageId = turnTo;
		    		var submitHandle = function(o) {
		    			DOM.hide('#J_LeftLoading');
						DOM.show('#J_MainLeftContent');
		    			totalRecords = o.payload.totalRecords;
		    			 if(totalRecords > 0){
			   					DOM.get('#J_LEmpty').style.display = 'none';
								DOM.removeClass('.J_DinggouHolder','ks-hidden');
							} else {
								DOM.get('#J_LEmpty').style.display = '';
								DOM.addClass('.J_DinggouHolder','ks-hidden');
						}
		   				acountControl.render(o.payload.body);
		 				var pageCount = Math.ceil(totalRecords/o.payload.pageSize); 
						acountControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_DingPaging',2);
			    	};
			    	DOM.show('#J_LeftLoading');
					DOM.hide('#J_MainLeftContent');
		    	    var start_created = DOM.val('#J_startDate');
		    	    var end_created = DOM.val('#J_endDate');
		    	    var page_size = DOM.val('#hide');
		    	    var nick = DOM.val('#J_NickName');	    	  
			    	data = 'start_created='+start_created+'&end_created='+end_created+'&page_size='+page_size+'&page_no='+pageId+'&nick='+nick;
			    	new H.widget.asyncRequest().setURI(buyDetailUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
				},
				Give : function(){
					var submitHandle = function(o) {
						 DOM.hide('#J_RightLoading');
						 DOM.show('#J_MainRightContent');
		        	    totalRecords = o.payload.totalRecords;
						if(totalRecords > 0){
							DOM.get('#J_REmpty').style.display = 'none';
							DOM.removeClass('.J_GiveHolder','ks-hidden');
						} else {
							DOM.get('#J_REmpty').style.display = '';
							DOM.addClass('.J_GiveHolder','ks-hidden');
						}
						acountControl.render(o.payload.body);
						var pageCount = Math.ceil(totalRecords/o.payload.pageSize); 
						acountControl.paginatorGive = new showPages('acountControl.paginatorGive').setRender(acountControl.renderGive).setPageCount(pageCount).printHtml('#J_GivePaging',2);
		    	    };
		    	    DOM.show('#J_RightLoading');
					DOM.hide('#J_MainRightContent');
			    	var start_created = DOM.val('#J_startDate');
			    	var end_created = DOM.val('#J_endDate');
			    	var page_size = DOM.val('#hide');
			    	var nick = DOM.val('#J_NickName');		    	    
		    	    data = 'start_created='+start_created+'&end_created='+end_created+'&page_size='+page_size+'&nick='+encodeURIComponent(nick);
		    	    new H.widget.asyncRequest().setURI(giftDetailUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
				},
				renderGive :function(turnTo){
					pageId = turnTo;
		    		var submitHandle = function(o) {
		    			 DOM.hide('#J_RightLoading');
						 DOM.show('#J_MainRightContent');
		    			totalRecords = o.payload.totalRecords;
		    			if(totalRecords > 0){
							DOM.get('#J_REmpty').style.display = 'none';
							DOM.removeClass('.J_GiveHolder','ks-hidden');
						} else {
							DOM.get('#J_REmpty').style.display = '';
							DOM.addClass('.J_GiveHolder','ks-hidden');
						}
		    			acountControl.render(o.payload.body);
		 				var pageCount = Math.ceil(totalRecords/o.payload.pageSize); 
						acountControl.paginatorGive.setPage(pageId).setPageCount(pageCount).printHtml('#J_GivePaging',2);
			    	};
			    	DOM.show('#J_RightLoading');
					DOM.hide('#J_MainRightContent');
			    	var start_created = DOM.val('#J_startDate');
			    	var end_created = DOM.val('#J_endDate');
			    	var page_size = DOM.val('#hide');
			    	var nick = DOM.val('#J_NickName');	
			    	data = 'start_created='+start_created+'&end_created='+end_created+'&page_size='+page_size+'&page_no='+pageId+'&nick='+nick;
			    	new H.widget.asyncRequest().setURI(giftDetailUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
				},
				render : function(o){
					if(acountControl.currentMode == 'dinggou'){
						var str = '';
						DOM.html('#J_DingGouContent',o);
					} else if(acountControl.currentMode == 'give'){
						DOM.html('#J_GiveContent',o);
					}
				}
	}
}, {
    requires: ['utils/showPages/index','bui/select','bui/calendar']
});
