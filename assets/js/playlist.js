const trackListDiv = document.getElementById("track-list-div-playlist");
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
const sideBarLinks = document.querySelectorAll(".sidebar-links a");

window.onload = function () {
    // Recupera i dati dell'album dal sessionStorage
    for(let i=0; i<4; i++){
        sideBarLinks[i].addEventListener("click", () => handlePlaylistClick());
    }
    const playlistTracks = JSON.parse(sessionStorage.getItem("selectedTracksPlaylist"));

    if (playlistTracks) {
        populateAlbumDetails(playlistTracks); // Popola i dettagli dell'album
    } else {
        console.error("Dati dell'artista non trovati nel sessionStorage.");
    }
}

function handlePlaylistClick(){
    const arrTracks = JSON.parse(sessionStorage.getItem("arrTracksArtists"));
    const playlistTracks = [];
    for(let i=0; i<10; i++){
        const randomArtist = Math.floor(Math.random()*6);
        const randomSong = Math.floor(Math.random() * arrTracks[randomArtist].length);
        playlistTracks.push(arrTracks[randomArtist][randomSong]);
    }
    sessionStorage.setItem("selectedTracksPlaylist", JSON.stringify(playlistTracks));
    
    window.location.href = "playlist.html";
}

// Funzione per popolare i dettagli dell'album
function populateAlbumDetails(tracks) {
    songList = tracks;

    //Popola la lista delle tracce
    if (trackListDiv) {
        const trackList = document.getElementById("track-list-playlist");

        tracks.forEach((track) => {
            const min = Math.floor(track.duration / 60);
            const seconds = track.duration % 60;
            let durata = `00`;
            if(seconds>=10){
                durata = `${min}:${seconds}`;
            }else if(seconds === 0){
                durata = `${min}:00`;
            }else{
                durata = `${min}:${seconds}0`;
            }

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
                const albumCover = link.querySelector("img").src;
    
                document.getElementById("songTitle").textContent = songTitle;
                document.getElementById("songCover").src = albumCover;
                document.querySelector("#playerSection .song-cover").src = albumCover;
                document.querySelector("#playerSection .song-title-container h6").innerHTML = `${songTitle}`;
    
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

volumeBar.addEventListener("input", function () {
    if (currentAudio) {
        currentAudio.volume = volumeBar.value;
    }
});