'use strict';

angular.module('exampleApp', ['ngEquation'])
    .controller('ExampleCtrl', function(fruitOperand) {
        var ctrl = this;

        ctrl.config = {
            availableOperands: [fruitOperand.config()]
        };

        ctrl.onEquationReady = function(equationApi) {
            ctrl.equationApi = equationApi;
        };

        ctrl.toJson = function() {
            if (ctrl.equationApi) {
                var value = ctrl.equationApi.value();
                return JSON.stringify(value, null, 4);
            } else {
                return '';
            }
        };

        ctrl.formula = function() {
            var formula = '';
            if (ctrl.equationApi) {
                formula = ctrl.equationApi.formula();
            }
            return formula ? formula : 'N/A';
        }
    });
