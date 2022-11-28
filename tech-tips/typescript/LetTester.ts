class LetTester {
    public blockMutation() {
        var theValue = 10;
        let otherValue = 5;
        let acumuladoVar = 0
        let acumuladoLet = 0;

        // perform some actions

        let index = 1;
        for( ;index<10; index++) {
            var theValue = 30;
            let otherValue = 8;

            acumuladoVar = theValue * index;
            acumuladoLet = otherValue * index;
        }
        
        console.log(acumuladoVar);
        console.log(acumuladoLet);

        console.log(theValue);
        console.log(otherValue);
    }
};

var tester = new LetTester();
tester.blockMutation();

