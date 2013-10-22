/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S) {
    // your code here
    
	return listParam = {
		init :function(){
				var str ='',
					frameHtml = '',
					colorHtml = '',
					moreLinkHtml ='',
					qualityPicsHtml = '',
					keywordsHtml = '',
					listParamsHtm1 = '',
					listParamsHtm2 = '',
					listParamsHtm3 = '',
					listParamsHtm4 = '',
					listParamsHtm5 = '',
					listParamsHtm6 = '',
					listParamsHtm7 = '',
					listParamsHtm8 = '';
				S.each(list.listParams,function(item){
					if(item['field_code'] == 'color'){
						colorHtml +='<li class="J_ListParams" >'+
									'<input type="hidden" id ="J_color"  value="'+item['value']+'"  class="J_Param_Value">'+
									'<input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/>'+
		        					'<div class="ui-side-list">颜色选择：</div>'+
		           		 			'<div class="ui-content-list ui-content-color">';
								if(paramOptons['color']){
									S.each(paramOptons['color'],function(col,index){
										clos = col.split("_");
										colorHtml+='<span class="list-template-color J_SelectColor ';
										if(item['value']==col){
											colorHtml+='a-current';
										}
										colorHtml+='" data="'+col+'" >';
										colorHtml +='<b style="background-color: #'+clos[0]+'"></b>';
//										S.each(clos,function(i){
//											colorHtml +='<b style="background: #'+i+'"></b>';
//										})
										colorHtml +='</span>';
									})
								}
								if(paramOptons['color'].length == 1){
									colorHtml+= '<span style="font-size:12px;"><!--（说明：此模版为旧模版不支持多色系,持续更新中）--></span>'
								}
				         colorHtml+= '</div></li>';
					}
					if(item['field_code'] == 'items_per_line'){
						// 搭配套餐 尺寸 样式 不同
						var c = '';
						if(mtype==7){
							var c = 'mt-7';
						}
						frameHtml +='<li class="J_ListParams '+c+'">';
						frameHtml +='<div class="ui-side-list">';
						if(mtype==7){
							frameHtml += '尺寸/宝贝数';
							if(items_per_line==''){
								var items_per_line_default =  item['value']
							}else{
								var items_per_line_default =  items_per_line
							}
							var ttemps = items_per_line_default.split('_');
							limit = parseInt(ttemps[3]);
							var st = 'style=""';
						}else{
							frameHtml += '尺寸选择';
							var items_per_line_default =  item['value']
							limit = parseInt(limitNums[items_per_line_default.substr(0,3)]);
							var st = 'style="width: auto;"';
						}
						//alert(limit);
						frameHtml +='：</div>'+
				            		'<div class="ui-content-list menu-item" '+st+' ><input type="hidden" id ="J_items_per_line_default"  value="'+items_per_line_default+'">'+
				        			'<input type="hidden" id ="J_items_per_line"  value="'+items_per_line_default+'"  class="J_Param_Value">'+
									'<input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/>';
						if(mtype==7){
							var alen = associateFormats.length;
							for(var i=0; i<alen; i++){
								frameHtml +='<a href="#2"';
								if(items_per_line_default+'-'+protoId==associateFormats[i]){
									frameHtml+='class="on-center J_width"';
								}else{
									frameHtml+='class="off-center J_width"';
								}
								if( i>12){
									frameHtml+='style="border-top: none;"';
								}
								var ffmat = associateFormats[i].substring(0,associateFormats[i].indexOf('-'));
								ffmat = ffmat.split('_');
								frameHtml+='><span  class="w-100 J_list_width" id="'+associateFormats[i]+'">'+ffmat[0]+'/'+ffmat[3]+'</span></a>';
							}
							frameHtml +='</div></li>';
						}else{
		            		p = 0;
							for (var k in formats) {
								//列表宽度
								if(item['value'].split("_")[0]==k){
									frameHtml +='<input type="hidden" id="J_frame_width" value ="'+k+'"/>';
								}
								frameHtml +='<a href="#2"';
								if(item['value'].split("_")[0]==k){
									frameHtml+='class="on-center J_width"';
								}else{
									frameHtml+='class="off-center J_width"';
								}
								frameHtml+='><span  class="w-100 J_list_width" id="'+k+'">'+k+'像素</span></a>';
							}
							frameHtml +='</div></li>';
							frameHtml += '<li class="min-height-40">'+
					        			 '<div class="ui-side-list">宝贝主图尺寸：</div>';
							for (var k in formats) {
								frameHtml +='<div class="ui-content-list relative  J_mainSize menu-item" id="J_mainSize'+k+'" style="width:auto;';
								if(item['value'].split("_")[0]!=k){
									frameHtml +='display:none';
								};
								frameHtml +='">';
								
								frameHtml +='<input type="hidden" id="J_mian_size'+k+'" value ="';
								for(var g in formats[k]) {
									if(item['value'].split("_")[0]==k){
										if(item['value'].split("_")[2]==g){
											frameHtml +=g;
										}
									}else{
										frameHtml+=g;
										break;
									}
								}
								frameHtml +='"/>';
								var index = 1;
								for(var m in formats[k]) {
									frameHtml +='<a href="#2"';
									if(item['value'].split("_")[0]==k){
										if(item['value'].split("_")[2]==m){
											frameHtml+='class="on-center J_Mwidth"';
										}else{
											frameHtml+='class="off-center J_Mwidth"';
										}
									}else{
										if(index == 1){
											frameHtml+='class="on-center J_Mwidth"';
											index++;
										}else{
											frameHtml+='class="off-center J_Mwidth"';
										}
									}
									//frameHtml+='><span  class="w-100 J_main_size" id="'+m+'">'+m+'x'+m+'</span></a>';
									frameHtml+='><span  class="w-100 J_main_size" id="'+m+'">'+m+'</span></a>';
								}
								frameHtml +='</div>';
							}
							frameHtml +='</li>';
							frameHtml +='<li class="min-height-40">'+
				        	'<div class="ui-side-list">每行显示：</div>'+
				            '<div class="ui-content-list relative"><span class="list-number" ><b id="J_item_pre_line">'+item['value'].split("_")[3]+'</b></span></div></li>';
						}
					}
					if(item['field_code'] == 'more_link'){
						moreLinkHtml +='<li class="title-params J_ListParams" >'+
				        			   '<div class="ui-side-list">更多：</div>'+
				            		   '<div class="ui-content-list">'+
									   '<input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/>';
								
						moreLinkHtml+= '<input type="text" id="J_moreLink"  class="input-text-3 J_Param_Value" value="'+item['value']+'">';
						moreLinkHtml+= '</div></li>';
					}
					if(item['field_code'] == 'quality_pics'){
						qualityPicsHtml +=  '<li class="title-params list-template-icon-img J_ListParams" id="">'+
				        					'<div class="ui-side-list">品质图片：</div>'+
			            					'<div class="ui-content-list"><input type="hidden" id ="J_QualityPics" class="J_Param_Value" value="'+item['value']+'"/>'+
			            					'<input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/>';
						if(paramOptons['quality_pics']){
							var defaultQuality = item['value'].split("#");
							S.each(paramOptons['quality_pics'],function(qualityPic,index){
								qualityPicsHtml +='<a href="#2"';
									S.each(defaultQuality,function(d){
										if( d !='' && d == qualityPic){
											qualityPicsHtml+= 'class="a-current"';
										}
									})
								qualityPicsHtml +='><span class="J_quality_pics"><img width="50" border="0" src ="'+qualityPic+'_sum.jpg" alt=""></span></a>';
							})
						}		
						qualityPicsHtml+= '</div></li>';
					}
					if(item['field_code'] == 'keywords'){
						keywordsHtml +='<li class="title-params J_ListParams" >'+
				        			   '<div class="ui-side-list">关键词：</div>'+
				            		   '<div class="ui-content-list"><input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/>';
						keywordsHtml+= '<input type="text" id="J_keywords"  class="input-text-3 J_Param_Value" value="'+item['value']+'">';
						keywordsHtml+= '</div></li>';
					}
					if(item['field_code'] == 'list_param1'){
						if(7==mtype){
							var show_title = 'title="'+item['field_name']+'"' ;
						}else{
							var show_title = '';
						}
						listParamsHtm1 +='<li class="title-params J_ListParams" >'+
				        			   '<div class="ui-side-list">'+item['field_name']+'：</div>'+
				            		   '<div class="ui-content-list"><input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/>';
						listParamsHtm1+= '<input type="text" id="J_list_param1" '+show_title+' class="input-text-3 J_Param_Value" value="'+item['value']+'">';
						listParamsHtm1+= '</div></li>';
					}
					if(item['field_code'] == 'list_param2'){
						if(7==mtype){
							var show_title = 'title="'+item['field_name']+'"' ;
						}else{
							var show_title = '';
						}
						listParamsHtm2 +='<li class="title-params J_ListParams" >'+
				        			   '<div class="ui-side-list">'+item['field_name']+'：</div>'+
				            		   '<div class="ui-content-list"><input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/>';
						listParamsHtm2+= '<input type="text" id="J_list_param2" '+show_title+' class="input-text-3 J_Param_Value" value="'+item['value']+'">';
						listParamsHtm2+= '</div></li>';
					}
					if(item['field_code'] == 'list_param3'){
						if(7==mtype){
							var show_title = 'title="'+item['field_name']+'"' ;
						}else{
							var show_title = '';
						}
						listParamsHtm3 +='<li class="title-params J_ListParams" >'+
				        			   '<div class="ui-side-list">'+item['field_name']+'：</div>'+
				            		   '<div class="ui-content-list" ><input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/>';
						listParamsHtm3+= '<input type="text" id="J_list_param3"  '+show_title+' class="input-text-3 J_Param_Value" value="'+item['value']+'">';
						listParamsHtm3+= '</div></li>';
					}
					if(item['field_code'] == 'list_param4'){
						if(7==mtype){
							var show_title = 'title="'+item['field_name']+'"' ;
						}else{
							var show_title = '';
						}
						listParamsHtm4 +='<li class="title-params  J_ListParams" >'+
				        			   '<div class="ui-side-list">'+item['field_name']+'：</div>'+
				            		   '<div class="ui-content-list" ><input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/>';
						listParamsHtm4+= '<input type="text" id="J_list_param4"  '+show_title+' class="input-text-3 J_Param_Value" value="'+item['value']+'">';
						listParamsHtm4+= '</div></li>';
					}
					if(item['field_code'] == 'list_param5'){
						if(7==mtype){
							var show_title = 'title="'+item['field_name']+'"' ;
						}else{
							var show_title = '';
						}
						listParamsHtm5 +='<li class="title-params J_ListParams" >'+
				        			   '<div class="ui-side-list">'+item['field_name']+'：</div>'+
				            		   '<div class="ui-content-list" ><input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/>';
						listParamsHtm5+= '<input type="text" id="J_list_param5"  '+show_title+' class="input-text-3 J_Param_Value" value="'+item['value']+'">';
						listParamsHtm5+= '</div></li>';
					}
					if(item['field_code'] == 'list_param6'){
						if(7==mtype){
							var show_title = 'title="'+item['field_name']+'"' ;
						}else{
							var show_title = '';
						}
						listParamsHtm6 +='<li class="title-params  J_ListParams" >'+
				        			   '<div class="ui-side-list">'+item['field_name']+'：</div>'+
				            		   '<div class="ui-content-list"><input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/>';
						listParamsHtm6+= '<input type="text" id="J_list_param6"  '+show_title+' class="input-text-3 J_Param_Value" value="'+item['value']+'">';
						listParamsHtm6+= '</div></li>';
					}
					if(item['field_code'] == 'list_param7'){
						if(7==mtype){
							var show_title = 'title="'+item['field_name']+'"' ;
						}else{
							var show_title = '';
						}
						listParamsHtm7 +='<li class="title-params J_ListParams" >'+
				        			   '<div class="ui-side-list">'+item['field_name']+'：</div>'+
				            		   '<div class="ui-content-list"><input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/>';
						listParamsHtm7+= '<input type="text" id="J_list_param7"  '+show_title+' class="input-text-3 J_Param_Value" value="'+item['value']+'">';
						listParamsHtm7+= '</div></li>';
					}
					if(item['field_code'] == 'list_param8'){
						if(7==mtype){
							var show_title = 'title="'+item['field_name']+'"' ;
						}else{
							var show_title = '';
						}
						listParamsHtm8 +='<li class="title-params  J_ListParams" >'+
				        			   '<div class="ui-side-list">'+item['field_name']+'：</div>'+
				            		   '<div class="ui-content-list"><input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/>';
						listParamsHtm8+= '<input type="text" id="J_list_param8"  '+show_title+' class="input-text-3 J_Param_Value" value="'+item['value']+'">';
						listParamsHtm8+= '</div></li>';
					}
					
				})
				listParamsConfirmHtm = '';			

				//宝贝参数 整体设置
				List_itemParamExplainHtml = '';
				List_oriPriceWriterHtml ='';
				List_curPriceWriterHtml = '';
				List_tinyLabelsHtml = '';
				List_itemParam1Html = '';
				List_itemParam2Html = '';
				List_itemParam3Html = '';
				List_itemParam4Html = '';
				List_itemParam5Html = '';
				List_itemParam6Html = '';
				S.each(list.defaultItemParams,function(item){
						if(item['field_code'] == 'ori_price_writer'){
							List_oriPriceWriterHtml +='<li class="title-params  J_SetAllItem clear min-height-30" ><div class="ui-side-list w-100">原价文案：</div><div class="ui-content-list">'+
								'<input type="text" id ="J_oriPriceWriter" value="'+item['value']+'" title="原价文案" class="input-text-3 J_Param_Value">'+
								'<input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/>'+
								'<select id="J_OPrice" name="oripricewriter" onchange="KISSY.DOM.val(\'#J_oriPriceWriter\',this.value)">';
								if(paramOptons['ori_price_writer']){
									S.each(paramOptons['ori_price_writer'],function(item){
										List_oriPriceWriterHtml+=  '<option value="'+item+'">'+item+'</option>';
									})
								}
								List_oriPriceWriterHtml+='</select></div></li>';
						}
						if(item['field_code'] == 'cur_price_writer'){
							List_curPriceWriterHtml +='<li class="title-params  J_SetAllItem clear min-height-30" ><div class="ui-side-list w-100">现价文案：</div><div class="ui-content-list">'+
							'<input type="text" id ="J_curPriceWriter" value="'+item['value']+'" title="现价文案" class="input-text-3 J_Param_Value">'+
							'<input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/>'+
							'</div><div class="fl"><select id="J_CPrice" name="oripricewriter" onchange="KISSY.DOM.val(\'#J_curPriceWriter\',this.value)">';
							if(paramOptons['cur_price_writer']){
								S.each(paramOptons['cur_price_writer'],function(item){
									List_curPriceWriterHtml+=  '<option value="'+item+'">'+item+'</option>';
								})
							}
							List_curPriceWriterHtml+='</select></div></li>';
						}
						/*宝贝标签*/
						if(item['field_code'] == 'tiny_labels'){
							var defaultTiny = item['value'].split("#");
							List_tinyLabelsHtml +='<li class="title-params  J_SetAllItem clear " ><div class="ui-side-list w-100">小标签：</div><div class="ui-content-list">'+
								'<input type="hidden" class="J_Param_Value" id ="J_SetTinyLabels" value="'+item['value']+'"/><input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/>';
								if(paramOptons['tiny_labels']){
									S.each(paramOptons['tiny_labels'],function(ite){
										List_tinyLabelsHtml+= '<a href="#2"';
											S.each(defaultTiny,function(d){
												if( d !='' && d == ite){
													List_tinyLabelsHtml+= 'class="t-current"';
												}
											})
										List_tinyLabelsHtml+='><img src="'+ite+'" class="J_TinyLabels" onClick="var elem = this;listParam.setAllTiny(elem)" /></a>&nbsp;&nbsp;';
									})
								}
							List_tinyLabelsHtml+='</div></li>';
						}
						/*宝贝参数1*/
						if(item['field_code'] == 'item_param1'){
							List_itemParam1Html +='<li class="title-params  J_SetAllItem clear min-height-30" ><div class="ui-side-list w-100">'+list.defaultItemFieldNames[item.field_code]+'：</div><div class="ui-content-list">'+
											 '<input type="text"  name="param1" value="'+item['value']+'" title="param1" class="J_Param_Value input-text-3">'+
											 '<input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/></div></li>';
						}
						/*宝贝参数2*/
						if(item['field_code'] == 'item_param2'){
							List_itemParam2Html +='<li class="title-params  J_SetAllItem clear min-height-30" ><div class="ui-side-list w-100">'+list.defaultItemFieldNames[item.field_code]+'：</div><div class="ui-content-list">'+
											 '<input type="text"  name="param2" value="'+item['value']+'" title="param2" class="J_Param_Value input-text-3">'+
											 '<input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/></div></li>';
						}
						/* 宝贝参数3*/
						if(item['field_code'] == 'item_param3'){
							List_itemParam3Html +='<li class="title-params  J_SetAllItem clear min-height-30" ><div class="ui-side-list w-100">'+list.defaultItemFieldNames[item.field_code]+'：</div><div class="ui-content-list">'+
											 '<input type="text"  name="param3" value="'+item['value']+'" title="param3" class="J_Param_Value input-text-3">'+
											 '<input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/></div></li>';
						}
						/*宝贝参数4*/
						if(item['field_code'] == 'item_param4'){
							List_itemParam1Html +='<li class="title-params  J_SetAllItem clear min-height-30" ><div class="ui-side-list w-100">'+list.defaultItemFieldNames[item.field_code]+'：</div><div class="ui-content-list">'+
											 '<input type="text"  name="param4" value="'+item['value']+'" title="param4" class="J_Param_Value input-text-3">'+
											 '<input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/></div></li>';
						}
						/*宝贝参数5*/
						if(item['field_code'] == 'item_param5'){
							List_itemParam5Html +='<li class="title-params  J_SetAllItem clear min-height-30" ><div class="ui-side-list w-100">'+list.defaultItemFieldNames[item.field_code]+'：</div><div class="ui-content-list">'+
											 '<input type="text"  name="param5" value="'+item['value']+'" title="param5" class="J_Param_Value input-text-3">'+
											 '<input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/></div></li>';
						}
						/* 宝贝参数6*/
						if(item['field_code'] == 'item_param6'){
							List_itemParam6Html +='<li class="title-params  J_SetAllItem clear min-height-30" ><div class="ui-side-list w-100">'+list.defaultItemFieldNames[item.field_code]+'：</div><div class="ui-content-list">'+
											 '<input type="text"  name="param6" value="'+item['value']+'" title="param6" class="J_Param_Value input-text-3">'+
											 '<input type="hidden" class="J_Param_ParamId" value="'+item.param_id+'"/><input type="hidden" class="J_Param_FieldCode" value="'+item.field_code+'"/></div></li>';
						}
				})
				
				
				ListStr = colorHtml+frameHtml+moreLinkHtml+qualityPicsHtml+keywordsHtml+listParamsHtm1+listParamsHtm2+listParamsHtm3+listParamsHtm4+listParamsHtm5+listParamsHtm6+listParamsHtm7+listParamsHtm8+listParamsConfirmHtm;
				if(mtype==7 && meal_id==0){
//					ListStr += '<li class="title-params"><div class="ui-side-list w-100" >&nbsp;</div><div class="ui-content-list"><a href="http://bangpai.taobao.com/group/thread/609027-277801311.htm?spm=0.0.0.40.35d48a" target="_blank">没有链接？您可能没订购官方的搭配套餐，点击查看详情</a></div></li>'; 
				}
				ItemStr = List_itemParamExplainHtml+List_oriPriceWriterHtml+List_curPriceWriterHtml+List_tinyLabelsHtml+List_itemParam1Html+List_itemParam2Html+List_itemParam3Html+List_itemParam4Html+List_itemParam5Html+List_itemParam6Html;
				if(list.defaultItemParams.length>0){
					ItemStr +=	'<li class="  clear min-height-30"><div class="ui-side-list w-100">&nbsp;</div><div class="ui-content-list"><button class="btm-small button-gray" onclick="list.setAllItems();">应用到以下宝贝</button></div></li>';
				}
				DOM.html('#J_AllItemParams',ItemStr);
				DOM.html('#J_listParams',ListStr);
				//品质图片
				if(DOM.query('.J_quality_pics').length>0){
					Event.on(DOM.query('.J_quality_pics'),'click',function(ev){
						var src = DOM.attr(DOM.children(ev.currentTarget)[0],'src');
						var paramVlaue = DOM.val('#J_QualityPics');
						if(DOM.hasClass(DOM.parent(ev.currentTarget),'a-current')){
							paramVlaue = paramVlaue.replace('#'+src,'');
							paramVlaue = paramVlaue.replace(src+'#','');
							paramVlaue = paramVlaue.replace(src,'');
							DOM.removeClass(DOM.parent(ev.currentTarget),'a-current');
						}else{
							if(paramVlaue==''){
								paramVlaue+=src;
							}else{
								paramVlaue+='#'+src;
							}
							DOM.addClass(DOM.parent(ev.currentTarget),'a-current');
						}
						DOM.val('#J_QualityPics',paramVlaue);
					})
				}
				//颜色选择
				if(DOM.query('.J_SelectColor').length>0){
					Event.on(DOM.query('.J_SelectColor'),'click',function(ev){
						var color = DOM.attr(ev.currentTarget,'data');
							DOM.removeClass(DOM.query('.list-template-color'),'a-current');
							DOM.toggleClass(this,'a-current');
							DOM.val('#J_color',color);
							list.preview();
					})
				}
				
				Event.on(DOM.query('.J_list_width'),'click',listParam.changeListOption);
				Event.on(DOM.query('.J_main_size'),'click',listParam.changeMainSise);
			},
			//模板 宽度 选择
			changeListOption : function(){
				if(mtype==7){
					var w =this.id;
					DOM.replaceClass(DOM.query('.J_width'),'on-center off-center','off-center');
					DOM.replaceClass(DOM.parent(this),'on-center off-center','on-center');
					var guige_proto = w.split('-');
					DOM.val('#J_items_per_line',guige_proto[0]);
					var ttemps = guige_proto[0].split('_');
					limit = parseInt(ttemps[3]);
					//limit = parseInt(limitNums[guige_proto[0].substr(0,3)]);
					if(guige_proto[1]!=protoId){
						window.location = dapeiUrl+guige_proto[1]+"&items_per_line="+guige_proto[0]+"&isShowFirst=0";
					}
				}else {
					var w =this.id;
					var s = DOM.val('#J_mian_size'+w);//模板宽度w下的默认主图规格
					DOM.hide(DOM.query('.J_mainSize'));
					DOM.show('#J_mainSize'+w);
					DOM.replaceClass(DOM.query('.J_width'),'on-center off-center','off-center');
					DOM.replaceClass(DOM.parent(this),'on-center off-center','on-center');
					DOM.val('#J_frame_width',w);//模板宽度
					if(s != ''){
						DOM.html('#J_item_pre_line',formats[w][s][1]); //2012-11-09
					}else{
						DOM.html('#J_item_pre_line','请选择主图规格');
					}
					
					limit = parseInt(limitNums[w]);
					var len = w+'_'+formats[w][s][0]+'_'+s+'_'+formats[w][s][1];//2012-11-09
					DOM.val('#J_items_per_line',len);

					//2012-11-09
					for(var ik in list.savedPics){
						//alert(list.savedPics[ik]);
						list.savedPics[ik] = (list.savedPics[ik]+'').replace(/_\d{2,3}x\d{2,3}\.jpg$/,'_'+2+'x'+2+'.jpg');
						//alert(list.savedPics[ik]);
					}
					
				}
				listParam.getDesignPics(protoId, w);
				list.preview();
				//alert(limit);
			},
			getDesignPics : function(protoId, w) {
				var submitHandle = function(o) {
					list.designPics = o.payload;
	    	    };
	    	    var errorHandle = function(o) {
						new H.widget.msgBox({
							    title:"错误提示",
							    content:o.desc,
							    type:"error"
							});
	        	};
	     	    var data = "proto_id="+protoId+"&width="+w+"&form_key="+FORM_KEY;
	    	    new H.widget.asyncRequest().setURI(getDesignPicsUrl).setMethod("POST").setHandle(submitHandle).setErrorHandle(errorHandle).setData(data).send();
			},
			//主图  宽度 选择
			changeMainSise : function(){
				 var s = this.id;
				 var w =DOM.val('#J_frame_width');
				 DOM.replaceClass(DOM.query('#J_mainSize'+w+' .J_Mwidth'),'on-center off-center','off-center');
				 DOM.replaceClass(DOM.parent(this),'on-center off-center','on-center');
				 DOM.val('#J_mian_size'+w,s);
				 DOM.html('#J_item_pre_line',formats[w][s][1]);//2012-11-09
				 var len = w+'_'+formats[w][s][0]+'_'+s+'_'+formats[w][s][1];
				 DOM.val('#J_items_per_line',len);

				 //2012-11-09
				 for(var ik in list.savedPics){
					list.savedPics[ik] = (list.savedPics[ik]+'').replace(/_\d{2,3}x\d{2,3}\.jpg$/ , '_'+s+'x'+s+'.jpg');
				}
			},
			setAllTiny : function(el){
				var src = DOM.attr(el,'src');
				var paramVlaue = DOM.val('#J_SetTinyLabels');
				if(DOM.hasClass(DOM.parent(el),'t-current')){
					paramVlaue = paramVlaue.replace('#'+src,'');
					paramVlaue = paramVlaue.replace(src+'#','');
					paramVlaue = paramVlaue.replace(src,'');
					DOM.removeClass(DOM.parent(el),'t-current');
					DOM.addClass(DOM.parent(el),'e-current');
				}else{
					if(paramVlaue==''){
						paramVlaue+=src;
					}else{
						paramVlaue+='#'+src;
					}
					DOM.removeClass(DOM.parent(el),'e-current');
					DOM.addClass(DOM.parent(el),'t-current');
				}
				DOM.val('#J_SetTinyLabels',paramVlaue);
			}
		
	}
	
}, {
    requires: []
});