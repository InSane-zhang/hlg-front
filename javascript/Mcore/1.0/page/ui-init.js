
/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,O,showPages,beautifyForm,placeholder,Overlay,Select) {
	var S= KISSY,DOM = S.DOM, Event = S.Event;
	return  dashboard = {
			msg :null ,
			panel : null,
			
         test: function(){
        	 
			// 编辑input
			Event.on('.J_EditorPromoName','click',function(ev){
				var p =DOM.parent(ev.currentTarget);
				DOM.addClass(p,'hover');
				DOM.get('.J_Input',p).focus();
			})
			Event.on('.J_Input','blur',function(ev){
				var id = DOM.attr(ev.currentTarget,'data');
				KISSY.later(function(){
					DOM.removeClass('#J_Box'+id,'hover');
	 			},200,false,null);
			})
		
        	 var aa = function(page){
        		 dashboard.paginator.setPage(page).setPageCount(100).printHtml('#J_PAGE',2);
        		 dashboard.paginator.setPage(page).setPageCount(100).printHtml('#J_PAGE2',2);
        		 dashboard.paginator.setPage(page).setPageCount(100).printHtml('#J_PAGE3',2);
        		 dashboard.paginator.setPage(page).setPageCount(100).printHtml('#J_PAGE1',3);
        		 dashboard.paginator.setPage(page).setPageCount(100).printHtml('#J_PAGE4',1);
        	 };
        	 dashboard.paginator = new showPages('dashboard.paginator').setRender(aa).setPageCount(100).printHtml('#J_PAGE',2);
        	 dashboard.paginator.setPage(100).setPageCount(100).printHtml('#J_PAGE2',2);
        	 dashboard.paginator.setPage(10).setPageCount(100).printHtml('#J_PAGE3',2);
        	 dashboard.paginator.setPage(1).setPageCount(100).printHtml('#J_PAGE1',3);
        	 dashboard.paginator.setPage(1).setPageCount(100).printHtml('#J_PAGE4',1);
//     		 表单美化调用事例
     		 var x = new beautifyForm;
             //x.renderAllCheckbox('#J_CheckDiv');
            // x.renderAllRadio('#J_RadioDiv');
             //x.renderAllCheckPro('#J_InputUl');
//            x.renderAll('#J_AllInputDiv');
     		
     		  Event.on('.J_check','click',function(ev){
     			  var checkboxs = DOM.query('.J_check');
     			  var len = checkboxs.length;
     			  var str ='';
     			  for(var i = 0;i<len;i++){
     				  var iid = checkboxs[i].value;
     				  if(checkboxs[i].disabled) continue
    						if(checkboxs[i].checked){
    							str += "选中的值"+iid;
    						} 
     			  }
             	  DOM.html('#J_val2',str);
              })
     		 
             Event.on('.J_radio','click',function(ev){
            	 if(DOM.query('.J_radio')[0].checked){
            		 DOM.html('#J_val','0')
            	 }	else{
            		 DOM.html('#J_val','1')
            	 }
             })
	     		//渲染placeholder
	     		placeholder('#J_TestPlaceholder');
//	     		S.all('.J_Placeholder').each(function(el) {
//	     		    placeholder(el);
//	     		  });
//	     		var placeholder = new placeholder({
//	                node : '#J_TestPlaceholder'
//	            });
	     	        var dialog = new Overlay.Dialog({
	     	            title:'弹窗标题',
	     	            width:400,
	     	            height:300,
	     	            mask:false,
	     	            buttons:[
	     	                   {
	     	                     text:'确定',
	     	                     elCls : 'bui-button bui-button-primary',
	     	                     handler : function(){
	     	                       this.hide();
	     	                     }
	     	                   },{
	     	                     text:'关闭',
	     	                     elCls : 'bui-button',
	     	                     handler : function(){
	     	                       this.hide();
	     	                     }
	     	                   }
	     	                 ],
	     	            
	     	            bodyContent:'<div class="point relative"><div class="point-w-2">亲，授权窗口被浏览器拦截了&nbsp;&nbsp;&nbsp;<a target="_blank" href="http://bangpai.taobao.com/group/thread/609027-275734689.htm">点此查看</a></div></div>'
	     	          });
	     	       var dialog1 = new Overlay.Dialog({
	     	            title:'弹窗标题',
	     	            width:300,
	     	            height:100,
	     	            mask:false,
	     	            buttons:[
	     	                   {
	     	                     text:'确定',
	     	                     elCls : 'bui-button bui-button-primary',
	     	                     handler : function(){
	     	                       this.hide();
	     	                     }
	     	                   }
	     	                 ],
	     	            bodyContent:'<div class="point relative"><div class="point-w-1">亲，授权窗口被浏览器拦截了&nbsp;&nbsp;&nbsp;<a target="_blank" href="http://bangpai.taobao.com/group/thread/609027-275734689.htm">点此查看</a></div></div>'
	     	          });
	     	      //dialog.show();
//	     	      $('#btnShow').on('click',function () {
//	     	        dialog.show();
//	     	      });
	     	      Event.on('#J_OP1','click',function(ev){
	     	    	 dialog.show();
	     	      })
	     	      
	     	       Event.on('#J_OP2','click',function(ev){
	     	    	  //BUI.Message.Alert('这只是简单的提示信息','info');
	     	    	   
	     	    	 dialog1.show()
	     	       })
	     	       			var items = [
	     	                  {text:'选项1',value:'a'},
	     	                  {text:'选项2',value:'b'},
	     	                  {text:'选项3',value:'c'}
	     	                ],
	     	                select = new Select.Select({  
	     	                  render:'#s1',
	     	                  valueField:'#hide',
	     	                  items:items,
	     	                 focused : false
	     	                });
	     	            select.render();
	     	            select.on('change', function(ev){
	     	            });
	     	           select.setSelectedValue('a');
	     	           
	     	      	var items = [
		     	                  {text:'选项1',value:'a'},
		     	                  {text:'选项2',value:'b'},
		     	                  {text:'选项3',value:'c'}
		     	                ],
		     	                select22 = new Select.Select({  
		     	                  render:'#s2',
		     	                  valueField:'#hide1',
		     	                  items:items,
		     	                 disabled : true
		     	                });
		     	            select22.render();
		     	            select22.on('change', function(ev){
		     	            	
		     	            });
		     	           select22.setSelectedValue('a');
		     	          select22.disable();
		     	          console.log(select22.get('picker').get('el')[0]);
							DOM.css(select22.get('picker').get('el'),'display','none');
	     	           
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
	     	    		  select.setSelectedValue('0');		
	     	    		 var items1 = [
	    	   		   	      {text:'素材类型',value:'00'},
	    	   		   	      {text:'海报',value:'2'},
	    	   		   	      {text:'关联列表',value:'3'},
	    	   		   	      {text:'搭配套餐',value:'7'},
	    	   		   	      {text:'团购模版',value:'6'},
	    	   		   	      {text:'自定义列表',value:'1'},
	    	   		   	      {text:'分类模板',value:'9'}
	    	   		   	    ],
    	   		   	    select1 = new Select.Select({  
    	   		   		    render:'#J_Mtype',
    	   		   	      	valueField:'#hide33',
    	   		   	      	items:items1
    	   		   		});
    	   		   		select1.render();
    	   		   	   select1.setSelectedValue('00');	
	     	           
	     	           /**/
	     	          Event.on(DOM.query('.J_Tiger'),'mouseenter mouseleave',function(ev){
	     	        	  if(ev.type == 'mouseenter'){
	     	        		  DOM.addClass(ev.currentTarget,'current');
	     	        	  }else{
	     	        		 DOM.removeClass(ev.currentTarget,'current');
	     	        	  }
	     	          })
	     	          
	     	          
         }
	
	
         
	}
   
}, {
    requires: ['overlay','utils/showPages/index','utils/beautifyForm/index','utils/placeholder/index','bui/overlay','bui/select']
});