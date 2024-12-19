const url = "https://striveschool-api.herokuapp.com/api/deezer/search?q=";
const TOKEN = "Bearer YOUR_TOKEN_HERE";

const searchBar = document.getElementById("searchBar");
const form = document.getElementById("form");
const showSong = document.getElementById("showSong");
const playIcon = document.getElementById("playIcon");
const progressBar = document.getElementById('songProgressBar');
const playIconMobile = document.getElementById("playIconMobile");
const progressBarMobile = document.getElementById('songProgressBarMobile');

const mobilePlayIcon = document.getElementById("player-icon2");
let currentAudio = null;
let isPlaying = false;
let songList = [];
let currentSongIndex = 0;
const volumeBar = document.querySelector(".progress-bar");

volumeBar.addEventListener("input", function() {
    if (currentAudio) {
        currentAudio.volume = volumeBar.value;
    }
});
let progressInterval = null;
let mobileProgressInterval = null;
let progress = 0;

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


            // Update desktop player
            document.getElementById("songTitle").textContent = songTitle;
            document.getElementById("artistName").textContent = artistName;
            document.getElementById("songCover").src = albumCover;
            document.querySelector("#playerSection .song-cover").src = albumCover;
            document.querySelector("#playerSection .song-title-container h6").innerHTML = `${songTitle} - ${artistName}`;

            if (currentAudio && !currentAudio.paused) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                fermaBarraProgresso();
                isPlaying = false;
                playIcon.innerHTML = `<i class="bi bi-play-fill text-black"></i>`;
            }

            currentAudio = new Audio(audioUrl);
            currentAudio.play();
            isPlaying = true;
            updatePlayIcons();
            currentSongIndex = Array.from(songImages).indexOf(img);
            console.log(currentSongIndex);
            
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
        if (isPlaying) {
            currentAudio.pause();
            isPlaying = false;
            playIcon.innerHTML = `<i class="bi bi-play-fill text-black"></i>`;
        } else {
            currentAudio.play();
            isPlaying = true;
            updatePlayIcons();
        }
    }
});

mobilePlayIcon.addEventListener("click", function () {
    if (currentAudio) {
        if (isPlaying) {
            currentAudio.pause();
            isPlaying = false;
            updatePlayIcons();
        } else {
            currentAudio.play();
            isPlaying = true;
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
    isPlaying = true;
    updatePlayIcons();
}

document.querySelector('.bi-skip-start-fill').addEventListener("click", prevSong);
document.querySelector('.bi-skip-end-fill').addEventListener("click", nextSong);
