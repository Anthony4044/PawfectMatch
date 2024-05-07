
function updateDateTime(){
    var date = new Date();
    var dateTime = date.toLocaleString();
    document.getElementById("headerTime").innerHTML =  " - " + dateTime;
}
updateDateTime();
setInterval(updateDateTime, 1000);