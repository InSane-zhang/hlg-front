KISSY.add('page/memberEdit-init',function (S,showPages,Select) {
    // your code here
	var DOM = S.DOM, Event = S.Event;	
	
	return	editControl = {
			paginator : null,
			init : function() {
				var items = [
				  {text:'会员等级',value:'0'},
				  {text:'普通客户',value:'1'},
				  {text:'高级会员',value:'2'},
				  {text:'VIP会员',value:'3'},
				  {text:'至尊VIP会员',value:'4'}						  
				],
				select = new Select.Select({  
				  render:'#J_Member',   
				  valueField:'#J_Grade',
				  items:items
				});
				select.render();
				select.setSelectedValue('0');
			}
	}
}, {
    requires: ['utils/showPages/index','bui/select']
});
