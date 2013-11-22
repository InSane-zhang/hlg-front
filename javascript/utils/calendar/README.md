#Calendar for KISSY
***

##组件简介：
***

Calendar组件是bootstrap下的daterangepicker组件的KISSY移植版，供欢乐逛网站使用，并且根据自身需求做了较多的调整和改动。

本组件可以创建一个弹出菜单，用于日期时间及其区间的选择。

在没有设置任何附加选项的情况下，本组件将提供两个日历界面，位于左侧的日历用于选择开始日期，位于右侧的日历用于选择结束日期。如果本组件是被应用到一个文本输入框，所选择的日期将会被填入到该文本框内，如果不是，则需提供一个回调函数。

##如何使用：
***

本组件依赖于moment模块、holiday插件和KISSY框架

###调用方法
***

    <link rel="stylesheet" type="text/css" media="all" href="../daterangepicker-bs3.css" />  
    <script type="text/javascript" src="http://g.tbcdn.cn/kissy/k/1.3.0/kissy-min.js" charset="utf-8"></script>  
    <script type="text/javascript">  
    KISSY.use('gallery/calendar/1.3/index', function(S, Calendar) {
       var $ = S.all;
       var _calendar = new Calendar('#reservationtime');  
    });  
    </script>
    
    <input id="reservationtime" type="text" />

这个构建函数同时可以接受一个可自定义的选项对象及一个回调函数作为可选参数，回调函数会在日期/时间被更改的时候被调用。回调函数会传递两个moment日期对象作为参数：开始日期和结束日期。您可以使用moment模块里的方法对其进行处理。例如：

    <script type="text/javascript">   
    KISSY.use('gallery/calendar/1.3/index', function(S, Calendar) { 
       var $ = S.all; 
       var _calendar = new Calendar('#reservationtime', {
           format: 'YYYY-MM-DD',
           startDate: '2013-01-01',
           endDate: '2013-12-31'
       }, function(start, end){
           alert('您选择的日期为：' + start.format('YYYY-MM-DD') + ' 到 ' + end.format('YYYY-MM-DD'));
       });   
    });   
    </script>

##选项设置：
***

**startDate**: （Date对象、moment对象或字符串）

所选择的开始日期

**endDate**: （Date对象、moment对象或字符串）

所选择的结束日期

**minDate**: （Date对象、moment对象或字符串）

所能选择的最早日期

**maxDate**: （Date对象、moment对象或字符串）

所能选择的最晚日期

**dateLimit**: （对象）

所能选择的日期范围的最大区间，可以包含所有你能添加到moment对象中的属性，比如天数、月数等。

**timePicker**：（布尔值）

允许选择时间，而非仅只日期

**timePickerIncrement**：（数值）

定义分钟选单的递进差值，例如：定义为30，将只允许用户选择0分或30分的时间

**buttonClasses**：（数组）

这里定义的css类名将会被添加到所有的按钮中

**applyClass**：（字符串）

将会被添加到确定按钮的class属性中

**cancelClass**：（字符串）

将会被添加到取消按钮的class属性中

**format**：（字符串）

用来定义日期与时间格式化的方式

**separator**：（字符串）

定义文本输入框中，两个日期之间的文本

**locale**：（对象）

允许你为按钮和标签设置本地语言，以及哪一天作为星期的开始  
