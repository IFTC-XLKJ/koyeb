relayout();
var pageNum = 1;
var pageSize = 10;
var playIcon = '<svg t="1718518330674" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4283" width="30" height="30"><path d="M128 138.666667c0-47.232 33.322667-66.666667 74.176-43.562667l663.146667 374.954667c40.96 23.168 40.853333 60.8 0 83.882666L202.176 928.896C161.216 952.064 128 932.565333 128 885.333333v-746.666666z" fill="#3D3D3D" p-id="4284"></path></svg>';
var pauseIcon = '<svg t="1718518409100" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5269" width="30" height="30"><path d="M128 106.858667C128 94.976 137.621333 85.333333 149.12 85.333333h85.76c11.648 0 21.12 9.6 21.12 21.525334V917.12c0 11.882667-9.621333 21.525333-21.12 21.525333H149.12A21.290667 21.290667 0 0 1 128 917.141333V106.88z m640 0c0-11.882667 9.621333-21.525333 21.12-21.525334h85.76c11.648 0 21.12 9.6 21.12 21.525334V917.12c0 11.882667-9.621333 21.525333-21.12 21.525333h-85.76a21.290667 21.290667 0 0 1-21.12-21.525333V106.88z" fill="#3D3D3D" p-id="5270"></path></svg>';
const audio = new Audio();
var isPlay = false;
const toast = new Toast();
let keyword = '';
let lrcfile;

if (!localStorage.getItem('music-search-history')) {
    localStorage.setItem('music-search-history', JSON.stringify([]));
}

const tips = document.getElementById('tips');
tips.style.width = '300px';
tips.style.display = 'flex';
const searchInput = document.querySelector('#s input');
const searchBtn = document.getElementById('search');
const clear = document.getElementById('clear');
const musicList = document.getElementById('music');
const page = document.getElementById('page');
const playerCover = document.querySelector('#player-cover img');
const playerName = document.querySelector('#player-name');
const playerAuthor = document.querySelector('#player-author');
const playerPlay = document.querySelector('#player-play');
const playerProgress = document.querySelector('#player-progress-bar input');
const download = document.getElementById('download');
searchInput.addEventListener('keydown', async function (e) {
    if (e.key == 'Enter') {
        if (!searchInput.value) {
            const id = toast.warn('搜索内容不能为空', 2000)
            return;
        }
        keyword = searchInput.value;
        const musics = await getMusicList(keyword);
        if (!musics) {
            return;
        }
        renderMusicList(musics);
    } else if (e.key == 'Escape' || e.key == 'Delete') {
        searchInput.value = '';
    }
});
searchBtn.addEventListener('click', async function () {
    if (!searchInput.value) {
        const id = toast.warn('搜索内容不能为空', 2000)
        return;
    }
    keyword = searchInput.value;
    const musics = await getMusicList(keyword);
    if (!musics) {
        return;
    }
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
    const target = e.target;
    console.log(key, target)
    if (target == searchInput) {
        return;
    }
    if (key == " ") {
        e.preventDefault();
        if (isPlay) {
            audio.pause();
            playerPlay.innerHTML = playIcon;
            isPlay = false;
        } else {
            audio.play();
            playerPlay.innerHTML = pauseIcon;
            isPlay = true;
        }
    } else if (key == "ArrowLeft") {
        e.preventDefault();
        audio.currentTime -= 5;
    } else if (key == "ArrowRight") {
        e.preventDefault();
        audio.currentTime += 5;
    } else if (key == "ArrowUp") {
        e.preventDefault();
        audio.volume += 0.1;
    } else if (key == "ArrowDown") {
        e.preventDefault();
        audio.volume -= 0.1;
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

let lrcstimes = [];
let lrclist = [];

function renderMusicList(musics) {
    console.log('搜索成功', musics);
    musicList.innerHTML = '';
    musics.forEach(music => {
        const { id, name, artist, pic } = music;
        const author = artist.map(String).join(" ");
        musicList.innerHTML += `
        <div class="music-item" data-id="${id}" data-name='${name}' data-pagesize='${pageSize}' data-page='${pageNum}' data-author='${author}'>
            <div class="music-item-img" data-id="${id}">
                <img class="music-item-img-img" src="${pic}" alt="${name}" title="${name} - ${author}" data-id="${id}">
            </div>
            <div class="music-item-info" data-id="${id}">
                <div class="music-item-name" data-id="${id}">${name}</div>
                <div class="music-item-author" data-id="${id}">${author}</div>
            </div>
        </div>
        `;
    });
    page.innerHTML = `
    <button class='page left' id='previous'>上一页</button>
    <input type='number' min='1' id='page-input' value='${pageNum}'>
    <button class='page right' id='next'>下一页</button>
    `;
    const pageInput = document.getElementById('page-input');
    pageInput.addEventListener('keyup', async (e) => {
        if (e.key == 'Enter') {
            pageNum = pageInput.value;
            if (pageNum <= 0) {
                pageNum = 1;
            }
            const musics = await getMusicList(keyword);
            if (!musics) {
                return;
            }
            renderMusicList(musics);
        }
    })
    pageInput.addEventListener('change', async (e) => {
        pageNum = pageInput.value;
        if (pageNum <= 0) {
            pageNum = 1;
        }
        const musics = await getMusicList(keyword);
        if (!musics) {
            return;
        }
        renderMusicList(musics);
    })
    const previous = document.getElementById('previous');
    previous.addEventListener('click', async (e) => {
        if (pageNum > 1) {
            pageNum--;
            const musics = await getMusicList(keyword);
            if (!musics) {
                return;
            }
            renderMusicList(musics);
        }
    })
    const next = document.getElementById('next');
    next.addEventListener('click', async (e) => {
        pageNum++;
        const musics = await getMusicList(keyword);
        if (!musics) {
            return;
        }
        renderMusicList(musics);
    })
    const musiclist = document.querySelectorAll('.music-item');
    musiclist.forEach(musicItem => {
        musicItem.addEventListener('click', async (e) => {
            console.log(musicItem)
            const id = musicItem.getAttribute('data-id');
            const music = await getMusic(id);
            if (music) {
                const { url, lyric, pic, name, artist } = music.song_data;
                if (url) {
                    const id1 = toast.loading('加载中...')
                    try {
                        const response = await fetch(url);
                        if (response.ok) {
                            const blob = await response.blob();
                            if (blob) {
                                const url = URL.createObjectURL(blob);
                                if (url) {
                                    toast.loadend(id1)
                                    toast.success('加载成功', 2000)
                                    audio.src = url;
                                    playerCover.src = pic;
                                    playerName.innerHTML = name;
                                    playerAuthor.innerHTML = artist;
                                    document.title = name + ' - ' + artist;
                                    const favicon = document.querySelector("link[rel*='icon']") || document.createElement('link');
                                    favicon.type = 'image/jpeg';
                                    favicon.rel = 'shortcut icon';
                                    favicon.href = pic;
                                    lrcfile = lyric;
                                    lrcstimes = [0];
                                    lrclist = [name + ' - ' + artist];
                                    lyric.split(/\n/).forEach((item, index) => {
                                        console.log(item);
                                        if (item.match(/^\[.+\]/)) {
                                            lrcstimes.push(lrcTimeToNum(item.match(/^\[(.+)\]/)[1]));
                                            lrclist.push(subsequenceFromStartLast(item, ((item.indexOf(']') + 1 + 1) - 1)));
                                        }
                                    })
                                    lrclist.push(name + ' - ' + artist);
                                    lrcstimes.push(lrcstimes[lrcstimes.length - 1] + 1);
                                    totaltime();
                                    audio.play()
                                    updatetime();
                                    console.log(lrcstimes, lrclist);
                                } else {
                                    toast.loadend(id1)
                                    toast.error('加载失败', 2000)
                                }
                            } else {
                                toast.loadend(id1)
                                toast.error('加载失败', 2000)
                            }
                        } else {
                            console.error('网络请求失败', response.statusText);
                            toast.loadend(id1)
                            toast.error('网络请求失败：' + response.statusText, 2000)
                        }
                    } catch (error) {
                        console.error('网络请求失败', error);
                        toast.loadend(id1)
                        toast.error('网络请求失败：' + error, 2000)
                    }
                }
            }
        })
    });
}

addEventListener("contextmenu", async e => {
    e.preventDefault();
    const target = e.target;
    const oldMenuMain = document.querySelector('.menu-main');
    if (oldMenuMain) {
        oldMenuMain.remove();
    }
    console.log(target)
    if (
        target.classList.contains('music-item') ||
        target.classList.contains('music-item-info') ||
        target.classList.contains('music-item-author') ||
        target.classList.contains('music-item-name') ||
        target.classList.contains('music-item-img') ||
        target.classList.contains('music-item-img-img')
    ) {
        const id = target.getAttribute('data-id');
        const menuMain = document.createElement('div');
        menuMain.className = 'menu-main';
        menuMain.style.top = e.clientY + 'px';
        menuMain.style.left = e.clientX + 'px';
        menuMain.innerHTML = `
        <div class="menu-item" data-id="${target.getAttribute('data-id')}" data-type="copy-url">复制链接</div>
        `;
        document.body.appendChild(menuMain);
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(menuItem => {
            menuItem.addEventListener('click', async (e) => {
                if (menuItem.getAttribute('data-type') === 'copy-url') {
                    const id = menuItem.getAttribute('data-id');
                    const id1 = toast.loading("获取链接中...")
                    const music = await getMusic(id);
                    toast.loadend(id1)
                    if (music) {
                        const { url } = music.song_data;
                        if (url) {
                            navigator.clipboard.writeText(url);
                            toast.success('复制成功', 2000)
                            menuMain.remove();
                        }
                    }
                }
            });
        });
    } else if (target == searchInput) {
        navigator.clipboard.readText()
            .then(async text => {
                searchInput.value = text;
                keyword = text;
                const musics = await getMusicList(keyword);
                if (!musics) {
                    return;
                }
                renderMusicList(musics);
            });
    }
})

const app = document.getElementById('app');
app.addEventListener("scroll", () => {
    const oldMenuMain = document.querySelector('.menu-main');
    if (oldMenuMain) {
        oldMenuMain.remove();
    }
})
app.addEventListener("click", () => {
    const oldMenuMain = document.querySelector('.menu-main');
    if (oldMenuMain) {
        oldMenuMain.remove();
    }
})

function totaltime() {
    const totaltime = document.getElementById('player-progress-time-total');
    const lrc = document.getElementById('music-lrc');
    audio.onloadedmetadata = function () {
        var duration = audio.duration * (10 ** 6);
        lrc.innerHTML = '';
        totaltime.innerHTML = formatSecondsToTime(Math.ceil((duration) / (10 ** 6)));
        progress.max = duration;
    };
}

audio.addEventListener('play', () => {
    isPlay = true;
    playerPlay.innerHTML = pauseIcon;
});

audio.addEventListener('pause', () => {
    isPlay = false;
    playerPlay.innerHTML = playIcon;
});

var last = 0;
var current = 0;
function updatetime() {
    const time = document.getElementById('player-progress-time');
    const lrc = document.getElementById('music-lrc');
    audio.ontimeupdate = function () {
        if (!isPlay) {
            return;
        }
        const currentTime = audio.currentTime * (10 ** 6);
        for (var i = 0; i < lrcstimes.length; i++) {
            if (currentTime <= lrcstimes[i + 1] * (10 ** 6)) {
                if (current != i) {
                    console.log(lrclist[i])
                    lrc.innerHTML = `<p class="poplrc">${lrclist[i]}</p>`;
                    current = i;
                }
                break;
            }
        }
        time.innerHTML = formatSecondsToTime(Math.ceil((currentTime) / (10 ** 6)));
        progress.value = currentTime;
    };
    audio.onend = function () {
        isPlay = false;
        lrc.innerHTML = '';
        last = 0;
        current = 0;
        audio.play();
    };
}

playerPlay.addEventListener('click', () => {
    if (isPlay) {
        audio.pause();
    } else {
        audio.play();
    }
});

playerProgress.addEventListener('change', e => {
    audio.currentTime = playerProgress.value / 10 ** 6;
    last = 0;
    current = 0;
    audio.play();
})

playerProgress.addEventListener('input', e => {
    audio.pause();
})

function formatSecondsToTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (remainingSeconds < 10) {
        remainingSeconds = "0" + remainingSeconds;
    }
    return minutes + ":" + remainingSeconds;
}

function subsequenceFromStartLast(sequence, at1) {
    const start = at1;
    const end = sequence.length - 1 + 1;
    return sequence.slice(start, end);
}

function lrcTimeToNum(time) {
    const times = time.split(':');
    return parseInt(times[0]) * 60 + parseFloat(times[1]);
}

download.addEventListener('click', async () => {
    const id = toast.loading('下载中...');
    const blobURL = audio.src;
    if (blobURL) {
        const response = await fetch(blobURL);
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${playerName.innerText} - ${playerAuthor.innerText}.mp3`;
            a.click();
            window.URL.revokeObjectURL(url);
            toast.loadend(id)
            toast.success('下载成功', 2000)
        } else {
            toast.loadend(id)
            toast.error('下载失败', 2000)
        }
    } else {
        toast.loadend(id)
        toast.warn("请先播放歌曲再下载", 2000)
    }
})

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
            console.error('遇到未知的错误', data.msg);
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

async function getMusic(id) {
    const id1 = toast.loading('获取资源中...');
    const response = await fetch(getMusicURL(id));
    if (response.ok) {
        const data = await response.json();
        if (data.status) {
            toast.loadend(id1)
            toast.success('获取资源成功', 2000)
            return data;
        } else {
            console.error('遇到未知的错误', data.msg);
            toast.loadend(id1)
            toast.error('遇到未知的错误', 2000)
            return;
        }
    } else {
        console.error('网络请求失败', response.statusText);
        toast.loadend(id1)
        toast.error('网络请求失败：' + response.statusText, 2000)
    }
}


function searchURL(keyword) {
    return 'https://www.lihouse.xyz/coco_widget/music_resource/info?key=' + keyword + '&page=' + pageNum + '&limit=' + pageSize;
}

function getMusicURL(id) {
    return 'https://www.lihouse.xyz/coco_widget/music_resource/id/' + id;
}