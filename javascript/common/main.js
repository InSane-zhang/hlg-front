KISSY.add("common/main",function(S,Switchable){
	
	var DOM = S.DOM ,Event = S.Event,$ = S.Node.all;
	
	return mainControl = {
		
				init : function(){
		
						/*消息公告滚动*/
						var msgNum = DOM.query('#J_NoticeBox li').length;;
						if(msgNum > 1){
							new Switchable.Slide('#J_NoticeBox', {
					            contentCls : 'news-items',
					            hasTriggers : false,
					            effect : 'scrolly',
					            easing : 'easeOutStrong',
					            interval : 5,
					            duration : 0.5
					        });
						}
						/*账号信息*/
						Event.on('#J_MenuMouse','mouseenter mouseleave',function(ev){
							if(ev.type == 'mouseenter'){
								DOM.addClass(ev.currentTarget,'current');
								DOM.width('#J_SubMenu',DOM.width('#J_MenuMouse'));
								DOM.show('#J_SubMenu');
							}else{
								DOM.removeClass(ev.currentTarget,'current');
								DOM.hide('#J_SubMenu');
							}
						})
						/*优惠续费*/
						Event.on('#J_renewal','mouseenter mouseleave',function(ev){
							if(ev.type == 'mouseenter'){
								DOM.addClass(ev.currentTarget,'current');
								DOM.show('#J_renewalMenu');
							}else{
								DOM.removeClass(ev.currentTarget,'current');
								DOM.hide('#J_renewalMenu');
							}
						})
						//获取消息条数
						S.io.get(getMsgUrl,{
							type:"mess"
						},function(o){
							if(o.payload > 0){ 
								DOM.addClass('#J_HasMsgBox','has-msg');
								DOM.html('#J_MsgNum',o.payload);
							}
						},"json");
						
						//左边菜单
						//hover
						var menuItem = DOM.query('#J_menu .J_menuItem');
						S.each(menuItem,function(item){
							Event.on(item,'mouseenter mouseleave',function(ev){
								if(ev.type == 'mouseenter'){
									DOM.addClass(DOM.parent(item),'menu-hover');
								}else if(ev.type == 'mouseleave'){
									DOM.removeClass(DOM.parent(item),'menu-hover');
								}
							}); 
						});
						
						//点击展开效果1
//						var h;		
//						function height(el){
//							var h = 0,display = el.css('display'),position = el.css('position'),visibility = el.css('hidden');
//							if(el.css('display') == 'none'){
//								el.css({'display':'block','position':'absolute','visibility':'hidden'});
//								h = el.height();
//								el.css({'display':'none','position':position,'visibility':visibility});
//							}else{
//								h = el.height();
//							}
//							return h;	
//						};
//						var menuItemHeader = S.all("#J_menu div");
//						menuItemHeader.on('click',function(ev){
//							var menu = S.one(ev.target).next();
//							if(menu){
//								var display = menu.css('display');	
//								if(display == 'none'){
//									h = height(menu);
//									menu.css({height: 0,display: 'block',overflow:'hidden'});
//									menu.animate({'height':h+'px'},1,'elasticOut');
//								}else{
//									h = menu.height();
//									menu.animate('height:0',0.2,S.Easing.easeNone,function(){
//										menu.hide().height(h);
//									});							
//								}
//							};			
//							return false;		
//						});
						
						//点击展开效果2
						var menuItemHeader = S.all("#J_menu div");
						var menuItemContent = S.all("#J_menu ul");
						menuItemHeader.on('click',function(ev){
							var menu = S.one(ev.target).next();
							if(menu){
								var display = menu.css('display');	
								if(display == 'none'){
									menuItemContent.slideUp(0.2);
									menu.slideDown(0.2);
								}else{
									menuItemContent.slideUp(0.2);					
								}
							};			
							return false;		
						});
						//  左边栏
						var menuModuleId =  DOM.val('#J_MenuModuleId');
						DOM.show('#kefu-preview-'+menuModuleId);
//						var menuItemHeader = S.query("#J_menu .J_menuItem");
//						var menuUl = S.query('.menu-item-bd');	
//						Event.on(menuItemHeader,'click',function(ev){
//							var data = DOM.attr(ev.currentTarget,'data');
//							var allGroup = DOM.query('.kefu-preview');
//							DOM.hide(allGroup);
//							DOM.show('#kefu-preview-'+data); 
//							
//						});
						var ItemHeader = S.query("#J_menu .second-title");
						Event.on(ItemHeader,'click',function(ev){
							var data = DOM.attr(ev.currentTarget,'data');
							var allGroup = DOM.query('.kefu-preview');
							DOM.hide(allGroup);
							DOM.show('#kefu-preview-'+data); 
						});
						
						//在线帮助 漂浮块  
					    Event.on('#online_help','mouseenter mouseleave',function(ev){
						 		if(ev.type== "mouseenter"){
						 			DOM.show('#J_help');
						 	 	}else if(ev.type== "mouseleave"){
						 	 		DOM.hide('#J_help');
						 	 	}
						});
						    //反馈建议 漂浮块  
						    Event.on('#J_fkjy','click',function(ev){
						    	if(!window.suggestDialog){
						    		KISSY.use("bui/overlay,editor", function(S, Overlay ,Editor ) {
										window.suggestDialog = new Overlay.Dialog({
														  	            title:'<div style="line-height:50px;font-weight:bold;font-size:14px;">反馈建议</div>',
														  	            width:460,
														  	            height:542,
														  	            mask:false,
														  	            elAttrs :{id : 'J_SuggestDialog'},   
														  	            footerStyle :{'display' : 'none'},
														  	            bodyContent:''
														  	          });
										var cont='<div class=""><form method="post" id="J_SuggestAddForm" action=""><ul><input type="hidden" name="type" value="2" /><input type="hidden" name="source" value="1" />'
												+'<li><div class="align-right fl">类型:</div><div class="fl ml6"><select id="J_Suggest_ProjectType" name="project_type"><option value="1">促销活动</option><option value="2">模板</option><option value="3">会员</option><option value="4">数据</option><option value="5">批量工具</option><option value="6">标题优化</option><option value="7">移动端</option><option value="8">其它</option></select></div></li>'
												+'<li><div class="align-right fl">标题:</div><div class="fl ml6"><input type="text" id="J_Suggest_Title" name="title" value="" class="suggest_input_text"></div></li>'
												+'<li><div class="align-right fl">旺旺:</div><div class="fl ml6"><input type="text" id="J_Suggest_Shopnick" name="shop_nick" value="" class="suggest_input_text"></div></li>'
												+'<li><div id="editorContainer" class="ks-editor"><textarea class="ks-editor-textarea  required-entry"  title="Template Content" id="J_Suggest_Content" name="content"></textarea></div></li>'
												+'<li style="line-height:0;min-height:0;margin-bottom:0;"><div class="ui-msg mt15" style="display: none; width:420px;" id="J_Suggest_ParamsErrorBox"><div class="error-msg"><div class="img-16-1"></div><div class="text-16 color-red" id="J_Suggest_ParamsErrorMsg"></div></div></div><div class="ui-msg mt15" style="display: none;width:420px;" id="J_Suggest_ParamsSucessBox"><div class="success-msg"><div class="img-16-6"></div><div class="text-16" id="J_Suggest_ParamsSucessMsg"></div></div></div></li>'
												+'</ul></form>'
												+'<div class="bui-stdmod-footer"><button class="bui-button bui-button-primary clickable" id="J_SubmitPost" >确定</button><button class="bui-button J_SuggestCancle">关闭</button></div></div>'
										window.suggestDialog.set('bodyContent',cont);	
										window.suggestDialog.render();
										DOM.val('#J_Suggest_Shopnick',DOM.val('#J_ShopNick'));
										 var cfg = {
								    	            // 是否初始聚焦
								    	            focused:false,
								    	            attachForm:true,
								    	            // 自定义样式
								    	            // customStyle:"p{line-height: 1.4;margin: 1.12em 0;padding: 0;}",
								    	            // 自定义外部样式
								    	            // customLink:["http://localhost/customLink.css","http://xx.com/y2.css"],
								    	            // render:"#container",
								    	            srcNode: '#editorContainer',
								    	            width:'100%',
								    	            height:"200px"
								    	        };
								    	        KISSY.use("editor/plugin/smiley/," +
								    	            "editor/plugin/font-size/," +
								    	            "editor/plugin/image/" 
								    	            , function (S, Smiley, FontSize, Image) {

								    	            cfg.plugins = [Smiley, FontSize, new Image({
								    	                upload:{
								    	                    serverUrl:uploadImgURL,
								    	                    serverParams:{
								    	                        waterMark:function () {
								    	                            return S.one("#ke_img_up_watermark_1")[0].checked;
								    	                        }
								    	                    },
								    	                    suffix:"png,jpg,jpeg,gif",
								    	                    fileInput:"Filedata",
								    	                    sizeLimit:1000, //k
								    	                    extraHtml:"<p style='margin-top:10px;'><input type='checkbox' id='ke_img_up_watermark_1' checked='checked'> 图片加水印，防止别人盗用</p>"
								    	                }
								    	            })];
								    	            window.suggestEditor = new Editor(cfg).render();
								    	        });
								    	        window.suggestDialog.show();
								    	    });
						    			
						    	}else{
									window.suggestDialog.show();
									DOM.val('#J_Suggest_Title','');
									var html ="";
									window.suggestEditor.set('data',html);
									DOM.addClass("#J_SubmitPost","clickable");
								}
								Event.remove('#J_SubmitPost');
								var timeFunName = null;
								 Event.delegate(document,'click dblclick','#J_SubmitPost',function(ev){
									if(ev.type == 'click'){
										clearTimeout(timeFunName);
										timeFunName = setTimeout(function () {
											window.suggestEditor.sync();
											ParamsErrorBox = KISSY.one('#J_Suggest_ParamsErrorBox');
							    	    	var title = DOM.val('#J_Suggest_Title');
							    	    	
							    	    	var shop_nick = DOM.val('#J_Suggest_Shopnick');
							    	    	var content = DOM.val('#J_Suggest_Content');
							    	    	if(title == "" || title == "undefined"){
							    	    		DOM.html('#J_Suggest_ParamsErrorMsg','标题不能为空');
							    	    		if (ParamsErrorBox.css("display")==="none") {
							    	    			ParamsErrorBox.slideDown();														
												}
							    	    		S.later(function(){
							    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
												},2000,false);
												return;
											}
							    	    	if(shop_nick == "" || shop_nick == "undefined"){
							    	    		DOM.html('#J_Suggest_ParamsErrorMsg','旺旺不能为空');
							    	    		if (ParamsErrorBox.css("display")==="none") {
													ParamsErrorBox.slideDown();														
												}
							    	    		S.later(function(){
							    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
												},2000,false);
												return;
											}
							    	    	if(content == "" || content == "undefined"){
							    	    		DOM.html('#J_Suggest_ParamsErrorMsg','内容不能为空');
							    	    		if (ParamsErrorBox.css("display")==="none") {
													ParamsErrorBox.slideDown();														
												}	
							    	    		S.later(function(){
							    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
												},2000,false);
												return;
											}
							    	    	if(DOM.hasClass("#J_SubmitPost","clickable")){
												var submitHandle = function(o) {
													ParamsSucessBox = KISSY.one('#J_Suggest_ParamsSucessBox');
													DOM.html('#J_Suggest_ParamsSucessMsg','提交成功！');
													if (ParamsSucessBox.css("display")==="none") {
														ParamsSucessBox.slideDown();														
													}	
													S.later(function(){
														DOM.hide('#J_Suggest_ParamsSucessBox');
														window.suggestDialog.hide();
													},1000,false);
													DOM.removeClass("#J_SubmitPost","clickable");
									    	    };
									    	    var errorHandle = function(o){	
									    	    };
									    	    var data ='';
												new H.widget.asyncRequest().setURI(suggestUrl).setMethod("POST").setForm('#J_SuggestAddForm').setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
							    	    	}
								    	    
										},300);
									} 
									if(ev.type == 'dblclick'){
										clearTimeout(timeFunName); 
										//console.log('双击');
										window.suggestEditor.sync();
										ParamsErrorBox = KISSY.one('#J_Suggest_ParamsErrorBox');
						    	    	var title =encodeURIComponent(DOM.val('#J_Suggest_Title'));
						    	    	
						    	    	var shop_nick = DOM.val('#J_Suggest_Shopnick');
						    	    	var content = DOM.val('#J_Suggest_Content');
						    	    	if(title == "" || title == "undefined"){
						    	    		DOM.html('#J_Suggest_ParamsErrorMsg','标题不能为空');
						    	    		if (ParamsErrorBox.css("display")==="none") {
						    	    			ParamsErrorBox.slideDown();														
											}
						    	    		S.later(function(){
						    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
											},2000,false);
											return;
										}
						    	    	if(shop_nick == "" || shop_nick == "undefined"){
						    	    		DOM.html('#J_Suggest_ParamsErrorMsg','旺旺不能为空');
						    	    		if (ParamsErrorBox.css("display")==="none") {
												ParamsErrorBox.slideDown();														
											}
						    	    		S.later(function(){
						    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
											},2000,false);
											return;
										}
						    	    	if(content == "" || content == "undefined"){
						    	    		DOM.html('#J_Suggest_ParamsErrorMsg','内容不能为空');
						    	    		if (ParamsErrorBox.css("display")==="none") {
												ParamsErrorBox.slideDown();														
											}	
						    	    		S.later(function(){
						    	    			DOM.hide('#J_Suggest_ParamsErrorBox');
											},2000,false);
											return;
										}
						    	    	if(DOM.hasClass("#J_SubmitPost","clickable")){
											var submitHandle = function(o) {
												ParamsSucessBox = KISSY.one('#J_Suggest_ParamsSucessBox');
												DOM.html('#J_Suggest_ParamsSucessMsg','提交成功！');
												if (ParamsSucessBox.css("display")==="none") {
													ParamsSucessBox.slideDown();														
												}	
												S.later(function(){
													DOM.hide('#J_Suggest_ParamsSucessBox');
													window.suggestDialog.hide();
												},1000,false);
												DOM.removeClass("#J_SubmitPost","clickable");
								    	    };
								    	    var errorHandle = function(o){	
								    	    };
								    	    var data ='';
											new H.widget.asyncRequest().setURI(suggestUrl).setMethod("POST").setForm('#J_SuggestAddForm').setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
						    	    	}
										
									}
								});
								Event.delegate(document,'click','.J_SuggestCancle',function(ev){		
									window.suggestDialog.hide();
								});
										
						    })
				}
		}
			
}, {
    requires: ['switchable']
})
	
