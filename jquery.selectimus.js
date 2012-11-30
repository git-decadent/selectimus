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
    var _document = $(document),
	// required styles for selects on default
	default_styles = function () {
	    return {
		background: 'white',
		display: 'inline-block',
		'border-width': 1,
		'border-style': 'solid',
		'border-color': '#b6b6b6',
		'border-radius': '5px',
		margin: '3px 0',
		position: 'relative',
		overflow: 'visible'
	    }
	},
        // Exploded select lines number on default
	default_rows   = 10,
        // Hash for the created selects
	select_hash    = {},
        // Selects number calculator
	len            = 0,
        // Select minimum height
        min_height     = 16;
    
    // method add to jQuery object
    $.fn.selectimus = function (styles, settings) {
	var def_style = default_styles(),
	    len = this.length,
	    i;
	// styles add/change for subselect
	if (styles != undefined) {
	    for (i in styles) {
		def_style[i] = styles[i];
	    }
	}
	def_style.border = def_style['border-width'] + 'px ' + def_style['border-style'] + ' ' + def_style['border-color'];
	
        // function use for all the passed elements
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
    
    // subselect extra options setup
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
    // Select change
    function changeSelect(element, def_style, settings) {
	    
           // select internal options
	var options = element.children(),
	
            // select styles   
	    styles  = getStyles(element, def_style, settings),
            // subselect	  
	    clone   = new createClone(styles, element, options, settings);
	    
	select_hash[element.attr('id')] = clone;
	len++;


        // hide the select
	element.css('display', 'none');

        // and paste the clone
	clone.div.insertBefore(element);
    }
    
    // Select styles receiving
    function getStyles(element, def_style, settings) {
	var result = {},
	    value,
	    styles = element[0].style;

	// The function takes all the possible styles out of the select
	function getStyle(elem, name) {
	    var currStyle;
	    if (elem.style[name]) {
		return elem.style[name];
	    } else {
		if (elem.currentStyle) {
                    // the current style specification  existence check 
                    // in browser
		    try {
			currStyle = elem.currentStyle[name];
		    } catch (e) {
		    }
		    return currStyle;
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
	    value = getStyle(element[0], i);
            // if the style is not empty-save it
	    if (value != '' && value != 'none' && typeof value != 'function') {
		result[i] = value;
	    }
	}
        // Add the default styles and the styles passed by the user to the result
	for (var i in def_style) {
	    result[i] = def_style[i];
	}
	
	// For Safari – take out some style by means of the set keys
	if (window.navigator.appVersion.search('Safari') >= 0) {
	    result.width  = element.outerWidth() - def_style['border-width'] + 'px';
	    result.height = element.outerHeight() - def_style['border-width'] + 'px';
	}
        // If extra options are passed than use them to the styles
	if (settings != undefined) {
	    setSettings(settings, result);
	}
        
	return result;
    }
    // subselect creation
    function createClone(styles, element, options, settings) {
        // link to the changing select  chosen option 
	this.selected   = {};
	this.parent     = $(element);
        // subselect (the top element)
	this.div        = $('<div>');
        // contents container 
	this.box        = $('<div>');
        // select contents 
	this.content    = createContent.call(this, styles, element, options);
        // select open button
	this.button     = $('<div>');
        // styles hash
	this.opt        = {};
	var tmp_rows    = (settings != undefined && settings.rows != undefined) ? settings.rows : default_rows;
        // the number of elements inside the select
	var rows        = options.length < tmp_rows ? options.length : tmp_rows;
        // open/close select flag
	this.opened     = false;
	    
        // add to pseudoselect the styles taken from the select 
	for (var i in styles) {
	    this.div.css(i, styles[i]);
	}
	// Styles for convoluted pseudoelect
	this.opt.down = {
	    height_div: styles.height,
	    height_box: window.navigator.appName == 'Opera'  ? (parseInt(styles.height) - 2*parseInt(styles.borderWidth) + 'px') : styles.height,
	    overflow:   'hidden',
	    border:     '0 none',
	    zIndex:     0
	};
        // Styles for open pseudoselect
	this.opt.up = {
	    rows: rows,
	    heightContent: options.length * parseInt(styles.height) + 'px',
	    height_div:    (rows * parseInt(styles.height)) + 'px',
	    height_box:    window.navigator.appName.search('Microsoft') >= 0  ?
			    (rows * parseInt(styles.height) - 2*parseInt(styles.borderWidth) + 'px') :
			    (rows * parseInt(styles.height)) + 'px',
	    overflow:      'visible',
	    position:      'absolute',
	    border:        styles.border,
	    borderTop:     '0 none',
	    zIndex:        100000000
	};
	// Setup the button in the center in accordance with the pseudoselect height
	this.button
            .addClass('select-button-close')
            .css({
                top: (parseInt(styles.height) - min_height)/2 + 'px'
            });
            
	this.box
            .addClass('select-box')
            .css({
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
    // Subselect content creation
    function createContent(styles, element, options) {
	var self = this,
	    table = $('<table>'),
	    tbody = $('<tbody>'),
	    height,
	    tr;
	    
	table.addClass('selectimus-table')
	
        // Correction for Opera. Consider the height of the frames while
        // finding the select under change height, the frames height is to be taken off 

	if (window.navigator.appName == 'Opera') {
	    height = parseInt(styles.height) - styles['border-width']*2 + 'px'; 
	} else {
	    height = styles.height;
	}
        // Subselect table lines
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
                // When click the table line, the attached select  chosen option is changed
		tr.click(function () {
		    if (self.opened == true) {
			self.selected.count = j;
			self.selected.id    = val;
		    }
		});
	    })(k, v.value);
	});
	table.append(tbody);
	
	return table;
    }
    // Event agents for the new pseudoselect attach
    function setEvents() {
		
	var self = this;
	
        // the first select click
	this.div.toggle(function (e) {
	    self.opened = true;
	    self.div.css({
		borderBottom: self.opt.up.borderTop,
		borderLeft:   self.opt.up.borderTop,
		borderRight:  self.opt.up.borderTop,
		overflow:     self.opt.up.overflow,
		height:       self.opt.up.height_div
	    });
	    self.box
		.css({
		    position:  self.opt.up.position,
		    border:    self.opt.up.border,
		    borderTop: self.opt.up.borderTop,
		    height:    self.opt.up.height_box,
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
	    
            // When click on any place of the document the select is to be rolled down
	    /*_document.one('click', function () {
		self.div.click();
	    });*/
            _document.bind('click', closeSelect);
	
        // Repeated click on the select    
	}, function (e) {
	    self.opened = false;
            _document.unbind('click', closeSelect)
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
        
        function closeSelect() {
	    self.div.click();
        }
    }
    // Scrollbar setup 
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
    // In the case of scrollbar absence set up the pseudoselect content 
    function moveTo(margin, down) {
	
	var _margin;
	
	if (down == true || Math.abs(margin) < this.content.height() - parseInt(this.opt.up.height)) {
	    _margin = margin;
	} else {
	    _margin = 0;
	}
	
        // Immediate setup
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
                // (scrolling button width) scrollbar width
                btnsWidth:    16,
                // (scrolling button height) scrollbar width
	        btnsHeight:   16,
                // scrollbar bounds depth
                bordersWidth: 1
	   };
	   
        // Slider proportions according to the scrolled content setup
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
                // container height
		scrollpane_h:     scrollpane_h,
                // content height
		scrollcontent_h:  scrollcontent_h,
                // content stop coordinates
		scrollcontent_stop: scrollpane_h - scrollcontent_h,
                // scrollbar container height
		scrollbar_wrap_h: scrollbar_wrap_h,
                // slider height
		size_slider:      size_slider,
                // content height growth while scrolling index
		multiple:         multiple,
                // when the coordinate limit is reached than stop the scrollbar
		stopScroll:       stopScroll,
                // the number of pixels  in one percent of movement by the content
		percentContent:   percentContent,
                // the number of pixels in one percent of movement  by the slider
		percentSlider:    percentSlider
	    };
       }
       
       
       function _Scrollbar(data) {
            var self = this,
                interval;
	   
            // content container
            this.scrollpane    = data.scrollpane;
            // content
            this.scrollcontent = data.scrollcontent;
            // data
            this.params = sizeSlider(this.scrollpane, this.scrollcontent);
            // scroll up button   
            this.scroll_top      = $('<div>').addClass('w-srcoll-top w-srcoll-btn').css({
                width: 	def_opt.btnsWidth + 'px',
                height: def_opt.btnsWidth + 'px',
                backgroundPosition: + (def_opt.btnsWidth - 14)/2 + "px " + (def_opt.btnsWidth - 14)/2 + "px "
            });
            // scroll down button
            this.scroll_bottom   = $('<div>').addClass('w-srcoll-bottom w-srcoll-btn').css({
                width: 	def_opt.btnsWidth  + 'px',
                height: def_opt.btnsWidth + 'px',
                //backgroundPosition: + (def_opt.width - 16)/2 + "px " + (def_opt.width - 16)/2 + "px "
                backgroundPosition: + (def_opt.btnsWidth - 14)/2 + "px 112%"
            });
            // scrollbar container
            this.scrollbar_wrap  = $('<div>').addClass('w-srcollbar-wrap').css({
                height: 	this.params.scrollbar_wrap_h,
                width: 		def_opt.btnsWidth
            });
            // scrollbar
            this.scrollbar       = $('<div>').addClass('w-srcollbar').css({
	       height: 	this.params.scrollbar_wrap_h - def_opt.btnsWidth*2,
	       marginTop: 	def_opt.btnsWidth + 'px',
	       width:  	def_opt.btnsWidth + 'px'  
            });
            // slider
            this.slider          = $('<div>').addClass('w-slider').css({
                top:		 0,
                width: 		 def_opt.btnsWidth - 2 + 'px',
                height: 	 this.params.size_slider + 'px'
            }).append("<span style='margin:"+ this.params.size_slider/2 +"px auto;'></span>");

            // Elements adjustment 
            this.scrollbar_wrap.append(this.scroll_top);
            this.scrollbar_wrap.append(this.scrollbar);
            this.scrollbar_wrap.append(this.scroll_bottom);
            this.scrollbar.append(this.slider);
            this.scrollbar_wrap.appendTo(this.scrollpane);
	   
            // Slider initialization 
	   (function draggable() {
		var top,
		    y;
                // When click on slider – start the movement	
		self.slider.mousedown(function (e) {
                    // forbid the default action in order to prevent  the text highlighting  
		    e.preventDefault();
                    // the slider should move when the cursor is moving along the whole document
                    // while the left mouse button is pressed
		    _document.bind('mousemove', moveSlider);
                    // stop the slider movement when the left mouse button is unpressed at any place of the document
		    _document.one('mouseup', mouseupSlider);
		    top = parseInt(self.slider.css('top'));
		    y = e.clientY;
		});
                // the slider movement stop	
		function mouseupSlider(e) {
		    _document.unbind('mousemove', moveSlider);
		}
		// the slider position relative to it`s start position and the current cursor position calculation
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
	   
            // Prevent the event`s scrollbar bounds leave
            this.scrollbar_wrap.click(function (e) {
                e.stopPropagation();
            });
	   
            // Scrolling when press the button
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
	   
            //Scrolling when click at free scrollbar place   
            this.scrollbar.bind('click', function (e) {
                if (e.target != self.scrollbar[0]) {
                    return false; 
                }
                // Place for click
	       var clickY 	= e.pageY,
                    // highest slider bound
                    posY 	= self.slider.offset().top,
                    //highest content bound
                    contentY = parseInt(self.scrollcontent.css('margin-top')),
                    // stop coordinates
                    target,
                    i = 0,
                    j;
                // Scrolling up or down 
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
        // select scrolling to the pointed place
        // scrollbar is setup proportionally
        _Scrollbar.prototype.move = function (margin, set) {
	   
            var _margin,
                params = this.params,
                top;
            // If the content scrolling leaves the container bounds than scroll    
            if (margin < params.scrollpane_h - params.scrollcontent_h) {
                _margin = params.scrollpane_h - params.scrollcontent_h;
            } else {
                _margin = margin;
            }
	   
            top = (Math.abs(_margin)/params.percentContent)*params.percentSlider;
	   
	   
            this.slider.css('top', top + 'px');
            // Scroll
            if (set == undefined) {
                this.scrollcontent.animate({
                    'margin-top': _margin + 'px'
                }, 800);
            } else {

            // Immediate setup
                this.scrollcontent.css({
		   'margin-top': set == true ? margin : _margin + 'px'
                });
            }
        }
        // show the slider  
        _Scrollbar.prototype.show = function () {
            this.scrollbar_wrap.css('display', 'block');
        }
        // Hide the slider
        _Scrollbar.prototype.hide = function () {
            this.scrollbar_wrap.css('display', 'none');
        }
        // Renew the slider
        _Scrollbar.prototype.renew = function (slider) {
            sizeSlider(this.scrollpane, this.scrollcontent, this.slider);
        }
       
        return new _Scrollbar(data);  
    }
   
   
})(jQuery);
