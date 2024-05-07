function updateDateTime() {
    var date = new Date();
    var dateTime = date.toLocaleString();
    document.getElementById("headerTime").innerHTML = " - " + dateTime;
}
updateDateTime();
setInterval(updateDateTime, 1000);

var animal, breed, age, gender, comments, ownerName, ownerEmail;
var ifClicked = [false, false, false, false ];
var form = document.getElementById("adoptForm");

document.getElementById("animal").addEventListener("click", function () {
    ifClicked[0] = true;
});
document.getElementById("breed").addEventListener("click", function () {
    ifClicked[1] = true;
});
document.getElementById("age").addEventListener("click", function () {
    ifClicked[2] = true;
});
document.getElementById("gender").addEventListener("click", function () {
    ifClicked[3] = true;
});


function submitBtn() {
    checkIfValid();
    validateNameEmail();
    for (var i = 0; i < form.elements.length; i++) {
        var selectElements = form[i];
        if (selectElements.tagName == "SELECT") {
            if (i == 0)
                animal = selectElements.value;
            if (i == 1)
                breed = selectElements.value;
            if (i == 2)
                age = selectElements.value;
            if (i == 3)
                gender = selectElements.value;

        }
    }
    comments = document.getElementById("comments").value;
    ownerName = document.getElementById("ownerName").value;
    ownerEmail = document.getElementById("ownerEmail").value;

}
function validateNameEmail() {

}
function checkIfValid() {
    for (var i = 0; i < ifClicked.length; i++) {
        if (!ifClicked[i]) {
            alert("You have not accessed all the fields. Please go back and read all the fields.");
            return;
        }
    }
    if (document.getElementById("comments").value == "") {
        alert("No comment.");
    }
    if (document.getElementById("ownerName").value == "") {
        alert("No Owner Name");
    }
    if (document.getElementById("ownerEmail").value == "") {
        alert("No Owner Email");
    }
    var validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var email = document.getElementById("ownerEmail").value;
    if (email.search(validEmail) < 0) {
        alert("Not a valid email address");
    }
    var validName = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    var name = document.getElementById("ownerName").value;
    if (name.search(validName) < 0) {
        alert("Not a valid owner name");
    }

}



