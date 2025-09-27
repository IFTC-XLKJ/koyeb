menu.addEventListener("click", function () {
    if (drawer.open) drawer.open = false;
    else drawer.open = true;
});
addEventListener("scroll", e => {
    document.querySelector("mdui-top-app-bar").style.top = document.querySelector("html").scrollTop + "px";
});
drawerHome.addEventListener("click", function () {
    window.location.href = "/";
});
const articles = document.getElementById("articles");
function newArticle(title, date, desc, link) {
    const articleCard = document.createElement("mdui-card");
    articleCard.clickable = true;
    articleCard.style.width = "90%";
    articleCard.style.margin = "1rem auto";
    articleCard.style.padding = "1rem";
    articleCard.style.boxSizing = "border-box";
    articleCard.style.cursor = "pointer";
    articleCard.addEventListener("click", function () {
        window.location.href = link;
    });
    articles.appendChild(articleCard);
}

async function loadArticles() {
    const r = await fetch("/api/articles");
    const j = await r.json();
    const articles = j.data;
    articles.forEach(article => {
        newArticle(article.title, article.date, article.desc, article.link);
    });
}
loadArticles();