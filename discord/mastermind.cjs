function generateRandomNumber() {
    let number;
    do {
        number = Math.floor(Math.random() * 900) + 100;
    } while (!hasUniqueDigits(number));
    return number;
}

function hasUniqueDigits(number) {
    let digits = new Set(number.toString().split(''));
    return digits.size === 3;
}

// const randomNumber = generateRandomNumber();
// console.log(randomNumber);

function checkAnswer(input, number) {
    let digits = new Set(input.split(''));
    if (digits.size != 3) {
        return ("\`You either have entered too many digits or they are not unique\`")
    } 

    // var inputString = input.toString();
    var numberString = number.toString();

    var res = {"🟢":0, "⚠️":0, "❌":0};

    for (var i = 0; i < 3; i++){
        // console.log(input[i], numberString[i]);
        if (input[i] == numberString[i]) {
            res["🟢"] += 1;
        } else if(numberString.includes(input[i])) {
            res["⚠️"] += 1;
        } else {
            res["❌"] += 1;
        }
    }

    return res;
}

module.exports = {
    generateRandomNumber: generateRandomNumber,
    checkAnswer: checkAnswer
};

// console.log(checkAnswer(1234,123));
// console.log(checkAnswer(444,123));
// console.log(checkAnswer(123,123));
// console.log(checkAnswer(123,469));
// console.log(checkAnswer(123,321));