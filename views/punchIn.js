const isMobile = /iPhone|iPad|IEMobile|iphone SE|Android/i.test(
  window.navigator.userAgent
);
// if (!isMobile) {
//   window.location = "/errorpage";
// }
var acc = document.getElementsByClassName("accordion");
var i;
//accordion for home page getting the ids of employees :
for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "block";
    }
  });
}
//spinner logic:
const spinner = () => {
  document.getElementById("loader").classList.toggle("loader");
};

window.addEventListener("load", function () {
  const button = document.getElementById("formId");
  button.addEventListener("click", spinner);

  button.textContent =
    localStorage.getItem("punchState") === "Punch In"
      ? "Punch Out"
      : "Punch In";
  document.getElementById("inputId").value = localStorage.getItem("id");
  document.getElementById("passKeyId").value = localStorage.getItem("passKey");
  const form = document.getElementById("formSubmit");
  form.onsubmit = function (e) {
    e.preventDefault();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        localStorage.setItem("punchState", button.textContent);
        localStorage.setItem(
          "passKey",
          document.getElementById("passKeyId").value
        );
        localStorage.setItem("id", document.getElementById("inputId").value);
        document.getElementById("lat").value = position.coords.latitude;
        document.getElementById("long").value = position.coords.longitude;
        form.submit();
      });
    }
  };
});
//getting the latitude longitude :
const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }
};
const showPosition = (position) => {
  localStorage.setItem("lat", position.coords.latitude);
  localStorage.setItem("long", position.coords.longitude);
  document.getElementById("lat").value = position.coords.latitude;
  document.getElementById("long").value = position.coords.longitude;
};
getLocation();
//success message notification :
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
//Error message notification :
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
if (localStorage.getItem("passKey") !== "wework") {
  sendErrorNotifcation();
  window.history.pushState({}, "", "/");
}
//Handling the success and error message notifications :
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
if (params.e === "success") {
  sendNotifcation();
  window.history.pushState({}, "", "/");
} else if (params.e === "error") {
  sendErrorNotifcation();
  window.history.pushState({}, "", "/");
}
