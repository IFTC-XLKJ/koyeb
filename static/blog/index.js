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
function newArticle(title, date, content) {
    const articleCard = document.createElement("mdui-card");
    // articleCard.clickable = true;
    articleCard.style.width = "90%";
    articleCard.style.margin = "1rem auto";
    articleCard.style.padding = "1rem";
    articleCard.style.boxSizing = "border-box";
    articleCard.style.transition = "box-shadow 0.3s";
    articleCard.style.minWidth = "300px";
    // articleCard.addEventListener("click", function () {
    //     window.location.href = link;
    // });
    const articleTitle = document.createElement("h2");
    articleTitle.innerText = title;
    articleCard.appendChild(articleTitle);
    const articleDate = document.createElement("span");
    articleDate.innerText = date;
    articleDate.style.color = "#888";
    articleCard.appendChild(articleDate);
    const articleContent = document.createElement("div");
    articleContent.style.marginTop = "1rem";
    articleContent.innerHTML = CMLParser.parser(content);
    articleCard.appendChild(articleContent);
    articles.appendChild(articleCard);
}

async function loadArticles() {
    const r = await fetch("/api/articles");
    const j = await r.json();
    const articles = j.data;
    articles.forEach(async article => {
        console.log(article);
        try {
            const r = await fetch(article.main);
            const text = await r.text();
            newArticle(article.title, article.date, text);
        } catch (e) {
            newArticle(article.title, article.date, `<Text color="red">加载文章失败</Text>`);
            console.error("加载文章失败", e);
        }
    });
}
(async function () {
    await loadArticles();
})();