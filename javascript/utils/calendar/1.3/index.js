/**
 * @fileoverview 一个为欢乐逛量身定制的日历组件
 * @author hlg
 * @module calendar
 **/
KISSY.add(function(S, Node, Base, moment,Holidays) {

    var $ = Node.all;
    var DOM = S.DOM;
    var TMP = S.substitute;
    var WIN = S.one(window);
    var DOC = S.one(document);

    /**
     * @name Calendar
     * @class 日历
     * @since 1.2
     * @constructor
     * @extends Base
     */
    function Calendar(element, options, cb) {
        var self = this;
        if (!(self instanceof Calendar)) { 
            return new Calendar(element, options, cb); 
        } 
        self.startDate = moment().startOf('day');
        self.endDate = moment().startOf('day');
        self.minDate = false;
        self.maxDate = false;
        self.dateLimit = false;

        self.showDropdowns = false;
        self.showWeekNumbers = false;
        self.timePicker = false;
        self.timePickerIncrement = 5;
        self.ranges = {};
        self.opens = 'right';
        self.buttonClasses = ['btn', 'btn-small'];
        self.applyClass = 'btn-success';
        self.cancelClass = 'btn-default';
        self.format = 'MM/DD/YYYY';
        self.separator = ' - ';
        self.locale = {
            applyLabel: '确定',
            cancelLabel: '取消',
            fromLabel: '从',
            toLabel: '到',
            weekLabel: 'W',
            customRangeLabel: 'Custom Range',
            daysOfWeek: ['日','一','二','三','四','五','六'].slice(),
            monthNames: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'].slice(),
            firstDay: 0
        };
        // by default, the daterangepicker element is placed at the bottom of HTML body
        self.parentEl = 'body';
        self.cb = function () { };

        self.single = false;
        
        self.agent = false;
       
        // 初始化组件
        self.initializer(element, options ,cb );
      
    }


    S.augment(Calendar,{
        /**
         * 日历初始化
         *
         * @method initializer
         */
        
        initializer: function(el, options ,cb) {
            var self = this;
            var hasOptions = typeof options == 'object';
            var localeObject;
               //element that triggered the date range picker
            self.element = $(el);
            if (this.element.hasClass('pull-right'))
                self.opens = 'left';
            
            localeObject = self.locale;
            
            if (hasOptions) {
                if (typeof options.locale == 'object') {
                    S.each(localeObject, function (property, value) {
                        localeObject[property] = options.locale[property] || value;
                    });
                }
                if (options.applyClass) {
                     self.applyClass = options.applyClass;
                }
                if (options.cancelClass) {
                     self.cancelClass = options.cancelClass;
                }
            }
            var guid = S.guid();
            if (typeof options.agentId === 'string'){
                self._calendarId = options.agentId;
            } else {
                self._calendarId = 'calendar-' + guid;
            }
            var DRPTemplate = '<div class="daterangepicker dropdown-menu ' + (options.single ? 'daterangepicker-single' : '') + '" id="'+self._calendarId+'">' +
                '<div class="calendar left"></div>' +
                '<div class="calendar right"></div>' +
                '<div class="ranges">' +
                  '<div class="range_inputs"><div class="split" style="float:left;">从</div>' +
                    '<div class="daterangepicker_start_input" style="float: left">' +
                      '<label for="daterangepicker_start">' + self.locale.fromLabel + '</label>' +
                      '<input class="input-mini daterangepicker_start" type="text" name="daterangepicker_start" value="" disabled="disabled" />' +
                    '</div><div class="split" style="float:left;">到</div>' +
                    '<div class="daterangepicker_end_input" style="float: left;">' +
                      '<label for="daterangepicker_end">' + self.locale.toLabel + '</label>' +
                      '<input class="input-mini daterangepicker_end" type="text" name="daterangepicker_end" value="" disabled="disabled" />' +
                    '</div>' +
                    '<button class="' + self.applyClass + ' applyBtn" disabled="disabled">' + self.locale.applyLabel + '</button>&nbsp;' +
                    //'<button class="' + self.cancelClass + ' cancelBtn">' + self.locale.cancelLabel + '</button>' +
                  '</div>' +
                '</div>' +
              '</div>';
            
            self.parentEl = (hasOptions && options.parentEl && $(options.parentEl)) || $(self.parentEl);
            
            //the date range picker
            self.container = $(DRPTemplate).appendTo(self.parentEl);
            if (hasOptions) {

                if (typeof options.format == 'string')
                    self.format = options.format;

                if (typeof options.separator == 'string')
                    self.separator = options.separator;

                if (typeof options.startDate == 'string')
                    self.startDate = moment(options.startDate, self.format);

                if (typeof options.endDate == 'string')
                    self.endDate = moment(options.endDate, self.format);

                if (typeof options.minDate == 'string')
                    self.minDate = moment(options.minDate, self.format);

                if (typeof options.maxDate == 'string')
                    self.maxDate = moment(options.maxDate, self.format);

                if (typeof options.startDate == 'object')
                    self.startDate = moment(options.startDate);

                if (typeof options.endDate == 'object')
                    self.endDate = moment(options.endDate);

                if (typeof options.minDate == 'object')
                    self.minDate = moment(options.minDate);

                if (typeof options.maxDate == 'object')
                    self.maxDate = moment(options.maxDate);

                if (typeof options.ranges == 'object') {
                    for (var range in options.ranges) {

                        var start = moment(options.ranges[range][0]);
                        var end = moment(options.ranges[range][1]);

                        // If we have a min/max date set, bound this range
                        // to it, but only if it would otherwise fall
                        // outside of the min/max.
                        if (self.minDate && start.isBefore(self.minDate))
                            start = moment(self.minDate);

                        if (self.maxDate && end.isAfter(self.maxDate))
                            end = moment(self.maxDate);

                        // If the end of the range is before the minimum (if min is set) OR
                        // the start of the range is after the max (also if set) don't display this
                        // range option.
                        if ((self.minDate && end.isBefore(self.minDate)) || (self.maxDate && start.isAfter(self.maxDate))) {
                            continue;
                        }

                        this.ranges[range] = [start, end];
                    }

                    var list = '<ul>';
                    for (var range in this.ranges) {
                        list += '<li>' + range + '</li>';
                    }
                    list += '<li>' + this.locale.customRangeLabel + '</li>';
                    list += '</ul>';
                    self.container.one('.ranges').prepend(list);
                }

                if (typeof options.dateLimit == 'object')
                    self.dateLimit = options.dateLimit;

                // update day names order to firstDay
                if (typeof options.locale == 'object') {
                    if (typeof options.locale.firstDay == 'number') {
                        self.locale.firstDay = options.locale.firstDay;
                        var iterator = options.locale.firstDay;
                        while (iterator > 0) {
                            self.locale.daysOfWeek.push(self.locale.daysOfWeek.shift());
                            iterator--;
                        }
                    }
                }

                if (typeof options.opens == 'string')
                    self.opens = options.opens;

                if (typeof options.showWeekNumbers == 'boolean') {
                    self.showWeekNumbers = options.showWeekNumbers;
                }

                if (typeof options.buttonClasses == 'string') {
                    self.buttonClasses = [options.buttonClasses];
                }

                if (typeof options.buttonClasses == 'object') {
                    self.buttonClasses = options.buttonClasses;
                }

                if (typeof options.showDropdowns == 'boolean') {
                    self.showDropdowns = options.showDropdowns;
                }

                if (typeof options.timePicker == 'boolean') {
                    self.timePicker = options.timePicker;
                }

                if (typeof options.timePickerIncrement == 'number') {
                    self.timePickerIncrement = options.timePickerIncrement;
                }

                if (typeof options.single == 'boolean') {
                    self.single = options.single;
                }
                
                if (typeof options.agent !== 'undefined') {
                    self.agent = options.agent;
                }

            }
            
            if (!self.timePicker) {
                self.startDate = self.startDate.startOf('day');
                self.endDate = self.endDate.startOf('day');
            }
            //apply CSS classes to buttons
            var c = self.container;
            S.each(self.buttonClasses, function (val,idx) {
                c.one('button').addClass(val);
            });
            if (self.opens == 'right') {
                //swap calendar positions
                
                var left = self.container.one('.left');
                var right = self.container.one('.right');
                left.removeClass('left').addClass('right');
                right.removeClass('right').addClass('left');
            }
            if (typeof options == 'undefined' || typeof options.ranges == 'undefined') {
                self.container.all('.calendar').show();
                self.move();
            }
            if (typeof cb == 'function')
                self.cb = cb;

            self.container.addClass('opens' + self.opens);
            
          //try parse date if in text input
            if (!hasOptions || (typeof options.startDate == 'undefined' && typeof options.endDate == 'undefined')) {
                if (self._isInput($(self.element))) {
                    var val = $(self.element).val();
                    var split = val.split(self.separator);
                    var start, end;
                    if (split.length == 2) {
                        start = moment(split[0], self.format);
                        end = moment(split[1], self.format);
                    }
                    if (start != null && end != null) {
                        self.startDate = start;
                        self.endDate = end;
                    }
                }
            }
            
            //state
            self.oldStartDate = self.startDate.clone();
            self.oldEndDate = self.endDate.clone();

            self.leftCalendar = {
                month: moment([self.startDate.year(), self.startDate.month(), 1, self.startDate.hour(), self.startDate.minute()]),
                calendar: []
            };

            self.rightCalendar = {
                month: moment([self.endDate.year(), self.endDate.month(), 1, self.endDate.hour(), self.endDate.minute()]),
                calendar: []
            };
            
            self.bindUI();
            
        },
        /**
         * 判断node是不是input
         *
         * @method _isInput
         * @param  {Object} v node
         * @private
         */
        _isInput: function(v) {
            return v.getDOMNode && v.getDOMNode().tagName.toUpperCase() === 'INPUT' && (v.attr('type') === 'text' || v.attr('type') === 'date');
        },
        
        /**
         * 事件绑定
         *
         * @method bindUI
         */
        bindUI: function() {
            var self = this;
            if (self._isInput(self.element)) {
                 self.element.on('click', self.show, self);
                 self.element.on('focusin', self.show, self);
            } else {
                 self.element.on('click', self.show, self);
            }
            
            //event listeners
            this.container.on('mousedown', this.mousedown, this);
            this.container.all('.calendar').delegate('click', '.prev', self.clickPrev, this);
            this.container.all('.calendar').delegate('click', '.next', this.clickNext, this);
            this.container.one('.ranges').delegate('click', 'button.applyBtn', this.clickApply, this);
            this.container.one('.ranges').delegate('click', 'button.cancelBtn', this.clickCancel, this);

            this.container.one('.ranges').delegate('click', '.daterangepicker_start_input', this.showCalendars, this);
            this.container.one('.ranges').delegate('click', '.daterangepicker_end_input', this.showCalendars, this);

            this.container.all('.calendar').delegate('click', 'td.available',this.clickDate, this);
            this.container.all('.calendar').delegate('mouseenter', 'td.available', this.enterDate, this);
            this.container.all('.calendar').delegate('mouseleave', 'td.available', function(e){
                DOM.removeClass(e.target,'hover');
                this.updateView();
            }, this);

            this.container.one('.ranges').delegate('click', 'li', this.clickRange, this);
            this.container.one('.ranges').delegate('mouseenter', 'li', this.enterRange, this);
            this.container.one('.ranges').delegate('mouseleave', 'li', this.updateView, this);
//
            this.container.all('.calendar').delegate('change', 'select.yearselect', this.updateMonthYear, this);
            this.container.all('.calendar').delegate('change', 'select.monthselect', this.updateMonthYear, this);
//
            //this.container.all('.calendar').delegate('change', 'select.hourselect', this.updateTime, this);
            //this.container.all('.calendar').delegate('change', 'select.minuteselect', this.updateTime, this);
            //this.container.all('.calendar').delegate('change', 'select.ampmselect', this.updateTime, this);

            //this.element.on('keyup', this.updateFromControl, this);
            this.container.all('.calendar').delegate('click', '.hourselect', this.fakeSelect, this);
            this.container.all('.calendar').delegate('click', '.minuteselect', this.fakeSelect, this);
            this.container.all('.calendar').delegate('click', '.hourselect-val', this.fakeSelectShow, this);
            this.container.all('.calendar').delegate('click', '.minuteselect-val', this.fakeSelectShow, this);

            $(document).on('click', this.fakeSelectHide, this);

            this.updateView();
            this.updateCalendars();
           
            //WIN.on('resize', self._setPos, self);
            return self;
        },
        fakeSelectShow: function(e){
            var item;

            if ($(e.target).nodeName() === 'p'){
                item = $(e.target);
            } else {
                item = $(e.target).parent('p');
            }

            item.next().show();
        },
        fakeSelectHide: function(e){
            //if ($(e.target).test('.')
            var fakeselect = $(e.target).parent('.fakeselect');

            var elems = $('div.fakeselect');
            var lists = elems.all('div.list');

            if (!fakeselect || fakeselect.length === 0){
                lists.hide();
                return;
            }

            S.each(elems, function(elem){
                if ($(elem).getDOMNode() !== fakeselect.getDOMNode()){
                    $(elem).one('.list').hide();
                }
            });

        },
        fakeSelect: function(e){
            var opt;

            if ($(e.target).nodeName() === 'li'){
                opt = $(e.target);
            } else {
                opt = $(e.target).parent('li');
            }
            var value = opt.attr('j_val');
            var ctnr = opt.parent().parent();
            ctnr.prev().html(value);

            opt.addClass('selected').siblings().removeClass('selected');
            ctnr.hide();

            var isLeft = $(e.target).parent('.calendar').hasClass('left');
            var cal = this.container.one('.left');
            if (!isLeft)
                cal = this.container.one('.right');

            var hour = parseInt(cal.one('.hourselect-val').html());
            var minute = parseInt(cal.one('.minuteselect-val').html());


            if (isLeft) {
                var start = this.startDate.clone();
                start.hour(hour);
                start.minute(minute);
                this.startDate = start;
                this.leftCalendar.month.hour(hour).minute(minute);
                
                
            } else {
                var end = this.endDate.clone();
                //如果结束时间和开始时间同一天，且 小时 小于了 开始时间的小时，则退后一天
                if(end.format('YYYY-MM-DD') == this.startDate.format('YYYY-MM-DD') && this.startDate.hour() > hour){
                    end = moment(this.startDate).add('day', 1).startOf('day');
                }
                end.hour(hour);
                end.minute(minute);
                
                this.endDate = end;
                this.rightCalendar.month.hour(hour).minute(minute);
            }

            this.updateCalendars();

            //abc.leftCalendar.month.hour(13);
            //console.log(this.startDate);
            //console.log($(e.target).nodeName());
           //console.log($(e.target).parent('.fakeselect')[0]);
        },
        mousedown: function (e) {
              e.stopPropagation();
        },
        updateView: function () {
            var self = this ;
            this.leftCalendar.month.month(self.startDate.month()).year(self.startDate.year());
            this.rightCalendar.month.month(self.endDate.month()).year(self.endDate.year());

            this.container.one('.daterangepicker_start').val(self.startDate.format(self.format));
            this.container.one('.daterangepicker_end').val(self.endDate.format(self.format));

            if (this.startDate.isSame(self.endDate) || self.startDate.isBefore(self.endDate)) {
                this.container.one('button.applyBtn').removeAttr('disabled');
            } else {
                this.container.one('button.applyBtn').attr('disabled', 'disabled');
            }
        },
        updateFromControl: function () {
            var self = this ;
            if (!self._isInput(this.element)) return;
            if (!this.element.val().length) return;

            var dateString = this.element.val().split(self.separator);
            var start = moment(dateString[0], self.format);
            var end = moment(dateString[1], self.format);

            if (start == null || end == null) return;
            if (end.isBefore(start)) return;

            this.oldStartDate = self.startDate.clone();
            this.oldEndDate = self.endDate.clone();

            self.startDate = start;
            self.endDate = end;

            if (!self.startDate.isSame(this.oldStartDate) || !self.endDate.isSame(this.oldEndDate))
                this.notify();

            this.updateCalendars();
        },
        notify: function () {
            var self = this ;
            this.updateView();
            
        },
        
        _isBosy: function(v) {
            return v.getDOMNode && v.getDOMNode().tagName.toUpperCase() === 'BODY';
        },
        move: function () {
            var self = this ;
            var parentOffset = {
                top: this.parentEl.offset().top - (self._isBosy(this.parentEl) ? 0 : this.parentEl.scrollTop()),
                left: this.parentEl.offset().left - (self._isBosy(this.parentEl) ? 0 : this.parentEl.scrollLeft())
            };
            if (this.opens == 'left') {
                this.container.css({
                    top: this.element.offset().top + this.element.outerHeight() - parentOffset.top,
                    right: $(window).width() - this.element.offset().left - this.element.outerWidth() - parentOffset.left,
                    left: 'auto'
                });
                if (this.container.offset().left < 0) {
                    this.container.css({
                        right: 'auto',
                        left: 9
                    });
                }
            } else {
                this.container.css({
                    top: this.element.offset().top + this.element.outerHeight() - parentOffset.top,
                    left: this.element.offset().left - parentOffset.left,
                    right: 'auto'
                });
                if (this.container.offset().left + this.container.outerWidth() > $(window).width()) {
                    this.container.css({
                        left: 'auto',
                        right: 0
                    });
                }
            }
        },
        show: function (e) {
            var self = this ;
            self.container.show();
            this.move();
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
            self._hide = true;
            $(document).on('mousedown', this.hide, this);
           // this.element.fire('shown', {target: e.target, picker: this});
        },

        hide: function (e) {
            var self = this ;
            this.container.hide();
            self._hide = false;
            if (!this.startDate.isSame(this.oldStartDate) || !this.endDate.isSame(this.oldEndDate))
                this.notify();
            this.oldStartDate = this.startDate.clone();
            this.oldEndDate = this.endDate.clone();

            $(document).remove('mousedown', this.hide);
           // this.element.fire('hidden', { picker: this });
        },
        enterRange: function (e) {
            var label = e.target.innerHTML;
            if (label == this.locale.customRangeLabel) {
                this.updateView();
            } else {
                var dates = this.ranges[label];
                this.container.one('.daterangepicker_start').val(dates[0].format(this.format));
                this.container.one('.daterangepicker_end').val(dates[1].format(this.format));
            }
        },

        showCalendars: function() {
            this.container.all('.calendar').show();
            this.move();
        },

        updateInputText: function() {
            var self = this;
            if (self._isInput(this.element))
                this.element.val(this.startDate.format(this.format) + this.separator + this.endDate.format(this.format));
            this.cb(self.startDate, self.endDate, self.agent);
        },
        clickRange: function (e) {
            var label = e.target.innerHTML;
            if (label == this.locale.customRangeLabel) {
                this.showCalendars();
            } else {
                var dates = this.ranges[label];

                this.startDate = dates[0];
                this.endDate = dates[1];

                if (!this.timePicker) {
                    this.startDate.startOf('day');
                    this.endDate.startOf('day');
                }

                this.leftCalendar.month.month(this.startDate.month()).year(this.startDate.year()).hour(this.startDate.hour()).minute(this.startDate.minute());
                this.rightCalendar.month.month(this.endDate.month()).year(this.endDate.year()).hour(this.endDate.hour()).minute(this.endDate.minute());
                this.updateCalendars();

                this.updateInputText();

                this.container.all('.calendar').hide();
                this.hide();
            }
        },

        clickPrev: function (e) {
            if (!$(e.target).test('.available') && !$(e.target).parent().test('.available')) return false;
            var cal = $(e.target).parent('.calendar');
            if (cal.hasClass('left')) {
                this.leftCalendar.month.subtract('month', 1);
            } else {
                this.rightCalendar.month.subtract('month', 1);
            }
            this.updateCalendars();
        },

        clickNext: function (e) {
            var cal = $(e.target).parent('.calendar');
            if (cal.hasClass('left')) {
                this.leftCalendar.month.add('month', 1);
            } else {
                this.rightCalendar.month.add('month', 1);
            }
            this.updateCalendars();
        },
        enterDate: function (e) {
            var item;
            if ($(e.target).test('td')){
                item = $(e.target);
            } else {
                item = $(e.target).parent('td');
            }
            
            var title = item.attr('data-title');
            var row = title.substr(1, 1);
            var col = title.substr(3, 1);
            var cal = item.parent('.calendar');

            DOM.addClass(item,'hover');
            if (cal.hasClass('left')) {
                //this.container.one('.daterangepicker_start').val(this.leftCalendar.calendar[row][col].format(this.format));
            } else {
                //this.container.one('.daterangepicker_end').val(this.rightCalendar.calendar[row][col].format(this.format));
            }
        },

        clickDate: function (e) {
            var item;
            if ($(e.target).test('td')){
                item = $(e.target);
            } else {
                item = $(e.target).parent('td');
            }

            var title = item.attr('data-title');
            var row = title.substr(1, 1);
            var col = title.substr(3, 1);
            var cal = item.parent('.calendar');

            if (cal.hasClass('left')) {
                var startDate = this.leftCalendar.calendar[row][col];
                var endDate = this.endDate;
                startDate = moment(startDate).startOf('day');
                
                if (typeof this.dateLimit == 'object') {
                    var maxDate = moment(startDate).add(this.dateLimit).startOf('day');
                    if (endDate.isAfter(maxDate)) {
                        endDate = maxDate;
                    }
                }
            } else {
                var startDate = this.startDate;
                var endDate = this.rightCalendar.calendar[row][col];
                endDate = moment(endDate).endOf('day');
                if (typeof this.dateLimit == 'object') {
                    var minDate = moment(endDate).subtract(this.dateLimit).startOf('day');
                    if (startDate.isBefore(minDate)) {
                        startDate = minDate;
                    }
                }
            }

            cal.all('td').removeClass('active');

            if (startDate.isSame(endDate) || startDate.isBefore(endDate)) {
                $(e.target).addClass('active');
                this.startDate = startDate;
                this.endDate = endDate;
            } else if (startDate.isAfter(endDate)) {
                item.addClass('active');
                this.startDate = startDate;
                this.endDate = moment(startDate).add('day', 1).endOf('day');
            }

            this.leftCalendar.month.month(this.startDate.month()).year(this.startDate.year()).hour(this.startDate.hour()).minute(this.startDate.minute());
            this.rightCalendar.month.month(this.endDate.month()).year(this.endDate.year()).hour(this.endDate.hour()).minute(this.endDate.minute());
            this.updateCalendars();

            //单个日历选单
            if (this.single){
                this.clickApply();
            }

        },

        clickApply: function (e) {
            this.updateInputText();
            this.hide();
        },
        clickCancel: function (e) {
            this.startDate = this.oldStartDate;
            this.endDate = this.oldEndDate;
            this.updateView();
            this.updateCalendars();
            this.hide();
        },

        updateMonthYear: function (e) {

            var isLeft = $(e.target).parent('.calendar').hasClass('left');
            var cal = this.container.one('.left');
            if (!isLeft)
                cal = this.container.one('.right');
            var month = parseInt(cal.one('.monthselect').val());
            var year = cal.one('.yearselect').val();

            if (isLeft) {
                this.leftCalendar.month.month(month).year(year);
            } else {
                this.rightCalendar.month.month(month).year(year);
            }

            this.updateCalendars();

        },

        updateTime: function(e) {
            var isLeft = $(e.target).parent('.calendar').hasClass('left');
            var cal = this.container.one('.left');
            if (!isLeft)
                cal = this.container.one('.right');

            var hour = parseInt(cal.one('.hourselect').val());
            var minute = parseInt(cal.one('.minuteselect').val());

            if (isLeft) {
                var start = this.startDate.clone();
                start.hour(hour);
                start.minute(minute);
                this.startDate = start;
                this.leftCalendar.month.hour(hour).minute(minute);
                
                
            } else {
                var end = this.endDate.clone();
                end.hour(hour);
                end.minute(minute);
                this.endDate = end;
                this.rightCalendar.month.hour(hour).minute(minute);
            }

            this.updateCalendars();

        },

        updateCalendars: function () {
            this.leftCalendar.calendar = this.buildCalendar(this.leftCalendar.month.month(), this.leftCalendar.month.year(), this.leftCalendar.month.hour(), this.leftCalendar.month.minute(), 'left');
            this.rightCalendar.calendar = this.buildCalendar(this.rightCalendar.month.month(), this.rightCalendar.month.year(), this.rightCalendar.month.hour(), this.rightCalendar.month.minute(), 'right');
            this.container.one('.left').html(this.renderCalendar(this.leftCalendar.calendar, this.startDate, this.minDate, this.maxDate, '开始时间'));
            this.container.one('.right').html(this.renderCalendar(this.rightCalendar.calendar, this.endDate, this.startDate, this.maxDate, '结束时间'));
            if(this.container.one('.ranges').one('li')){
                 this.container.one('.ranges').all('li').removeClass('active');
            }
            var customRange = true;
            var i = 0;
            for (var range in this.ranges) {
                if (this.timePicker) {
                    if (this.startDate.isSame(this.ranges[range][0]) && this.endDate.isSame(this.ranges[range][1])) {
                        customRange = false;
                        this.container.one('.ranges').all('li').item(i).addClass('active');
                    }
                } else {
                    //ignore times when comparing dates if time picker is not enabled
                    if (this.startDate.format('YYYY-MM-DD') == this.ranges[range][0].format('YYYY-MM-DD') && this.endDate.format('YYYY-MM-DD') == this.ranges[range][1].format('YYYY-MM-DD')) {
                        customRange = false;
                        this.container.one('.ranges').all('li').item(i).addClass('active');
                    }
                }
                i++;
            }
            if (customRange)
                DOM.addClass(DOM.last(DOM.get('.ranges ul')),'active');
            
        },
        buildCalendar: function (month, year, hour, minute, side) {

            var firstDay = moment([year, month, 1]);
            var lastMonth = moment(firstDay).subtract('month', 1).month();
            var lastYear = moment(firstDay).subtract('month', 1).year();

            var daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();

            var dayOfWeek = firstDay.day();

            //initialize a 6 rows x 7 columns array for the calendar
            var calendar = [];
            for (var i = 0; i < 6; i++) {
                calendar[i] = [];
            }

            //populate the calendar with date objects
            var startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
            if (startDay > daysInLastMonth)
                startDay -= 7;

            if (dayOfWeek == this.locale.firstDay)
                startDay = daysInLastMonth - 6;

            var curDate = moment([lastYear, lastMonth, startDay, 12, minute]);
            for (var i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment(curDate).add('hour', 24)) {
                if (i > 0 && col % 7 == 0) {
                    col = 0;
                    row++;
                }
                calendar[row][col] = curDate.clone().hour(hour);
                curDate.hour(12);
            }

            return calendar;

        },

        renderDropdowns: function (selected, minDate, maxDate) {
            var currentMonth = selected.month();
            var monthHtml = '<select class="monthselect">';
            var inMinYear = false;
            var inMaxYear = false;

            for (var m = 0; m < 12; m++) {
                if ((!inMinYear || m >= minDate.month()) && (!inMaxYear || m <= maxDate.month())) {
                    monthHtml += "<option value='" + m + "'" +
                        (m === currentMonth ? " selected='selected'" : "") +
                        ">" + this.locale.monthNames[m] + "</option>";
                }
            }
            monthHtml += "</select>";

            var currentYear = selected.year();
            var maxYear = (maxDate && maxDate.year()) || (currentYear + 5);
            var minYear = (minDate && minDate.year()) || (currentYear - 50);
            var yearHtml = '<select class="yearselect">';

            for (var y = minYear; y <= maxYear; y++) {
                yearHtml += '<option value="' + y + '"' +
                    (y === currentYear ? ' selected="selected"' : '') +
                    '>' + y + '</option>';
            }

            yearHtml += '</select>';

            return monthHtml + yearHtml;
        },

        renderCalendar: function (calendar, selected, minDate, maxDate, timetype) {

            var html = '<div class="calendar-date">';
            html += '<div class="topctrl">';
            html += '<div class="type">' + timetype + '</div><div class="ctrl">';
            if (!minDate || minDate.isBefore(calendar[1][1])) {
                html += '<div class="prev available"><i class="icon-arrow-left"></i></div>';
            } else {
                html += '<div class="prev">&nbsp;</div>';
            }

            var dateHtml = calendar[1][1].format(" YYYY") + '年'+ this.locale.monthNames[calendar[1][1].month()] ;

            if (this.showDropdowns) {
                dateHtml = this.renderDropdowns(calendar[1][1], minDate, maxDate);
            }

            html += '<div class="item">' + dateHtml + '</div>';
            if (!maxDate || maxDate.isAfter(calendar[1][1])) {
                html += '<div class="next available"><i class="icon-arrow-right"></i></div>';
            } else {
                html += '<div class="next">&nbsp;</div>';
            }

            html += '</div></div><div class="tablectnr">';



            html += '<table class="table-condensed">';
            html += '<thead>';

            // add empty cell for week number
            if (this.showWeekNumbers)
                html += '<th></th>';


            html += '<tr>';

            // add week number label
            if (this.showWeekNumbers)
                html += '<th class="week">' + this.locale.weekLabel + '</th>';

            S.each(this.locale.daysOfWeek, function ( dayOfWeek,index) {
                html += '<th>' + dayOfWeek + '</th>';
            });

            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';

            for (var row = 0; row < 6; row++) {
                html += '<tr>';

                // add week number
                if (this.showWeekNumbers)
                    html += '<td class="week">' + calendar[row][0].week() + '</td>';

                for (var col = 0; col < 7; col++) {
                    var cname = 'available ';
                    cname += (calendar[row][col].month() == calendar[1][1].month()) ? '' : ' off ';

                    cname += Holidays.getClassName(calendar[row][col].format('YYYY-MM-DD'))
                    if ((minDate && (calendar[row][col].isBefore(minDate) || calendar[row][col].isSame(minDate))) || (maxDate && calendar[row][col].isAfter(maxDate))) {
                        //结束时间 保证和开始时间当天是可选的
                        if(calendar[row][col].format('YYYY-MM-DD') == minDate.format('YYYY-MM-DD') && timetype == '结束时间'){
                            
                        }else{
                            cname = ' off disabled ';
                        }
                    } else if (calendar[row][col].format('YYYY-MM-DD') == selected.format('YYYY-MM-DD')) {
                        cname += ' active ';

                        if (calendar[row][col].format('YYYY-MM-DD') == this.startDate.format('YYYY-MM-DD') && timetype == '开始时间') {
                            cname += ' start-date ';
                        }
                        if (calendar[row][col].format('YYYY-MM-DD') == this.endDate.format('YYYY-MM-DD') && timetype == '结束时间') {
                            cname += ' end-date ';
                        }
                    } else if (calendar[row][col] >= this.startDate && calendar[row][col] <= this.endDate) {
                        cname += ' in-range ';
                        if (calendar[row][col].isSame(this.startDate)) { cname += ' start-date '; }
                        if (calendar[row][col].isSame(this.endDate) && timetype == '结束时间') { cname += ' end-date '; }
                    }

                    var title = 'r' + row + 'c' + col;
                    html += '<td class="' + cname.replace(/\s+/g, ' ').replace(/^\s?(.*?)\s?$/, '$1') + '" data-title="' + title + '"><div class="inner"><em>.</em>' + calendar[row][col].date() + '</div></td>';
                }
                html += '</tr>';
            }

            html += '</tbody>';
            html += '</table></div>';
            html += '</div>';

            if (this.timePicker) {

                html += '<div class="calendar-time">';
                html += '<div class="fakeselect">';
                var start = 0;
                var end = 23;
                var selected_hour = selected.hour();

                html += '<p class="hourselect-val">' + selected_hour + '</p>';
                html += '<div class="list"><ul class="hourselect">';

                for (var i = start; i <= end; i++) {
                    if (i == selected_hour) {
                        html += '<li class="selected" j_val="' + i + '">' + i + '</li>';
                    } else {
                        html += '<li j_val="' + i + '">' + i + '</li>';
                    }
                }

                html += '</ul></div></div><div class="split">:</div>';

                html += '<div class="fakeselect">';
                html += '<p class="minuteselect-val">' + selected.minute() + '</p>';
                html += '<div class="list"><ul class="minuteselect">';
                for (var j = 0; j < 60; j += this.timePickerIncrement) {
                    var num = j;
                    if (num < 10)
                        num = '0' + num;
                    if (j == selected.minute()) {
                        html += '<li class="selected" j_val="' + num + '">' + num + '</li>';
                    } else {
                        html += '<li j_val="' + num + '">' + num + '</li>';
                    }
                }
                if(selected.minute() == 59){
                     html += '<li class="selected" j_val="' + 59 + '">' + 59 + '</li>';
                }else{
                     html += '<li j_val="' + 59 + '">' + 59 + '</li>';
                }
               
                
                
                html += '</ul></div></div>';


                html += '</div>';

            }

            return html;

        }
      
    });

    return Calendar;

}, {
    requires: ['node', 'base', './moment.min','./holidays', './style.css']
});