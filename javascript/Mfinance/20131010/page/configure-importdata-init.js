/*
combined files : 

page/configure-importdata-init

*/
/**
 * @fileOverview 
 * @author  
 */
KISSY.add('page/configure-importdata-init',function (S,Tooltip,Overlay) {
	var DOM = S.DOM, Event = S.Event;	
	return importdataControl = {
				msg : null,
				msg1 : null,
				dialog:null,
				flag:true,
				init : function(){
		        //input效果
				 Event.on('#J_userAccouts','focus',function(ev){
		 	    	if(DOM.val('#J_userAccouts')=='请输入您的支付宝账号名称'){
		 	    		DOM.val('#J_userAccouts','');
		 	    	 } 
		 	 	  });
			      Event.on('#J_userAccouts','blur',function(ev){
			    	if(DOM.val('#J_userAccouts')==''){
			    		DOM.val('#J_userAccouts','请输入您的支付宝账号名称');
			    	} 
			 	  }); 
               //导入数据并授权
				 Event.on('#J_inportData','click',function(){
					var account=DOM.val('#J_userAccouts');
					DOM.val('#J_account',account);
					var submitHandle = function(o) {
		        		var status=o.payload;
						DOM.val('#J_status',status);
						if(status==''){
							var account=DOM.val('#J_userAccouts');
							importdataControl.checkEMail(account);
						}else{
							importdataControl.showPop();
							//在新窗口打开
//							window.open(status);
						}
	        	    };
					var data ='&account='+account;
	                new H.widget.asyncRequest().setURI(educeStartUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
				});       
			},
			
			checkEMail:function(account){
				var reg=/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)|(^1[0-9]{10}$)/ ;
				if(!reg.test(account))
				{
				   new H.widget.msgBox({
	        		 title:"",
	        		 content:"支付帐号格式不正确",
	        		 type:"error"
	        		});	
				   return false;
				}
				if(account=='请输入您的支付宝账号名称')
				{
				   new H.widget.msgBox({
	        		 title:"",
	        		 content:"支付帐号名称不能为空",
	        		 type:"error"
	        		});	
				   return false;
				}else{
					importdataControl.showPop();
				}
			},
	
    		//弹出授权窗口	
			showPop:function(){
				var account=DOM.val('#J_account');
				if(!importdataControl.dialog){
	     			importdataControl.dialog = new Overlay.Dialog({
		     	            width:380,
			 	            height:210,
		     	            mask:true,
		     	            buttons:[
			     	                   {
			     	                	 text:'完成授权',
			     	                     elCls : 'bui-button bui-button-primary',
			     	                     handler : function(){
			     	                	  var account=DOM.val('#J_account');
			     	                	  var submitHandle = function(o){
			     	                		 var status=o.payload;
			     	                		 if(status==''){
			     	                			new H.widget.msgBox({ 
			  							 			type: "sucess", 
			  							 			content: "授权成功",
			  										dialogType:"msg", 
			  										autoClose:true, 
			  										timeOut:3000
			  									});
			     	                			importdataControl.importData();
			     	                            
			     	                		}else{
			     	                			new H.widget.msgBox({ 
			  							 			type: "error", 
			  							 			content: "授权失败",
			  										dialogType:"msg", 
			  										autoClose:true, 
			  										timeOut:3000
			  									});     	        	 
			     	                		 }
			     	                		 };
			     	                		this.hide();
			     	                		var data ='&account='+account;
			     	                        new H.widget.asyncRequest().setURI(educeStartUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			     	                     }
			     	                   },{
			     	                	 text:'取消',
			     	                     elCls : 'bui-button',
			     	                     handler : function(){
			     	                       this.hide();
			     	                     }
			     	                   }
		     	                 ],
	     			 });
	     			var address=DOM.val('#J_status');
	     			var str='<div style="text-align:center;"><div class="ui-confirm-message-content" style="color:#656D7A;font-size:15px;height:20px;line-height:20px;margin-bottom:5px;font-weight:bold;">请到新打开页的授权页面完成支付宝授权</div><p>支付宝帐号：'+account+'<a href="'+address+'">去授权</a></p></div>'
	     			importdataControl.dialog.set('bodyContent',str);
	     			importdataControl.dialog.render();
	     			importdataControl.dialog.show();	
			       }
				
			},
			//时时获取导入数据的值
    		importData : function(){   	   
					var process=S.later(function(){
						var submitHandle = function(o){
	                    	var status=o.payload;
	                    	DOM.val('#J_importVal',status);
	                    	var status=DOM.val('#J_importVal');
		                	if(status== 100 ){
		                		process.cancel();
		                		importdataControl.msg1.hide();
				        		new H.widget.msgBox({ 
						 			type: "sucess", 
						 			content: "数据导入成功",
									dialogType:"msg", 
									autoClose:true, 
									timeOut:5000
								});	
		                		importdataControl.getStatusProgress();
		            	       }else{
		            	    	   if(!importdataControl.msg1){
		            	    	    importdataControl.msg1 = new H.widget.msgBox({
		       						dialogType : 'loading',
		       					    content:'正在为您加载支付宝数据到财务管理，请耐心等待...'	
		       	        	       });
		            	          } 
		            	       }
	            	    };  
	            	    new H.widget.asyncRequest().setURI(rateUrl).setMethod("GET").setHandle(submitHandle).setData(null).send(); 
     				}, 1000, true);     
    			},		
 
    			  //获取数据导入成功状态
  			   getStatusProgress : function() {
					DOM.hide('.J_stepOne');
	                DOM.show('.J_costSet');
                  var submitHandle = function(o) {
  	        	    totalRecords = o.payload.totalRecords;
  	        	    var already=o.payload.already;
  	        	    var all=o.payload.all;
  	        	    var less=all-already;
  	        	    if(all==already){
  	        		 DOM.show('.J_setSuccess');
  	        		 DOM.hide('.J_baobeiSet');
  	        	    }
  	        	    DOM.removeClass('.J_step1','current');
  	        	    DOM.addClass('.J_step2','current');
  	        	    DOM.html('.J_already',already);
  	        	    DOM.html('.J_all',all);
  	        	    var percent=((already/all)*100).toFixed(2)+"%";
  	        	    DOM.css('#J_ui-progress1', "width",percent);
  	        	    DOM.html('.J_less',less);

          	    };
          	    new H.widget.asyncRequest().setURI(getCostsSetUrl).setMethod("GET").setHandle(submitHandle).setData(null).send();
  			}


      
                
                
		}
}, {
	requires: ['bui/tooltip','bui/overlay']
});      
