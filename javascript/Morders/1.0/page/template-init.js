/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,O,RenderUploader,beautifyForm,Overlay,Select) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return templateControl = {
	    	paginator : null,
			handlePagination :null,
	    	isFisrst : true,
	    	panel2 : null,
	    	init : function() {
				templateControl.Form = new beautifyForm();
				templateControl.changeTemplate('顺丰速运');
				templateControl.searchTbItems();
				templateControl.Form.renderAll('#J_toggleCheck');
				
				Event.remove('#J_Save')
				Event.on('#J_Save','click',function(){
					DOM.remove('.dragresize ')
					templateControl.templateSave();
				})	
				Event.on('#J_DeleteTemplate','click',function(){
					templateControl.deleteTemplate();
				})	
				Event.on('#J_ResetTemplate','click',function(){
					templateControl.resetTemplate();
				})	
				
				//增加自定义项-快递单
				Event.remove('#J_NewAdd')
				Event.on('#J_NewAdd','click',function(){
					var customText = DOM.val('#J_CustomText')
					var text = DOM.create('<div class="drsElement drsMoveHandle J_NewAddText" style="left:200px; top:400px; width: 142px; height: 20px;z-index:8;position: absolute;">'+customText+'<a class="J_NewAddDelete delete" href="javascript:void(0)">X</a></div>')
					DOM.insertBefore(text,'#J_SenderName');
				})		
				Event.on('#J_NewImg','click',function(){
					templateControl.newCostomImg();
				})				
				Event.delegate(document,'click','#J_SaveBill',function(){
					templateControl.templateBillSave()
				})					
				Event.on('#J_NewTemplate','click',function(){
					templateControl.newTemplate();
				})		
				//增加自定义项-发货单
				Event.delegate(document,'click','#J_NewShipAdd',function(){
					templateControl.newShipCustom();
				})	
				// 编辑input
				Event.delegate(document,'click','.J_EditTiger',function(ev){
					var p =DOM.parent(ev.currentTarget);
					DOM.addClass(p,'hover');
					DOM.get('input',p).focus();
				})
				// 失去焦点
				Event.delegate(document,'focusout','.J_textSize',function(ev){
					KISSY.later(function(){
						DOM.removeClass('#J_textSizeBox','hover');
			 		},200,false,null);
				})
				// 字体大小设置
				Event.delegate(document,'click','.J_textSizeSubmit',function(ev){
					var title = DOM.val('#J_textSize_1');
					var otitle = DOM.val('#J_textSize1');
					if(otitle == title){
						return ;
					}else{
						DOM.style('.J_NewAddText','font-size',title);
						DOM.style('.J_NewAddText','line-height',title);
						DOM.val('#J_textSize1',title);
						DOM.html(DOM.get("#J_textSizeBox .J_Name"),title);
					}
				});
				
				Event.on('#J_TemplteBtm','click',function(){
					templateControl.newTemplate();
					DOM.val('#J_ExpressName',DOM.val('#J_Express'))
					DOM.val('#J_Uploader',DOM.attr('#J_ExpressImg','src'))
				})	
				Event.delegate(document,'click','#J_Skewing',function(ev){
					if(DOM.hasClass(ev.target,'J_left')){
						DOM.val('#J_Around',(DOM.val('#J_Around')-1))
					}else if(DOM.hasClass(ev.target,'J_Right')){
						DOM.val('#J_Around',(Number(DOM.val('#J_Around'))+1))
					}else if(DOM.hasClass(ev.target,'J_Top')){
						DOM.val('#J_Middle',(DOM.val('#J_Middle')-1))
					}else if(DOM.hasClass(ev.target,'J_Bottom')){
						DOM.val('#J_Middle',(Number(DOM.val('#J_Middle'))+1))
					}
				})	
				Event.on('#J_Test','click',function(){
					var left = DOM.val('#J_Around');
					var top = DOM.val('#J_Middle');
					var body = DOM.html('#J_Template')
					templateControl.CreateOneFormPage(body,left,top);
					LODOP.PRINT_DESIGN();
				})	
				Event.delegate(document,'click','#J_ShipTest',function(){
					var left = DOM.val('#J_Around');
					var top = DOM.val('#J_Middle');					
					var body = DOM.html('#J_Template');
					templateControl.CreateOneFormPage(body,left,top);
					LODOP.PRINT_DESIGN();
				})		
				Event.on('.J_toggle','click',function(ev){
					var value = DOM.val(ev.currentTarget)
					DOM.toggle('#'+value)
				})
				Event.delegate(document,'click','.delete',function(ev){
				    var name = DOM.attr(ev.currentTarget,'name');
					var data = DOM.attr(ev.currentTarget,'data');
					DOM.hide('#'+name);
					DOM.attr('#J_toggle_'+data,'checked',false)
				})	
				Event.on('.printFile','click',function(ev){
					if(DOM.attr(ev.currentTarget,'data') == 0){
						DOM.hide('.express-seting');
						DOM.show('.new-search');
						window.location.reload();
					}else{
						DOM.hide('.new-search');
						DOM.hide('.express-set');
						DOM.show('.express-seting');
					}
					if(DOM.hasClass(ev.currentTarget,'current')){
						
					}else{
						DOM.removeClass(DOM.query('.printFile'),'current')
						DOM.addClass(ev.currentTarget,'current');
					}
				})
				Event.delegate(document,'click','.J_NewAddDelete',function(ev){
					DOM.remove(DOM.parent(ev.currentTarget))
				})
	        },
	        CreateOneFormPage : function(desc,left,top){
	        	LODOP=getLodop(document.getElementById('LODOP_OB'),document.getElementById('LODOP_EM'));  
        		LODOP.PRINT_INIT("");
        		LODOP.SET_PRINT_STYLE("FontSize",16);
        		LODOP.SET_PRINT_STYLE("Bold",1);
        		LODOP.SET_PRINT_STYLEA(0,"HtmWaitMilSecs",1000); 
        		LODOP.SET_PRINT_PAGESIZE(1,10800,20000,12);
        		LODOP.ADD_PRINT_HTM(top,left,'100%','100%',''+desc);
	        },	
	       
	        deleteTemplate : function(){
  				var submitHandle = function(o) {
  					new H.widget.msgBox({
					    title:"成功提示",
					    content:'成功删除',
					    type:"error"
					});
  					KISSY.later(function(){
  						window.location.reload();
  					},1500)
  					
  				};
				var errorHandle = function(o){

				};	
				var templateName = DOM.val('#J_Express');
				var data = "templateName="+templateName;
				new H.widget.asyncRequest().setURI(loadDeleteTemplateUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
	        },
	        resetTemplate : function(){
  				var submitHandle = function(o) {
  					DOM.html('#J_Template',o.payload.body)
					new H.widget.msgBox({ 
			 			type: "sucess", 
			 			content: "重置成功",
						dialogType:"msg", 
						autoClose:true, 
						timeOut:3000
					});  					
  				};
				var errorHandle = function(o){

				};	
				var templateName = DOM.val('#J_Express');
				var reset = 1;
				var data = "templateName="+templateName+"&reset="+reset;
				new H.widget.asyncRequest().setURI(loadChangeUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
	        },	   
	        resetShipTemplate : function(){
  				var submitHandle = function(o) {
  					DOM.html('.template-content',o.payload.body)
					new H.widget.msgBox({ 
			 			type: "sucess", 
			 			content: "重置成功",
						dialogType:"msg", 
						autoClose:true, 
						timeOut:3000
					});  					
  				};
				var errorHandle = function(o){
					new H.widget.msgBox({ 
			 			type: "sucess", 
			 			content: o.desc,
						dialogType:"msg", 
						autoClose:true, 
						timeOut:3000
					});  
				};	
				var templateName = 'hlgShip';
				var reset = 1;
				var data = "templateName="+templateName+"&reset="+reset;
				new H.widget.asyncRequest().setURI(loadShipUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
	        },	
	        newShipCustom : function(){
				if(!templateControl.panel2){
  					templateControl.panel2 = new Overlay.Dialog({
					      width: 450,
					      headerContent: '自定义',
					      bodyContent:'123',
					      mask: true,
					      align: {
					          points: ['cc', 'cc']
					      },
					      closable :true,
					      draggable: true,
					      aria:true
  				 	});
				}
				var cont = '<div style="width:320px;margin:30px auto;"><ul style="overflow:hidden;"><li class="min-height-30 fl">'
	        		+'<div class="w-80 align-right fl">自定义内容:</div>'
	        		+'<div class="fl ml6 input-text"><input type="text" id="J_CustomText" class="w-200 input-none" value="" ></div></li>'
	        		+'</ul><div style="width:160px;margin:15px auto 0 auto;overflow:hidden;"><input class="btm-68-orange fl J_SaveText" type="button" name="确定" value="确定"><input class="btm-68-gray fl cancle" type="button" name="取消" value="取消"></div></div>';
				templateControl.panel2.set('bodyContent',cont);
			 	templateControl.panel2.show();
			 	Event.remove('.J_SaveText')
				Event.on('.J_SaveText','click',function(){
				 	var customText = DOM.val('#J_CustomText')
					var text = DOM.create('<tr><td class="J_NewAddText" style="border:1px solid #999;padding-left: 25px;line-height:25px;border-collapse: collapse;border-top:0;">'+customText+'</td></tr>')
					DOM.insertAfter(text,'#J_Last');
				 	templateControl.panel2.hide();
					Event.on('.J_NewAddDelete','click',function(ev){
						DOM.remove(DOM.parent(ev.currentTarget))
					})
				})
				Event.on('.cancle','click',function(ev){
					templateControl.panel2.hide();
				})				
	        },	        
	        searchTbItems : function(){
  				var submitHandle = function(o) {
  					DOM.html('#Express',o.payload.body)
  					/*ExpressSelect = new Select.Select({  
  						render:'#Express',
  						valueField:'#J_Express',
  						items:o.payload.body
  					});
  					ExpressSelect.render();
  					ExpressSelect.on('change', function(ev){
  						templateControl.changeTemplate(this.value);
  					});*/
				};
				var errorHandle = function(o){

				};	 
				var data = "listCompanies="+1;
				new H.widget.asyncRequest().setURI(loadCompaniesUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
	        },	        
	        newTemplate :function(value){  
				if(!templateControl.panel){
  					templateControl.panel = new Overlay.Dialog({
					      width: 450,
					      title: '新建模板',
					      bodyContent:'',
					      mask: true,
					      align: {
					          points: ['cc', 'cc']
					      },
					      buttons:[
							{
								text:'确定',
								elCls : 'bui-button bui-button-primary',
								handler : function(){
									if(DOM.val('#J_ExpressName') == ''){
										DOM.show('#J_PromoNameError');
									}else if(DOM.val('#J_Uploader') == ''){
										DOM.hide('#J_PromoNameError');
										DOM.show('#J_PromoImgError');
									}else{
										DOM.hide('#J_PromoNameError');
										DOM.hide('#J_PromoImgError');
										var el = DOM.create('<option  value="">'+DOM.val('#J_ExpressName')+'</option>');
										DOM.prepend(el,'#J_Express');
										DOM.attr('#J_ExpressImg','src',DOM.val('#J_Uploader'));
										DOM.val(DOM.query('option')[0],DOM.val('#J_ExpressName'));
										DOM.val('#J_SortContent',DOM.val('#J_Sort'))
										this.hide();
									}
									
						  		}
							},{
						    	text:'关闭',
						    	elCls : 'bui-button cancle',
						    	handler : function(){
						     		this.hide();
						   		}
							}
						  ],
					      closable :true,
					      draggable: true,
					      aria:true
  				 	});
				}
				var cont = '<div><ul class="ui-about-list"><li>'
        		+'<div class="ui-side-list w-70">名称:</div>'
        		+'<div class="ui-content-list"><input type="text" id="J_ExpressName" class="w-200 input-text-2" value="" ></div><span style="padding-left:20px;color:#ff0000;display:none;" class="error-img w-160" id="J_PromoNameError">名称不能为空！</span></li>'
        		+'<li class="">'
        		+'<div class="ui-side-list w-70">所属类别:</div>'
        		+'<div class="ui-content-list"><select id="J_Sort">'
        		+'<option>自定义</option>'
			    +'<option   value="EMS" >EMS</option>'
				+'<option   value="韵达快运" >韵达快运</option>'
				+'<option   value="顺丰速运" >顺丰速运</option>'
				+'<option   value="汇通快运" >汇通快运</option>'
				+'<option   value="第一物流" >第一物流</option>'
				+'<option   value="中通速递" >中通速递</option>'
				+'<option   value="联邦" >联邦</option>'
				+'<option   value="圆通速递" >圆通速递</option>'
				+'<option   value="宅急送" >宅急送</option>'
				+'<option   value="申通E物流" >申通E物流</option>'
				+'<option   value="德邦物流" >德邦物流</option>'					
				+'<option   value="全一快递" >全一快递</option>'
				+'<option   value="大淘宝" >大淘宝</option>'
                +'<option   value="中国邮政-平邮" >中国邮政-平邮</option>'
				+'<option   value="大田物流" >大田物流</option>'
				+'<option   value="一邦速递" >一邦速递</option>'
				+'<option   value="天天快递" >天天快递</option>'
				+'<option   value="一统" >一统</option>'
				+'<option   value="亚风" >亚风</option>'
				+'<option   value="杭州ABC" >杭州ABC</option>'
				+'<option   value="hh" >hh</option>'
				+'<option   value="e邮宝" >e邮宝</option>'
				+'<option   value="wlhtest01" >wlhtest01</option>'
				+'<option   value="信丰物流" >信丰物流</option>'
				+'<option   value="HLX11" >HLX11</option>'
				+'<option   value="优速物流" >优速物流</option>'
				+'<option   value="上海仓储" >上海仓储</option>'
				+'<option   value="星晨急便" >星晨急便</option>'
				+'<option   value="wlhtest001" >wlhtest001</option>'
				+'<option   value="佳吉快运" >佳吉快运</option>'
				+'<option   value="NO_COD" >NO_COD</option>'
				+'<option   value="邮政国内小包" >邮政国内小包</option>'
				+'<option   value="百世物流科技" >百世物流科技</option>'
				+'<option   value="NORA051102" >NORA051102</option>'
                +'<option   value="啊里味儿"  >啊里味儿</option>'
                +'<option   value="nora03" >nora03</option>'
                +'<option   value="CCES" >CCES</option>'
                +'<option   value="DXX" >DXX</option>'
        		+'</select></div></li>'
        		+' <li">'
        		+'<div class="ui-side-list w-70">快递图片:</div>'
        		+'<div class="ui-content-list"><input type="text" class="w-160 input-text-2" value=""  id="J_Uploader" style="width:160px;margin-top:0;"></div>&nbsp;&nbsp;<a id="J_UploaderBtn" class="uploader-button" href="#2" style="display:inline-block;width:40px;">浏览</a><ul id="J_UploaderQueue" style="width:300px;margin:10px 0 10px 68px;"></ul><span style="padding-left:20px;color:#ff0000;display:none;" class="error-img w-160" id="J_PromoImgError">请上传快递图片！</span></li>'
        		+'<li>'
        		+'<div class="ui-side-list w-70 ">尺寸:</div>'
        		+'<div class="ui-content-list">宽<input type="text" class="w-60 input-text-2" value="230" style="margin:0 10px;">毫米&nbsp;&nbsp;&nbsp;宽<input type="text" class="w-60 input-text-2" value="126" style="margin:0 10px;">毫米</div></li>'
        		+'</ul>';
				templateControl.panel.set('bodyContent',cont);
			 	templateControl.panel.show();
				
								
			     //第一个参数：按钮元素钩子，第二个参数：队列元素钩子
			    var ru = new RenderUploader('#J_UploaderBtn', '#J_UploaderQueue',{
			    	//验证配置
			    	type : "auto",
			    	authConfig: {
			    	    allowExts:[
			    	        {desc:"支持的图片格式", ext:"*.gif;*.jpg;*.png"},
			    	        '目前只支持 .gif .jpg .png 格式的图片'
			    	    ],
			    	    max:[5, '每次最多上传{max}个文件！'],
			    	    maxSize:[2000, "文件大小为{size}，文件太大！"],
			    	    allowRepeat:[false, '该文件已经存在！']
			    	},
			        //服务器端配置
			        serverConfig:{
			            //处理上传的服务器端脚本路径 
			            "action":loadUploadimgUrl,"data":{"dir":"files/"},"dataType" : "json"
			        },
			        // 文件域
			        name:"Filedata",
			        //用于放服务器端返回的url的隐藏域
			        urlsInputName:"fileUrls",
			        autoUpload : true
			    });
			    ru.on("init", function (ev) {
			        var uploader = ev.uploader;
			        var auth = ev.auth;
			        var queue = ev.queue;
			        DOM.val('#J_Uploader',ev.desc);
			        uploader.on("success", function (ev) {
						DOM.val('#J_Uploader',ev.result.desc);
					})
					uploader.on("error", function (ev) {
						DOM.val('#J_Uploader',ev.result.desc);
					 })
				 })
	        },	             
	        templateSave : function(){
  				var submitHandle = function(o) {
  					new H.widget.msgBox({
					    title:"成功提示",
					    content:'保存成功',
					    type:"error"
					});
					
				};
				var errorHandle = function(o){
					new H.widget.msgBox({
							    title:"错误提示",
							    content:o.desc,
							    type:"error"
							});
				};	 
				DOM.remove('#Middle');
				DOM.remove('#Around');	
				DOM.remove('#ImgSrc');
				DOM.remove('#Template');
				DOM.remove('#ExpressHeight');
				DOM.remove('#ExpressWidth');
				var templateContent = KISSY.trim(DOM.html('#J_Template'));
				var userDefined = DOM.val('#J_Express');
				var isDefault = 0;
				var leftValue = DOM.val('#J_Around');
				var rightValue = DOM.val('#J_Middle');
				var imgDir = DOM.attr('#J_ExpressImg','src');
				var expressWidth = DOM.val('#J_ExpressWidth');
				var expressHeight = DOM.val('#J_ExpressHeight');
				var logisticCompany = DOM.val('#J_SortContent');
				var data = "templateContent="+templateContent+"&logisticCompany="+userDefined+"&isDefault="+isDefault+"&leftValue="+leftValue+"&rightValue="+rightValue+"&imgDir="+imgDir+"&expressWidth="+expressWidth+"&expressHeight="+expressHeight+"&userDefined="+logisticCompany;
				new H.widget.asyncRequest().setURI(loadChangeUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
	        },
	        templateBillSave : function(){
  				var submitHandle = function(o) {
					new H.widget.msgBox({
					    title:"成功提示",
					    content:'保存成功',
					    type:"error"
					});
				};
				var errorHandle = function(o){
					new H.widget.msgBox({
							    title:"错误提示",
							    content:o.desc,
							    type:"error"
							});
				};	 
				DOM.remove('#Middle');
				DOM.remove('#Around');	
				DOM.remove('#ImgSrc');
				DOM.remove('#Template');
				DOM.remove('#ExpressHeight');
				DOM.remove('#ExpressWidth');
				var leftValue = DOM.val('#J_Around');
				var rightValue = DOM.val('#J_Middle');
				var expressWidth = DOM.val('#J_ExpressWidth');
				var expressHeight = DOM.val('#J_ExpressHeight');
				var shipContent = KISSY.trim(DOM.html('#J_Template'));
				var data = "shipContent="+shipContent+"&leftValue="+leftValue+"&rightValue="+rightValue+"&expressWidth="+expressWidth+"&expressHeight="+expressHeight;			
				new H.widget.asyncRequest().setURI(loadShipUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
	        },	        
	        changeTemplate : function(templateName) {
  				var submitHandle = function(o) {
  					DOM.html(DOM.get("#J_Template"), o.payload.body);
  					DOM.attr('#J_ExpressImg','src',DOM.val('#ImgSrc'))
  					if(!DOM.val('#Around') == ''){
  						DOM.val('#J_Around',DOM.val('#Around'))
  					}
  					if(!DOM.val('#Middle') == ''){
  						DOM.val('#J_Middle',DOM.val('#Middle'))
  					}  	
  					if(DOM.val('#Template') == 1){
  					//	DOM.hide('#J_TemplteBtm');
  						DOM.hide('#J_DeleteTemplate');
  						DOM.show('#J_ResetTemplate');
  					}else{
  						//DOM.show('#J_TemplteBtm');
  						DOM.show('#J_DeleteTemplate');
  						DOM.hide('#J_ResetTemplate');
  					}
  					DOM.val('#J_ExpressWidth',DOM.val('#ExpressWidth'))
  					DOM.val('#J_ExpressHeight',DOM.val('#ExpressHeight'))
				};
				var errorHandle = function(o){
					new H.widget.msgBox({
							    title:"错误提示",
							    content:o.desc,
							    type:"error"
							});
				};	  
				if(templateName == 'EMS-3'){
					DOM.css('#J_ExpressImg',{width:'889px'})
				}else if(templateName == '顺丰速运'){
					DOM.css('#J_ExpressImg',{height:'510px'})
				}else if(templateName == '申通-2'){
					DOM.css('#J_ExpressImg',{width:'818px'})
				}else if(templateName == '申通-2013'){
					DOM.css('#J_ExpressImg',{width:'869px'})
				}else if(templateName == '汇通快运'){
					DOM.css('#J_ExpressImg',{width:'830px',height:'462px'})
				}else if(templateName == '天天快递'){
					DOM.css('#J_ExpressImg',{width:'818px',height:'462px'})
				}else if(templateName == '韵达'){
					DOM.css('#J_ExpressImg',{width:'818px',height:'460px'})
				}else if(templateName == '圆通速递'){
					DOM.css('#J_ExpressImg',{width:'818px'})
				}else if(templateName == '圆通速递-2'){
					DOM.css('#J_ExpressImg',{width:'818px'})
				}else if(templateName == '圆通速递-vip'){
					DOM.css('#J_ExpressImg',{width:'818px'})
				}else if(templateName == '中通速递'){
					DOM.css('#J_ExpressImg',{width:'818px'})
				}else if(templateName == '联邦快递'){
					DOM.css('#J_ExpressImg',{width:'869px'})
				}else if(templateName == '宅急送'){
					DOM.css('#J_ExpressImg',{width:'869px'})
				}else if(templateName == '德邦物流'){
					DOM.css('#J_ExpressImg',{width:'869px'})
				}else if(templateName == '星晨急便'){
					DOM.css('#J_ExpressImg',{width:'869px'})
				}else if(templateName == '全峰快递'){
					DOM.css('#J_ExpressImg',{width:'869px'})
				}
				var data = "templateName="+templateName;
				new H.widget.asyncRequest().setURI(loadChangeUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
	        },
	        deliveryPrint : function() {
  				var submitHandle = function(o) {
  					DOM.html('.template-content',o.payload.body);
  					templateControl.Form.renderAll('#J_ShiptoggleCheck');
  					Event.on('.J_ShipToggle','click',function(ev){ 
  						var value = DOM.val(ev.currentTarget);
  						DOM.toggle('.J_Td_'+value)
  					})
  				     //第一个参数：按钮元素钩子，第二个参数：队列元素钩子
  				    var ru = new RenderUploader('#J_UploaderBtn2', '#J_UploaderQueue',{
  				    	//验证配置
  				    	type : "auto",
  				    	authConfig: {
  				    	    allowExts:[
  				    	        {desc:"支持的图片格式", ext:"*.gif;*.jpg;*.png"},
  				    	        '目前只支持 .gif .jpg .png 格式的图片'
  				    	    ],
  				    	    max:[1, '每次最多上传{max}个文件！'],
  				    	    maxSize:[2000, "文件大小为{size}，文件太大！"],
  				    	    allowRepeat:[false, '该文件已经存在！']
  				    	},
  				        //服务器端配置
  				        serverConfig:{
  				            //处理上传的服务器端脚本路径 
  				            "action":loadUploadimgUrl,"data":{"dir":"files/"},"dataType" : "json"
  				        },
  				        // 文件域
  				        name:"Filedata",
  				        //用于放服务器端返回的url的隐藏域
  				        urlsInputName:"fileUrls",
  				        autoUpload : true
  				    });
  				    ru.on("init", function (ev) {
  				        var uploader = ev.uploader;
  				        var auth = ev.auth;
  				        var queue = ev.queue;
  				        DOM.val('#J_Uploader',ev.desc);
  				        uploader.on("success", function (ev) {
  							DOM.val('#J_Uploader2',ev.result.desc);
  		  					alert(DOM.val('#J_Uploader2'))
  		  					DOM.attr('#J_ImgSrc','src',DOM.val('#J_Uploader2'))
  						})
  						uploader.on("error", function (ev) {
  							DOM.val('#J_Uploader2',ev.result.desc);
  							DOM.attr('#J_ImgSrc','src',DOM.val('#J_Uploader2'))
  						 })
  					})
  					if(!DOM.val('#Around') == ''){
  						DOM.val('#J_Around',DOM.val('#Around'))
  					}
  					if(!DOM.val('#Middle') == ''){
  						DOM.val('#J_Middle',DOM.val('#Middle'))
  					}   
				};
				var errorHandle = function(o){
					new H.widget.msgBox({
							    title:"错误提示",
							    content:o.desc,
							    type:"error"
							});
				};	 
				var ship = 1;
				var data = "ship="+ship;
				new H.widget.asyncRequest().setURI(loadShipUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
	        }	        
	}
}, {
    requires: ['utils/showPages/index','overlay','gallery/form/1.2/uploader/index','utils/beautifyForm/index','bui/overlay','bui/select']
});