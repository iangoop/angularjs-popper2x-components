describe('Popper2x-components testing',function() {
    beforeEach(module('popupExt'));

    var $compile, $rootScope, $filter;

    beforeEach(inject(function(_$compile_, _$rootScope_, _$filter_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $filter = _$filter_;
    }));

    it('click on button should open the dropdown',function() {
        var trigger = angular.element("<button dropdown='#dropdown' />");
        var dropdown = angular.element("<div id='dropdown' style='display: none'></div>");
        $(document.body).append(trigger)
        $(document.body).append(dropdown)
        $compile(trigger)($rootScope);
        $compile(dropdown)($rootScope);

        $rootScope.$digest();
        expect(jQuery(dropdown).is(':hidden')).toEqual(true);
        jQuery(trigger).click();
        expect(jQuery(dropdown).is(':hidden')).toEqual(false);
        trigger.remove();
        dropdown.remove();
    })

})
