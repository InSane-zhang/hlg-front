
/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,Overlay,Uploader,DefaultTheme) {
	
	var S= KISSY,DOM = S.DOM, Event = S.Event;
	return orderControl = {
	    	paginator : null,
	    	msg :null,
	    	dialog : null,
	    	isFisrst : true,
	    	init : function() {
		
		
	     //上传组件插件
        var plugins = 'gallery/uploader/1.4/plugins/auth/auth,' +
                'gallery/uploader/1.4/plugins/urlsInput/urlsInput,' +
                'gallery/uploader/1.4/plugins/proBars/proBars';

        S.use(plugins,function(S,Auth,UrlsInput,ProBars){
            var uploader = new Uploader('#J_UploaderBtn',{
                //处理上传的服务器端脚本路径
                action:uploaderFileUrl
            });
            //使用主题
            uploader.theme(new DefaultTheme({
                queueTarget:'#J_UploaderQueue'
            }))
                    //验证插件
            uploader.plug(new Auth({
                        //最多上传个数
                        max:3,
                        //图片最大允许大小
                        maxSize:1048576
                    }))
                     //url保存插件
                    .plug(new UrlsInput({target:'#J_Urls'}))
                    //进度条集合
                    .plug(new ProBars());
            
    		uploader.on("success", function (ev) {
    			
					//window.location.href= curentUrl;
					new H.widget.msgBox({ 
						type: "sucess", 
						content: "上传成功",
						dialogType:"msg", 
						autoClose:true, 
						timeOut:3000
					});
    			
    			
    		})
    		uploader.on("error", function (ev) {
    			//前端验证返回的失败
    			if(ev.status == -1 ){
    				new H.widget.msgBox({
    				    title:"错误提示",
    				    content:ev.msg,
    				    type:"error"
    				});
    			}else{
    				if(!ev.result.error){
    					new H.widget.msgBox({ 
    						type: "sucess", 
    						content: "上传成功",
    						dialogType:"msg", 
    						autoClose:true, 
    						timeOut:3000
    					});
    					window.location.href= curentUrl;
    				}else{
    					new H.widget.msgBox({
    					    title:"错误提示",
    					    content:ev.result.desc,
    					    type:"error"
    					});
    					DOM.hide('#J_UploaderQueue');
    				}
    			}
    		})
        });
		
		
		
		
		
		
		
		
		
		
		
		
		
		
				Event.delegate(document,'click','.J_Delete',function(ev){
					var file_id = DOM.attr(ev.currentTarget,'data');  
	        		if(!orderControl.dialog){
	        			orderControl.dialog = new Overlay.Dialog({
		     	            title:'删除',
		     	            width:220,
		     	            height:160,
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
		     	            
		     	            bodyContent:'确定删除？'
	     	          });
	        	 }
     	         orderControl.dialog.show();
     	         Event.on('.bui-button-primary','click',function(){
 	         	    var submitHandle = function(o){
 						new H.widget.msgBox({ 
					 			type: "sucess", 
					 			content: "删除成功",
								dialogType:"msg", 
								autoClose:true, 
								timeOut:3000
							});
 						window.location.reload();
	         	    };		     	        	 
 	         	    var errorHandle = function(o){
						new H.widget.msgBox({
						    title:"错误提示",
						    content:o.desc,
						    type:"error"
						});
	         	    };
     	        	data = 'file_id='+file_id;
	         	    new H.widget.asyncRequest().setURI(deleteFileUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
     	         })
				});
	        }

}
   
}, {
    requires: ['utils/showPages/index','bui/overlay','gallery/uploader/1.4/index','gallery/uploader/1.4/themes/default/index','gallery/uploader/1.4/themes/default/style.css']
});