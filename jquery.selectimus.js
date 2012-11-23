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
	// обязательные стили для селектов по-умолчанию
	default_styles = function () {
	    return {
		background: 'white',
		display: 'block',
		border: '1px solid #e5e5e5',
		'border-radius': '5px',
		margin: '3px 0',
		position: 'relative',
		overflow: 'visible'
	    }
	},
	// количество строк в развернутом селекте
	default_rows   = 10,
        // хэш для всех созданных селектов
	select_hash    = {},
        // счетчик количества селектов
	len            = 0;
    
    // добавление метода объекту jQuery
    $.fn.selectimus = function (styles, settings) {
	var def_style = default_styles(),
	    len = this.length,
	    i;
	
        // замена/добавление стилией для псевдоселекта    
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
    
    // Установка дополнительныйх опций у псевдоселекта
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
    
    // Замена селекта
    function changeSelect(element, def_style, settings) {
	    // Внутренние опции селекта
	//var options = children(element),
	var options = element.children(),
	    // стили селекта
	    styles  = getStyles(element[0], def_style, settings),
	    // псевдоселект    
	    clone   = new createClone(styles, element, options, settings);
	    
	select_hash[element.attr('id')] = clone;
	len++;
	// скрываем селект
	element.css('display', 'none');
	// и вставляем клона
	clone.div.insertBefore(element);
    }
    
    // Получение стилей селекта
    function getStyles(element, def_style, settings) {
	var result = {},
	    value,
	    styles = element.style;
	
	// Функция вынимает все возможные стили из селекта
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
	    // Если стиль не пустой - сохранить его.
	    if (value != '' && value != 'none' && typeof value != 'function') {
		result[i] = value;
	    }
	}
	
	// Добавляем в результат стили по-умолчанию и
	// стили переданные пользователем
	for (var i in def_style) {
	    result[i] = def_style[i]
	}
	
	// Если переданы доп. опции, применить их стилям
	if (settings != undefined) {
	    setSettings(settings, result);
	}
	
	return result;
    }
    
    // Создание псевдоселекта
    function createClone(styles, element, options, settings) {
	this.selected   = {};
	this.parent     = $(element);
	// псевдоселект (верхний элемент)
	this.div        = $('<div>');
	// контейнер содержимого
	this.box        = $('<div>');
	// содержание селекта
	this.content    = createContent.call(this, styles, element, options);
	// кнопка раскрытия селекта
	this.button     = $('<div>');
	// хэш со стилями
	this.opt        = {};
	var tmp_rows    = (settings != undefined && settings.rows != undefined) ? settings.rows : default_rows;
	// количество элементов внутри селекта
	var rows        = options.length < tmp_rows ? options.length : tmp_rows;
	// флаг открытого/закрытого селекта
	this.opened     = false;
	    
	// добавляем ему стили, которые были у селекта
	for (var i in styles) {
	    this.div.css(i, styles[i]);
	}
	
	this.button.addClass('select-button-close');
	this.box.addClass('select-box');
	
	// стили для свернутого псевдоселекта
	this.opt.down = {
	    height:   styles.height,
	    overflow: 'hidden',
	    border:    '0 none',
	    zIndex:    0
	};
	// стили для раскрытого псевдоселекта
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
	    height: this.opt.down.height,
	    background: styles.background,
	    'border-radius': styles['border-radius']
	});
	
	this.div.addClass('selectimus');
	this.box.append(this.content);
	this.div.append(this.button);
	this.div.append(this.box);
	
	setEvents.call(this);
	
    }
    
    // Создание контента псевдоселекта
    function createContent(styles, element, options) {
	var self = this,
	    table = $('<table>'),
	    tbody = $('<tbody>'),
	    tr;
	    
	table.addClass('selectimus-table')
	
	$.each(options, function (k, v) {
	    if (v.value == element.val()) {
		self.selected.count = k;
		self.selected.id    = element.val();
	    }
	    tr = $('<tr>');
	    tr.css('height', styles.height);
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
    
    // Прикрепление обработчиков событий для нового псевдоселекта
    function setEvents() {
		
	var self = this;
	
	// первый клик на селекте
	this.div.toggle(function (e) {
	    self.opened = true;
	    self.div.css({
		borderBottom: self.opt.up.borderTop,
		borderLeft:   self.opt.up.borderTop,
		borderRight:  self.opt.up.borderTop
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
		self.scrollbar.move(-1 * self.selected.count * parseInt(self.opt.down.height), false);
	    } else {
		moveTo.call(self, -1 * self.selected.count * parseInt(self.opt.down.height));
	    }
	    
	    _window.one('click', function () {
		self.div.click();
	    });
	    
	// повторный клик на селекте
	}, function (e) {
	    self.opened = false;
	    self.div.css({
		border: self.opt.up.border
	    });
	    self.box
		.css({
		    border:    self.opt.down.border,
		    borderTop: self.opt.up.borderTop,
		    height:    self.opt.down.height,
		    zIndex:    self.opt.down.zIndex
		});
	    if (self.scrollbar != false) {
		self.scrollbar.move(-1 * self.selected.count * parseInt(self.opt.down.height), true);
		self.scrollbar.hide();
	    } else {
		moveTo.call(self, -1 * self.selected.count * parseInt(self.opt.down.height), true);
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
    // Установка контента в псевдоселекте в случае отсутствия скроллбара
    function moveTo(margin, down) {
	
	var _margin;
	
	if (down == true || Math.abs(margin) < this.content.height() - parseInt(this.opt.up.height)) {
	    _margin = margin;
	} else {
	    _margin = 0;
	}
	
	// мгновенная установка
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
	       // ширина скроллбара
	       btnsWidth:    16,
	       btnsHeight:   16,
	       bordersWidth: 1
	   };
	   
       // Установка пропорций слайдера относительно
       // прокручиваемого контента
       function sizeSlider(scrollpane, scrollcontent, _slider) {
	   var scrollpane_h     = scrollpane.height();
	       scrollcontent_h  = scrollcontent.height();
	       scrollbar_wrap_h = scrollpane_h - scrollpane_h*0.02,
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
	       // высота контейнера
	       scrollpane_h:     scrollpane_h,
	       // высота контента
	       scrollcontent_h:  scrollcontent_h,
	       // высота контейнера скроллбара
	       scrollbar_wrap_h: scrollbar_wrap_h,
	       // высота слайдера
	       size_slider:      size_slider,
	       // коэфициент увеличения высоты контента, при движении скролла
	       multiple:         multiple,
	       stopScroll:       stopScroll,
	       // количество пикселей в одном проценте движения у контента
	       percentContent:   percentContent,
	       // количество пикселей в одном проценте движения у слайдера
	       percentSlider:    percentSlider
	   };
       }
       
       
       function _Scrollbar(data) {
	   var self = this,
	       interval;
	   
	   // контейнер контента
	   this.scrollpane    = data.scrollpane;
	   // контент
	   this.scrollcontent = data.scrollcontent;
	   
	   
	   // параметры
	   this.params = sizeSlider(this.scrollpane, this.scrollcontent);
	   
	   // кнопка скролла наверх
	   this.scroll_top      = $('<div>').addClass('w-srcoll-top w-srcoll-btn').css({
	       width: 	def_opt.btnsWidth + 'px',
	       height: def_opt.btnsWidth + 'px',
	       backgroundPosition: + (def_opt.btnsWidth - 14)/2 + "px " + (def_opt.btnsWidth - 14)/2 + "px "
	   });
	   // кнопка скролла вниз
	   this.scroll_bottom   = $('<div>').addClass('w-srcoll-bottom w-srcoll-btn').css({
	       width: 	def_opt.btnsWidth  + 'px',
	       height: def_opt.btnsWidth + 'px',
	       //backgroundPosition: + (def_opt.width - 16)/2 + "px " + (def_opt.width - 16)/2 + "px "
	       backgroundPosition: + (def_opt.btnsWidth - 14)/2 + "px 112%"
	   });
	   // контейнер скроллбара
	   this.scrollbar_wrap  = $('<div>').addClass('w-srcollbar-wrap').css({
	       height: 	this.params.scrollbar_wrap_h,
	       width: 		def_opt.btnsWidth
	   });
	   // скроллбар
	   this.scrollbar       = $('<div>').addClass('w-srcollbar').css({
	       height: 	this.params.scrollbar_wrap_h - def_opt.btnsWidth*2,
	       marginTop: 	def_opt.btnsWidth + 'px',
	       width:  	def_opt.btnsWidth + 'px'  
	   });
	   // слайдер
	   this.slider          = $('<div>').addClass('w-slider').css({
	       top:		 0,
	       width: 		 def_opt.btnsWidth - 2 + 'px',
	       height: 	 this.params.size_slider + 'px'
	   }).append( "<span style='margin:"+ this.params.size_slider/2 +"px auto;' class='ui-icon ui-icon-grip-dotted-horizontal'></span>" );
	   
	   // Сборка элементов    
	   this.scrollbar_wrap.append(this.scroll_top);
	   this.scrollbar_wrap.append(this.scrollbar);
	   this.scrollbar_wrap.append(this.scroll_bottom);
	   this.scrollbar.append(this.slider);
	   this.scrollbar_wrap.appendTo(this.scrollpane);
	   
	   /*
	   // инициализации слайдера
	   this.slider.draggable({
	       axis: 'y',
	       containment: "parent",
	       drag: function (event, ui) {
		   var margin = self.params.multiple*(-1 * ui.position.top)
		   
		   self.scrollcontent.css({
		       'margin-top': margin + 'px'
		   }); 
	       }
	   });*/
	   
	   // инициализации слайдера
	   (function draggable() {
	       var stop  = true,
		   top,
		   y;
		   
		   
	       self.slider.mousedown(function (e) {
		   stop = false;
		   top = parseInt(self.slider.css('top'));
		   y = e.clientY;
	       });
	       
	       self.slider.mouseup(function (e) {
		   stop = true;
	       });
	       
	       self.slider.mousemove(function (e) {
		   if (stop === true) {
		       return false;
		   }
		   
		   if (top + e.clientY - y < 1) {
		       self.slider.css({
			   'top': 0
		       });
		       return false;
		   } else if (top + e.clientY - y > self.params.stopScroll - 1) {
		       self.slider.css({
			   'top': self.params.stopScroll
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
		   
	       });
	       
	   })();
	   
	   // Предотвращение ухода события за пределы скролбара
	   this.scrollbar_wrap.click(function (e) {
	       e.stopPropagation();
	   });
	   
	   // перемотка при нажатии на кнопки
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
		       /*if (listeners.drag != undefined) {
			   listeners.drag(-1*multiple*(top + it));
		       }*/
		   }, 4);
	       },
	       'mouseup': function (e) {
		   e.stopPropagation();
		   clearInterval(interval);
	       }
	   });
	   
	   
	   // перемотка при клике на свободном месте скроллбара
	   this.scrollbar.bind('click', function (e) {
	       if (e.target != self.scrollbar[0]) {
		   return false; 
	       }
		   // место клика
	       var clickY 	= e.pageY,
		   // верхняя граница слайдера
		   posY 	= self.slider.offset().top,
		   // верхняя граница контента
		   contentY = parseInt(self.scrollcontent.css('margin-top')),
		   // координаты остановки
		   target,
		   i = 0,
		   j;
	       
	       // перемотка вверх или вниз
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
       // Перемотка селекта на указанное место,
       // скролбар устанавливается пропорционально
       _Scrollbar.prototype.move = function (margin, set) {
	   
	   var _margin,
	       params = this.params,
	       top;
	   
	   // Если прокрутка контента ухожид за пределы контейнера,
	   // то перемотать до границы
	   if (margin < params.scrollpane_h - params.scrollcontent_h) {
	       _margin = params.scrollpane_h - params.scrollcontent_h;
	   } else {
	       _margin = margin;
	   }
	   
	   top = (Math.abs(_margin)/params.percentContent)*params.percentSlider;
	   
	   
	   this.slider.css('top', top + 'px');
	   // перемотка
	   if (set == undefined) {
	       this.scrollcontent.animate({
		   'margin-top': _margin + 'px'
	       }, 800);
	   } else {
	   // мгновенная установка
	       this.scrollcontent.css({
		   'margin-top': set == true ? margin : _margin + 'px'
	       });
	   }
       }
       
       // показать слайдер
       _Scrollbar.prototype.show = function () {
	   this.scrollbar_wrap.css('display', 'block');
       }
       
       // скрыть слайдер
       _Scrollbar.prototype.hide = function () {
	   this.scrollbar_wrap.css('display', 'none');
       }
       
       // обновить слайдер
       _Scrollbar.prototype.renew = function (slider) {
	   sizeSlider(this.scrollpane, this.scrollcontent, this.slider);
       }
       
       return new _Scrollbar(data);  
   }
   
    
})(jQuery);

