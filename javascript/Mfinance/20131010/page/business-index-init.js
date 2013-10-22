/*
combined files : 

utils/showPages/index
page/business-index-init

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
KISSY.add('page/business-index-init',function (S,showPages,Select,Tooltip) {
	var DOM = S.DOM, Event = S.Event;	
	return 	indexControl = {
		    	paginator : null,
		    	listItemsPaginator : null,
		    	init : function() {
		               indexControl.getLessBaobei();
						  //时间
						var items3 = [
							{text:'最近一个月',value:'30'},
							{text:'最近2个月',value:'60'},
							{text:'最近3个月',value:'90'}								     
						],
						sortSelect = new Select.Select({  
							render:'#J_SelectItemSort',
							valueField:'#J_SelectItemSortHide',
							items:items3
						});
						sortSelect.render();
						sortSelect.setSelectedValue('30');
						sortSelect.on('change', function(ev){
							indexControl.searchTbItems();
						});
						//状态
						var items4 = [
							{text:'利润最高',value:'profit:desc'},
							{text:'利润最低',value:'profit:asc'}								     
						],
						statusSelect = new Select.Select({  
							render:'#J_SearchProfitBox',
							valueField:'#J_SearchStatus',
							items:items4
						});
						statusSelect.render();
						statusSelect.setSelectedValue('profit:desc');
						statusSelect.on('change', function(ev){
							indexControl.searchTbItems();
						});	
						Event.on('#J_RightSearchBtn','click',function(ev){
						  indexControl.searchTbItems();
						});	
						 Event.on(DOM.query('.J_Tiger'),'mouseenter mouseleave',function(ev){
		     	        	  if(ev.type == 'mouseenter'){
		     	        		  DOM.addClass(ev.currentTarget,'current');
		     	        	  }else{
		     	        		 DOM.removeClass(ev.currentTarget,'current');
		     	        	  }
		     	          });
		     	          Event.on(DOM.query('.J_Page'),'click',function(ev){
     	        	         var v = DOM.attr(ev.currentTarget,'data');
	 						 DOM.removeClass(DOM.query('#J_TopLeft .J_Page'),'active');
	 						 DOM.addClass(ev.currentTarget,'active');
	 						 DOM.html(DOM.get('#J_TopLeft .value'),v);
	 						 DOM.val('#J_SelectItemPage',v);
	     	        	    indexControl.searchTbItems();
		     	          }); 
		     	         indexControl.searchTbItems();
		     	         indexControl.getProductsItems();
		     	         
		        },
		        getProductsItems:function(){
		        	var submitHandle = function(o) {
		        		DOM.html('#J_saleList',o.payload.body);
		        	};
		        	 new H.widget.asyncRequest().setURI(getProductsUrl).setMethod("GET").setHandle(submitHandle).setData(null).send();
		        },
		        
		        getLessBaobei:function(){
		        	 var submitHandle = function(o) {
	    	        	    totalRecords = o.payload.totalRecords;
	    	        	    var already=o.payload.already;
	    	        	    var all=o.payload.all;
	    	        	    var less=all-already;
	    	        	    if((all-already)!= 0 ){ 
	    	        	    	DOM.html('#J_less',less);
	    	        	    	DOM.show('#J_lessNumbers');
	                	       }else{
	                	    	   DOM.hide('#J_lessNumbers');  
	                	       }       	
	            	    };
	            	    new H.widget.asyncRequest().setURI(getCostsSetUrl).setMethod("GET").setHandle(submitHandle).setData(null).send();
		        },
				 searchTbItems : function() {
		            var submitHandle = function(o) {
						DOM.hide('#J_RightLoading');
						DOM.show('#J_MainRightContent');
		        	    totalRecords = o.payload.totalRecords;
		        	    DOM.html('#J_totalRecords',totalRecords);
		        	    var sales=o.payload.countResults.sales;
		        	    var profit=o.payload.countResults.profit;
		        	    DOM.html('#J_allSale',sales);
		        	    DOM.html('#J_income',profit);
						if(totalRecords > 0){
							DOM.css(DOM.get('#J_REmpty') ,'display','none');
							DOM.css(DOM.query(".J_ItemSelectBtnHolder") ,'display' , '');
						} else {
							DOM.css(DOM.get('#J_REmpty'), 'display' , '');
							DOM.css(DOM.query(".J_ItemSelectBtnHolder") , 'display' , 'none');
						}
						indexControl.renderItems(o.payload.body);
						 Event.on(DOM.query('.J_tip'),'mouseover click',function(ev){
							 var i=DOM.attr(ev.currentTarget,'data');
							 var data_date=DOM.attr(ev.currentTarget,'data-date');
							 var promptHelp = new Tooltip.Tip({
								 trigger : '#J_finaceWarn'+i,
								 alignType : 'top',
								 offset : 10,
								 elCls : 'ui-tip',
								 title : '<div style="height:34px;width:178px;color:#555555;line-height:34px;"><span style="color:#999999;">上架时间：'+data_date+'</span></div>'
							 })
							 promptHelp.render();
						 });
						var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
						indexControl.paginator = new showPages('indexControl.paginator').setRender(indexControl.handlePagination).setPageCount(pageCount).printHtml('#J_BottomPaging',2);
						indexControl.paginator.setPageCount(pageCount).printHtml('#J_TopPaging',3);
		    	    };
		        	 if(DOM.val(DOM.get("#J_SearchTitle")) != '宝贝链接、产品ID'){
		    	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
		    	    }else{
		    	    	var title ='';
		    	     } 
						var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
						var orderby=DOM.val('#J_SearchStatus');
						var days=DOM.val('#J_SelectItemSortHide');
		    	    	var data = "q="+title+"&page_size="+itemPage+"&orderby="+orderby+"&days="+days;
			 			DOM.show('#J_RightLoading');
						DOM.hide('#J_MainRightContent');
			    	    new H.widget.asyncRequest().setURI(loadProductItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
				 },
				 renderItems: function(c) {
		    	    DOM.html(DOM.get("#J_BaobeiItemList"), c);
		        	var lis = DOM.query("#J_BaobeiItemList .J_TbItem");
		        	Event.on(lis, "mouseenter mouseleave click", function(ev){
		        		var el = DOM.get('.J_CheckBox',ev.currentTarget);
		        		if(el.disabled) return;
		        		if(ev.type == 'mouseenter'){
							DOM.addClass(ev.currentTarget,'current');
		        		}else if(ev.type == 'mouseleave'){
							DOM.removeClass(ev.currentTarget,'current');
						}
		        	});	
				},	
		    	handlePagination : function(turnTo) {
			    	pageId = turnTo;
		    		var submitHandle = function(o) {
		    			 totalRecords = o.payload.totalRecords;
		 				if(totalRecords > 0){
		 					DOM.css(DOM.get('#J_REmpty') ,'display','none');
		 					DOM.css(DOM.query(".J_ItemSelectBtnHolder") ,'display' , '');
		 				} else {
		 					DOM.css(DOM.get('#J_REmpty'), 'display' , '');
		 					DOM.css(DOM.query(".J_ItemSelectBtnHolder") , 'display' , 'none');
		 				}
		 				var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
		    			indexControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_BottomPaging',2);
						indexControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_TopPaging',3);
		        	    indexControl.renderItems(o.payload.body);
		 				DOM.hide('#J_RightLoading');
						DOM.show('#J_MainRightContent');
			    	};
			    		 if(DOM.val(DOM.get("#J_SearchTitle")) != '宝贝链接、产品ID'){
		    	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
		    	    }else{
		    	    	var title ='';
		    	    }
					var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
					var orderby=DOM.val('#J_SearchStatus');
					var days=DOM.val('#J_SelectItemSortHide');
	    	    	var data = "q="+title+"&page_size="+itemPage+"&orderby="+orderby+"&days="+days; 
				        data += "&page_id="+pageId;
					    DOM.show('#J_RightLoading');
						DOM.hide('#J_MainRightContent');
		    	    new H.widget.asyncRequest().setURI(loadProductItemsUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
				}		
				
		}
}, {
    requires: ['utils/showPages/index','bui/select','bui/tooltip',]
});
