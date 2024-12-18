const url = "https://striveschool-api.herokuapp.com/api/deezer/search?q=";
const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzViMmQ1ZGQyMjA3MTAwMTVkZTJmMWYiLCJpYXQiOjE3MzQ0Njg0NjEsImV4cCI6MTczNTY3ODA2MX0.Q89cp9cHweU9w5ZWnXYvoPa9mO26MvOv3dP8Qzmkusc";

const searchBar = document.getElementById("searchBar");
const form = document.getElementById("form");
const showSong = document.getElementById("showSong");
const playIcon = document.getElementById("playIcon");
const progressBar = document.getElementById('songProgressBar');

let currentAudio = null;
let isPlaying = false;
let progressInterval;
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
            document.getElementById("songTitle").textContent = songTitle;
            document.getElementById("artistName").textContent = artistName;
            document.getElementById("songCover").src = albumCover;
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
            playIcon.innerHTML = `<i class="bi bi-pause-fill text-black"></i>`;
            avviaBarraProgresso();
        });
    });
}

// Gestisce il click sul pulsante play/pause
playIcon.addEventListener("click", function() {
    if (currentAudio) {
        if (isPlaying) {
            // Se la canzone sta suonando, la mette in pausa
            currentAudio.pause();
            isPlaying = false;
            fermaBarraProgresso();
            playIcon.innerHTML = `<i class="bi bi-play-fill text-black"></i>`;
        } else {
            // Se la canzone è in pausa, la fa ripartire
            currentAudio.play();
            isPlaying = true;
            avviaBarraProgresso();
            playIcon.innerHTML = `<i class="bi bi-pause-fill text-black"></i>`;
        }
    }
});

const currentTimeDisplay = document.getElementById('currentTime');

// Funzione per avviare e aggiornare la barra di progresso
function avviaBarraProgresso() {
    clearInterval(progressInterval);
    progressInterval = setInterval(() => {
        if (currentAudio) {
            const duration = currentAudio.duration;
            const currentTime = currentAudio.currentTime;
            progress = (currentTime / duration) * 100;

            // Controlla se la canzone è finita
            if (progress >= 100) {
                // Resetta tutto quando la canzone finisce
                clearInterval(progressInterval);
                isPlaying = false;
                playIcon.innerHTML = '<i class="bi bi-play-fill text-black"></i>';
                progress = 0;
                currentTimeDisplay.textContent = '0:00';
            } else {
                // Aggiorna la barra di progresso e il tempo visualizzato
                aggiornaBarraProgresso();
                aggiornaTempoCorrente(currentTime);
            }
        }
    }, 100); // Aggiorna ogni 100 millisecondi
}

// Funzione per aggiornare visivamente la barra di progresso
function aggiornaBarraProgresso() {
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', Math.floor(progress));
}

// Funzione per aggiornare il tempo corrente visualizzato
function aggiornaTempoCorrente(currentTime) {
    const minutes = Math.floor(currentTime / 60);
    const seconds = Math.floor(currentTime % 60);
    currentTimeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// Funzione per fermare l'aggiornamento della barra di progresso
function fermaBarraProgresso() {
    clearInterval(progressInterval);
}

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

