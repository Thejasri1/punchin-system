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
    localStorage.setItem("punchState", button.textContent);
    localStorage.setItem("id", document.getElementById("inputId").value);
    form.submit();
  };
});
