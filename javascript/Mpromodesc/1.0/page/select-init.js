/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S,showPages,Select) {
    // your code here
    	var DOM = S.DOM, Event = S.Event;	
		return selectControl = {
			    	paginator : null,
			    	promodescItemPaginator : null,
			    	itemCache : null,
			    	promodescItemCache : null,
			    	panel : null,
			    	msg : null,
			    	init : function() {
						var items = [
						  {text:'活动类型',value:'all'},
						  {text:'限时折扣',value:'2'},
						  {text:'一口价',value:'10'},
						  {text:'团购',value:'9'},
						  {text:'部分商品免邮',value:'106'},
						  {text:'部分商品满就送',value:'108'},
						  {text:'部分商品送彩票',value:'208'},
						  {text:'全店免邮',value:'105'},
						  {text:'全店满就送',value:'107'},
						  {text:'全店送彩票',value:'207'},
						  {text:'免邮[部分不参与]',value:'115'},
						  {text:'满就送[部分不参与]',value:'117'},
						  {text:'送彩票[部分不参与]',value:'217'}
						],
						select = new Select.Select({  
						  render:'#J_PromoSmart',
						  valueField:'#J_SearchStatus',
						  items:items
						});
						select.render();
						var value = DOM.val('#J_SearchStatus');
	     	            select.on('change', function(ev){
	     	            	var value = DOM.val('#J_SearchStatus');
	     	            	window.location.href=loadSelectTbUrl+'&type='+value;
	     	            });
	     	            select.setSelectedValue(value);
			        }
			}
}, {
    requires: ['utils/showPages/index','bui/select']
});