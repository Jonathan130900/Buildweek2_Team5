// document.addEventListener("DOMContentLoaded", function () {
//   const albumCover = document.querySelector("#album-cover");

//   if (albumCover) {
//     albumCover.onload = () => {
//       const vibrant = new Vibrant(albumCover);
//       vibrant
//         .getPalette()
//         .then((palette) => {
//           const dominantColor =
//             palette.Vibrant || palette.Midnight || palette.LightVibrant;

//           if (dominantColor) {
//             const gradientBg = document.getElementById("gradient-bg");
//             gradientBg.style.background = `linear-gradient(to bottom, rgba(${dominantColor
//               .getRgb()
//               .join(",")}, 0.5), rgba(18, 18, 18, 1))`;
//           }
//         })
//         .catch((err) => {
//           console.error("Error fetching palette:", err);
//         });
//     };
//   }
// });
// Recupera i dati dell'album dal sessionStorage
const albumCover = document.getElementById("album-cover");
const colorThief = new ColorThief();
const albumData = JSON.parse(sessionStorage.getItem("selectedAlbum"));

if (albumData) {
    populateAlbumDetails(albumData); // Popola i dettagli dell'album
} else {
    console.error("Dati dell'album non trovati nel sessionStorage.");
}

// Funzione per popolare i dettagli dell'album
function populateAlbumDetails(album) {
    const albumTitle = document.getElementById("album-title");
    const albumCover = document.getElementById("album-cover");
    const artistName = document.getElementById("artist-name");
    const trackList = document.getElementById("track-list");

    // Imposta i dettagli dell'album
    albumTitle.textContent = album.title;
    albumCover.src = album.cover;
    albumCover.alt = `Copertina di ${album.title}`;
    artistName.textContent = album.artist;

    // Popola la lista delle tracce
    trackList.innerHTML = album.tracks
        .map(track => `<li>${track.title}</li>`)
        .join("");
}
 
// cambiare sfondo in base alla cover

albumCover.addEventListener('load', function() {
    try {
        // Estrai il colore dominante dall'immagine
        const dominantColor = colorThief.getColor(albumCover);
        console.log(dominantColor); // Log per vedere il colore estratto

        const rgbColor = `rgb(${dominantColor.join(', ')})`;

        // Imposta il colore di sfondo
        document.body.style.backgroundColor = rgbColor;
    } catch (error) {
        console.error("Errore nell'estrazione del colore:", error);
    }
});