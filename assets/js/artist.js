const trackListDiv = document.getElementById("track-list-div-artist");


window.onload = function () {
    // Recupera i dati dell'album dal sessionStorage
    const artistData = JSON.parse(sessionStorage.getItem("selectedArtist"));

    if (artistData) {
        populateAlbumDetails(artistData); // Popola i dettagli dell'album
    } else {
        console.error("Dati dell'artista non trovati nel sessionStorage.");
    }
}

// Funzione per popolare i dettagli dell'album
function populateAlbumDetails(artist) {
    // Recupera gli elementi esistenti dall'HTML
    const artistTitle = document.querySelector("name-artist");
    const artistRank = document.getElementById("artist-rank");
    const artistCover = document.getElementById("album-cover");
    const artistName = document.getElementById("artist-name");

    // Imposta i dettagli del primo album
    if (artistTitle) artistTitle.textContent = artist.name;
    if (artistCover) {
        artistCover.src = album.picture_big;
        artistCover.alt = `Copertina di ${artist.name}`;
    }

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
    <h4 class="mb-0 mt-0 text-white " id="track-list">
        <span><img src="/assets/imgs/main/image-15.jpg" height="50px" class="me-3 ms-2"/></span>
        ${track.title}</h4>
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
</li>
        `;
        });
    } else if (trackListDiv) {
        trackListDiv.innerHTML = "";
        trackListDiv.innerText = "Nessuna traccia disponibile.";
    }
}
