/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,iconControl,Switchable,Calendar) {
    // your code here
   return addControl = {
		msg : null,
		init : function(){
			// input 边框变化  
			var inputs = DOM.filter (DOM.query('input'),function(i){if(i.type =='text')return true;})
			Event.on(inputs,'focus blur',function(ev){
				if(ev.type == 'focus'){
					DOM.removeClass(ev.target,'text-error');
					DOM.addClass(ev.target,'input-text-on');
				} else if(ev.type == 'blur'){
					DOM.removeClass(ev.target,'input-text-on');
				}
			})
			
			if(S.one("#J_startDate")){
				  var datepicker = new Calendar.DatePicker({
     	              trigger:'#J_startDate',
     	              showTime:true,
     	              autoRender : true,
     	              autoSetValue :false,
     	              textField  : '2',
     	              hour : 0,
	 	              minute : 0,
	 	              second : 0,
	 	              minDate : new Date()
     	              
     	            });
				  datepicker.on('selectedchange',function (e) {
					  	var ParamsErrorBox = KISSY.one('#J_ParamsErrorBox');
						ParamsErrorBox.hide();
	 	        	 	var endDate = H.util.stringToDate(S.one('#J_endDate').val());
						var startDate   = e.value;
						if((endDate !='')&&(startDate.getTime() >= endDate.getTime()))
						{
							DOM.addClass(promotionForm.start_date,'text-error');
							ParamsErrorBox = KISSY.one('#J_ParamsErrorBox');
							DOM.html('#J_ParamsErrorMsg','开始时间不能大于结束时间');
							if (ParamsErrorBox.css("display")==="none") {
								ParamsErrorBox.slideDown();
							}
							//S.one('#J_startDate').val('');
						}else{
							S.one('#J_startDate').val(e.text);
							DOM.removeClass(promotionForm.start_date,'text-error');
							var leftsecond = parseInt((endDate.getTime() - startDate.getTime()) / 1000);
			                d = parseInt((leftsecond / 86400) % 10000);
			                h = parseInt((leftsecond / 3600) % 24);
							str = '活动持续<b class="color-red">'+d+'</b>天<b class="color-red">'+h+'</b>小时';
							DOM.html("#J_PromoTimeLast" , str);
						}
						
	 	         });
			}
			if(S.one("#J_endDate")){
			   var datepicker2 = new Calendar.DatePicker({
	 	              trigger:'#J_endDate',
	 	              showTime:true,
	 	              autoRender : true,
	 	              autoSetValue :false,
	 	              textField  : '2',
	 	              hour : '23',
	 	              minute : '59' ,
	 	              second : '59',
	 	              minDate : new Date()
 	            });
	 	        datepicker2.on('selectedchange',function (e) {
		 	        	var ParamsErrorBox = KISSY.one('#J_ParamsErrorBox');
						ParamsErrorBox.hide();
		     	       	var endDate   =  e.value;
		     	        var nowDate = new Date();
						var startTime = H.util.stringToDate(S.one('#J_startDate').val());
						var endTime = H.util.stringToDate(endDate);
						var invalidate =H.util.stringToDate(invalidate);
						if((endTime.getTime() <= startTime.getTime() || endTime.getTime() <= nowDate.getTime())&&(startTime !='')){
							DOM.addClass(promotionForm.end_date,'text-error');
							DOM.html('#J_ParamsErrorMsg','结束时间不能小于开始时间');
							if (ParamsErrorBox.css("display")==="none") {
								ParamsErrorBox.slideDown();
							}
							//S.one('#J_endDate').val('');
						}else{
							S.one('#J_endDate').val(e.text);
							DOM.removeClass(promotionForm.end_date,'text-error');
							var leftsecond = parseInt((endTime.getTime() - startTime.getTime()) / 1000);
			                d = parseInt((leftsecond / 86400) % 10000);
			                h = parseInt((leftsecond / 3600) % 24);
							str = '活动持续<b class="color-red">'+d+'</b>天<b class="color-red">'+h+'</b>小时';
							DOM.html("#J_PromoTimeLast" , str);
						}
	 	         });
			}
	   						
 			//图标
			window.tabs = new Switchable.Tabs('#icon_panel',{
				navCls: 'ks-switchable-nav',
				contentCls: 'icon-content',
				triggerType: 'click',
				activeTriggerCls: 'current'			
			}).on('switch',function(ev){
				var index = ev.currentIndex;
				switch(index) {
					case 0:
						iconControl.show('comm');
						break;
					case 1:
						iconControl.show('commDesign');
						break;
					case 2:
						iconControl.show('smart');
						break;
					case 3:
						iconControl.show('me');
						break;
				}
			})
			
//			Event.delegate(document,'click','.J_icon',function(ev){
//				var data=DOM.attr(ev.currentTarget,'data');
//				DOM.removeClass('.J_icon','current');	
//				DOM.addClass(ev.currentTarget,'current');
//				if(data==0){
//					iconControl.show('comm');	
//				}
//				if(data==1){
//				   iconControl.show('commDesign');
//				}
//				if(data==2){
//					iconControl.show('smart');	
//				}
//				if(data==3){
//					iconControl.show('me');	
//				}
//				
//			});
			
			iconControl.scale = 2;
			iconControl.frontPageNum = 14;
			iconControl.show('comm');
			
			Event.delegate(document,'click','.iconDeletelink', function(ev) {
				var iconId = DOM.attr(ev.currentTarget,'data');
				new H.widget.msgBox({
						    title: "删除图标",
						    content: '亲！您确定删除这个图标?',
						    type: "confirm",
						    buttons: [{ value: "确定删除" }, { value: "取消" }],
						    success: function (result) {
						        if (result == "确定删除") {
									ev.preventDefault();
									var submitHandle = function(o) {
									  	iconControl.initMeFlag = false;
										iconControl.show('me');
									};
									var error = function(o){
										new H.widget.msgBox({
										    title:"错误提示",
										    content:o.payload,
										    type:"error"
										});
									};
									var data = "iconId="+iconId+"&form_key="+FORM_KEY;
							  		new H.widget.asyncRequest().setURI(delIconUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(error).setData(data).send();
						        }
						    }
						});
	  		});
		
		},
		initIcon : function(icon, iconPositionId, iconColorId, undefined){
			iconControl.initIcon(icon, iconPositionId, iconColorId, undefined)
			
		},
		showDesign : function(){
			iconControl.showDesign()
			
		},
		
		designFinish : function(designId, xmlPath, picUrl){
			iconControl.designFinish(designId, xmlPath, picUrl)
		},
		//活动保存 验证
		save : function() {
			if(isVersionPer('icon')){return ;}
			ParamsErrorBox = KISSY.one('#J_ParamsErrorBox');
			var promoIds = DOM.val('#J_PromoId');
			var promo_id  =	promoIds.split('_')[0];
			if(promo_id == 0){
				if(KISSY.one("#J_startDate")){
					var startDate = DOM.val('#J_startDate');
					var endDate = S.one('#J_endDate').val();
					if((endDate!='')&&(startDate>=endDate)){
						DOM.html('#J_ParamsErrorMsg','开始时间不能大于结束时间，请重新选择');
						if (ParamsErrorBox.css("display")==="none") {
							ParamsErrorBox.slideDown();
						}
						DOM.addClass('#J_startDate','text-error');
						return ;
					}
				}
				if(KISSY.one("#J_endDate")){
					var endDate = S.one('#J_endDate').val();
					var nowDate = new Date();
					var startTime = H.util.stringToDate(S.one('#J_startDate').val());
					var endTime = H.util.stringToDate(endDate);
					var invalidate =H.util.stringToDate(invaliDate);
					
					if(endTime.getTime() <= nowDate.getTime() || endTime.getTime()<=startTime ){
						DOM.html('#J_ParamsErrorMsg','结束时间不能小于开始时间，请重新选择');
						if (ParamsErrorBox.css("display")==="none") {
							ParamsErrorBox.slideDown();
						}
						DOM.addClass('#J_endDate','text-error');
						return ;
					}
				}
			}
				if(iconControl.currentIconId != null){
					promotionForm.iconId.value = iconControl.currentIconId;
					if(iconControl.mode==0){
						if (iconControl.currentIconType==2 ||iconControl.currentIconType==4) { 
							promotionForm.iconId.value += '_' + iconControl.currentPositionId + '_' + iconControl.currentColorId;
							if (iconControl.currentIconType==2){
								var typeId  =	promoIds.split('_')[1];
								if(!KISSY.inArray( typeId ,['2','9','10'])){
									DOM.show('#J_ShowSmartIconMsg');
									return ;
								}
							}
						}
					}
				}
			promotionForm.iconType.value = iconControl.currentIconType;
			if(iconControl.currentIconId == null || iconControl.currentIconType == null ){
				DOM.html('#J_ParamsErrorMsg','请选择图标');
				if (ParamsErrorBox.css("display")==="none") {
					ParamsErrorBox.slideDown();
				}
				return ;
			}
			promotionForm.promoId.value = promo_id;
//			if((promotionForm.oriIconId.value !='' && (promotionForm.oriIconId.value == promotionForm.iconId.value)) || false  ){
//				iconControl.msg.hide();
//				iconControl.msg.setMsg('<div class="point relative"><div class="point-w-1">请更换图标或更改时间</div></div>').showDialog();
//				return ;
//			} 
			DOM.get("#promotion_edit_form").submit();
			return true;
	    },
		
	    changePromo: function(value){
			if(value != 0){
				DOM.attr('#J_startDate','disabled','disabled');
				DOM.removeClass('#J_startDate','input-day');
				DOM.style('#J_startDate', {border: '0', background: 'none'});
				DOM.attr('#J_endDate','disabled','disabled');
				DOM.removeClass('#J_endDate','input-day');
				DOM.style('#J_endDate', {border: '0', background: 'none'});
				var typeId  =	value.split('_')[1];
				DOM.val('#J_startDate',value.split('_')[2]);
				DOM.val('#J_endDate',value.split('_')[3]);
			}else{
				DOM.val('#J_startDate',startAt);
				DOM.style('#J_startDate',{border: '1px solid #A7A6AA', background: 'url(http://cdn.huanleguang.com/img/hlg/v3/input-dayman.gif) right 0', width:'184px'});
				DOM.style('#J_endDate', {border: '1px solid #A7A6AA', background: 'url(http://cdn.huanleguang.com/img/hlg/v3/input-dayman.gif) right 0' , width:'184px'});
				DOM.val('#J_endDate',endAt);
				var typeId  = 0;
				DOM.attr('#J_startDate','disabled',false);
				DOM.attr('#J_endDate','disabled',false);
			}
			if(KISSY.inArray( typeId ,['2','9','10'])){
				DOM.hide('#J_ShowSmartIconMsg');
			}
			var startTime = H.util.stringToDate(S.one('#J_startDate').val());
			var endTime = H.util.stringToDate(S.one('#J_endDate').val());
			var leftsecond = parseInt((endTime.getTime() - startTime.getTime()) / 1000);
            d = parseInt((leftsecond / 86400) % 10000);
            h = parseInt((leftsecond / 3600) % 24);
			str = '活动持续<b class="color-red">'+d+'</b>天<b class="color-red">'+h+'</b>小时';
			DOM.html("#J_PromoTimeLast" , str);

		}
					
	};
}, {
    requires: ['./mods/icon-control','switchable','bui/calendar']
});