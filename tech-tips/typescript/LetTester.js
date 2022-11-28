var LetTester = /** @class */ (function () {
    function LetTester() {
    }
    LetTester.prototype.blockMutation = function () {
        var theValue = 10;
        var otherValue = 5;
        var acumuladoVar = 0;
        var acumuladoLet = 0;
        // perform some actions
        var index = 1;
        for (; index < 10; index++) {
            var theValue = 30;
            var otherValue_1 = 8;
            acumuladoVar = theValue * index;
            acumuladoLet = otherValue_1 * index;
        }
        console.log(acumuladoVar);
        console.log(acumuladoLet);
        console.log(theValue);
        console.log(otherValue);
    };
    return LetTester;
}());
;
var tester = new LetTester();
tester.blockMutation();
