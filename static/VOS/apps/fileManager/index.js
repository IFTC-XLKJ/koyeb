addEventListener("load", e => {
    console.log("fileManager DOMContentLoaded");
    const pathSpan = document.querySelector("#path span");
    const pathInput = document.querySelector("#path input");
    try {
        API.postMessage({ type: "setDrag" });
        newTab("Home", "/storage/share/");
        document.querySelector(".tab").classList.add("active");
        pathSpan.textContent = "/storage/share/";
        pathInput.value = pathSpan.textContent;
        pathSpan.addEventListener("click", function () {
            pathInput.style.display = "flex";
            pathSpan.style.display = "none";
            pathInput.focus();
            pathInput.selecte();
        });
        pathInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                if (pathInput.value.trim() === "") {
                    console.warn("Path input is empty, not changing path.");
                    return;
                }
                pathInput.style.display = "none";
                pathSpan.textContent = pathInput.value;
                pathSpan.style.display = "flex";
            }
        });
        pathInput.addEventListener("blur", function () {
            pathInput.style.display = "none";
            pathSpan.style.display = "flex";
            pathInput.value = pathSpan.textContent;
        });
    } catch (error) {
        console.error("Error in load event:", error);
    }
    const close = document.getElementById("close");
    close.addEventListener("click", function () {
        API.postMessage({ type: "close" });
    });
});

function renderFileList(files) {
    const fileList = document.getElementById("file-list");
}

function newTab(name, path) {
    try {
        const tab = document.createElement("div");
        tab.className = "tab";
        tab.innerHTML = `<span class="tab-name">${name}</span><br><span class="tab-path">${path}</span><button class="close">x</button>`;
        tab.addEventListener("click", function (e) { });
        tab.querySelector(".close").addEventListener("click", function (e) {
            tab.remove();
            document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            if (document.querySelectorAll(".tab").length > 0) {
                document.querySelectorAll(".tab")[document.querySelectorAll(".tab").length - 1].classList.add("active");
            }
            if (document.querySelectorAll(".tab").length == 0) {
                document.querySelector("#close").click();
            }
            e.stopPropagation();
        });
        console.log(tab);
        const tabsContainer = document.getElementById("tabs");
        if (!tabsContainer) {
            console.error("Tabs container not found");
            return;
        }
        console.log("Tab element type:", typeof tab);
        console.log("Tab element:", tab);
        console.log("Tabs container type:", typeof tabsContainer);
        console.log("Tabs container:", tabsContainer);
        if (!(tab instanceof Element)) {
            console.error("Tab is not a valid Element:", tab);
            return;
        }
        tabsContainer.appendChild(tab);
        console.log("newTab", name, path);
    } catch (error) {
        console.error("Error creating tab:", error);
        console.error("Error stack:", error.stack);
    }
}