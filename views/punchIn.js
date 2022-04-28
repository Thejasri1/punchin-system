window.addEventListener("load", function () {
  const button = document.getElementById("formId");
  button.textContent =
    localStorage.getItem("punchState") === "Punch In"
      ? "Punch Out"
      : "Punch In";
  document.getElementById("inputId").value = localStorage.getItem("id");
  const form = document.getElementById("formSubmit");
  form.onsubmit = function (e) {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        localStorage.setItem("punchState", button.textContent);
        localStorage.setItem("id", document.getElementById("inputId").value);
        document.getElementById("lat").value = position.coords.latitude;
        document.getElementById("long").value = position.coords.longitude;
        form.submit();
      }, showError);
    } else {
      console.log("Browser does not support geolocation");
    }
  };
});

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
    console.log("Browser does not support geolocation");
  }
}
function showPosition(position) {
  localStorage.setItem("lat", position.coords.latitude);
  localStorage.setItem("long", position.coords.longitude);
  document.getElementById("lat").value = position.coords.latitude;
  document.getElementById("long").value = position.coords.longitude;
}
function showError(error) {
  if (error.PERMISSION_DENIED) {
    console.log(" The user have denied the request for geolocation.");
  }
}
getLocation();
const sendNotifcation = () => {
  new Notify({
    status: "success",
    title: "“Successfully Recorded”",
    effect: "fade",
    speed: 200,
    customClass: "",
    customIcon: "",
    showIcon: true,
    showCloseButton: true,
    autoclose: true,
    autotimeout: 3000,
    gap: 0,
    distance: 0,
    type: 1,
    position: "right top",
  });
};

const sendErrorNotifcation = () => {
  new Notify({
    status: "error",
    title: "“Unable to Record”",
    effect: "fade",
    speed: 200,
    customClass: "",
    customIcon: "",
    showIcon: true,
    showCloseButton: true,
    autoclose: true,
    autotimeout: 3000,
    gap: 0,
    distance: 0,
    type: 1,
    position: "right top",
  });
};

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
if (params.e === "success") {
  sendNotifcation();
  window.history.pushState({}, "", "/");
} else if (params.e === "error") {
  sendErrorNotifcation();
  window.history.pushState({}, "", "/");
}
