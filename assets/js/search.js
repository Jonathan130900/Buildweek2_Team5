const url = "https://striveschool-api.herokuapp.com/api/deezer/search?q=";
const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzViMmQ1ZGQyMjA3MTAwMTVkZTJmMWYiLCJpYXQiOjE3MzQ0Njg0NjEsImV4cCI6MTczNTY3ODA2MX0.Q89cp9cHweU9w5ZWnXYvoPa9mO26MvOv3dP8Qzmkusc";

const searchBar = document.getElementById("searchBar");
const form = document.getElementById("form");
const showSong = document.getElementById("showSong");
const playIcon = document.getElementById("playIcon");
const progressBar = document.getElementById('songProgressBar');
const playIconMobile = document.getElementById("playIconMobile");
const progressBarMobile = document.getElementById('songProgressBarMobile');

let currentAudio = null;
let isPlaying = false;
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
            printSong(data.data);
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
        img.addEventListener('click', function() {
            const audioUrl = img.getAttribute('data-song');
            const songTitle = img.nextElementSibling.querySelector('h4').textContent;
            const artistName = img.nextElementSibling.querySelector('p').textContent;
            const albumCover = img.src;

            // Update desktop player
            document.getElementById("songTitle").textContent = songTitle;
            document.getElementById("artistName").textContent = artistName;
            document.getElementById("songCover").src = albumCover;

            // Update mobile player
            document.getElementById("songTitleMobile").textContent = `${songTitle} - ${artistName}`;
            document.getElementById("songCoverMobile").src = albumCover;

            if (currentAudio && !currentAudio.paused) {
                currentAudio.pause();
                currentAudio.currentTime = 0;
                fermaBarraProgresso();
                isPlaying = false;
                playIcon.innerHTML = `<i class="bi bi-play-fill text-black"></i>`;
                playIconMobile.classList.replace("bi-pause-fill", "bi-play-fill");
            }

            currentAudio = new Audio(audioUrl);
            currentAudio.play();
            isPlaying = true;
            playIcon.innerHTML = `<i class="bi bi-pause-fill text-black"></i>`;
            playIconMobile.classList.replace("bi-play-fill", "bi-pause-fill");
            avviaBarraProgresso(); // Avvia la barra di progresso
        });
    });
}

// Funzione per gestire il play/pause
function togglePlayPause() {
    if (currentAudio) {
        if (isPlaying) {
            currentAudio.pause();
            isPlaying = false;
            playIcon.innerHTML = `<i class="bi bi-play-fill text-black"></i>`;
            playIconMobile.classList.replace("bi-pause-fill", "bi-play-fill");
        } else {
            currentAudio.play();
            isPlaying = true;
            playIcon.innerHTML = `<i class="bi bi-pause-fill text-black"></i>`;
            playIconMobile.classList.replace("bi-play-fill", "bi-pause-fill");
        }
    }
}

// Funzione per aggiornare la barra di progresso (sia desktop che mobile)
function avviaBarraProgresso() {
    progressInterval = setInterval(() => {
        if (currentAudio && !currentAudio.paused) {
            progress = (currentAudio.currentTime / currentAudio.duration) * 100;
            updateProgressBar();
        }
    }, 100);
    avviaBarraProgressoMobile(); // Avvia anche la barra di progresso mobile
}

// Funzione per aggiornare la barra di progresso
function updateProgressBar() {
    progressBar.style.width = `${progress}%`;
    progressBarMobile.style.width = `${progress}%`;
    updateCurrentTime(currentAudio.currentTime); // Aggiorna il tempo su entrambi i lettori
}

// Funzione per aggiornare il tempo
function updateCurrentTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    const timeString = `${minutes}:${seconds}`;
    document.getElementById("currentTime").textContent = timeString;
    document.getElementById("currentTimeMobile").textContent = timeString;
}

// Funzione per fermare la barra di progresso
function fermaBarraProgresso() {
    clearInterval(progressInterval);
    progressInterval = null; // Non fermiamo il progresso completamente
    // La barra di progresso non torna più indietro
}

// Funzione per la barra di progresso mobile
function avviaBarraProgressoMobile() {
    mobileProgressInterval = setInterval(() => {
        if (currentAudio && !currentAudio.paused) {
            progress += (100 / currentAudio.duration) * 0.1; // Aggiorna la progressione
            if (progress >= 100) {
                clearInterval(mobileProgressInterval);
                progress = 100;
            }
            progressBarMobile.style.width = `${progress}%`;
        }
    }, 100);
}

// Funzione per fermare la barra di progresso mobile
function fermaBarraProgressoMobile() {
    clearInterval(mobileProgressInterval);
    mobileProgressInterval = null; // Non fermiamo il progresso completamente
}

// Event listener per i pulsanti di play/pause
playIcon.addEventListener("click", togglePlayPause);
playIconMobile.addEventListener("click", togglePlayPause);

document.addEventListener('DOMContentLoaded', function() {
    const shuffleIcon = document.getElementById('shuffleIcon');
    const repeatIcon = document.getElementById('repeatIcon');

    function toggleActiveState(element) {
        element.classList.toggle('active');
    }

    shuffleIcon.addEventListener('click', function() {
        toggleActiveState(this);
    });

    repeatIcon.addEventListener('click', function() {
        toggleActiveState(this);
    });
});
