relayout();
var pageNum = 1;
var pageSize = 10;
var playIcon = '<svg t="1718518330674" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4283" width="30" height="30"><path d="M128 138.666667c0-47.232 33.322667-66.666667 74.176-43.562667l663.146667 374.954667c40.96 23.168 40.853333 60.8 0 83.882666L202.176 928.896C161.216 952.064 128 932.565333 128 885.333333v-746.666666z" fill="#3D3D3D" p-id="4284"></path></svg>';
var pauseIcon = '<svg t="1718518409100" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5269" width="30" height="30"><path d="M128 106.858667C128 94.976 137.621333 85.333333 149.12 85.333333h85.76c11.648 0 21.12 9.6 21.12 21.525334V917.12c0 11.882667-9.621333 21.525333-21.12 21.525333H149.12A21.290667 21.290667 0 0 1 128 917.141333V106.88z m640 0c0-11.882667 9.621333-21.525333 21.12-21.525334h85.76c11.648 0 21.12 9.6 21.12 21.525334V917.12c0 11.882667-9.621333 21.525333-21.12 21.525333h-85.76a21.290667 21.290667 0 0 1-21.12-21.525333V106.88z" fill="#3D3D3D" p-id="5270"></path></svg>';
var audio = new Audio();
var isPlay = false;
const toast = new Toast();

const searchInput = document.querySelector('#s input');
const searchBtn = document.getElementById('search');
const clear = document.getElementById('clear');
searchInput.addEventListener('keydown', async function (e) {
    if (e.key == 'Enter') {
        const keyword = searchInput.value;
        if (!keyword) {
            const id = toast.warn('搜索内容不能为空', 2000)
            console.log(id)
            return;
        }
        const musics = await getMusicList(keyword);
        renderMusicList(musics);
    }
});
searchBtn.addEventListener('click', async function () {
    const keyword = searchInput.value;
    if (!keyword) {
        const id = toast.warn('搜索内容不能为空', 2000)
        console.log(id)
        return;
    }
    const musics = await getMusicList(keyword);
    renderMusicList(musics);
});

clear.addEventListener('click', function () {
    searchInput.value = '';
    searchInput.focus();
});

addEventListener('load', function () {
});

addEventListener('resize', function () {
    relayout();
});

addEventListener('keydown', function (e) {
    const key = e.key;
    console.log(key)
    if (key == " ") {
    }
})

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

addEventListener('load', function () {
    var fps = document.getElementById("fps");
    var fpsCounter = {
        startTime: 0,
        frameCount: 0,
        fps: 0,
        update: function (timestamp) {
            if (this.startTime === 0) {
                this.startTime = timestamp;
            } else {
                var elapsedTime = timestamp - this.startTime;
                if (elapsedTime >= 1000) {
                    this.fps = this.frameCount;
                    this.frameCount = 0;
                    this.startTime = timestamp;
                }
            }
            fps.innerHTML = `FPS:${this.fps}`;
            this.frameCount++;
            requestAnimationFrame(this.update.bind(this));
        }
    };
    requestAnimationFrame(fpsCounter.update.bind(fpsCounter));
});

function renderMusicList(musics) {
    console.log('搜索成功', musics);
}

async function getMusicList(keyword) {
    const id = toast.loading('搜索中...');
    const response = await fetch(searchURL(keyword));
    if (response.ok) {
        const data = await response.json();
        if (data.status) {
            if (data.song_data.length == 0) {
                toast.loadend(id)
                toast.warn('没有搜索到结果', 2000)
                return;
            } else {
                toast.loadend(id)
                toast.success('搜索成功', 2000)
                return data.song_data;
            }
        } else {
            console.error('遇到未知的错误');
            toast.loadend(id)
            toast.error('遇到未知的错误', 2000)
            return;
        }
    } else {
        console.error('网络请求失败', response.statusText);
        toast.loadend(id)
        toast.error('网络请求失败：' + response.statusText, 2000)
        return;
    }
}


function searchURL(keyword) {
    return 'https://www.lihouse.xyz/coco_widget/music_resource/info?key=' + keyword + '&page=' + pageNum + '&limit=' + pageSize;
}