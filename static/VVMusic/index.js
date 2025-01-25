relayout();
addEventListener('load', function () {
});

addEventListener('resize', function () {
    relayout();
});

function relayout() {
    var winwidth = window.innerWidth;
    var winheight = window.innerHeight;
    var app = document.querySelector('#app');
    app.style.width = winwidth + 'px';
    app.style.height = (winheight - 90 - 25) + 'px';
    var player = document.querySelector('#player');
    player.style.width = winwidth + 'px';
    player.style.height = 60 + 'px';
    var lrc = document.getElementById('music-lrc');
    lrc.style.width = winwidth + 'px';
    lrc.style.height = 30 + 'px';
    console.log(winwidth, winheight)
}