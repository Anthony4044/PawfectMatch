
function updateDateTime() {
    var date = new Date();
    var dateTime = date.toLocaleString();
    document.getElementById("headerTime").innerHTML = " - " + dateTime;
}
updateDateTime();
setInterval(updateDateTime, 1000);

var animal, breed, age, gender, compatibility;
var ifClicked = [false, false, false, false, false];
var form = document.getElementById("petSearchForm");

document.getElementById("petType").addEventListener("click", function () {
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
document.getElementById("compatibility").addEventListener("click", function () {
    ifClicked[4] = true;
});

function submitBtn() {
    checkIfClicked();
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
            if (i == 4)
                compatibility = selectElements.value;
        }
    }
}
function checkIfClicked() {
    for (var i = 0; i < ifClicked.length; i++) {
        console.log(ifClicked[i]);
        if (!ifClicked[i]) {
            alert("You have not accessed all the fields. Please go back and read all the fields.");
            return;
        }
    }
}



