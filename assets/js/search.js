const url = "https://striveschool-api.herokuapp.com/api/deezer/search?q=";
const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzViMmQ1ZGQyMjA3MTAwMTVkZTJmMWYiLCJpYXQiOjE3MzQ0Njg0NjEsImV4cCI6MTczNTY3ODA2MX0.Q89cp9cHweU9w5ZWnXYvoPa9mO26MvOv3dP8Qzmkusc";
const searchBar = document.getElementById("searchBar");
const form = document.getElementById("form");
const showSong = document.getElementById("showSong");
const playIcon = document.getElementById("playIcon");
const mobilePlayIcon = document.getElementById("player-icon2");
let currentAudio = null;
let isPlaying = false;
let songList = [];
let currentSongIndex = 0;
const volumeBar = document.querySelector(".volume-bar");
const songProgress = document.getElementById("songProgress");
const songProgressMobile = document.getElementById("songProgressMobile");
const currentTimeDisplay = document.getElementById("currentTime");
const durationDisplay = document.getElementById("duration");


volumeBar.addEventListener("input", function () {
    if (currentAudio) {
        currentAudio.volume = volumeBar.value;
    }
});

form.addEventListener("submit", function (e) {
    e.preventDefault();
    searchSong();
});

async function searchSong() {
    try {
        const response = await fetch(url + searchBar.value, {
            headers: {
                authorization: TOKEN,
            },
        });
        if (response.ok) {
            const data = await response.json();
            songList = data.data;
            printSong(songList);
        } else {
            console.log("Errore nella risposta: ", response.status);
        }
    } catch (error) {
        console.log("Errore: ", error);
    }
}

function printSong(data) {
    showSong.innerHTML = `<h2 class="text-white">Brani</h2>`;
    for (let i = 0; i < 14; i++) {
        const songTitle = data[i].title;
        const artistName = data[i].artist.name;
        const albumCover = data[i].album.cover;
        const song = data[i].preview;
        const songId = data[i].id;
        showSong.innerHTML += `
            <div class="tagStart d-flex p-0 rounded mt-3">
                <img src="${albumCover}" class="rounded-start" style="width: 5em; height: 100%;" data-song="${song}" data-song-id="${songId}">
                <div>
                    <h4 class="ms-2 text-light">${songTitle}</h4>
                    <p class="ms-2 text-light">${artistName}</p>
                </div>
            </div>`;
    }

    const songImages = document.querySelectorAll('.tagStart img');
    songImages.forEach(img => {
        img.addEventListener('click', function () {
            const audioUrl = img.getAttribute('data-song');
            const songTitle = img.nextElementSibling.querySelector('h4').textContent;
            const artistName = img.nextElementSibling.querySelector('p').textContent;
            const albumCover = img.src;

            document.getElementById("songTitle").textContent = songTitle;
            document.getElementById("artistName").textContent = artistName;
            document.getElementById("songCover").src = albumCover;
            document.querySelector("#playerSection .song-cover").src = albumCover;
            document.querySelector("#playerSection .song-title-container h6").innerHTML = `${songTitle} - ${artistName}`;

            if (currentAudio && !currentAudio.paused) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                isPlaying = false;
                updatePlayIcons();
            }

            currentAudio = new Audio(audioUrl);
            currentAudio.play();
            currentAudio.volume = volumeBar.value;
            isPlaying = true;
            updatePlayIcons();
            currentSongIndex = Array.from(songImages).indexOf(img);
            updateProgress();
            currentAudio.ontimeupdate = updateProgress;
            currentAudio.onloadedmetadata = function () {
                durationDisplay.textContent = formatTime(currentAudio.duration);
                songProgress.max = currentAudio.duration;
            };
        });
    });
}

function updatePlayIcons() {
    if (isPlaying) {
        playIcon.innerHTML = `<i class="bi bi-pause-fill text-black"></i>`;
        mobilePlayIcon.classList.replace("bi-play-fill", "bi-pause-fill");
    } else {
        playIcon.innerHTML = `<i class="bi bi-play-fill text-black"></i>`;
        mobilePlayIcon.classList.replace("bi-pause-fill", "bi-play-fill");
    }
}

playIcon.addEventListener("click", function () {
    if (currentAudio) {
        if (currentAudio.paused) {
            currentAudio.play();
            currentAudio.volume = volumeBar.value;
            isPlaying = true;
            updatePlayIcons();
        } else {
            currentAudio.pause();
            isPlaying = false;
            updatePlayIcons();
        }
    }
});

mobilePlayIcon.addEventListener("click", function () {
    if (currentAudio) {
        if (currentAudio.paused) {
            currentAudio.play();
            currentAudio.volume = volumeBar.value;
            isPlaying = true;
            updatePlayIcons();
        } else {
            currentAudio.pause();
            isPlaying = false;
            updatePlayIcons();
        }
    }
});

function nextSong() {
    currentSongIndex++;
    if (currentSongIndex >= songList.length) {
        currentSongIndex = 0;
    }
    playSongAtIndex(currentSongIndex);
}

function prevSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
        currentSongIndex = songList.length - 1;
    }
    playSongAtIndex(currentSongIndex);
}

function playSongAtIndex(index) {
    const song = songList[index];
    const audioUrl = song.preview;
    const songTitle = song.title;
    const artistName = song.artist.name;
    const albumCover = song.album.cover;

    document.getElementById("songTitle").textContent = songTitle;
    document.getElementById("artistName").textContent = artistName;
    document.getElementById("songCover").src = albumCover;
    document.querySelector("#playerSection .song-cover").src = albumCover;
    document.querySelector("#playerSection .song-title-container h6").innerHTML = `${songTitle} - ${artistName}`;

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    currentAudio = new Audio(audioUrl);
    currentAudio.play();
    currentAudio.volume = volumeBar.value;
    isPlaying = true;
    updatePlayIcons();
    updateProgress();
    currentAudio.ontimeupdate = updateProgress;
    currentAudio.onloadedmetadata = function () {
        durationDisplay.textContent = formatTime(currentAudio.duration);
        songProgress.max = currentAudio.duration;
        songProgressMobile.max = currentAudio.duration;
    };
}

document.querySelector('.bi-skip-start-fill').addEventListener("click", prevSong);
document.querySelector('.bi-skip-end-fill').addEventListener("click", nextSong);

function updateProgress() {
    if (currentAudio) {
        const currentTime = currentAudio.currentTime;
        const progressPercentage = (currentTime / currentAudio.duration) * 100;
        songProgress.setAttribute("style", `width: ${progressPercentage}%`);
        songProgressMobile.setAttribute("style", `width: ${progressPercentage}%`)
        currentTimeDisplay.textContent = formatTime(currentTime);
    }
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

songProgress.addEventListener("input", function () {
    if (currentAudio) {
        currentAudio.currentTime = songProgress.value;
    }
});

songProgressMobile.addEventListener("input", function () {
    if (currentAudio) {
        currentAudio.currentTime = songProgressMobile.value;
    }
});