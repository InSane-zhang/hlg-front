   		 
/**
 * @fileOverview 
 * @author  
 */
KISSY.add(function (S) {
    // your code here
	
	return checkUtil = {
			/*违禁词限制*/
			checkSpecTitle : function(str){
				var result = [];
				var error = false;
				var msg = null;
				var re =/(淘宝)|(限时折扣)|(限时打折)|(良品)|(淘金币)|(天天特价)|(满就送)/i;
				if(re.test(str)){
				    var rt = re.exec(str);
				    if(rt != null){
						error = true;
						msg = '含有违禁字'+rt[0]+'！';
					}
				}
				result.push(error);
				result.push(msg);
				return result;
			},
			/*验证活动名称*/
			checkPromoName : function(promoName){
				var result = [];
				var error = false;
				var msg = null;
				var re=/^[\u4E00-\u9FA5\uf900-\ufa2d\A-Za-z0-9]{2,5}$/;
				if(!re.test(promoName)){
					if(promoName.length<2 || promoName.length >5){
						error = true;
						msg = '长度2~5个字符！';
					}else {
						var reg=/[^\u4E00-\u9FA5\uf900-\ufa2d\A-Za-z0-9]+/;
						var rt = promoName.match(reg);
						if(rt != null){
							error = true;
							msg = '含有非法字符'+rt[0]+'！';
						}
					}
				}
				result.push(error);
				result.push(msg);
				return result;
			},
			/*验证活动备注*/
			checkPromoDesc : function(promoDesc){
				var result = [];
				var error = false;
				var msg = null;
				var re=/^[\u4E00-\u9FA5\uf900-\ufa2d\w\s\，！。《》（）、—]{0,30}$/;
				if(!re.test(promoDesc)){
					if(promoDesc.length>30){
						error = true;
						msg = '长度30个字以内！';
					}else {
						var reg=/[^\u4E00-\u9FA5\uf900-\ufa2d\w\s\，！。《》（）、—]+/;
						var rt = promoDesc.match(reg);
						if(rt != null){
							error = true;
							msg = '含有非法字符'+rt[0]+'！';
						}
					}
				}
				result.push(error);
				result.push(msg);
				return result;
			},
			/*URL验证*/
			checkUrl : function(v){
				var result = [];
				var error = false;
				var msg = null;
				var reUrl = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/ ;
				if(!reUrl.test(v)){
						error = true;
						msg = '非法URl地址！';
				}
				result.push(error);
				result.push(msg);
				return result;
			},
			/*折扣验证*/
			checkDiscount : function(v){
				var result = [];
				var error = false;
				var msg = null;
				if(isNaN(Number(v)) || v <= 0 || v >=10){
					error = true;
					msg = '折扣范围在 0.00~9.99之间哦！';
				}else {
					var re = /(^[0-9]([.][0-9]{1,2})?$)|(^1[0-9]([.][0-9]{1,2})?$)|(^2[0-3]([.][0-9]{1,2})?$)|(^10([.]0{1,2})?$)/;
					if(!re.test(v)){
						error = true;
						msg = '折扣范围在 0.00~9.99之间哦！';
					}
				}
				result.push(error);
				result.push(msg);
				return result;
			},
	         /**
	         * JSON ajax 传参转换
	         * @param {Object} str
	         * @return {Object}
	         */
	        strProcess : function(str){
	                return str.replace(/\\/g, '\\\\').replace(/\"/g, '\\"').replace(/[\t\n&]/g, '%26').replace(/%/g, '%25');
	        },
            /**
             * 格式化数字
             * @example formatNumber(100.888,2); //结果为100.88
             * @param {Object} str
             * @return {date}
             */
	        FormatNumber: function(srcStr,nAfterDot){
                    var srcStr,nAfterDot;
                    var resultStr,nTen;
                    srcStr = ""+srcStr+"";
                    strLen = srcStr.length;
                    dotPos = srcStr.indexOf(".",0);
                    if (dotPos == -1){
                        resultStr = srcStr+".";
                        for (i=0;i<nAfterDot;i++){
                            resultStr = resultStr+"0";
                        }
                        return resultStr;
                    }else{if ((strLen - dotPos - 1) >= nAfterDot){
                            nAfter = dotPos + nAfterDot + 1;
                            nTen =1;
                            for(j=0;j<nAfterDot;j++){
                            nTen = nTen*10;
                            }
                            resultStr = Math.floor(parseFloat(srcStr)*nTen)/nTen;
                            return resultStr;
                        }else{
                            resultStr = srcStr;
                                for (i=0;i<(nAfterDot - strLen + dotPos + 1);i++){
                                resultStr = resultStr+"0";
                                }
                            return resultStr;
                        }
                    }
            },
			/*是否为空*/
			isNull : function(str){
				var result = [];
				var error = false;
				var msg = null;
				if(str == null ||str == ""){
					error = true;
					msg = '请填写，此项不能为空！';
				}
				result.push(error);
				result.push(msg);
				return result;
				
			}
	}
});