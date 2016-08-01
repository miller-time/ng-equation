'use strict';

describe('equation directive', function() {
    var $scope,
        element,
        controller,
        instantiate,
        UnknownOperandClassException;

    beforeEach(module('ngEquation'));

    beforeEach(inject(function($compile, $rootScope, _UnknownOperandClassException_) {
        UnknownOperandClassException = _UnknownOperandClassException_;
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
                operands: []
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

    it('should allow getting "formula" of the topLevelGroup', function() {
        expect(controller.formula()).toEqual('');
    });

    it('should load an equation and attach the the available operand properties to operands of the equation', function() {
        instantiate();
        controller.options.availableOperands = [{
            class: 'fruit',
            foo: function() { return 'foo'; },
            bar: 'fruit bar'
        }, {
            class: 'animal',
            bar: 'animal bar'
        }];
        controller.loadEquation({
            operator: 'AND',
            operands: [
                {
                    class: 'fruit',
                    value: 'banana'
                },
                {
                    operator: 'OR',
                    operands: [
                        {
                            class: 'animal',
                            value: 'cat'
                        },
                        {
                            class: 'animal',
                            value: 'dog'
                        }

                    ]
                }
            ]
        });
        expect(controller.topLevelGroup).toEqual({
            onReady: jasmine.any(Function),
            operator: 'AND',
            operands: [
                {
                    class: 'fruit',
                    value: 'banana',
                    foo: jasmine.any(Function),
                    bar: 'fruit bar'
                },
                {
                    operator: 'OR',
                    operands: [
                        {
                            class: 'animal',
                            value: 'cat',
                            bar: 'animal bar'
                        },
                        {
                            class: 'animal',
                            value: 'dog',
                            bar: 'animal bar'
                        }
                    ]
                }
            ]
        });
    });

    it('should throw an exception if trying to load operands that don\'t map to an available operand', function() {
        instantiate();
        controller.options.availableOperands = [{class: 'bike'}];
        expect(function() {
            controller.loadEquation({
                operator: 'AND',
                operands: [{
                    class: 'car',
                    value: 'corvette'
                }]
            });
        }).toThrowError(
            UnknownOperandClassException,
            'Available operands does not include an operand with class "car".'
        );
    });
});
