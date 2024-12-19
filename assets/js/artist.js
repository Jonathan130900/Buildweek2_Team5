const trackListDiv = document.getElementById("track-list-div-artist");


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
                            <h4 class="mb-0 mt-0 text-white " id="track-list" style="font-size: 1rem;">
                                <span><img src="${track.cover_big}" height="50px" class="me-3 ms-2"/></span>
                                ${track.title}
                            </h4>
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
    } else if (trackListDiv) {
        trackListDiv.innerHTML = "";
        trackListDiv.innerText = "Nessuna traccia disponibile.";
    }
}
