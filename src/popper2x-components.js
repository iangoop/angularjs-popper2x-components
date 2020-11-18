(function(angular,$,Popper) {
    "use strict";
    angular.module('popupExt',[])
        .directive('tooltip',tooltip())
        .directive('tooltipHtml',tooltip(true))
        .directive('dropdown',dropdown())

    var defaults = {
        /**
         * place of the pop-up component opened in relation to the trigger
         * or the target if it is defined
         */
        placement: 'bottom',
        /**
         * allows the directive to control the tabindex property to assure that
         * any focusable will receive the focus when the user hits tab after the
         * pop-up component is shown
         */
        controlTabOrder: true,
        /**
         * related to the tab hit control. The element that triggers the pop-up
         * component will have the tabindex set to the value below while the
         * pop-up is visible
         */
        autoTabIndex: 1000
    }

    function ctrl(scope) {
        var i = {
            open: function(popup, container) {
                if (this.popper) {
                    return;
                }
                if (this.opts.contentHTML) {
                    popup = this.innerPopup = angular.element('<div>'+this.opts.contentHTML+'</div>');
                    container.parent().append(this.innerPopup)
                }
                if (this.opts.controlTabOrder && this.source) {
                    this.seizeTabindex(popup);
                }
                popup.show()
                //d.find(':focusable').first().focus();
                this.popper = Popper.createPopper(container.get(0), popup.get(0), this.opts);
            },
            close: function(popup,event) {
                if (!this.popper) {
                    return;
                }
                if (popup) {
                    popup.hide();
                }
                if (this.innerPopup) {
                    this.innerPopup.remove();
                }
                if (this.opts.controlTabOrder && this.source) {
                    this.freeTabindex(event);
                }

                if (this.popper) {
                    this.popper.destroy();
                    this.popper = null;
                }
            },
            seizeTabindex: function(popup) {
                this.tabindex = this.source.attr('tabindex');
                var seizeTab = this.opts.autoTabIndex;
                this.source.attr('tabindex',seizeTab)
                popup.find(':focusable').each(function(){
                    seizeTab++
                    $(this).attr('tabindex',seizeTab);
                })
            },
            freeTabindex: function(event) {
                var self = this;
                if (this.tabindex) {
                    this.source.attr('tabindex',this.tabindex)
                } else {
                    self.source.removeAttr('tabindex');
                }

                if (this.source.length && event && this.source.get(0) == event.target) {
                    event.preventDefault();
                    event.stopImmediatePropagation();

                    var restoreFocus = function() {
                        setTimeout(function() {
                            self.source.first().focus();
                        },1)
                        $(window).off('focus',restoreFocus)
                    }

                    $(window).on('focus', restoreFocus)
                } else {
                    this.source.first().focus();
                }
            }

        }
        scope.$watch('config', function(config) {
            var opts = config || {}
            i.opts = angular.extend({}, defaults, opts)
        })
        return i;
    }

    function tooltip() {
        return [function() {
            return {
                restrict: 'A',
                scope: {
                    config: '='
                },
                link: function(scope, element, attr) {
                    var _ctrl = ctrl(scope);

                    var tooltip = attr['tooltip']?$(attr['tooltip']).first():null;
                    var target = attr['target']?$(attr['target']).first():$(element);
                    var open = function() {
                        _ctrl.open(tooltip,target);
                    }
                    var close = function() {
                        _ctrl.close(tooltip)
                    }

                    $(element).on({mouseenter: open, focus: open})
                    $(element).on({mouseleave: close, blur: close})

                    scope.$on('$destroy', function() {
                        _ctrl.close(tooltip)
                    });
                }
            }
        }]
    }

    function dropdown() {
        return [function() {

            jQuery.extend(jQuery.expr[':'], {
                focusable: function(el, index, selector){
                    var match = 'a[href]:not([disabled]), area[href], :input:not([disabled]), details, iframe,' +
                        '[contentEditable=true], [tabindex]:not([tabindex^="-"])';
                    return $(el).is(match);
                }
            });

            return {
                restrict: 'A',
                scope: {
                    config: '='
                },
                link: function(scope, element, attr) {
                    var _ctrl = ctrl(scope);
                    _ctrl.source = element;

                    var dropdown = $(attr['dropdown']).first();
                    var target = attr['target']?$(attr['target']).first():$(element);

                    var mouseIn = false;
                    var mouseDown = false;

                    var elementClick = function(e) {
                        e.preventDefault();
                        if (dropdown.is(':hidden')) {
                            _ctrl.open(dropdown,target);
                        } else {
                            _ctrl.close(dropdown)
                        }
                        return false;
                    }

                    var dropdownMouseEnter = function() {
                        mouseIn = true;
                    }
                    var dropdownMouseLeave = function() {
                        mouseIn = false;
                    }
                    var dropdownMouseDown = function() {
                        mouseDown = true;
                    }
                    var dropdownBlur = function(e) {
                        if (!mouseDown && !$(e.relatedTarget).parents().filter(dropdown).length && e.relatedTarget != element.get(0)) {
                            _ctrl.close(dropdown,e);
                        }
                    }
                    var dropdownClick = function(e) {
                        mouseDown = false;
                        if ($(e.target).data('destroy')) {
                            _ctrl.close(dropdown)
                        }
                    }
                    var documentClick = function(e) {
                        if (!mouseIn) {
                            _ctrl.close(dropdown)
                        }
                    }

                    $(element).on('blur', dropdownBlur);
                    $(element).on('click', elementClick);
                    $(dropdown).on('mouseenter',dropdownMouseEnter);
                    $(dropdown).on('mouseleave',dropdownMouseLeave);
                    $(dropdown).on('mousedown',dropdownMouseDown);
                    $(dropdown).on('blur',':focusable', dropdownBlur);
                    $(dropdown).on('click',dropdownClick);
                    $(document).on('click',documentClick);

                    scope.$on('$destroy', function() {
                        _ctrl.close(dropdown)
                        $(dropdown).off("mouseenter",dropdownMouseEnter);
                        $(dropdown).off("mouseleave",dropdownMouseLeave);
                        $(dropdown).off('mousedown',dropdownMouseDown);
                        $(dropdown).off('blur',':focusable', dropdownBlur);
                        $(dropdown).off('click',dropdownClick);
                        $(document).off("click",documentClick);
                    });
                }
            }
        }]
    }

})(angular,jQuery,Popper)
