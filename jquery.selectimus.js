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

    var loc_document = $(document),
        // required styles for selects on default
        default_styles = function () {
            return {
		color:      '#000',
                background: '#FFF',
		color_up:        '#FFF',
		background_up:   '#7ea0fa',
                display:         'inline-block',
                'border-width':  '1px',
                'border-style':  'solid',
                'border-color':  '#b6b6b6',
                'border-radius': '5px',
                margin:          '3px 0',
                padding:         0,
                position:        'relative',
                overflow:        'visible'
            };
        },
        // Exploded select lines number on default
        default_rows = 10,
        // Hash for the created selects
        select_hash = {},
        // Selects number calculator
        len = 0,
        // Select minimum height
        min_height = 16,
        curr_select,
        key_flag   = false;

    // subselect extra options setup
    function setSettings(opt, style) {
        var i;
            options = {
                width: 5,
                height: 5
            };

        for (i in opt) {
            if (options[i] !== undefined) {
                style[i] = parseInt(style[i], 10) + opt[i] * options[i] + 'px';
            }
        }
        
    }

    // Select styles receiving
    function getStyles(element, def_style, settings) {
        var i,
            result = {},
            value,
            styles = ['width', 'height'];

        // Add the default styles and the styles passed by the user to the result
        if (def_style.height !== undefined) {
            result.height = parseInt(def_style.height, 10);
        } else {
            result.height = element[0].clientHeight >= 22 ? element[0].clientHeight : 22;
        }
        result.width = element[0].clientWidth;

        if (window.navigator.appName == 'Opera') {
            result['line-height'] = result.height - def_style['border-width'] * 2 + 'px';
        } else {
            result['line-height'] = result.height + 'px';
        }
        
        for (i in def_style) {
            result[i] = def_style[i];
        }

        // For Safari – take out some style by means of the set keys
        /*if (window.navigator.vendor.search('Apple') >= 0) {
        result.width = element.outerWidth() - def_style['border-width'] + 'px';
        result.height = element.outerHeight() - def_style['border-width'] + 'px';
        }*/

        // If extra options are passed than use them to the styles
        if (settings !== undefined) {
            setSettings(settings, result);
        }

        return result;
    }
    
    // Subselect content creation
    function createContent(styles, element, options) {
        var self = this,
            ul = $('<ul>'),
            li;
            
        ul.addClass('selectimus_ul');
        
        // Correction for Opera. Consider the height of the frames while
        // finding the select under change height, the frames height is to be taken off
        /*
        if (window.navigator.appName == 'Opera') {
            height = parseInt(styles.height) - styles['border-width']*2 + 'px';
        } else {
            height = styles.height;
        }*/
        
        // Subselect list lines
	$.each(options, function (k, v) {
            
            if (v.value == element.val()) {
                self.selected.count = k;
                self.selected.id = element.val();
            }

            li = $('<li>')
                .attr({value: k})
                .css('height', styles.height).html(v.innerHTML);
                
            ul.append(li);
    
        });
        
        ul.bind('click', function (e) {
            var elem = e.target;
            
            if (self.opened === true) {
                self.selected.count = parseInt(elem.getAttribute('value'), 10);
                self.selected.id    = elem.innerHTML;
            }
        });
        
        return ul;
    }

    // Checking for activated selected
    function documentClick() {
        var i;
        
        for (i in select_hash) {
            if (select_hash[i].opened === true) {
                select_hash[i].div.click();
            }
        }
        
    }

    // Scrollbar setup
    function setScrolbar(field, content, options) {
        var result;
	
        if (options.up.height == options.up.heightContent) {
            result = false;
        } else {
            result = $.scrollbar({
                scrollpane:    field,
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
        var loc_margin;
        
        if (down === true || Math.abs(margin) < this.content.height() - parseInt(this.opt.up.height, 10)) {
            loc_margin = margin;
        } else {
            loc_margin = 0;
        }
        
        // Immediate setup
        this.content.css({
            'margin-top': loc_margin + 'px'
        });
        
    }
    
    // Scrollbar manipulation with keys
    function KeyCodeContructor() {
    }
    KeyCodeContructor.prototype.keyCodeOn = function (e) {
        var code = e.keyCode,
            index,
            lines,
            over,
            d_heig,
            u_heig,
            len;
        
        // Capture event event only to Enter, Arrow Up and Arrow Down keys
        if (code == 40 || code == 38 || code == 13) {
                e.preventDefault();
                len   = this.parent[0].length;
                lines = this.content.find('LI');
                // number of current line
                over  = this.selected.over;
                
                // current id and position of real hidden select
                this.selected.id    = lines.eq(over).html();
                this.selected.count = lines.eq(over).val();
                
                if (code != 13) {
                    index = code == 40 ? 1 : -1;
                    
                    if ((over == (len - 1) && index == 1) || (over == 0 && index == -1)) {
                        return false;
                    }
                    
                    d_heig = parseInt(this.opt.down.height, 10);
                    u_heig = parseInt(this.opt.up.height, 10);
                    
		    lines.css({
			background: this.opt.down.background,
			color:      this.opt.down.color
		    });
                    lines.eq(over + index).css({
			background: this.opt.up.background,
			color:      this.opt.up.color
		    });
                    this.selected.over += index;
		    
		    if (code == 40 && (this.selected.count * d_heig > -1 * parseInt(this.content.css('margin-top'), 10) - this.current_stop - d_heig*2)) {
                        this.current_step += index;
                        this.scrollbar.move(-1  * u_heig * (this.current_step - 1), false); 
		    } else if (code == 38 && (this.selected.count * d_heig == -1 * parseInt(this.content.css('margin-top'), 10))) {
                        this.current_step += index;
                        this.scrollbar.move(-1  * u_heig * (this.current_step - 1), false); 
		    }
		    
                // For Enter pressing cause event listener for click event on the Document -
                // select_hide will work
                } else {
                    loc_document.click();
                }
                
        }
    }
    
    // Event agents for the new subselect attach
    function setEvents() {
        var self = this;
        
        // Repeated click on the select
        function select_hide(e) {
            
            curr_select = undefined;
            self.opened = false;
            self.button.show();
            
            self.div.css({
                border: self.opt.up.border,
                height: self.opt.down.height,
                zIndex: self.opt.down.zIndex
            });
            self.box
                .removeClass('select-box-open')
                .css({
                    border: self.opt.down.border,
                    borderTop: self.opt.up.borderTop,
                    height: self.opt.down.height
                });
            
            if (self.scrollbar !== false) {
                self.scrollbar.move(-1 * self.selected.count * parseInt(self.opt.down.height, 10), true);
                self.scrollbar.hide();
            } else {
                moveTo.call(self, -1 * self.selected.count * parseInt(self.opt.down.height, 10), true);
            }
            
            self.box.find('LI').unbind('mouseenter');
	    self.box.find('LI').css({
		background: self.opt.down.background,
		color:      self.opt.down.color
	    });
            self.parent.val(self.selected.id);
            self.div.one('click', select_open);
        }
        
        // the first select click
        function select_open(e) {
            
            curr_select = self;

            documentClick();
            e.stopPropagation();
            self.opened = true;
            self.button.hide();
            self.div
                .css({
                    borderBottom: self.opt.up.borderTop,
                    borderLeft: self.opt.up.borderTop,
                    borderRight: self.opt.up.borderTop,
                    overflow: self.opt.up.overflow,
                    height: self.opt.up.height,
                    zIndex: self.opt.up.zIndex
                });
            self.box
                .addClass('select-box-open')
                .css({
                    position: self.opt.up.position,
                    border: self.opt.up.border,
                    borderTop: self.opt.up.borderTop,
                    height: self.opt.up.height
                });
            
            self.selected.over = self.selected.count;
            self.box.find('LI').eq(self.selected.id).css({
		background: default_styles.background2,
		color:      default_styles.color2
	    });
            
            self.box.find('LI').bind('mouseenter', function (e) {
		self.box.find('LI').css({
		    background: self.opt.down.background,
		    color:      self.opt.down.color
		});
		$(e.target).css({
		    background: self.opt.up.background,
		    color:      self.opt.up.color
		});
                self.selected.over = parseInt(e.target.getAttribute('value'), 10);
            });
            
            if (self.scrollbar === undefined) {
                self.scrollbar = setScrolbar(self.box, self.content, self.opt);
            }
            
            if (self.scrollbar !== false) {
                self.scrollbar.show();
                self.scrollbar.move(-1 * self.selected.count * parseInt(self.opt.down.height, 10), false);
            } else {
                moveTo.call(self, -1 * self.selected.count * parseInt(self.opt.down.height, 10));
            }
            
            // When click on any place of the document the select is to be rolled down
            loc_document.one('click', select_hide);
        }
        
        this.div.one('click', select_open);
        
    }
    
    // Function for inheritance Prototype.
    function extend(Child, Parent/*, parent_own_prop*/) {
        var F = function() { },
            i,
            instance;
    
        F.prototype = Parent.prototype;
        Child.prototype = new F();
        Child.prototype.constructor = Child[i];
        Child.superclass = Parent.prototype;
        
    }
    
    
    // subselect creation
    function CreateClone(styles, element, options, settings) {
        
        // link to the changing select chosen option
        this.selected = {};
        this.parent = $(element);
        // subselect (the top element)
        this.div = $('<div>');
        // contents container
        this.box = $('<div>');
        // select contents
        this.content = createContent.call(this, styles, element, options);
        // select open button
        this.button = $('<div>');
        // styles hash
        this.opt = {};
        // open/close select flag
        this.opened = false;
        
        var i,
            tmp_rows = (settings !== undefined && settings.rows !== undefined) ? settings.rows : default_rows,
            // the number of elements inside the select
            rows = options.length < tmp_rows ? options.length : tmp_rows;
            
        // add to pseudoselect the styles taken from the select
        for (i in styles) {
            this.div.css(i, styles[i]);
        }
        
        // Styles for convoluted subselect
        this.opt.down = {
            height: styles.height,
            overflow: 'hidden',
            border: '0 none',
            zIndex: 1,
	    background: styles.background,
	    color: styles.color
        };
        // Styles for open subselect
        this.opt.up = {
            rows: rows,
            heightContent: options.length * parseInt(styles.height, 10) + 'px',
            height: rows * parseInt(styles.height, 10) + 'px',
            overflow: 'visible',
            position: 'absolute',
            border: styles.border,
            borderTop: '0 none',
            zIndex: 100000000,
	    background: styles.background_up,
	    color: styles.color_up
        };
        // Setup the button in the center in accordance with the pseudoselect height
        this.button
            .addClass('select-button-close')
            .css({
                top: (parseInt(styles.height, 10) - min_height) / 2 + 'px'
            });
        this.box
            .addClass('select-box')
            .css({
                height: this.opt.down.height,
                background: styles.background_down,
                'border-radius': styles['border-radius']
            });

        
        this.current_step = 1;
        this.current_stop = -1 * parseInt(this.opt.up.height, 10);

        this.div.addClass('selectimus');
        this.box.append(this.content);
        this.div.append(this.button);
        this.div.append(this.box);
        setEvents.call(this);
        moveTo.call(this, -1 * this.selected.count * parseInt(this.opt.down.height, 10), true);
        
    }
    
    // Select change
    function changeSelect(element, def_style, settings) {
        
        // select internal options
        var options = element.children(),
            // select styles
            styles = getStyles(element, def_style, settings),
            // subselect
            clone = new CreateClone(styles, element, options, settings);
            
        select_hash[element.attr('id')] = clone;
        len += 1;
        // hide the select
        element.css('display', 'none');
        // and paste the clone
        clone.div.insertBefore(element);
        
    }
    
    extend(CreateClone, KeyCodeContructor);

    loc_document.bind('keydown', function (e) {
	if (curr_select !== undefined) {
	    curr_select.keyCodeOn(e);
	}
    });
    
    // method add to jQuery object
    $.fn.selectimus = function (styles, settings) {
        
        var def_style = default_styles(),
            len = this.length,
            i;
	    
        // styles add/change for subselect
        if (styles !== undefined) {
            for (i in styles) {
                def_style[i] = styles[i];
            }
        }
        
        def_style.border = def_style['border-width'] + ' ' + def_style['border-style'] + ' ' + def_style['border-color'];
        
        // function use for all the passed elements
        $.each(this, function (k, v) {
            var el = $(v);
            
            if (select_hash[el.attr('id')] === undefined) {
                changeSelect($(v), def_style, settings);
            }
        });
	
        
        return this;
    };
    
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
            btnsWidth: 16,
            // (scrolling button height) scrollbar width
            btnsHeight: 16,
            // scrollbar bounds depth
            bordersWidth: 1
        };

        // Slider proportions according to the scrolled content setup
        function sizeSlider(scrollpane, scrollcontent, slider) {
            
            var scrollpane_h     = scrollpane.height(),
                scrollcontent_h  = scrollcontent.height(),
                scrollbar_wrap_h = scrollpane_h - scrollpane_h * 0.02,
                diff1	         = scrollcontent_h - scrollpane_h,
                prop	         = diff1 / scrollcontent_h,
                scroll_area      = scrollbar_wrap_h - def_opt.btnsWidth * 2,
                stopScroll       = Math.floor(scroll_area * prop),
                size_slider      = scrollbar_wrap_h - def_opt.btnsWidth * 2 - stopScroll - def_opt.bordersWidth * 2,
                //multiple         = diff1 / (scrollbar_wrap_h - def_opt.btnsWidth * 2 - size_slider),
                multiple         = scrollcontent_h / scroll_area,
                percentContent   = diff1 / 100,
                percentSlider    = stopScroll / 100;

            /*if (slider !== undefined) {
                size_slider = height2;
                slider.height(height2);
            }*/

            return {
                // container height
                scrollpane_h:       scrollpane_h,
                // content height
                scrollcontent_h:    scrollcontent_h,
                // content stop coordinates
                scrollcontent_stop: scrollpane_h - scrollcontent_h,
                // scrollbar container height
                scrollbar_wrap_h:   scrollbar_wrap_h,
                // slider height
                size_slider:        size_slider,
                // content height growth while scrolling index
                multiple:           multiple,
                // when the coordinate limit is reached than stop the scrollbar
                stopScroll:         stopScroll,
                // the number of pixels in one percent of movement by the content
                percentContent:     percentContent,
                // the number of pixels in one percent of movement by the slider
                percentSlider:      percentSlider
            };
       }
       
       
       function Scrollbar(data) {
            var self = this,
                interval;

            // content container
            this.scrollpane    = data.scrollpane;
            // content
            this.scrollcontent = data.scrollcontent;
            // data
            this.params        = sizeSlider(this.scrollpane, this.scrollcontent);
            // scroll up button
            this.scroll_top = $('<div>').addClass('w-srcoll-top w-srcoll-btn').css({
                width: def_opt.btnsWidth + 'px',
                height: def_opt.btnsWidth + 'px',
                backgroundPosition: + (def_opt.btnsWidth - 14) / 2 + "px " + (def_opt.btnsWidth - 14) / 2 + "px "
            });
            // scroll down button
            this.scroll_bottom = $('<div>').addClass('w-srcoll-bottom w-srcoll-btn').css({
                width: def_opt.btnsWidth + 'px',
                height: def_opt.btnsWidth + 'px',
                //backgroundPosition: + (def_opt.width - 16)/2 + "px " + (def_opt.width - 16)/2 + "px "
                backgroundPosition: (def_opt.btnsWidth - 14) / 2 + "px 112%"
            });
            // scrollbar container
            this.scrollbar_wrap = $('<div>').addClass('w-srcollbar-wrap').css({
                height: this.params.scrollbar_wrap_h,
                width: def_opt.btnsWidth
            });
            // scrollbar
            this.scrollbar = $('<div>').addClass('w-srcollbar').css({
                position: 'relative',
                height: this.params.scrollbar_wrap_h - def_opt.btnsWidth*2,
                //marginTop: def_opt.btnsWidth + 'px',
                top: def_opt.btnsWidth + 'px',
                width: def_opt.btnsWidth + 'px'
            });
            // slider
            this.slider = $('<div>').addClass('w-slider').css({
                top:	0,
                width: def_opt.btnsWidth - 2 + 'px',
                height: this.params.size_slider + 'px'
            }).append("<span style='margin:" + this.params.size_slider / 2 +"px auto;'></span>");

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
		    
		// the slider position relative to it`s start position and the current cursor position calculation
                function moveSlider(e) {
                                
                    e.preventDefault();
		    
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
                            'margin-top': self.params.multiple * (-1 * (top + e.clientY - y)) + 'px'
                        });
                    }
                }
		
                // the slider movement stop
                function mouseupSlider(e) {
                    loc_document.unbind('mousemove', moveSlider);
                }
                
                // When click on slider – start the movement
                self.slider.mousedown(function (e) {
                    // forbid the default action in order to prevent the text highlighting
                    e.preventDefault();
                    // the slider should move when the cursor is moving along the whole document
                    // while the left mouse button is pressed
                    loc_document.bind('mousemove', moveSlider);
                    // stop the slider movement when the left mouse button is unpressed at any place of the document
                    loc_document.one('mouseup', mouseupSlider);
                    top = parseInt(self.slider.css('top'), 10);
                    y = e.clientY;
                });
                
            })();

            // Prevent the event`s scrollbar bounds leave
            this.scrollbar_wrap.click(function (e) {
                e.stopPropagation();
            });

            // Scrolling when press the button
            this.scroll_top.add(this.scroll_bottom).bind({
                'mousedown': function (e) {
                    //e.stopPropagation();
                    var it,
		        im,
			stop;
                    
                    if (e.target == self.scroll_top[0]) {
                        it = -1;
                        stop = 0;
                    } else {
                        it = 1;
                        stop = self.params.stopScroll;
                    }
                    interval = setInterval(function () {
                        var top = parseInt(self.slider.css('top'), 10);
                        
                        if (top == stop) {
                            clearInterval(interval);
                            self.slider.css('top', stop + 'px');
                            return;
                        }
                        
                        self.slider.css('top', top + it + 'px');
                        self.scrollcontent.css('margin-top', -1 * self.params.multiple * (top + it) + 'px');
                        /*if (listeners.drag != undefined) {
                        listeners.drag(-1*multiple*(top + it));
                        }*/
                    }, 4);
                },
                'mouseup': function (e) {
                    //e.stopPropagation();
                    clearInterval(interval);
                }
            });

            //Scrolling when click at free scrollbar place
            this.scrollbar.bind('click', function (e) {
                
                if (e.target != self.scrollbar[0]) {
                    return false;
                }
                
                // Place for click
                var clickY = e.pageY,
                    // highest slider bound
                    posY = self.slider.offset().top,
                    //highest content bound
                    contentY = parseInt(self.scrollcontent.css('margin-top'), 10),
                    // stop coordinates
                    target,
                    i = 0,
                    j;
                    
                // Scrolling up or down
                if (clickY < posY) {
                    target = clickY - posY;
                    j = -1 * Math.round(self.params.scrollcontent_h / self.params.scrollpane_h * 2);
                } else {
                    target = clickY - posY - self.params.size_slider;
                    j = 1 * Math.round(self.params.scrollcontent_h / self.params.scrollpane_h * 2);
                }
                
                interval = setInterval(function () {
                    if ((i + j >= target && j > 0) || (i + j <= target && j < 0)) {
                        clearInterval(interval);
                        self.slider.offset({top: posY + target});
                        self.scrollcontent.css('margin-top', contentY - self.params.multiple*target + 'px');
                        return false;
                    }
                    self.slider.offset({top: self.slider.offset().top + j});
                    self.scrollcontent.css('margin-top', parseInt(self.scrollcontent.css('margin-top'), 10) - j * self.params.multiple + 'px');
                    i += j;
                }, 1);
                
            });

        }
        // select scrolling to the pointed place
        // scrollbar is setup proportionally
        Scrollbar.prototype.move = function (margin, set) {
            var loc_margin,
                params = this.params,
                top;
                
            // If the content scrolling leaves the container bounds than scroll
            if (margin < params.scrollpane_h - params.scrollcontent_h) {
                loc_margin = params.scrollpane_h - params.scrollcontent_h;
            } else {
                loc_margin = margin;
            }

            top = (Math.abs(loc_margin) / params.percentContent)*params.percentSlider;


            this.slider.css('top', top + 'px');
            // Scroll
            if (set == undefined) {
                this.scrollcontent.animate({
                    'margin-top': loc_margin + 'px'
                }, 800);
            // Immediate setup
            } else {
                this.scrollcontent.css({
                    'margin-top': set === true ? margin : loc_margin + 'px'
                });
            }
        };
        // show the slider
        Scrollbar.prototype.show = function () {
            this.scrollbar_wrap.css('display', 'block');
        };
        // Hide the slider
        Scrollbar.prototype.hide = function () {
            this.scrollbar_wrap.css('display', 'none');
        };
        // Renew the slider
        Scrollbar.prototype.renew = function (slider) {
            sizeSlider(this.scrollpane, this.scrollcontent, this.slider);
        };
       
        return new Scrollbar(data);
    };
   
})(window.jQuery);