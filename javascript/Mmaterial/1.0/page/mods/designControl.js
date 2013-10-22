

KISSY.add(function (S,Overlay,TShop) {
	var S = KISSY,DOM = S.DOM, Event = S.Event;	
	
	return designControl = {
	    		designPicPanel: null,
	    		currentDesignId: null,
	    		currentXmlPath: null,
	    		msg : null,
	    		initDesignFlag : false,
	    		getDesignContent : function(rawDid){
					
					if(KISSY.inArray(rawDid,g_ds_del_list)){
						return ;
					}
					var submitHandle = function(o) {
						DOM.html('#J_DesignDiv_'+rawDid, o.payload);
						DOM.css('#J_DesignDiv_'+rawDid,'position','relative');
						var height = DOM.height(DOM.get('#J_DesignDiv_'+rawDid+' img'));
						var width = DOM.width(DOM.get('#J_DesignDiv_'+rawDid+' img'));
						DOM.css('#J_DesignDiv_'+rawDid,'height',height);
						DOM.css('#J_DesignDiv_'+rawDid+' div','height',height);
						var box = DOM.get('#J_DesignDiv_'+rawDid)
						TShop.init(box);
						Event.on('#J_DesignDiv_'+rawDid+' .ds-bar-edit', 'click', function(evt) {
							designControl.showDesign('J_DesignDiv_'+rawDid);
						})
						Event.on('#J_DesignDiv_'+rawDid+' .ds-bar-del', 'click', function(evt) {
							var box = DOM.get('#J_DesignDiv_'+rawDid), boxID = DOM.attr( box, 'newid' ), a, p = { width: "0px", height:"0px" , opacity: "0" };
				            a = new KISSY.Anim( box, p, 0.3 ,KISSY.Easing.easeOut,function(){
					                box.innerHTML = '';
					                box.parentNode.removeChild( box );
					                g_ds_del_list.push( boxID );
				                });
							a.run();	
						})
			    	};
			    	var errorHandle = function(o){
							new H.widget.msgBox({
							    title:"错误提示",
							    content:o.desc,
							    type:"error",
								autoClose : true,
								timeOut : 3000
							});
				    };
				    var designId = list.designPics[rawDid].designId;
				    var data = "designId="+designId+"&form_key="+FORM_KEY;
					new H.widget.asyncRequest().setURI(getDesignContentUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
				},
				
	    	    showDesign : function(divId) {
					designControl.currentDesignId = divId.substr(12);
	    			var designId = list.designPics[designControl.currentDesignId].designId;
					var XmlUrl = list.designPics[designControl.currentDesignId].xml_path;
					
	    			var params = {
	    		  			allowScriptAccess: "always",
	    		  			allowFullScreen:true,
	    		  			base:"http://img01.huanleguang.com/main/"
	    			};
	    			var flashvars = {
	    					mode: '7',
	    					designId: designId, 	  			
	    					sid: sid, 				
	    					xmlUrl:XmlUrl, 				
	    					saveNew:'yes', 
	    					protoId:protoId
	    			};
	    			if (! designControl.initDesignFlag) {
	    					swfobject.embedSWF("http://img01.huanleguang.com/main/Main.swf?v=50", "hlgFlash", "1080", "475", "7", "expressInstall.swf", flashvars, params);
	    				//	designControl.initDesignFlag = true;
	    			} else {
	    				designControl.thisMovie('hlgFlash').initDesign(flashvars);
	    			}
	    			
	    			if (!designControl.designPicPanel) {	
						designControl.designPicPanel = new Overlay.Dialog({
			     	            title:'编辑海报',
			     	            width:1120,
			     	            height:600,
			     	            elAttrs :{id : 'J_design_icon_panel'},   
			     	            mask:false,
			     	            footerStyle :{'display' : 'none'}
			     	          });
						
						designControl.designPicPanel.set('bodyContent',KISSY.clone(DOM.get('#hlgFlash')));
						designControl.designPicPanel.render();
						designControl.designPicPanel.on('hide',function(){
							DOM.get('#J_design_icon_panel').style.display = 'none';
							DOM.get('#hlgFlash').style.visibility = 'hidden';
						})
	    			}
	    			designControl.designPicPanel.show();
					DOM.get('#J_design_icon_panel').style.display = 'block';
	    		},
	
	    	    thisMovie : function(movieName) {
	    			if (navigator.appName.indexOf("Microsoft") != -1) {
	    				return window[movieName];
	    			}else{
	    				return document[movieName];
	    			}
	    		},
	    		designFinish : function(fromDid, designId, xmlPath) {
	        		if(fromDid==null || designId==null || xmlPath==null) {
	            		
	            	}else{
		        		var rawDid = designControl.currentDesignId;
		    			list.designPics[rawDid].designId = designId;
		    			list.designPics[rawDid].xml_path = xmlPath;
		    			designControl.getDesignContent(rawDid);
	            	}
	        		DOM.get('#hlgFlash').style.visibility = 'hidden';
	    			designControl.designPicPanel.hide();
	    		}
	}
	
}, {
    requires: ['bui/overlay','./tshop']
})
