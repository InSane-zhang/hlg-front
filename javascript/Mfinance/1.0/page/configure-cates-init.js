/**
 * 自动分类设置js
 * @author  
 */
KISSY.add(function (S,showPages,Select,beautifyForm,Overlay,JSON) {
	var DOM = S.DOM, Event = S.Event;	
	var pid;
	var cate_id;
	var clssListBox;
	var cate_name;
	return  catesControl = {
				dialog:null,
				dialog1:null,
				msg : null,
				msg1:null,
				msg2:null,
				select : null,
				init : function() {
		        catesControl.Form = new beautifyForm();
			    catesControl.searchCatesTab();
  			 	if(!catesControl.msg1){
	   			   	catesControl.msg1 = new Overlay.Dialog({
	   			   	mask:true,
		   			   	buttons:[
		   			   	{
		   			   	text:'确定',
		   			   	elCls : 'bui-button bui-button-primary',
			   			   	handler : function(){
		   			     	catesControl.submitNums();
		   			     	this.hide();
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
   			   	}else{
   			   		catesControl.msg1.show();	
   			   	} 	
  			  Event.delegate(document,'click','.add_number',function(ev){
	  				cate_name=DOM.attr(ev.currentTarget,'cate_name');
	  				DOM.val('#J_cate_name',cate_name);
	  				cate_id=DOM.attr(ev.currentTarget,'data');
	  				catesControl.addNums();
  			  });
	  			 
		 		
		       //删除子帐号弹框
		   	   Event.delegate(document,'click','.J_delBtn',function(ev){
		   		var account_id=DOM.attr(ev.currentTarget,'data');
		   		var dialog = new Overlay.Dialog({
	 	             width:330,
	 	             mask:true,
  	                 buttons:[
	     	                   {
	     	                     text:'确定',
	     	                     elCls : 'bui-button bui-button-primary',
	     	                     handler : function(){
	     	                	  var submitHandle = function(o){
		  		 						new H.widget.msgBox({ 
		  							 			type: "sucess", 
		  							 			content: "删除成功",
		  										dialogType:"msg", 
		  										autoClose:true, 
		  										timeOut:3000
		  									});
		  		 						catesControl.searchCatesTab();
		  			         	     };		     	        	 
		  		 	         	    var errorHandle = function(o){
		  								new H.widget.msgBox({
		  								    title:"错误提示",
		  								    content:o.desc,
		  								    type:"error"
		  								});
		  			         	    };	     	                	 
	     	                	  var data ='&account_id='+account_id;
	     	      	  		      new H.widget.asyncRequest().setURI(delAccountUrl).setHandle(submitHandle).setErrorHandle(errorHandle).setMethod("GET").setData(data).send();
	     	      	  		      this.hide();
	     	      	  		      this.destroy(); 
	     	                     }
	     	                   },{
	     	                     text:'取消',
	     	                     elCls : 'bui-button',
	     	                     handler : function(){
	     	                      this.hide();
	     	                     }
	     	                   }
	     	                 ],
	 	             bodyContent:'<div style="text-align:center;"><div class="icon-doubt"></div><div class="ui-confirm-message-content" style="color:#656D7A;font-size:15px;height:20px;line-height:20px;margin-bottom:5px;font-weight:bold;">是否确认删除该帐号？</div></div>'
	 	           });
	 	           dialog.show();
	  			 });
		    	//添加类别
				 Event.delegate(document,'click','.add_class',function(ev){ 
				  	pid = DOM.attr(ev.currentTarget,'pid');
				 	if(!catesControl.msg){
		   			   	catesControl.msg = new Overlay.Dialog({
		   			   	    mask:true,
			   			   	buttons:[
			   			   	{
			   			   	text:'确定',
			   			   	elCls : 'bui-button bui-button-primary',
				   			   	handler : function(){
			   			         var sucessHandle = function(o){
			   			        	catesControl.searchCatesTab();
			   			        	DOM.val('#inp_val','请输入类别名称');   
				   			    	}; 
				   			       var errorHandle = function(o){
					        		 new H.widget.msgBox({
						        		 title:"",
						        		 content:o.desc,
						        		 type:"error"
						        		 });
					        		 }; 
			   			   		
			   			   		if(pid == 2){
			   			   		      var cate_name=DOM.val('#inp_val');
				   			   		  ParamsErrorBox = KISSY.one('#J_Suggest_ParamsErrorBox');
						        	    if(cate_name == "" || cate_name == "undefined"||cate_name == "请输入类别名称"){
						    	    		DOM.html('#J_Suggest_ParamsErrorMsg','类别名称不能为空');
						    	    		if (ParamsErrorBox.css("display")==="none") {
						    	    			ParamsErrorBox.slideDown();														
											}
						    	    		S.later(function(){
						    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
											},2000,false);
											return;
										}
		    		   			      var data ='cate_name='+cate_name+'&type='+pid;
		    		   			      new H.widget.asyncRequest().setURI(addCateUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
		    		   			      this.hide();
		    		   			      DOM.hide('#J_LEmpty');
			   			   		  }else if(pid==-2){
			   			   		      var cate_name=DOM.val('#inp_val');
				   			   		  ParamsErrorBox = KISSY.one('#J_Suggest_ParamsErrorBox');
						        	    if(cate_name == "" || cate_name == "undefined"||cate_name == "请输入类别名称"){
						    	    		DOM.html('#J_Suggest_ParamsErrorMsg','类别名称不能为空');
						    	    		if (ParamsErrorBox.css("display")==="none") {
						    	    			ParamsErrorBox.slideDown();														
											}
						    	    		S.later(function(){
						    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
											},2000,false);
											return;
										}
		    		   			      var data ='cate_name='+cate_name+'&type='+pid;
		    		   			      new H.widget.asyncRequest().setURI(addCateUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send();
		    		   			      this.hide();
		    		   			      DOM.hide('#J_LEmpty');
			   			   		    }
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
		   			   	 var str = '<div style="padding:30px 20px;"><ul><li style="margin-bottom:10px;width:100%;float:left;"><span style="float:left;width:65px;height:28px;line-height:28px;">资金流向：</span><div class="miniPop" id="J_income" style="float:left;"><input type="hidden" value="'+pid+'" id="J_CateType"/></div></li><li><span style="float:left;width:65px;height:26px;line-height:26px;">类别名称：</span><input type="text" value="请输入类别名称" name="amount_1" class="input-text-2" id="inp_val"></li>'+
		   			   	   '<li  class="fl"  style="margin-top:5px;width:300px;line-height:0;min-height:0;margin-bottom:0;">'+
					       '<div id="J_Suggest_ParamsErrorBox" style="display: none; width:300px;" class="ui-msg mt15">'+
							'<div class="error-msg"><div class="img-16-1"></div>'+
							'<div id="J_Suggest_ParamsErrorMsg" class="text-16 color-red">内容不能为空</div></div>'+
							'</div>'+
							'<div id="J_Suggest_ParamsSucessBox" style="display: none;width:300px;" class="ui-msg mt15">'+
						     '<div class="success-msg"><div class="img-16-6"></div></div>'+
				           '</li></ul></div>'	;
		   			   	
		      			 catesControl.msg.set('title','添加类别');
		      			 catesControl.msg.set('width',400);
		      			 catesControl.msg.set('bodyContent',str);
		      			 catesControl.msg.render();
		      			 var items =[
	  					  {text:'收入',value:'2'},
	  			   	      {text:'支出',value:'-2'}
	  			   	    ];
	  			   	    catesControl.select123 = new Select.Select({  
	  			   		    render:'#J_income',
	  			   	      	valueField:'#J_CateType',
	  			   	      	items:items
	  			   		});
		      			catesControl.select123.render();
	  			   	    catesControl.msg.show();
		  			   	 Event.on('#inp_val','focus',function(ev){
					    	if(DOM.val('#inp_val')=='请输入类别名称'){
					    		DOM.val('#inp_val','');
					    	} 
					 	 });
					     Event.on('#inp_val','blur',function(ev){
					    	if(DOM.val('#inp_val')==''){
					    		DOM.val('#inp_val','请输入类别名称');
					    	} 
					 	 });
	  			
	 			   	}else{
	 			   		catesControl.msg.show();	
	 			   	} 
				    if(pid == 2){
				    	catesControl.select123.setSelectedValue(2);
				   	}else{
				   		catesControl.select123.setSelectedValue(-2);
				   	}
				 }); 
	  			 
		   	 //修改类别
 		   	  Event.delegate(document,'click','.Jalter',function(ev){
 		   		 var cate_id=DOM.attr(ev.currentTarget,'data-id');
 		   		  DOM.show('#J_InEidtBox'+cate_id);
		   		  DOM.hide('#J_title'+cate_id);
 		   	  });
 		   	 Event.delegate(document,'click','.J_surbt',function(e){
		   			var cate_id=DOM.attr(e.currentTarget,'data-id');
	 		   	    var cate_name=DOM.val('#J_InEidtBox'+cate_id+' .J_Val');
		 		   	var submitHandle = function(o){
			 		   	 DOM.html('#J_title'+cate_id,cate_name);
			 		   	 DOM.hide('#J_InEidtBox'+cate_id);
				   		 DOM.show('#J_title'+cate_id);
		    	    };
	 		   	    var data = "cate_id="+cate_id+"&cate_name="+cate_name;
	 		   	    new H.widget.asyncRequest().setURI(saveCateUrl).setMethod("GET").setHandle(submitHandle).setData(data).send(); 
 		   	 });
 		   	  
 		   	  
 		   	 //删除类别 
 		   	 Event.delegate(document,'click','.del',function(ev){
 		   		 var pid = DOM.attr(ev.currentTarget,'data-id');
 		   		 var type = DOM.attr(ev.currentTarget,'data-type'); 
 		   		 DOM.val('#J_cates',type);
 			     var typeCatesHandle = function(o){
 			    	       var type_id=DOM.val('#J_cates');
	    		   			clssListBox=o.payload;
	    		   			catesControl.msg2 = new Overlay.Dialog({
	 		   			   		mask:true,
	 		   			   		width : 400,
	 		   			   		height : 230,
	 		   			   		closeAction : 'destroy',
	 			   			   	buttons:[
	 			   			   	{
	 			   			   	text:'确认',
	 			   			   	elCls : 'bui-button bui-button-primary',
	 				   			   	handler : function(){
		 				   			    	var sucessHandle = function(o){
		 				   			    		catesControl.searchCatesTab();
		 				   			    	};
		 				   			      var new_id=DOM.val('#J_cate');
		 				   			   	  var data ='&cate_id='+pid+'&new_id='+new_id+'&type='+type;
		 			      	  		      new H.widget.asyncRequest().setURI(delCateUrl).setMethod("GET").setHandle(sucessHandle).setData(data).send();
		 			      	  		      this.hide();
		 			      	  		      this.destroy();
		 			      	  		      catesControl.searchCatesTab();
	 				   			   	}
	 			   			   	},{
	 			   			   	text:'取消',
	 			   			   	elCls : 'bui-button',
	 				   			   	handler : function(){   		   			   		
	 				   			   		this.hide();
	 				   			     	this.destroy();
	 				   			   	}
	 			   			   	}
	 			   			   	]
	 		   			   	}); 
    		 		   		 var str ='<div style="text-align:center;">'+
    			            	 '<div class="x-icon-doubt"></div>'+
    		 	            	' <div class="ui-confirm-message-content" style="color:#656D7A;font-size:15px;height:20px;line-height:20px;margin-bottom:5px;font-weight:bold;">是否确认删除该类别？</div>'+
    		 	            	' <p class="font-size:12px;color:#AAB2BD;">删除类别后，所属该类别的所有明细移至：</p><div class="miniPop" id="J_Classity" style="margin-top:5px;"><input type="hidden" value="" id="J_cate" /></div>'+
    		 	            	'</div>';
			      			 catesControl.msg2.set('bodyContent',str);
			      			 catesControl.msg2.render();
			      			 catesControl.select = new Select.Select({  
					   		    render:'#J_Classity',
					   	      	valueField:'#J_cate',
					   	        items:clssListBox
		 		   			 });
			      			 catesControl.select.render();
		      				 if(type_id == 2){
		      					catesControl.select.setSelectedValue('10');
						   	 }else if(type_id==-2){
						   		catesControl.select.setSelectedValue('20');
						   	 }
		 		   			 catesControl.msg2.show();	
	   			 }; 		
	 		   	 var data ='&type='+type+'&old_id='+pid;	
			     new H.widget.asyncRequest().setURI(getTypeCatesUrl).setMethod("GET").setHandle(typeCatesHandle).setData(data).send();	  
			 }); 	   	  

		},
		
		addNums:function(){
			   var catename=DOM.val('#J_cate_name');
			   var str2 = '<div style="padding:30px 20px;" id="J_addNum_pop">'+
				'<ul><li style="margin-bottom:10px;"><span style="float:left;width:80px;text-align:center;">类别：</span><span>'+catename+'</span></li>'+
				'<li style="margin-bottom:10px;"><span style="float:left;width:65px;">账号类型：</span>'+
				'<input type="hidden" value="bank" id="J_radios_type">'+
			   ' <label class="beautify_radio r_off" for="radio-01" style="display:none;"><input type="radio" name="sample-radio" id="radio-01" value="1" checked="checked" class="J_radio_type" data="aliyun">支付宝id</label>'+
			    '<label class="beautify_radio r_on" for="radio-02"><input type="radio" name="sample-radio" id="radio-02" value="2" data="bank" class="J_radio_type" checked="checked">银行卡账号</label>'+
			    '<label class="beautify_radio r_off" for="radio-03"><input type="radio" name="sample-radio" id="radio-03" value="3" data="person" class="J_radio_type">对象名称</label>'+
			   '</li>'+
		       '<li class="J_bank_account" style="margin-bottom:10px;height:35px;line-height:35px;"><span style="float:left;width:65px;">银行卡号：</span>'+
		       '<input type="text" class="input-text-2" name="name_for_it"  value="输入对方银行卡帐号" id="J_payNum">'+
			  '</li>'+
			 '<li class="J_other_name" style="margin-bottom:10px;display:none;height:35px;line-height:35px;"><span style="float:left;width:65px;">对方名称：</span>'+
		       '<input type="text" class="input-text-2" name="name_for_it"  value="输入对方名称或公司名称" id="J_payName">'+
			  '</li>'+
			  '<li style="width:300px;line-height:0;min-height:0;margin-bottom:0;" class="fl">'+
			  '<div class="ui-msg mt15" style="display: none; width:300px;" id="J_Suggest_ParamsErrorBox"><div class="error-msg">'+
			  '<div class="img-16-1"></div><div class="text-16 color-red" id="J_Suggest_ParamsErrorMsg">内容不能为空</div></div></div>'+
			  '<div class="ui-msg mt15" style="display: none;width:300px;" id="J_Suggest_ParamsSucessBox">'+
			  '<div class="success-msg"><div class="img-16-6"></div></div></div></li></ul></div>';
	  			 catesControl.msg1.set('title','添加账号');
	  			 catesControl.msg1.set('width',400);
	  			 catesControl.msg1.set('bodyContent',str2);
	   			 catesControl.msg1.render();
			   	 catesControl.msg1.show();	    			   	 
			   	 catesControl.Form.renderAllRadio('#J_addNum_pop');
			     Event.on('#J_payNum','focus',function(ev){
			    	if(DOM.val('#J_payNum')=='输入对方银行卡帐号'){
			    		DOM.val('#J_payNum','');
			    	} 
			 	 });
			     Event.on('#J_payNum','blur',function(ev){
			    	if(DOM.val('#J_payNum')==''){
			    		DOM.val('#J_payNum','输入对方银行卡帐号');
			    	} 
			 	 });
			 	 Event.on('#J_payName','focus',function(ev){
			    	if(DOM.val('#J_payName')=='输入对方名称或公司名称'){
			    		DOM.val('#J_payName','');
			    	} 
		   		 });
			 	Event.on('#J_payName','blur',function(ev){
			    	if(DOM.val('#J_payName')==''){
			    		DOM.val('#J_payName','输入对方名称或公司名称');
			    	} 
			 	 });
			   	 Event.on('.J_radio_type','click',function(ev){
			   		 var radio_type=DOM.attr(ev.currentTarget,'data');
			   		 DOM.val('#J_radios_type',radio_type);
			   		 if(radio_type=='bank'){
			   			 DOM.show('.J_bank_account');
			   			 DOM.hide('.J_other_name');
			   		 }else if(radio_type=='person'){
			   			 DOM.hide('.J_bank_account');
			   			 DOM.show('.J_other_name');
			   		 } 
			   	 });
			
		},
		submitNums:function(){
			 var sucessHandle = function(o){
					var account_id = o.payload.items;
			   	    var con='<div style="width: 24%;float:left;padding-left:5px;overflow:hidden;"><span class="mr5" id="">'+account+'</span><a class="delBtn J_delBtn" data="'+account_id+'">删除</a></div>';
			        //类别									
			        var c=DOM.create(con);
		   	        DOM.append(c,'.cate-li'+cate_id);
		   	        DOM.val('#J_payNum','输入对方银行卡帐号');
		   	        DOM.val('#J_payName','输入对方名称或公司名称');
		        	catesControl.searchCatesTab();	
			    	}; 
			       var errorHandle = function(o){
	        		 new H.widget.msgBox({
		        		 title:"",
		        		 content:o.desc,
		        		 type:"error"
		        		 });
	        		 }; 
	        	ParamsErrorBox = KISSY.one('#J_Suggest_ParamsErrorBox');
	        	 if(DOM.val('#J_radios_type')=='bank'){
  			        var account=DOM.val('#J_payNum');
  			        if(!isNaN(account)){
	        	    	}else{
	        	    		DOM.html('#J_Suggest_ParamsErrorMsg','银行账户必须是数字');
		    	    		if (ParamsErrorBox.css("display")==="none"){
		    	    			ParamsErrorBox.slideDown();														
							}
		    	    		S.later(function(){
		    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
							},2000,false);
							return;
	        	    	}
  			    }else if(DOM.val('#J_radios_type')=='person'){
  			        var account=DOM.val('#J_payName');
  			    }
                var account_type=DOM.val('#J_radios');
  			    var types=DOM.val('#J_radios_type');
  			    if(types=='bank'){
		        	    if(account == "" || account == "undefined"){
		    	    		DOM.html('#J_Suggest_ParamsErrorMsg','请填写对方银行账号');
		    	    		if (ParamsErrorBox.css("display")==="none"){
		    	    			ParamsErrorBox.slideDown();														
							}
		    	    		S.later(function(){
		    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
							},2000,false);
							return;
						}   
  			    }else if(types=='person'){
  			    	if(account == "" || account == "undefined"){
		    	    		DOM.html('#J_Suggest_ParamsErrorMsg','请输入对方名称');
		    	    		if (ParamsErrorBox.css("display")==="none") {
		    	    			ParamsErrorBox.slideDown();														
							}
		    	    		S.later(function(){
		    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
							},2000,false);
							return;
						}
  			    }
			   	    var data ='account='+account+'&cate_id='+cate_id+'&account_type='+account_type;
			  	    new H.widget.asyncRequest().setURI(addAccountUrl).setMethod("GET").setHandle(sucessHandle).setErrorHandle(errorHandle).setData(data).send(); 
			  	    
		},
	 
		 searchCatesTab:function(){
            var submitHandle = function(o) {
	            var totalCates=o.payload.totalCates;
	            var totalAccounts=o.payload.totalAccounts;
				catesControl.renderItems(o.payload.body);
				DOM.html('#J_addNums',totalAccounts);
				DOM.html('#J_cateNums',totalCates);
				DOM.hide('#J_LeftLoading');
				DOM.show('#J_MainLeftContent');
    	    };  
    	    DOM.show('#J_LeftLoading');
			DOM.hide('#J_MainLeftContent');
    	    new H.widget.asyncRequest().setURI(loadCatesUrl).setMethod("GET").setHandle(submitHandle).setData(null).send();
		},
		renderItems: function(c) {
    	    DOM.html(DOM.get("#J_CatesItemList"), c);		 	 
		},	
    	handlePagination : function(turnTo) {
	    	pageId = turnTo;
    		var submitHandle = function(o) {
    			totalRecords = o.payload.totalRecords;
 				var pageCount = Math.ceil(totalRecords/o.payload.pageNum); 
 				var totalCates=o.payload.totalCates;
 	            var totalAccounts=o.payload.totalAccounts;
        	    catesControl.renderItems(o.payload.body);
	    	};  
    	    new H.widget.asyncRequest().setURI(loadCatesUrl).setMethod("GET").setHandle(submitHandle).setData(null).send();
		}

	}				
}, 
{
    requires: ['utils/showPages/index','bui/select','utils/beautifyForm/index','bui/overlay','json']
});