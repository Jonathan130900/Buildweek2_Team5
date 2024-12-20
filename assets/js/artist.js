const trackListDiv = document.getElementById("track-list-div-artist");
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


window.onload = function () {
    // Recupera i dati dell'album dal sessionStorage
    const artistData = JSON.parse(sessionStorage.getItem("selectedArtist"));
    const artistTracks = JSON.parse(sessionStorage.getItem("selectedArtistTracks"));

    if (artistData) {
        populateAlbumDetails(artistData, artistTracks); // Popola i dettagli dell'album
    } else {
        console.error("Dati dell'artista non trovati nel sessionStorage.");
    }
}

// Funzione per popolare i dettagli dell'album
function populateAlbumDetails(artist, tracks) {
    songList = tracks;
    // Recupera gli elementi esistenti dall'HTML
    const artistName = document.querySelector(".name-artist");
    const artistRank = document.getElementById("artist-rank");
    const artistCover = document.getElementById("artist-cover");

    // Imposta i dettagli del primo album
    if (artistRank) artistRank.textContent = artist.nb_fan;
    if (artistName) artistName.textContent = artist.name;
    if (artistCover) {
        artistCover.src = artist.picture_big;
        artistCover.alt = `Copertina di ${artist.name}`;
    }


    //Popola la lista delle tracce
    if (trackListDiv && tracks[0]) {
        const trackList = document.getElementById("track-list-artist");

        tracks.forEach((track) => {
            const min = Math.floor(track.duration / 60);
            const seconds = track.duration % 60;
            const durata = `${min}:${seconds}`;

            trackList.innerHTML += `
                <li>
                    <div class="row mt-3">
                        <div class="col-10 col-lg-6 ps-3">
                            <a href="Javascript:void(0)" class="text-decoration-none songLink" data-song="${track.preview}">
                            <h4 class="mb-0 mt-0 text-white " id="track-list" style="font-size: 1rem;">
                                <span class="img"><img src="${track.cover_big}" height="50px" class="me-3 ms-2"/></span>
                                ${track.title}
                            </h4>
                            </a>
                        </div>
                        <div class="col-lg-4 d-sm-none d-md-flex text-center">
                            <p class="m-0 pb-2 align-self-center">${track.rank}</p>
                        </div>
                        <div class="col-lg-1 d-sm-none ms-2 d-md-flex text-center">
                            <p class="m-0 pb-2 align-self-center">${durata}</p>
                        </div>
                        <div class="d-lg-none  col-1">
                            <i class="bi bi-three-dots-vertical "></i>
                        </div>
                    </div>
                </li>
        `;
        });
        const songLinks = document.querySelectorAll('.songLink');
        songLinks.forEach(link => {
            link.addEventListener('click', function () {
                const audioUrl = link.getAttribute('data-song');
                const songTitle = link.querySelector('h4').textContent;
                const artistName = artist.name;
                const albumCover = link.querySelector("img").src;
    
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
                isPlaying = true;
                updatePlayIcons();
                currentSongIndex = Array.from(songLinks).indexOf(link);
                updateProgress();
                currentAudio.ontimeupdate = updateProgress;
                currentAudio.onloadedmetadata = function () {
                    durationDisplay.textContent = formatTime(currentAudio.duration);
                    songProgress.max = currentAudio.duration;
                };
            });
        });
    } else if (trackListDiv) {
        trackListDiv.innerHTML = "";
        trackListDiv.innerText = "Nessuna traccia disponibile.";
    }
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
    const albumCover = song.cover_big;
    
    document.getElementById("songTitle").textContent = songTitle;
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

volumeBar.addEventListener("input", function () {
    if (currentAudio) {
        currentAudio.volume = volumeBar.value;
    }
});