/*
 * Event.target filter for KISSY
 * @VinceSnow mail@vincesnow.com
 */

KISSY.add('targetfilter', function(S){

	var $ = S.all;

	return function(t, selector){
		var t = $(t);
		if (typeof selector === 'string'){
			if (t.test(selector)){
				return t;
			}
			var elem = t.parent(selector);
			if (elem && elem.length > 0){
				return elem;
			}
			return t;
		}
		return t;
	}

}, {
    requires: [
        'node',
    ]
});