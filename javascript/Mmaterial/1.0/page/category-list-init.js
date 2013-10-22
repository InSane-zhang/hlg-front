/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,Overlay) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return list = {

            panel: null,
            msg : null,
            init: function() {
				list.panel = new Overlay.Dialog({
			            title:'获取代码',
			            width:425,
		  	            height:360,
			            mask:false,
			            footerStyle :{'display' : 'none'},
			            bodyContent:''
			          });
                	var els = DOM.query('.J_List');
					Event.on(els,'click',function(e){
						 e.preventDefault();
	                     var lid = DOM.attr(e.currentTarget,"lid");
	                     list.get(lid);
					})
					Event.on(DOM.query('.J_StartDesign'),'click',function(e){
						 e.preventDefault();
						 if(!showPermissions('editor_material','促销素材')){
						 	return ;
						}else{
							 var url = DOM.attr(e.currentTarget,"data-url");
							if(isVersionPer('material',false)){
								new H.widget.msgBox({
									    title:"温馨提示",
									    content:'只提供制作体验，尊享版才能享受素材投放功能',
									    type:"info",
										buttons: [{ value: "继续体验" }, { value: "关闭" }],
										success: function (result) {
										        if (result == "继续体验") {
													window.location.href = url;
										        }
					    				}
									});
								return 
							}
						}
					})
					
					
	        },
                
            get: function(lid) {
                if(!showPermissions('editor_material','促销素材')){return ;}
                if(isVersionPer('material')){
                    return ;
                }
                var submitHandle = function(o) {
                    	list.msg.hide();
                    	var cont = '<div><textarea style="width:380px;height:200px;margin:5px;" id="J_Templet_Content" onclick="this.select()">'+o.payload+'</textarea></br><button class="btm-small button-green J_Copy">点此复制</button><span style="height:31px; line-height:31px">鼠标于框内CTRL+C：复制、CTRL+V：粘贴</span></div>';
                    	list.panel.set('bodyContent',cont);
                    	list.panel.show();
                    	list.clipboard('.J_Copy','#J_Templet_Content');
                };
                list.msg = new H.widget.msgBox({
										dialogType : 'loading',
									    content:'正在获取代码！'	
									});
                var data = "id="+lid;
                new H.widget.asyncRequest().setURI(getListUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
            },
            collect : function(share_id){
                var submitHandle = function(o) {
                    DOM.html('#J_Collect_'+share_id, '<span></span>&nbsp;已收藏')
                };
                var errorHandle = function(o) {
                    new H.widget.msgBox({
								    title:"错误提示",
								    content:o.desc,
								    type:"error"
								});
                    return;
                };
                var data = "share_id="+share_id;
                new H.widget.asyncRequest().setURI(collectUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
                
            },
            cancelCollect : function(favorite_id){
                var submitHandle = function(o) {
                    DOM.remove('#J_Bm_Wrap_'+favorite_id)
                };
                var errorHandle = function(o) {
                   		new H.widget.msgBox({
								    title:"错误提示",
								    content:o.desc,
								    type:"error"
								});
                };
                var data = "favorite_id="+favorite_id;
                new H.widget.asyncRequest().setURI(cancelCollectUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
                
            },
            clipboard: function(el,contain){
				Event.on(el,'click',function(ev){
					var copy = DOM.val(contain);
					if (window.clipboardData){
						 window.clipboardData.clearData();
						 window.clipboardData.setData("Text", copy);
						 new H.widget.msgBox({ 
						 			type: "success", 
						 			content: "已成功复制",
									dialogType:"msg", 
									autoClose:true, 
									timeOut:3000
								});
						
					}else if (window.netscape){
							 try{
									netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
								}catch(e){
									 new H.widget.msgBox({ 
							 			type: "error", 
							 			content: "您的firefox安全限制限制您进行剪贴板操作，请打开'about:config'将signed.applets.codebase_principal_support'设置为true'之后重试，相对路径为firefox根目录/greprefs/all.js",
										dialogType:"msg", 
										autoClose:true, 
										timeOut:3000
									});
									return false;
								}
							//netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
							var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
							if (!clip) return;
							var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
							if (!trans) return;
							trans.addDataFlavor('text/unicode');
							var str = new Object();
							var len = new Object();
							var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
							var copytext=copy;
							str.data=copytext;
							trans.setTransferData("text/unicode",str,copytext.length*2);
							var clipid=Components.interfaces.nsIClipboard;
							if (!clip) return false;
							clip.setData(trans,null,clipid.kGlobalClipboard);
							 new H.widget.msgBox({ 
						 			type: "success", 
						 			content: "已成功复制",
									dialogType:"msg", 
									autoClose:true, 
									timeOut:3000
								});
						}else if(KISSY.UA.core == 'webkit'){
							 new H.widget.msgBox({ 
							 			type: "error", 
							 			content: "该浏览器暂不支持，请用 Ctrl+c 复制",
										dialogType:"msg", 
										autoClose:true, 
										timeOut:3000
									});
						}
					return false;
				})
			}
            
	
	}
}, {
    requires: ['bui/overlay']
});