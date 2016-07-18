'use strict';

describe('equation directive', function() {
    var $scope,
        controller,
        instantiate;

    beforeEach(module('ngEquation'));

    beforeEach(inject(function($compile, $rootScope) {
        $scope = $rootScope.$new();
        $scope.myOptions = {opt: 1};

        instantiate = function() {
            var element = angular.element(
                '<equation ' +
                    'equation-options="myOptions">' +
                '</equation>'
            );
            $compile(element)($scope);
            $scope.$digest();

            controller = element.isolateScope().equation;
        };
        instantiate();
    }));

    it('should initiate a topLevelGroup', function() {
        expect(controller.topLevelGroup).toEqual({
            operator: 'AND',
            operands: [],
            onReady: jasmine.any(Function)
        });
    });

    it('should allow getting "value" of the topLevelGroup', function() {
        expect(controller.value()).toEqual({
            operator: 'AND',
            children: []
        });
    });
});
