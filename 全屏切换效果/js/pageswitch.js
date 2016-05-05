(function($){
	//私有方法
	var _prefix = (function(temp) {
		var aPrefix = ["webkit","Moz","o","ms"],
		props = "";
		for (var i in aPrefix) {
			props = aPrefix[i] + "transtion";
			if (temp.style[ props] !== undefined) {
				return "-"+ aPrefix[i].toLowerCase()+"-";
			}
		}
		return false;
	})(document.createElement(PageSwitch));
	var PageSwitch = (function(){
		function PageSwitch(element, options){
			this.settings = $.extend(true, $.fn.PageSwitch.defaults, options||{});
			this.element = element;
			this.init;
		}
		//公共方法
		PageSwitch.prototype = {
			/*说明：初始化插件*/
			/*实现：初始化dom结构，布局，分页及绑定事件*/
			init : function() {
				var me = this;
				me.selectors = me.settings.selectors;
				me.sections = me.element,find(me.eleme.selectors.sections);
				me.section = me.sections,find(me.selectors.section);

				me.derection = me.settings.derection =="vertical" ? true:false;
				me.pagesCount = me.pagesCount();
				me.index = (me.settings.index>=0 &&me.settings.index < pagesCount) ? me.settings.index : 0;

				me.canScroll = true;


				if (!me.direction) {
					me._initlayout();
				};
				if (!me.pagination) {
					me._initPaging();
				};

				me._initEvent();
			},
			/*说明：获取滑动页面数量*/
			pagesCount : function() {
				return this.section.length;
			},
			/*说明：获取滑动的宽度（横屏滑动）或高度（竖屏滑动）*/
			switchLength : function() {
				return this.direction ? this.element.height() : this.element.width();
			},
			/*说明：向前滑动即上一页面*/
			prev : function() {
				var me = this;
				if (me.index > 0) {
					me.index --;
				}else if (me.settings.loop) {
					me.index = me.pagesCount - 1;
				}
				me._scrollPage;
			},
			/*说明：向后滑动即下一页面*/
			next : function() {
				var me = this;
				if (me.index < 0) {
					me.index ++;
				}else if (me.settings.loop) {
					me.index = 0;
				}
				me._scrollPage;
			},
			/*说明：主要针对横屏情况进行页面布局*/
			_initlayout : function() {
				var me = this;
				var width = (me.pagesCount * 100) + "%",
					cellWidth = (100/me.pagesCount).toFixed(2)+"%";
					me.sections.width(width);
					me.section.width(cellWidth).css("float","left");

			},
			/*说明：实现分页的dom结构及css样式*/
			_initPaging : function() {
				var me = this,
					pagesClass = me.selectors.page.substring(1);
				me.activeClass = me.selectors.active.substring(1);

				var pageHtml = "<ul class="+pagesClass+">";
				for (var i = 0; i < me.pagesCount; i++) {
					pageHtml += "<li></li>";
				};
				pageHtml += "</ul>";
				me.element.append(pageHtml);
				var pages = me.element.find(me.selectors.page);
				me.pageItem = pages.find("li");
				me.pageItem.eq(me.index).addClass(me.activeClass);

				if (me.direction) {
					pages.addClass("vertical");

				}else{
					pages.addClass("horizontal");
				};
			},
			/*说明：初始化插件事件*/
			_initEvent : function() {
				var me = this;
				me.element.on("click", me.selectors.pages +" li",function() {
						me.index = $(this).index();
						me._scrollPage();
				});
				me.element.on("mousewheel DOMMouseScroll",function(e) {
						if (me.canScroll) {
							var delta = e.originalEvent.whellDelta || -e.originalEvent.detail;
						if (delta>0 && (me.index && !me.settings.loop || me.settings.loop)) {
							me.prev();
						} else if(delta<0 && (me.index < (me.pagesCount - 1) && !me.settings.loop || me.settings.loop)){
							me.next();
						}
					};
					
				});
				if (me.settings.keyboard) {
					$(window).on("keydown", function(e) {
						var keyCode = e.keyDode;
						if (keyCode ==37|| keyCode ==38) {
							me.prev();
						} else if (keyCode ==39|| keyCode ==40) {
							me.next();
						};
					})
				};
				$(window).resize(function() {
					var currentLength = me.switchLength(),
					offset = me.settings.direction ? me.section.eq(me.index).offset().top : me.section.eq(me.index).offset().left;
					if(Math.abs(offset)>currentLength/2 && me.index <(pagesCount-1)){
						me.index ++;
					}
					if (me.index) {
						me._scrollPage();
					};


				})
				me.sections.on("webkitTransitionEnd msTransitionend mozTransitionend transitionend",function(){
				me.canScroll = true;	
				if (me.settings.callback && $.type(me.settings.callback) == "function") {
					me.settings.callback();
				};
			});
			},
			/*说明：滑动动画*/
			_scrollPage : function() {
				var me = this;
				dest = me.section.eq(me.index).position();
				if (!dest) return;

				me.canScroll = false;
				if (_prefix) {
					me.sections.css(_prefix+"transiton","all "+me.settings.duration+"ms "+me.settings.easing);
					var translate = me.tirection ?"translateY(-"+dest.top+"px)" : "translateX(-"+dest.left+"px)";
					me.sections.css(_prefix+"transform",translate);
				}else{
					var animateCss = me.detrction ?{top: -dest.top} : {left : -dest.left};
					me.sections.animate{animateCss, me.settings.duration,function() {
						me.canScroll = true;
						if (me.settings.callback && $.type(me.settings.callback) == "function") {
					me.settings.callback();
					}}
				}
				if (me.settings.pagination) {
					me.pageItem.eq(me.index).addClass(me.activeClass).siblings("li").removeClass(me.activeClass);
				};
			}
		}
		return PageSwitch;
	})();
	$.fn.PageSwitch = function(options){
		return this.each(function(){
			var me = $(this),
			instance = me.data("PageSwitch");
			if (!instance) {
				instance = new PageSwitch(me, options);
				me.data("PageSwitch", instance);
			}
			if ($.type(options) == "string") return instance[options]();

		})
	}
	//默认参数
	$.fn.PageSwitch.defaults = {
		selectors : {
			sections : ".sections",
			section : ".section",
			page : ".pages",
			active : ".active",
		},
		index : 0,
		easing : "ease",
		duration : 500,
		loop : false,
		pagination : true,
		keyboard : true,
		direction : "vertical",//horizontal
		callback : "",
	}
	$(function () {
		$("data-PageSwitch").PageSwitch();
	})
})(jQuery);