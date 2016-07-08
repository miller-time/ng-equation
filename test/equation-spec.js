'use strict';

describe('equation directive', function() {
    var $compile,
        $scope,
        ctrl,
        element;

    var standardMarkup = '<equation equation-options="myOptions"></equation>';

    beforeEach(module('ngEquation'));

    beforeEach(inject(function(_$compile_, $rootScope) {
        $compile = _$compile_;
        $scope = $rootScope.$new();
        $scope.myOptions = {opt: 1};
        element = $compile(standardMarkup)($scope);
        $scope.$digest();
        ctrl = element.isolateScope().equation;
    }));

    it('should initiate a topLevelGroup', function() {
        expect(ctrl.topLevelGroup).toEqual({
            operator: 'AND',
            operands: []
        });
    });
});
