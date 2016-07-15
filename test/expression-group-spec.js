'use strict';

describe('expressionGroup directive', function() {
    var $scope,
        controller;

    var fooOperand = {
        class: 'foo',
        typeLabel: 'Foo',
        editMetadata: function() {},
        getLabel: function() { return 'Bar'; },
        value: 'bar'
    };

    beforeEach(module('ngEquation'));

    beforeEach(inject(function($compile, $rootScope) {
        $scope = $rootScope.$new();
        $scope.myOperator = 'AND';
        $scope.myOperands = [];
        $scope.myAvailableOperands = [];

        var element = angular.element(
            '<expression-group ' +
                'operator="myOperator" ' +
                'operands="myOperands" ' +
                'available-operands="myAvailableOperands">' +
            '</expression-group>'
        );
        $compile(element)($scope);
        $scope.$apply();

        controller = element.isolateScope().group;
    }));

    it('should allow adding operands', function() {
        expect(controller.operands.length).toBe(0);

        controller.addOperand(fooOperand);

        expect(controller.operands.length).toBe(1);
        expect(controller.isSubgroup(controller.operands[0])).toBe(false);
    });

    it('should allow adding subgroups as operands', function() {
        expect(controller.operands.length).toBe(0);

        controller.addSubgroup();

        expect(controller.operands.length).toBe(1);
        expect(controller.isSubgroup(controller.operands[0])).toBe(true);
    });

    it('should allow getting the "value"', function() {
        expect(controller.value()).toEqual({
            operator: 'AND',
            children: []
        });
    });

    describe('with an operand', function() {
        beforeEach(function() {
            controller.addOperand(fooOperand);
        });

        it('should allow looking up the index of an operand', function() {
            var barOperand = {value: 'bar'};
            expect(controller.getIndexOfOperand(barOperand)).toEqual(0);

            var nonexistentOperand = {value: 'baz'};
            expect(controller.getIndexOfOperand(nonexistentOperand)).toEqual(-1);
        });

        it('should allow removing an operand', function() {
            expect(controller.operands.length).toBe(1);

            var barOperand = {value: 'bar'};
            controller.removeOperand(barOperand);

            expect(controller.operands.length).toBe(0);
        });

        it('should allow getting the "value" of operand', function() {
            expect(controller.value()).toEqual({
                operator: 'AND',
                children: [
                    {
                        itemType: 'foo',
                        id: 'bar',
                        label: 'Bar'
                    }
                ]
            });
        });
    });

    describe('with a subgroup', function() {
        beforeEach(function() {
            controller.addSubgroup();
        });

        it('should allow removing subgroup by index', function() {
            expect(controller.operands.length).toBe(1);

            controller.removeSubgroup(0);

            expect(controller.operands.length).toBe(0);
        });

        it('should allow getting the "value" of the subgroup', function() {
            expect(controller.value()).toEqual({
                operator: 'AND',
                children: [
                    {
                        operator: 'AND',
                        children: []
                    }
                ]
            });
        });

        describe('that has an operand', function() {
            beforeEach(function() {
                controller.operands[0].operands.push(fooOperand);
            });

            it('should allow getting the "value" of all its descendents', function() {
                expect(controller.value()).toEqual({
                    operator: 'AND',
                    children: [
                        {
                            operator: 'AND',
                            children: [
                                {
                                    itemType: 'foo',
                                    id: 'bar',
                                    label: 'Bar'
                                }
                            ]
                        }
                    ]
                });
            });
        });
    });
});
