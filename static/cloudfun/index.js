create.addEventListener("click", async () => {
    if (localStorage.getItem("ID") && localStorage.getItem("password")) {} else {
        alert("Please login first!");
        return;
    }
});