/*
combined files : 

utils/showPages/index
page/configure-logistics-init

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
 * 物流设置
 *  
 */
KISSY.add('page/configure-logistics-init',function (S,showPages,Select,Overlay,LinkSelect){
	var DOM = S.DOM, Event = S.Event;
	var returnCompany;
	var originsSelect;
	var addressSelect;
	var logicCompany=KISSY.JSON.parse(logisticsCompanysJson);
	var startAddress=KISSY.JSON.parse(logisticsCitysJson);
	var citysNum=KISSY.JSON.parse(logisticsCitysNum); 
	return 	logisticsControl = {
			    msg : null,
			    msg1:null,
			    flag:0,
		    	paginator : null,
		    	select1:null,
		    	dialog:null,
		    	select4:null,
		    	select5:null,
		    	select6:null,
		    	init : function() {
		        logisticsControl.searchTbItems();
		        logisticsControl.getLogicCompanyItems();
		        logisticsControl.getStartAddressItems();
		        DOM.html('#J_citys',citysNum);
		        //删除
		        Event.delegate(document,'click','.J_delete',function(ev){
		        	var temp_id=DOM.attr(ev.currentTarget,'data');
			   		DOM.val('#J_delete_id',temp_id);
	        		if(!logisticsControl.dialog){
	        			logisticsControl.dialog = new Overlay.Dialog({
		     	            title:'删除',
		     	            width:330,
			 	            height:150,
			 	            closeAction : 'destroy',
		     	            buttons:[
		     	                   {
		     	                     text:'确定',
		     	                     elCls : 'bui-button bui-button-primary',
		     	                     handler : function(){
		     	                	  var submitHandle = function(o){
		     	                		logisticsControl.searchTbItems();
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
		     	 	         	     };
		     	          	        var temp_id=DOM.val('#J_delete_id');
		     	 	                var data ='&temp_id='+temp_id;
		     	 	         	    new H.widget.asyncRequest().setURI(delLogisticsTemplateUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
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
		     	       bodyContent:'<div style="text-align:center;"><div class="ui-confirm-message-content" style="color:#656D7A;font-size:15px;height:20px;line-height:20px;margin-bottom:5px;font-weight:bold;">是否确认删除改地区模板金额？</div></div>'
	     	          });
	        	     }
     	            logisticsControl.dialog.show();
				});

//		        	Event.on('#J_RightSearchBtn','click',function(ev){
//		        		logisticsControl.searchTbItems();
//                    }); 
		        	
		        	//新建模板
			   		Event.delegate(document,'click','#J_add_moudle',function(){
			   			var sucessCompanyHandle = function(o){
			   				returnCompany=o.payload;
			   				if(!logisticsControl.msg1){
					   			logisticsControl.msg1 = new Overlay.Dialog({
					   			mask:true,
			   			   		buttons:[
			   			   		         {
			   			   		        	 text:'确定',
			   			   		        	 elCls : 'bui-button bui-button-primary',
			   			   		        	 handler : function(){
					   			   		       var sucessHandle = function(o){
							   			   		    temp_id = o.payload.items;
							   			   		    window.location.href=updateLogistic+'&temp_id='+temp_id;
			 				   			    	}; 
			 				   			       var errorHandle = function(o){
				 					        		 new H.widget.msgBox({
				 					        		 title:"",
				 					        		 content:o.desc,
				 					        		 type:"error"
				 					        		 });
			 					        		 }; 
			 					        		    ParamsErrorBox = KISSY.one('#J_Suggest_ParamsErrorBox');
			 					        		    var region_province=DOM.val('#s1');
				 				   			        var region_city =DOM.val('#s2');
				 				   			        //物流公司
				 				   			        var company_id=DOM.val('#hide1');
			 					        		    //首重标准
				 				   			    	var start1_standards=DOM.val('#J_start1_standards');
				 				   			    	//首重费用
				 				   			         var start1_fees=DOM.val('#J_firstMoney');   
				 				   			        //首重标准2
				 				   			    	var start2_standards=DOM.val('#J_start2_standards');
				 				   			    	//首重费用2
				 				   			        var start2_fees=DOM.val('#J_add');
				 				   			        
				 				   			       if(isNaN(start2_fees)||start2_fees<0){
				 					       	    	if (start2_fees<0){
				 					       	    		DOM.html('#J_Suggest_ParamsErrorMsg','首费金额填写不正确');
				 					       	    	}else{
				 					       	    		DOM.html('#J_Suggest_ParamsErrorMsg','首费金额必须是数字');
				 					       	    	}
				 					       	    	if(ParamsErrorBox.css("display")==="none") {
				 					   	    			ParamsErrorBox.slideDown();														
				 										}
				 					   	    		S.later(function(){
				 					   	    			DOM.hide('#J_Suggest_ParamsErrorBox');
				 										},2000,false);
				 										return;
				 								    }
					 				   			    
				 				   			         //续重标准
				 				   			        var add_standards=DOM.val('#J_add_standard');
				 				   			        //续重费用
				 				   			        var add_fees=DOM.val('#J_addStandar');
					 				   			    if(company_id == "" || company_id == "undefined"||company_id == 0){
									    	    		DOM.html('#J_Suggest_ParamsErrorMsg','物流公司不能为空');
									    	    		if (ParamsErrorBox.css("display")==="none"){
									    	    			ParamsErrorBox.slideDown();														
														}
									    	    		S.later(function(){
									    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
														},2000,false);
														return;
													}	 				   			        
					 				   			    if( region_province == "undefined"||region_province == 0){
									    	    		DOM.html('#J_Suggest_ParamsErrorMsg','省份不能为空');
									    	    		if (ParamsErrorBox.css("display")==="none") {
									    	    			ParamsErrorBox.slideDown();														
														}
									    	    		S.later(function(){
									    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
														},2000,false);
														return;
													}
						 				   			if( region_city == "undefined"||region_city == 0){
									    	    		DOM.html('#J_Suggest_ParamsErrorMsg','地区不能为空');
									    	    		if (ParamsErrorBox.css("display")==="none") {
									    	    			ParamsErrorBox.slideDown();														
														}
									    	    		S.later(function(){
									    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
														},2000,false);
														return;
													}
						 				   		   if(!isNaN(start1_fees)){
								        	    	}else{
								        	    		DOM.html('#J_Suggest_ParamsErrorMsg','首费金额必须是数字');
									    	    		if (ParamsErrorBox.css("display")==="none") {
									    	    			ParamsErrorBox.slideDown();														
														}
									    	    		S.later(function(){
									    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
														},2000,false);
														return;
								        	    	}
									        	    if(start1_fees == "" || start1_fees == "undefined"){
									    	    		DOM.html('#J_Suggest_ParamsErrorMsg','首费金额不能为空');
									    	    		if (ParamsErrorBox.css("display")==="none") {
									    	    			ParamsErrorBox.slideDown();														
														}
									    	    		S.later(function(){
									    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
														},2000,false);
														return;
													}
									        	    if(start1_fees<0){
									    	    		DOM.html('#J_Suggest_ParamsErrorMsg','首费金额不允许小于0');
									    	    		if (ParamsErrorBox.css("display")==="none") {
									    	    			ParamsErrorBox.slideDown();														
														}
									    	    		S.later(function(){
									    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
														},2000,false);
														return;
													}
									        	    
									        	   
									        	    if(!isNaN(add_fees)){
								        	    	}else{
								        	    		DOM.html('#J_Suggest_ParamsErrorMsg','续费金额必须是数字');
									    	    		if (ParamsErrorBox.css("display")==="none") {
									    	    			ParamsErrorBox.slideDown();														
														}
									    	    		S.later(function(){
									    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
														},2000,false);
														return;
								        	    	}
									        	    if(add_fees == ""){
									    	    		DOM.html('#J_Suggest_ParamsErrorMsg','续费金额不能为空');
									    	    		if (ParamsErrorBox.css("display")==="none") {
									    	    			ParamsErrorBox.slideDown();														
														}
									    	    		S.later(function(){
									    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
														},2000,false);
														return;
													}
									        	    if(add_fees<0){
									    	    		DOM.html('#J_Suggest_ParamsErrorMsg','续费金额不允许小于0');
									    	    		if (ParamsErrorBox.css("display")==="none") {
									    	    			ParamsErrorBox.slideDown();														
														}
									    	    		S.later(function(){
									    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
														},2000,false);
														return;
													}  
									            this.hide();
				 				   			   	var data ='&region_province='+region_province+'&region_city='+region_city+'&start1_standards='+start1_standards+'&start2_standards='+start2_standards+'&start2_fees='+start2_fees+'&start1_fees='+start1_fees+'&add_standards='+add_standards+'&add_fees='+add_fees+'&company_id='+company_id;
				 			      	  		    new H.widget.asyncRequest().setURI(addLogisticsTemplateUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();	 
			   			   		         	 }
			   			   		         },{
							   			   	text:'取消',
							   			   	elCls : 'bui-button',
							   			   	handler : function(){
			   			   		        	 	this.hide();
							   			   	}
			   			   		         }
			   			   		        ]
				   			   	});
					   			var str='<div id="J_logistics_pop">'+
					   		      '<ul style="overflow:hidden">'+
					   		        '<input type="hidden" value="" id="J_sartsFees">'+
					   		        '<input type="hidden" value="0" id="J_status">'+
					         	 '<li class="x-pop-element" style="width:100%;float:left;">'+   
						   			 '<div class="w-60 fl" style="text-align:center;">快递公司:</div> '+
						   			 '<div class="fl ml6" id="J_courier"><input type="hidden" id="hide1" value="0" name="courier"/></div>'+ 
					             '</li> '+
					           ' <li class="x-pop-element" class="min-height-30 fl" style="margin-bottom:15px;width:100%;float:left;">'+  
					   			 '<div class="w-60 fl" style="text-align:center;">始发地:</div>'+
					   			 '<div class="fl ml6"><select style="width:120px;height:30px;line-height:30px;margin-right:5px;" id="s1"></select><select style="width:120px;height:30px;line-height:30px;" id="s2"></select></div>'+				               
					           '</li>'+   
					         	'<li class="x-pop-element" class="min-height-30 fl" style="width:100%;float:left;">'+
					           '<div class="w-60 fl" style="text-align:center;">首费:</div>'+
					           '<div class="fl ml6" id="J_s1" style="margin-right:6px;"><input type="hidden" id="J_start1_standards" value="" name="s1"/></div>'+
						   		'<div class="fl ml6">'+
						   		'<input type="text" value="" name="amount_1" class="input-text-2" style="width:50px;" id="J_firstMoney"/>&nbsp;&nbsp;元'+
					          ' </li>'+
					           ' <li class="x-pop-element" class="min-height-30 fl" style="width:100%;float:left;">'+
					                  '<div class="w-60 align-right fl">&nbsp;</div>'+
					                  ' <div class="fl ml6">'+
					                  	'<a id="J_fir_Standar">+添加首费标准</a><div id="J_Standar2" style="display:none;"><div  id="J_s3" style="display:none;float:left;margin-right:6px;"><input type="hidden" value="" id="J_start2_standards"/></div><input type="text" value="" name="amount_1" class="input-text-2" style="width:50px;margin-left:6px;" id="J_add"/>&nbsp;&nbsp;元<a style="margin-left:5px;" class="J_clear">删除</a></div>'+
					                  '</div>'+
					          ' </li>'+
					          ' <li class="x-pop-element" class="min-height-30 fl" style="width:100%;float:left;">'+
					           '<div class="w-60 fl" style="text-align:center;">续费:</div>'+
					            '<div class="fl ml6" id="J_s2" style="margin-right:6px;"><input type="hidden" id="J_add_standard" value="" name="s2"/>'+   
					   		'</div>'+
					   		'<div class="fl ml6">'+
					          ' <input type="text" value="" name="amount_1" class="input-text-2" style="width:50px;" id="J_addStandar"/>&nbsp;&nbsp;元'+
					          '</div>'+	
					           '</li>'+
					           '<li  class="fl"  style="width:400px;line-height:0;min-height:0;margin-bottom:0;width:100%;float:left;">'+
						       '<div id="J_Suggest_ParamsErrorBox" style="display: none; width:400px;" class="ui-msg mt15">'+
								'<div class="error-msg"><div class="img-16-1"></div>'+
								'<div id="J_Suggest_ParamsErrorMsg" class="text-16 color-red">内容不能为空</div></div>'+
								'</div>'+
								'<div id="J_Suggest_ParamsSucessBox" style="display: none;width:400px;" class="ui-msg mt15">'+
							       '<div class="success-msg"><div class="img-16-6"></div></div>'+
					          '</li>'+
					           ' </ul>'+         
					          '</div>'
					   		     logisticsControl.msg1.set('title','新建模板');
					   			 logisticsControl.msg1.set('width',400);
					   			 logisticsControl.msg1.set('bodyContent',str);
					   			 logisticsControl.msg1.show();
					   			var  a = new LinkSelect(["#s1","#s2"],tdist, {
						         	defval: {
											text: "请选择地区", val: "0"
									 	},
										rootid: 1 
									});
			   				 	var items4 = [
			   			   	   		   	      {text:'0.5千克以内',value:'0.5'},
			   			   	   		   	      {text:'1千克以内',value:'1'}
			   			   	   		   	    ],
			   			   	   		   	    select4 = new Select.Select({  
			   			   	   		   		    render:'#J_s1',
			   			   	   		   	      	valueField:'#J_start1_standards',
			   			   	   		   	      	items:items4
			   			   	   		   		});
			   			   	   		   		select4.render();
			   			   			   		select4.setSelectedValue('0.5');
			   				 	var items5 = [
			   			   	   		   	      {text:'每增0.5千克',value:'0.5'},
			   			   	   		   	      {text:'每增1千克',value:'1'}
			   			   	   		   	    ],
			   			   	   		   	    select5 = new Select.Select({  
			   			   	   		   		    render:'#J_s2',
			   			   	   		   	      	valueField:'#J_add_standard',
			   			   	   		   	      	items:items5
			   			   	   		   		});
			   			   	   		   		select5.render();
			   			   			   		select5.setSelectedValue('0.5');
					   			var items6 = [
			   			   	   		   	      {text:'0.5千克以内',value:'0.5'},
			   			   	   		   	      {text:'1千克以内',value:'1'}
			   			   	   		   	    ],
			   			   	   		   	    select6 = new Select.Select({  
			   			   	   		   		    render:'#J_s3',
			   			   	   		   	      	valueField:'#J_start2_standards',
			   			   	   		   	      	items:items6
			   			   	   		   		});
			   			   	   		   		select6.render();
			   			   			   		select6.setSelectedValue('0.5');	
				   			   			    select1 = new Select.Select({  
					   		   		   		    render:'#J_courier',
					   		   		   	      	valueField:'#hide1',
					   		   		   	      	items:returnCompany
					   		   		   		});
					   		   		   		select1.render();
							   			    
						   			}else{
						   				logisticsControl.msg1.show();	 	
						   			}
				   			     Event.on('.J_clear','click',function(){
				  					DOM.show('#J_fir_Standar');
					   				DOM.hide('#J_Standar2');
					   				DOM.hide('#J_s3');
				  				 });
								 Event.on('#J_fir_Standar','click',function(){ 
					   				DOM.hide('#J_fir_Standar');
					   				DOM.show('#J_Standar2');
					   				DOM.show('#J_s3');
							       })
		   			    	};
		   			    	new H.widget.asyncRequest().setURI(loadLogisticsCompaniesUrl).setMethod("GET").setHandle(sucessCompanyHandle).setData(null).send();
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
				   		logisticsControl.searchTbItems();
			   		}); 

		        },
		         getLogicCompanyItems :function(){
					if(!originsSelect){
			   		originsSelect = new Select.Select({  
   	   		   		    render:'#J_logic',
   	   		   	      	valueField:'#J_logicVal',
   	   		   	      	items:logicCompany
   	   		   		});
					originsSelect.render();
					originsSelect.setSelectedValue('0');
					}
					originsSelect.on('change', function(ev){
						logisticsControl.searchTbItems();
					});
		        	
		         },
		        getStartAddressItems :function(){
						if(!addressSelect){
							addressSelect = new Select.Select({  
	   	   		   		    render:'#J_address',
	   	   		   	      	valueField:'#J_location',
	   	   		   	      	items:startAddress
	   	   		   		});
							addressSelect.render();
							addressSelect.setSelectedValue('0');
						}
						addressSelect.on('change', function(ev){
							logisticsControl.searchTbItems();
						});
			         } ,
				 searchTbItems : function() {
		            var submitHandle = function(o) {
						DOM.hide('#J_RightLoading');
						DOM.show('#J_MainRightContent');
		        	    totalRecords = o.payload.totalRecords;
		        	    if(totalRecords==0){
		        	    	DOM.hide('#J_search');
		        	    }
		        	    if(totalRecords > 0){
		        	    	DOM.css(DOM.get('#J_REmpty') ,'display','none');
		        	    	DOM.css(DOM.query(".J_PromotionItemBtnHolder") ,'display' , '');
		        	    	DOM.css(DOM.query(".J_ControlBtm") , 'display' , 'block');
		        	    	} else {
		        	    	DOM.css(DOM.get('#J_REmpty'), 'display' , '');
		        	    	DOM.css(DOM.query(".J_PromotionItemBtnHolder") , 'display' , 'none');
		        	    	DOM.css(DOM.query(".J_ControlBtm") , 'display' , 'none');
		        	    	} 
						logisticsControl.renderItems(o.payload.body);
						DOM.html('#J_income',totalRecords);
						DOM.html('#J_total',totalRecords);
						var pageCount = Math.ceil(totalRecords/o.payload.pageNum);
						logisticsControl.paginator = new showPages('logisticsControl.paginator').setRender(logisticsControl.handlePagination).setPageCount(pageCount).printHtml('#J_BottomPaging',2);
						logisticsControl.paginator.printHtml('#J_TopPaging',3);
		    	    };
		        	var errorHandle = function(o){
		        		 DOM.hide('#J_Loading');
		        		 DOM.show('#J_MainRightContent');
		        		 new H.widget.msgBox({
		        		 title:"错误提示",
		        		 content:o.desc,
		        		 type:"error"
		        		 });
		        		 }; 
					var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
					var company_id=DOM.val('#J_logicVal');
					var city_id=DOM.val('#J_location');
		    	    var data ="&page_size="+itemPage+"&company_id="+company_id+"&city_id="+city_id;
		 			DOM.show('#J_RightLoading');
					DOM.hide('#J_MainRightContent');
		    	    new H.widget.asyncRequest().setURI(loadLogisticsUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
				},	
				// 渲染 TbItems
				renderItems: function(c) {
					DOM.html(DOM.get("#J_LogisticsItemList"), c,true);
				},
		    	handlePagination : function(turnTo) {
			    	pageId = turnTo;
		    		var submitHandle = function(o) {
		    			 totalRecords = o.payload.totalRecords;
		    			 if(totalRecords > 0){
		    				 DOM.css(DOM.get('#J_REmpty') ,'display','none');
		    				 DOM.css(DOM.query(".J_PromotionItemBtnHolder") ,'display' , '');
		    				 } else {
		    				 DOM.css(DOM.get('#J_REmpty'), 'display' , '');
		    				 DOM.css(DOM.query(".J_PromotionItemBtnHolder") , 'display' , 'none');
		    				 } 
		 				var pageCount = Math.ceil(totalRecords/o.payload.pageNum);
		 				logisticsControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_BottomPaging',2);
						logisticsControl.paginator.setPage(pageId).setPageCount(pageCount).printHtml('#J_TopPaging',3);
		        	    logisticsControl.renderItems(o.payload.body);
		 				DOM.hide('#J_RightLoading');
						DOM.show('#J_MainRightContent');
			    	};
			    		 if(DOM.val(DOM.get("#J_SearchTitle")) != '快递公司、始发地'){
		    	    	var title = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
		    	    }else{
		    	    	var title ='';
		    	    }
					var itemPage = DOM.val(DOM.get("#J_SelectItemPage"));//每页多少条
					var company_id=DOM.val('#J_logicVal');
					var city_id=DOM.val('#J_location');
		    	    var data ="&page_size="+itemPage+"&company_id="+company_id+"&city_id="+city_id;
		             data += "&page_id="+pageId;
				     DOM.show('#J_RightLoading');
					 DOM.hide('#J_MainRightContent');
		    	    new H.widget.asyncRequest().setURI(loadLogisticsUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
				}								
	
		}
}, {
    requires: ['utils/showPages/index','bui/select','bui/overlay','gallery/province/1.0/index']
});
