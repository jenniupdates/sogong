function hasUniqueDigits(number) {
    let digits = new Set(number.toString().split(''));
    return digits.size === 3;
  }
  
  function getRandomNumber(socketid) {
    let number;
    do {
      number = Math.floor(Math.random() * 900) + 100;
    } while (!hasUniqueDigits(number));
    dict[socketid] = number;
  }
  