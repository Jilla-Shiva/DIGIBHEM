const buttons = document.querySelectorAll('.button');
const specialButtons = document.querySelectorAll('.special');

let holdInput = [];
let displayNumbers = [];
let answerOn = false;



function screenDisplay(data) {
  
  const screen = document.querySelector('#main');
  const screen2 = document.querySelector('#mini');

  if (data === "<<") {
    screen.innerText = "";
  } else if (data) {
    screen.innerText = data;
  } else {
    screen.innerText = holdInput.join("");
  }

  screen2.innerText = holdInput.join("");

}


function checkInput(data) {

  if ("1234567890x*/+-.".indexOf(data) > -1) {
    if (data === "*") data = "x"; 
    holdInput.push(data);
  }
}


function buttonInput(event) {
 
  const data = this.innerText;

  checkInput(data);

  if ("x/-+=".indexOf(data) > -1) {
    if (data === "=") {
      displayNumbers = [""];
      answerOn = true;
    }
    screenDisplay([""]);
    displayNumbers = [""];
    answerOn = false;
  }
  
  else {
    if (answerOn && "1234567890.".indexOf(data) > -1) {
      holdInput = [data];
      answerOn = false;
    }
    displayNumbers.push(data);
    screenDisplay(displayNumbers.join(""));
  }
}


function keyboardInput(e) {
  
  if (e.key === "Enter") {
    
    answer();
  } else {
    checkInput(e.key);

    if ("*/-+".indexOf(e.key) > -1) {
      screenDisplay([""]);
      displayNumbers = [""]
    } else if ("0123456789.".indexOf(e.key) > -1) {
      displayNumbers.push(e.key);
      screenDisplay(displayNumbers.join(""));
    }
  }
  playClick(); 
}


function playClick() {

  const audio = document.querySelector('.audio');
  audio.currentTime = 0; //to playback or rewind the sound
  audio.play();

}


function answer() {
  answerOn = true; 
  var calculatorData = parseCalculationString(holdInput.join(""));
  
  var calcValue = calculate(calculatorData);

  if (calcValue.length > 15) {
    calcValue = Number(calcValue).toExponential(5);
  }
  
  screenDisplay(calcValue);
}

//delete last entry
function removeLastInput() {
  holdInput.pop();
  displayNumbers.pop();
  displayNumbers.pop();

  screenDisplay("<<"); //update on screen
}

//reset the calculator
function resetCalculator() {
  holdInput = [""];
  displayNumbers = [""]
  screenDisplay("0");
}



function parseCalculationString(str) {
 
  console.log(str);
  s = str.replace(/x/gi, "*");
  console.log(s);

  var calculation = [],
    current = '';
  for (var i = 0, ch; ch = s.charAt(i); i++) {
    if ('^*/+-'.indexOf(ch) > -1) {
      if (current === '' && ch === '-') {
        current = '-';
      } else {
        
        calculation.push(new Decimal(current), ch);
        current = '';
      }
    } else {
      current += s.charAt(i);
    }
  }
  if (current !== '') {
    calculation.push(new Decimal(current));
  }
  return calculation;
}


function calculate(calc) {
  
  var ops = [{
      '^': (a, b) => a.pow(b)
    }, {
      '*': (a, b) => a.mul(b),
      '/': (a, b) => a.div(b)
    }, {
      '+': (a, b) => a.add(b),
      '-': (a, b) => a.sub(b)
    }],
    newCalc = [],
    currentOp;

  console.log(ops.length);
  for (var i = 0; i < ops.length; i++) {
    for (var j = 0; j < calc.length; j++) {
      if (ops[i][calc[j]]) {
        currentOp = ops[i][calc[j]];
      } else if (currentOp) {
        
        newCalc[newCalc.length - 1] = currentOp(newCalc[newCalc.length - 1], calc[j]);
        currentOp = null;
      } else {
        newCalc.push(calc[j]);
      }
    }
    calc = newCalc;
    newCalc = [];
  }
  if (calc.length > 1 || calc[0].valueOf() === undefined) {
    console.log('Error: unable to resolve calculation');
    return;
  } else {
    
    return calc[0].valueOf();
  }
}



buttons.forEach(button => {
  button.addEventListener("click", playClick);
  button.addEventListener("click", buttonInput);
});


specialButtons[0].addEventListener("click", resetCalculator);


specialButtons[1].addEventListener("click", removeLastInput);


specialButtons[2].addEventListener("click", answer);


