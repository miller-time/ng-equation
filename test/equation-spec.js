'use strict';

describe('equation directive', function() {
    var $scope,
        element,
        controller,
        instantiate;

    beforeEach(module('ngEquation'));

    beforeEach(inject(function($compile, $rootScope) {
        $scope = $rootScope.$new();
        $scope.myOptions = {opt: 1};

        instantiate = function(toolboxLabel) {
            element = angular.element(
                '<equation ' +
                    'equation-options="myOptions">' +
                    (toolboxLabel || '') +
                '</equation>'
            );
            $compile(element)($scope);
            $scope.$digest();

            controller = element.isolateScope().equation;
        };
    }));

    describe('with standard options', function() {
        beforeEach(function() {
            instantiate();
        });

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

        it('should contain the default toolbox label', function() {
            var labelElem = element.find('.eq-toolbox-label');
            expect(labelElem.length).toBe(1);
            expect(labelElem.text().trim()).toEqual('Toolbox');
        });
    });

    describe('with toolbox label transcluded', function() {
        beforeEach(function() {
            instantiate(
                '<toolbox-label>' +
                    '<span class="custom-label">Custom</span>' +
                '</toolbox-label>'
            );
        });

        it('should contain the custom label element that was transcluded', function() {
            expect(element.find('.eq-toolbox-label').length).toBe(0);

            var labelElem = element.find('.custom-label');
            expect(labelElem.length).toBe(1);
            expect(labelElem.text().trim()).toEqual('Custom');
        });
    });
});
