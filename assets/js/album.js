

// Recupera i dati dell'album dal sessionStorage
const albumData = JSON.parse(sessionStorage.getItem("selectedAlbum"));

if (albumData) {
    populateAlbumDetails(albumData); // Popola i dettagli dell'album
} else {
    console.error("Dati dell'album non trovati nel sessionStorage.");
}

// Funzione per popolare i dettagli dell'album
function populateAlbumDetails(album) {
    // Recupera gli elementi esistenti dall'HTML
    const albumTitle = document.getElementById("album-title");
    const albumCover = document.getElementById("album-cover");
    const artistName = document.getElementById("artist-name");
    const trackList = document.getElementById("track-list");

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

    if (albumTitle2) albumTitle2.textContent = album.title;  
    if (artistName2) artistName2.textContent = album.artist;  

    // Popola la lista delle tracce
    if (trackList && album.tracks && album.tracks.length > 0) {
        trackList.innerHTML = ""; 
        album.tracks.forEach((track) => {
            const trackItem = document.createElement("li");
            trackItem.textContent = track.title;
            trackList.appendChild(trackItem);
        });
    } else if (trackList) {
        trackList.innerHTML = "<li>Nessuna traccia disponibile.</li>";
    }
}
