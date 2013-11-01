/*
 * Event.target filter for KISSY
 * @VinceSnow mail@vincesnow.com
 */

KISSY.add('targetfilter', function(S){

	var $ = S.all;

	return function(t, o){
		var t = $(t), t2 = t, t3 = t;
		if (typeof o === 'string'){
			if (t.test(o)){
				return t;
			}
			var elem = t.parent(o);
			if (elem && elem.length > 0){
				return elem;
			}
			return t;
		}
		if (o.innerHTML){
			if (t.getDomNode() === o){
				return t;
			}
			while (t2.parent().length > 0) {
				t2 = t2.parent();
				if (t2.getDomNode() === o){
					return t2;
				}
			}
			return t;
		}
		if (o[0].innerHTML){
			for (var i =0; i < o.length; i++){
				if (t.getDomNode() === o[i]){
					return t;
				}
				while (t3.parent().length > 0) {
					t3 = t3.parent();
					if (t3.getDomNode() === o[i]){
						return t3;
					}
				}
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