function  focusfun(){
  document.getElementById("message").style.display = "block";
}

// When the user clicks outside of the password field, hide the message box
function blurfun() {
  document.getElementById("message").style.display = "none";
}

// When the user starts to type something inside the password field
function keyfun() {
  // Validate lowercase letters
  var myInput = document.getElementById("exampleInputPassword1");
  var letter = document.getElementById("letter");
  var capital = document.getElementById("capital");
  var number = document.getElementById("number");
  var length = document.getElementById("length");

  var lowerCaseLetters = /[a-z]/g;
  if(myInput.value.match(lowerCaseLetters)) {
    letter.classList.remove("invalid");
    letter.classList.add("valid");
  } else {
    letter.classList.remove("valid");
    letter.classList.add("invalid");
}

  // Validate capital letters
  var upperCaseLetters = /[A-Z]/g;
  if(myInput.value.match(upperCaseLetters)) {
    capital.classList.remove("invalid");
    capital.classList.add("valid");
  } else {
    capital.classList.remove("valid");
    capital.classList.add("invalid");
  }

  // Validate numbers
  var numbers = /[0-9]/g;
  if(myInput.value.match(numbers)) {
    number.classList.remove("invalid");
    number.classList.add("valid");
  } else {
    number.classList.remove("valid");
    number.classList.add("invalid");
  }

  // Validate length
  if(myInput.value.length >= 8) {
    length.classList.remove("invalid");
    length.classList.add("valid");
  } else {
    length.classList.remove("valid");
    length.classList.add("invalid");
  }
}

function clickfun(){
  var x=document.getElementById("exampleInputPassword1");
  var y=document.getElementById("exampleInputPassword2");
  if(x.type=="password" ){
    x.type="text";
  }
  else{
    x.type="password";
  }
  if(y.type=="password" ){
    y.type="text";
  }
  else{
    y.type="password";
  }
}
function fun4(){
  document.getElementById("pmatch").style.display="block";
}
function fun5(){
  document.getElementById("pmatch").style.display="none";
}
function fun6()
{ var x=document.getElementById("exampleInputPassword1");
  var y=document.getElementById("exampleInputPassword2");
  if(x.value == y.value){
    document.getElementById("pmatch2").style.display="block";
    document.getElementById("pmatch").style.display="none";
  }
  else{
    document.getElementById("pmatch2").style.display="none";
    document.getElementById("pmatch").style.display="block";
  }
}
