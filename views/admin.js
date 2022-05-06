window.addEventListener("load", function () {
  //Loading the current_date to date input :
  const dateDefaultValue = (document.getElementById("dateInputId").value =
    new Date().toISOString().slice(0, -14));
  //Storing the input values into Local Storage :
  document.getElementById("secretinputId").value =
    localStorage.getItem("secretkey");
  document.getElementById("idInput").value = localStorage.getItem("adminpgId");
  const adminFormElement = document.getElementById("adminformId");
  adminFormElement.onsubmit = function (e) {
    e.preventDefault();
    const secretKeyElement = document.getElementById("secretinputId").value;
    localStorage.setItem("secretkey", secretKeyElement);
    localStorage.setItem("adminpgId", document.getElementById("idInput").value);
    adminFormElement.submit();
  };
});
