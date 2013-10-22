/*
combined files : 

page/templet-init

*/

/**
 * @fileOverview 
 * @author  
 */
KISSY.add('page/templet-init',function (S,Overlay) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return 	templet = {
			panel: null,
			msg : null,
			init: function() {
			
				els = DOM.query('.J_Templet');
			    var liClickFun = function(e){
			    	e.preventDefault();
			    	var tid = DOM.attr(this,"tid");
			    	templet.get(tid);
			    }
			    Event.on(els, "click", liClickFun);
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
												window.open(url, "_blank");
									        }
				    				}
								});
							return 
						}
					}
				})
				Event.on(DOM.query('.J_ReleaseCode'),'click',function(ev){
					var CodeUrl = DOM.attr(ev.currentTarget,"data-url");
					if(!showPermissions('editor_material','促销素材')){
						return ;
						
					}
	                if(isVersionPer('material')){
	                    return ;
	                } 
	                window.location.href = CodeUrl;
				})
				Event.on('#J_HangYe','mouseenter mouseleave',function(ev){
					if(ev.type == 'mouseenter'){
						DOM.show('#J_HangYeContent');
					}else{
						DOM.hide('#J_HangYeContent');
					}
				})
				Event.on('#J_TypeChoose','mouseenter mouseleave',function(ev){
					if(ev.type == 'mouseenter'){
						DOM.show('#J_TypeContent');
					}else{
						DOM.hide('#J_TypeContent');
					}
				})
				Event.on('#J_ColorChoose','mouseenter mouseleave',function(ev){
					if(ev.type == 'mouseenter'){
						DOM.show('#J_ColorContent');
					}else{
						DOM.hide('#J_ColorContent');
					}
				})
				Event.on('#J_SortChoose','mouseenter mouseleave',function(ev){
					if(ev.type == 'mouseenter'){
						DOM.show('#J_SortContent');
					}else{
						DOM.hide('#J_SortContent');
					}
				})
				Event.on('#J_HolidayChoose','mouseenter mouseleave',function(ev){
					if(ev.type == 'mouseenter'){
						DOM.show('#J_HolidayContent');
					}else{
						DOM.hide('#J_HolidayContent');
					}
				})
		    },
		    get: function(tid) {
				if(!showPermissions('editor_material','促销素材')){
				 	return ;
				}else{
					if(isVersionPer('material')){
						return 
					}
				}
		    	if(! templet.panel){
		    		templet.panel = new Overlay.Dialog({
			            title:'获取代码',
			            width:425,
		  	            height:360,
			            mask:false,
			            footerStyle :{'display' : 'none'},
			            bodyContent:''
			          });
		    	}
	        	var submitHandle = function(o) {
	        		templet.panel.set('bodyContent','<div><textarea style="width:380px;height:200px;margin:5px" id="J_Templet_Content" onclick="this.select()">'+o.payload+'</textarea></br><span class="btm-68-gray fl"><button class="btm-small button-green J_Copy">点此复制</button><span style="height:31px; line-height:31px">鼠标于框内CTRL+C：复制、CTRL+V：粘贴</span></div>');
					templet.panel.show();
					templet.clipboard('.J_Copy','#J_Templet_Content')
	        	};
	        	var errorHandle = function(o){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});
	        	};
//	        	templet.msg.setMsg('正在获取代码！').show();
	    	    var data = "tid="+tid;
	        	new H.widget.asyncRequest().setURI(getTempletUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
		    },
		    share : function(materialType, id) {
		    	business = DOM.val(DOM.get('#J_Business_'+id));
		    	type = DOM.val(DOM.get('#J_Type_'+id));
		    	size = DOM.val(DOM.get('#J_Size_'+id));
		    	festival = DOM.val(DOM.get('#J_Festival_'+id));
		    	level = DOM.val(DOM.get('#J_Level_'+id));
		    	var submitHandle = function(o) {
		    		DOM.get("#J_Oper_"+id).innerHTML = '共享成功';
	        	};
	    	    var data = "material_type="+materialType+"&id="+id+"&business="+business+"&type="+type+"&size="+size+"&festival="+festival+"&level="+level;
	        	new H.widget.asyncRequest().setURI(shareTempletUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();	    	
			},
			levelAction : function(materialType, id) {
				var levelNum = DOM.val(DOM.get('#J_Level_'+id));
		    	var submitHandle = function(o) {
					new H.widget.msgBox({
					    title:"成功提示",
					    content:'操作成功',
					    type:"info"
					});
	        	};
	    	    var data = "material_type="+materialType+"&id="+id+"&level="+levelNum;
	        	new H.widget.asyncRequest().setURI(levelTempletUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			design : function(id){
				var tmpId = '';
				var tempItems = DOM.query('.J_Width_'+id);
				for(var i=0,len =tempItems.length;i<len;i++){
					if(DOM.hasClass(tempItems[i],'current')){
						tmpId = DOM.attr(tempItems[i],'data');
						break;
					}
				}
				var uri = designUrl+"&templet_id="+tmpId;
				window.open(uri, "_blank");
			},
			designOld : function(id){
				var tmpId = '';
				var tempItems = DOM.query('.J_Width_'+id);
				for(var i=0,len =tempItems.length;i<len;i++){
					if(DOM.hasClass(tempItems[i],'current')){
						tmpId = DOM.attr(tempItems[i],'data');
						break;
					}
				}
				var uri = designUrl+"&templet_id="+tmpId+"&isOld=1";
				window.open(uri, "_blank");
			},
			turn : function(id, tmpId,num){
				DOM.removeClass(DOM.query('.J_Width_'+id),'current');
				DOM.addClass(DOM.get('#J_ForLabel_'+tmpId),'current');
				var submitHandle = function(o) {
		    		DOM.html("#J_Content_"+id, o.payload);
		    		DOM.html("#J_TempletIdBox"+id, tmpId);
		    		//DOM.html("#J_TempletUseNumBox"+id, num);
	        	};
	    	    var data = "&templet_id="+tmpId;
	    	    //alert(data);
	        	new H.widget.asyncRequest().setURI(getContentUrl).setMethod("GET").setHandle(submitHandle).setData(data).send();
			},
			cancelAssociate : function(tmpId){
				var submitHandle = function(o) {
					new H.widget.msgBox({
					    title:"成功提示",
					    content:'操作成功',
					    type:"info"
					});
		    		window.location.reload();
	        	};
	        	var errorHandle = function(o) {
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});		    		
		    		return;
	        	};
	    	    var data = "templet_id="+tmpId;
	        	new H.widget.asyncRequest().setURI(cancelAssociateUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			associate : function(){
				var submitHandle = function(o) {
					new H.widget.msgBox({
					    title:"成功提示",
					    content:'操作成功',
					    type:"info"
					});
		    		window.location.reload();
	        	};
	        	var errorHandle = function(o) {
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});	
		    		return;
	        	};
	        	
				var ass_ids = '';
				var tempItems = document.getElementsByName('ass_ids[]');
				for(var i=0;i<tempItems.length;i++){
					if(tempItems[i].checked){
						ass_ids = ass_ids+tempItems[i].value+',';
					}
				}
				ass_ids = ass_ids.substr(0,ass_ids.length-1);
	    	    var data = "ass_ids="+ass_ids;
	        	new H.widget.asyncRequest().setURI(associateUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
				
			},
			associateByHand : function(){
				var submitHandle = function(o) {
					new H.widget.msgBox({
					    title:"成功提示",
					    content:'操作成功',
					    type:"info"
					});
		    		window.location.reload();
	        	};
	        	var errorHandle = function(o) {
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});	
		    		return;
	        	};
	        	var ass_ids = DOM.val('#J_AssIds'); 
	        	if(ass_ids.split(',').length<2){
					new H.widget.msgBox({
					    title:"错误提示",
					    content:'请输入至少2个不同规格海报，用,分隔',
					    type:"error"
					});		            	
	            	return;
	        	}
	    	    var data = "ass_ids="+ass_ids;
	        	new H.widget.asyncRequest().setURI(associateUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
				
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
		    		return;
	        	};
	    	    var data = "favorite_id="+favorite_id;
	        	new H.widget.asyncRequest().setURI(cancelCollectUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
				
			},
			setTop : function() {
				var submitHandle = function(o) {
					new H.widget.msgBox({
					    title:"成功提示",
					    content:o.desc,
					    type:"info"
					});	
		    		return;
	        	};
	        	var errorHandle = function(o) {
					new H.widget.msgBox({
					    title:"错误提示",
					    content:o.desc,
					    type:"error"
					});	
		    		return;
	        	};
	    	    var data = "festival="+DOM.val(DOM.get('#J_TopFestival'));
	    	    new H.widget.asyncRequest().setURI(setTopFestivalUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();	    	
			},
			add_ding : function(share_id){
				var submitHandle = function(o) {
		    		DOM.html('#J_Ding_'+share_id, '已赞');
		    		var num = Number(DOM.html('#J_Ding_Number_'+share_id))+1;
		    		DOM.html('#J_Ding_Number_'+share_id, num);
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
	        	new H.widget.asyncRequest().setURI(praiseUrl).setMethod("GET").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			/*复制功能*/
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
			},
			search : function(){
				if(DOM.val(DOM.get("#J_SearchTitle")) != '输入海报编码'){
					var searchName = encodeURIComponent(DOM.val(DOM.get("#J_SearchTitle"))); //标题
		    	}else{
		    	    var searchName ='';
		    	}
				var url = currentUrl+"&searchName="+searchName;
			  	window.location.href=url;
			}
		
	}
}, {
    requires: ['bui/overlay']
});
