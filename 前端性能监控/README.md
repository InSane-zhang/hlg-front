## 目标

 ***构建web前端异常监控系统***

## 需求  
1. js 错误监控机制；在线上环境如果有js错误，发送错误信息和环境；



## 参考文献
> [jEngine 是一个专门为性能优化的 Web 前端应用框架](http://www.oschina.net/p/jengine)  
> [构建web前端异常监控系统](http://www.aliued.cn/2012/10/27/%E6%9E%84%E5%BB%BAweb%E5%89%8D%E7%AB%AF%E5%BC%82%E5%B8%B8%E7%9B%91%E6%8E%A7%E7%B3%BB%E7%BB%9F-fdsafe.html)  
> [支付宝 前端异常监控系统](https://github.com/totorojs/monitor.js/blob/master/doc/index.md)  
> [搭建前端性能测试框架](http://ued.taobao.com/blog/2010/07/xvfb_yslow_showslow-2/)  
> [前端性能监控总结](http://www.xiaoqiang.org/javascript/font-end-performance-monitor.html)
> [segment.io](https://segment.io/docs/big-picture/what-we-do)

	给 kissy 类模块 的 加 try {} catch{}{}
	instance = S.Env.mods['page/design-init'].value;
	for (name in instance){
		method = instance[name];
		if (typeof method == "function"){
			instance[name] = function(name, method){
				return function (){
					try { 
						return method.apply(this, arguments);
					}
					catch(ex) {
						alert(ex);
						//$.logger.error(moduleId + " throw error: " +  name + "()-> " + ex.message);
					}
				};
			}(name, method);
		}
	}