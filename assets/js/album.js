const trackListDiv = document.getElementById("track-list-div");


window.onload = function () {
    // Recupera i dati dell'album dal sessionStorage
    const albumData = JSON.parse(sessionStorage.getItem("selectedAlbum"));

    if (albumData) {
        populateAlbumDetails(albumData); // Popola i dettagli dell'album
    } else {
        console.error("Dati dell'album non trovati nel sessionStorage.");
    }
}

// Funzione per popolare i dettagli dell'album
function populateAlbumDetails(album) {
    // Recupera gli elementi esistenti dall'HTML
    const albumTitle = document.getElementById("album-title");
    const albumCover = document.getElementById("album-cover");
    const artistName = document.getElementById("artist-name");

    // Imposta i dettagli del primo album
    if (albumTitle) albumTitle.textContent = album.title;
    if (albumCover) {
        albumCover.src = album.cover_big;
        albumCover.alt = `Copertina di ${album.title}`;
    }
    if (artistName) artistName.textContent = album.artist;

    // Imposta i dettagli del secondo album (aggiunto)
    const albumTitle2 = document.getElementById("album-title-2");
    const artistName2 = document.getElementById("artist-name-2");
    const albumCover2 = document.getElementById("album-cover-2");

    if (albumTitle2) albumTitle2.textContent = album.title;
    if (artistName2) artistName2.textContent = album.artist;
    if (albumCover2) {
        albumCover2.src = album.artistImg;
        albumCover.alt = `Copertina di ${album.title}`;
    }

    //Popola la lista delle tracce
    if (trackListDiv && album.tracks[0]) {
        const trackList = document.getElementById("track-list");
        
        album.tracks.forEach((track) => {
            const min = Math.floor(track.duration / 60); 
            const seconds = track.duration % 60;
            const durata = `${min}:${seconds}`;

            trackList.innerHTML += `
                <li>
                    <div class="row mt-3">
                        <div class="col-10 col-lg-6 ps-3">
                        <h4 class="mb-0 mt-0 text-white " id="track-list">${track.title}</h4>
                        <p class="text-secondary" id="artist-name">${track.artist}</p>
                        </div>
                        <div class="col-lg-4 d-sm-none d-md-inline text-center">
                        <p class="mt-0">${track.rank}</p>
                        </div>
                        <div class="col-lg-1 d-sm-none ms-2 d-md-inline text-center">
                        <p class="mt-0">${durata}</p>
                        </div>
                        <div class="d-lg-none  col-1">
                        <i class="bi bi-three-dots-vertical "></i>
                        </div>
                    </div>
                </li>
        `;  
        });
    } else if (trackListDiv) {
        trackListDiv.innerHTML = "";
        trackListDiv.innerText = "Nessuna traccia disponibile.";
    }
}
