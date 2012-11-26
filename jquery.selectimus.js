/*!
 *
 * Selectimus 0.1.0
 * Copyright 2012, Egor Skorobogatov
 * egor.skorobogatov@gmail.com
 *
 * Released under the MIT, BSD, and GPL Licenses
 * https://github.com/git-decadent/selectimus
 *
 * Change of standart selects in browser.
 * 
 * Includes ScrollBarJS.js
 *
*/

(function ($) {
    var _window = $(window),
	default_styles = function () {
	    return {
		background: 'white',
		display: 'block',
		border: '1px solid #b6b6b6',
		'border-radius': '5px',
		margin: '3px 0',
		position: 'relative',
		overflow: 'visible'
	    }
	},
	default_rows   = 10,
	select_hash    = {},
	len            = 0;
    
	
    $.fn.selectimus = function (styles, settings) {
	var def_style = default_styles(),
	    len = this.length,
	    i;
	
	if (styles != undefined) {
	    for (i in styles) {
		def_style[i] = styles[i];
	    }
	}
	
	$.each(this, function (k, v) {
	    var el = $(v);
	    if (select_hash[el.attr('id')] == undefined) {
		changeSelect($(v), def_style, settings);
	    } else {
		/**/
	    }
	});
	
	
	return this;
    }
    
    function setSettings(opt, style) {
	var _options = {
	    width: 5,
	    height: 5
	}
	
	for (var i in opt) {
	    if (_options[i] != undefined) {
		style[i] = parseInt(style[i]) + opt[i]*_options[i] + 'px';
	    }
	}
    }
    
    function changeSelect(element, def_style, settings) {
	
	var options = element.children(),
	    styles  = getStyles(element[0], def_style, settings),
	    clone   = new createClone(styles, element, options, settings);
	    
	select_hash[element.attr('id')] = clone;
	len++;
	element.css('display', 'none');
	clone.div.insertBefore(element);
    }
    
    function getStyles(element, def_style, settings) {
	var result = {},
	    value,
	    styles = element.style;
	
	function getStyle(elem, name) {
	    if (elem.style[name]) {
		return elem.style[name];
	    } else {
		if (elem.currentStyle) {
		    return elem.currentStyle[name];
		} else {
		    if (document.defaultView && document.defaultView.getComputedStyle) {
			name = name.replace(/(A-Z)/g, "-$1");
			name = name.toLowerCase();
			var s = document.defaultView.getComputedStyle(elem, "");
			return s && s.getPropertyValue(name);
		    } else {
		    	return null;
		    }
		}
	    }
	}
	
	for (var i in styles) {
	    value = getStyle(element, i);
	    if (value != '' && value != 'none' && typeof value != 'function') {
		result[i] = value;
	    }
	}
	
	for (var i in def_style) {
	    result[i] = def_style[i]
	}
	
	if (settings != undefined) {
	    setSettings(settings, result);
	}
	
	return result;
    }
    
    function createClone(styles, element, options, settings) {
	this.selected   = {};
	this.parent     = $(element);
	this.div        = $('<div>');
	this.box        = $('<div>');
	this.content    = createContent.call(this, styles, element, options);
	this.button     = $('<div>');
	this.opt        = {};
	var tmp_rows    = (settings != undefined && settings.rows != undefined) ? settings.rows : default_rows;
	var rows        = options.length < tmp_rows ? options.length : tmp_rows;
	this.opened     = false;
	    
	for (var i in styles) {
	    this.div.css(i, styles[i]);
	}
	
	this.button.addClass('select-button-close');
	this.box.addClass('select-box');
	
	this.opt.down = {
	    height_div:   styles.height,
	    height_box:   window.navigator.appName == 'Opera'  ? (parseInt(styles.height) - 2*parseInt(styles.borderWidth) + 'px') : styles.height,
	    overflow: 'hidden',
	    border:    '0 none',
	    zIndex:    0
	};
	this.opt.up = {
	    rows: rows,
	    heightContent: options.length * parseInt(styles.height) + 'px',
	    height:    (rows * parseInt(styles.height)) + 'px',
	    overflow:  'visible',
	    position:  'absolute',
	    border:    styles.border,
	    borderTop: '0 none',
	    zIndex:    100000000
	};
	
	this.box.css({
	    height: this.opt.down.height_box,
	    background: styles.background,
	    'border-radius': styles['border-radius']
	});
	
	this.div.addClass('selectimus');
	this.box.append(this.content);
	this.div.append(this.button);
	this.div.append(this.box);
	
	setEvents.call(this);
	
    }
    
    function createContent(styles, element, options) {
	var self = this,
	    table = $('<table>'),
	    tbody = $('<tbody>'),
	    height,
	    tr;
	    
	table.addClass('selectimus-table')
	
	if (window.navigator.appName == 'Opera') {
	    height = parseInt(styles.height) - 2 + 'px'; 
	} else {
	    height = styles.height;
	}
	    
	$.each(options, function (k, v) {
	    if (v.value == element.val()) {
		self.selected.count = k;
		self.selected.id    = element.val();
	    }
	    tr = $('<tr>');
	    tr.css('height', height);
	    tr.html('<td>' + v.innerHTML + '</td>');
	    tbody.append(tr);
	    (function (j, val) {
		tr.click(function () {
		    if (self.opened == true) {
			self.selected.count = j;
			self.selected.id    = val;
		    }
		})
	    })(k, v.value);
	});
	table.append(tbody);
	
	return table;
    }
    
    function setEvents() {
		
	var self = this;
	
	this.div.toggle(function (e) {
	    self.opened = true;
	    self.div.css({
		borderBottom: self.opt.up.borderTop,
		borderLeft:   self.opt.up.borderTop,
		borderRight:  self.opt.up.borderTop,
		overflow:     self.opt.up.overflow,
		height:       self.opt.up.height
	    });
	    self.box
		.css({
		    position:  self.opt.up.position,
		    border:    self.opt.up.border,
		    borderTop: self.opt.up.borderTop,
		    height:    self.opt.up.height,
		    zIndex:    self.opt.up.zIndex
		});
		
	    self.box.find('TD').eq(self.selected.id).addClass('td_hover');
	    
	    self.box.find('TD').hover(function () {
		self.box.find('TD').removeClass('td_hover');
		$(this).addClass('td_hover');
	    });
	    
	    if (self.scrollbar == undefined) {
		self.scrollbar = setScrolbar(self.box, self.content, self.opt);
	    }
	    if (self.scrollbar != false) {
		self.scrollbar.show();
		self.scrollbar.move(-1 * self.selected.count * parseInt(self.opt.down.height_box), false);
	    } else {
		moveTo.call(self, -1 * self.selected.count * parseInt(self.opt.down.height_box));
	    }
	    
	    _window.one('click', function () {
		self.div.click();
	    });
	    
	}, function (e) {
	    self.opened = false;
	    self.div.css({
		border: self.opt.up.border,
		height: self.opt.down.height_div
	    });
	    self.box
		.css({
		    border:    self.opt.down.border,
		    borderTop: self.opt.up.borderTop,
		    height:    self.opt.down.height_box,
		    zIndex:    self.opt.down.zIndex
		});
		
		
	    if (self.scrollbar != false) {
		self.scrollbar.move(-1 * self.selected.count * parseInt(self.opt.down.height_box), true);
		self.scrollbar.hide();
	    } else {
		moveTo.call(self, -1 * self.selected.count * parseInt(self.opt.down.height_box), true);
	    }
	    self.box.find('TD').unbind();
	    self.box.find('TD').eq(self.selected.count).removeClass('td_hover');
	    self.parent.val(self.selected.id);
	});
    }
    
    function setScrolbar(field, content, options) {
	var result;
	if (options.up.height == options.up.heightContent) {
	    result = false;
	} else {
	    result = $.scrollbar({
		scrollpane: field,
		scrollcontent: content,
		options: {
		    orientation: 'vertical',
		    css: {
			position: 'absolute'
		    }
		}
	    });
	}
	return result;
    }
    function moveTo(margin, down) {
	
	var _margin;
	
	if (down == true || Math.abs(margin) < this.content.height() - parseInt(this.opt.up.height)) {
	    _margin = margin;
	} else {
	    _margin = 0;
	}
	
	this.content.css({
	    'margin-top': _margin + 'px'
	});
    }

    /*
    *
    * ScrollBarJS 1.0.0
    * Copyright 2012, Egor Skorobogatov
    * egor.skorobogatov@gmail.com
    *
    * Released under the MIT, BSD, and GPL Licenses
    *
    * Change of standart scrollbar in html elements in browser.
    *
    */
   
   $.scrollbar = function (data) {
	   
       var def_opt = {
	       btnsWidth:    16,
	       btnsHeight:   16,
	       bordersWidth: 1
	   };
	   
       function sizeSlider(scrollpane, scrollcontent, _slider) {
	    var scrollpane_h      = scrollpane.height();
		scrollcontent_h   = scrollcontent.height();
		scrollbar_wrap_h  = scrollpane_h - scrollpane_h*0.02,
		diff1	    	 = scrollcontent_h - scrollpane_h,
		prop	         = diff1 / scrollcontent_h,
		scroll_area 	 = scrollbar_wrap_h - def_opt.btnsWidth*2;
		stopScroll  	 = Math.floor(scroll_area*prop),
		size_slider 	 = scrollbar_wrap_h - def_opt.btnsWidth*2 - stopScroll - def_opt.bordersWidth*2,
		multiple    	 = diff1/(scrollbar_wrap_h - def_opt.btnsWidth*2 - size_slider),
		multiple    	 = scrollcontent_h/scroll_area,
		percentContent 	 = diff1/100,
		percentSlider    = stopScroll/100;
	       
	   
	   
	    if (_slider != undefined) {
		size_slider = height2;
		_slider.height(height2);
	    }
	   
	    return {
		scrollpane_h:     scrollpane_h,
		scrollcontent_h:  scrollcontent_h,
		scrollcontent_stop: scrollpane_h - scrollcontent_h,
		scrollbar_wrap_h: scrollbar_wrap_h,
		size_slider:      size_slider,
		multiple:         multiple,
		stopScroll:       stopScroll,
		percentContent:   percentContent,
		percentSlider:    percentSlider
	    };
       }
       
       
       function _Scrollbar(data) {
	   var self = this,
	       interval;
	   
	   this.scrollpane    = data.scrollpane;
	   this.scrollcontent = data.scrollcontent;
	   
	   
	   this.params = sizeSlider(this.scrollpane, this.scrollcontent);
	   
	   this.scroll_top      = $('<div>').addClass('w-srcoll-top w-srcoll-btn').css({
	       width: 	def_opt.btnsWidth + 'px',
	       height: def_opt.btnsWidth + 'px',
	       backgroundPosition: + (def_opt.btnsWidth - 14)/2 + "px " + (def_opt.btnsWidth - 14)/2 + "px "
	   });
	   this.scroll_bottom   = $('<div>').addClass('w-srcoll-bottom w-srcoll-btn').css({
	       width: 	def_opt.btnsWidth  + 'px',
	       height: def_opt.btnsWidth + 'px',
	       backgroundPosition: + (def_opt.btnsWidth - 14)/2 + "px 112%"
	   });
	   this.scrollbar_wrap  = $('<div>').addClass('w-srcollbar-wrap').css({
	       height: 	this.params.scrollbar_wrap_h,
	       width: 		def_opt.btnsWidth
	   });
	   this.scrollbar       = $('<div>').addClass('w-srcollbar').css({
	       height: 	this.params.scrollbar_wrap_h - def_opt.btnsWidth*2,
	       marginTop: 	def_opt.btnsWidth + 'px',
	       width:  	def_opt.btnsWidth + 'px'  
	   });
	   this.slider          = $('<div>').addClass('w-slider').css({
	       top:		 0,
	       width: 		 def_opt.btnsWidth - 2 + 'px',
	       height: 	 this.params.size_slider + 'px'
	   }).append( "<span style='margin:"+ this.params.size_slider/2 +"px auto;' class='ui-icon ui-icon-grip-dotted-horizontal'></span>" );
	   
	   this.scrollbar_wrap.append(this.scroll_top);
	   this.scrollbar_wrap.append(this.scrollbar);
	   this.scrollbar_wrap.append(this.scroll_bottom);
	   this.scrollbar.append(this.slider);
	   this.scrollbar_wrap.appendTo(this.scrollpane);
	   
	   (function draggable() {
		var top,
		    y;
		    
		self.slider.mousedown(function (e) {
		    e.preventDefault();
		    _window.bind('mousemove', moveSlider);
		    _window.one('mouseup', mouseupSlider);
		    top = parseInt(self.slider.css('top'));
		    y = e.clientY;
		});
		
		
		function mouseupSlider(e) {
		    _window.unbind('mousemove', moveSlider);
		}
		
		function moveSlider(e) {
		    if (top + e.clientY - y < 1) {
			self.slider.css({
			    'top': 0
			});
			self.scrollcontent.css({
			    'margin-top': 0
			});
			return false;
		    } else if (top + e.clientY - y > self.params.stopScroll - 1) {
			self.slider.css({
			    'top': self.params.stopScroll
			});
			self.scrollcontent.css({
			    'margin-top': self.params.scrollcontent_stop + 'px'
			});
			return false;
		    } else {
			self.slider.css({
			    'top': (top + e.clientY - y) + 'px'
			});
			
			self.scrollcontent.css({
			    'margin-top': self.params.multiple*(-1 * (top + e.clientY - y)) + 'px'
			});
		    }
		}
		
	       
	   })();
	   
	   this.scrollbar_wrap.click(function (e) {
	       e.stopPropagation();
	   });
	   
	   this.scroll_top.add(this.scroll_bottom).bind({
	       'mousedown': function (e) {
		   e.stopPropagation();
		   var it, im;
		   if (e.target == self.scroll_top[0]) {
		       it   = -1;
		       stop = 0;
		   } else {
		       it   = 1;
		       stop = self.params.stopScroll;
		   }
		   interval = setInterval(function () {
		       var top = parseInt(self.slider.css('top'));
		       if (top == stop) {
			   clearInterval(interval);
			   self.slider.css('top', stop + 'px');
			   return;
		       }
		       self.slider.css('top',  top + it + 'px');
		       self.scrollcontent.css('margin-top', -1*self.params.multiple*(top + it) + 'px');

		   }, 4);
	       },
	       'mouseup': function (e) {
		   e.stopPropagation();
		   clearInterval(interval);
	       }
	   });
	   
	   
	   this.scrollbar.bind('click', function (e) {
	       if (e.target != self.scrollbar[0]) {
		   return false; 
	       }
	       var clickY 	= e.pageY,
		   posY 	= self.slider.offset().top,
		   contentY = parseInt(self.scrollcontent.css('margin-top')),
		   target,
		   i = 0,
		   j;

	       if (clickY < posY) {
		   target = clickY - posY;
		   j      = -1 * Math.round(self.params.scrollcontent_h/self.params.scrollpane_h*2);
	       } else {
		   target = clickY - posY - self.params.size_slider;
		   j      = 1 * Math.round(self.params.scrollcontent_h/self.params.scrollpane_h*2);
	       }
	       interval = setInterval(function () {
		   if ((i + j >= target && j > 0) || (i + j <= target && j < 0)) {
		       clearInterval(interval);
		       self.slider.offset({top: posY + target});
		       self.scrollcontent.css('margin-top', contentY - self.params.multiple*target + 'px');
		       return false;
		   }
		   self.slider.offset({top: self.slider.offset().top + j});
		   self.scrollcontent.css('margin-top', parseInt(self.scrollcontent.css('margin-top')) - j*self.params.multiple + 'px');
		   i += j;
	       }, 1);
	   });
	   
       }

       _Scrollbar.prototype.move = function (margin, set) {
	   
	   var _margin,
	       params = this.params,
	       top;
	   
	   if (margin < params.scrollpane_h - params.scrollcontent_h) {
	       _margin = params.scrollpane_h - params.scrollcontent_h;
	   } else {
	       _margin = margin;
	   }
	   
	   top = (Math.abs(_margin)/params.percentContent)*params.percentSlider;
	   
	   
	   this.slider.css('top', top + 'px');
	   if (set == undefined) {
	       this.scrollcontent.animate({
		   'margin-top': _margin + 'px'
	       }, 800);
	   } else {
	       this.scrollcontent.css({
		   'margin-top': set == true ? margin : _margin + 'px'
	       });
	   }
       }
       
       _Scrollbar.prototype.show = function () {
	   this.scrollbar_wrap.css('display', 'block');
       }
       
       _Scrollbar.prototype.hide = function () {
	   this.scrollbar_wrap.css('display', 'none');
       }
       
       _Scrollbar.prototype.renew = function (slider) {
	   sizeSlider(this.scrollpane, this.scrollcontent, this.slider);
       }
       
       return new _Scrollbar(data);  
   }
   
})(jQuery);

