'use strict';

describe('equation directive', function() {
    var $scope,
        controller;

    beforeEach(module('ngEquation'));

    beforeEach(inject(function($compile, $rootScope) {
        $scope = $rootScope.$new();
        $scope.myOptions = {opt: 1};

        var element = angular.element(
            '<equation ' +
                'equation-options="myOptions">' +
            '</equation>'
        );
        $compile(element)($scope);
        $scope.$digest();

        controller = element.isolateScope().equation;
    }));

    it('should initiate a topLevelGroup', function() {
        expect(controller.topLevelGroup).toEqual({
            operator: 'AND',
            operands: [],
            onReady: jasmine.any(Function)
        });
    });
});
