/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,Select) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return listControl = {
			init : function() {
				var items = [
				  {text:'投放位置',value:'0'},
		   	      {text:'位置1',value:'1'},
		   	      {text:'位置2',value:'2'},
		   	      {text:'位置3',value:'3'},
		   	      {text:'位置4',value:'4'},
		   	      {text:'位置5',value:'5'},
		   	      {text:'位置6',value:'6'}
		   	    ],
		   	    select = new Select.Select({  
		   		    render:'#J_Pos',
		   	      	valueField:'#hide',
		   	      	items:items
		   		});
		   		select.render();
		   		if(pos){
		   			select.setSelectedValue(pos);						
		   		}else{
		   			select.setSelectedValue('0');
		   		}
		   		var items1 = [
   		   	      {text:'素材类型',value:'00'},
   		   	      {text:'海报',value:'2'},
   		   	      {text:'关联列表',value:'3'},
   		   	      {text:'搭配套餐',value:'7'},
   		   	      {text:'团购模版',value:'6'},
   		   	      {text:'客服模板',value:'8'},
   		   	      {text:'分类模板',value:'9'},
   		   	      {text:'自定义',value:'1'}
   		   	    ],
   		   	    select1 = new Select.Select({  
   		   		    render:'#J_Mtype',
   		   	      	valueField:'#hide1',
   		   	      	items:items1
   		   		});
   		   		select1.render();
	   		   	if(mt){
		   			select1.setSelectedValue(mt);						
		   		}else{
		   			select1.setSelectedValue('00');
			   	}
		   		
				var Temple = DOM.query('.J_Height');
				for(i=0;i<10;i++){
					Height = DOM.height(Temple[i]);
					if(Height>300){
						aa = 'temple_'+[i];
						Parent = DOM.parent('.'+aa);
						DOM.replaceClass(Parent,'normal','overflow');
					}
				}
				Event.on('.float-icon','click',function(ev){
					var Parent = DOM.parent(ev.currentTarget,'.J_Height');
					if(DOM.hasClass(Parent,'overflow')){
						DOM.replaceClass(Parent,'overflow','normal');
					}else{
						DOM.replaceClass(Parent,'normal','overflow');
					}
				})
				
				var oTriggers = DOM.query('.J_Delete');
		    	Event.on(oTriggers, "click",function(ev){
		    		var id = DOM.attr(ev.currentTarget,'data');
		    		listControl.deleteHandle(id)
		    	})
				Event.on('#J_Release','click',function(e){
					 e.preventDefault();
					 if(!showPermissions('editor_material','促销素材')){
					 	return ;
					 }else{
						var url = DOM.attr(e.currentTarget,"data-url");
						if(isVersionPer('material',false)){
//							new H.widget.msgBox({
//								    title:"温馨提示",
//								    content:'只提供制作体验，尊享版才能享受素材投放功能',
//								    type:"info",
//									buttons: [{ value: "继续体验" }, { value: "关闭" }],
//									success: function (result) {
//									        if (result == "继续体验") {
//												window.location.href = url;
//									        }
//				    				}
//								});
							isVersionPer('material')
							return 
						}else{
							window.location.href = url;
						}
					}
				})
			},
			
			deleteHandle :function(id){
				new H.widget.msgBox({
				    title: "删除列表",
				    content: "系统将为您取消此活动设置的列表信息",
				    type: "confirm",
				    buttons: [{ value: "删除" }, { value: "取消" }],
				    success: function (result) {
				        if (result == "删除") {
							var submitHandle = function(o) {
								window.location.href = currentUrl;
							};
							var errorHandle = function(o){
								new H.widget.msgBox({
								    title:"错误提示",
								    content:o.desc,
								    type:"error"
								});
							}
							var data = "id="+id+"&form_key="+FORM_KEY;
						  	new H.widget.asyncRequest().setURI(deleteUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			
				        }
				    }
				});
			
						
			},
			
			search : function(){
				var list_id = DOM.val('#J_SearchListId');
				var pos = DOM.val('#hide');
				var mt = DOM.val('#hide1');	
				if(DOM.val(DOM.get("#J_SearchName")) != '输入素材关键字'){
					var searchName = encodeURIComponent(DOM.val(DOM.get("#J_SearchName"))); //标题
		    	}else{
		    	    var searchName ='';
		    	}
				var url = currentUrl+"&pos="+pos+"&mt="+mt+"&searchName="+searchName+"&list_id="+list_id;
			  	window.location.href=url;
			}
		
	}
}, {
    requires: ['utils/showPages/index','bui/select']
});