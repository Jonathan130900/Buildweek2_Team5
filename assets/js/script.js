const heartIcons = document.getElementsByClassName("heart");
const ALBUM_URL = "https://striveschool-api.herokuapp.com/api/deezer/album/";
const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzViMmQ1ZGQyMjA3MTAwMTVkZTJmMWYiLCJpYXQiOjE3MzQ0Njg0NjEsImV4cCI6MTczNTY3ODA2MX0.Q89cp9cHweU9w5ZWnXYvoPa9mO26MvOv3dP8Qzmkusc";

const array = [];

for(let i=0; i<heartIcons.length; i++){
    heartIcons[i].addEventListener("mouseover", () => {
        heartIcons[i].classList.remove("bi-heart");
        heartIcons[i].classList.add("bi-heart-fill");
    });

    heartIcons[i].addEventListener("mouseout", () => {
        heartIcons[i].classList.remove("bi-heart-fill");
        heartIcons[i].classList.add("bi-heart");
    });
}

window.onload = function(){
    randomAlbum();
}

async function randomAlbum(){
    let i=0;
    for(let i=0; i<5; i++){
        let id = Math.floor(Math.random() * 50) + 500000;
        try {
            const res = await fetch(ALBUM_URL + id, {
                headers: {
                    authorization: TOKEN,
                },
            });

            if (res.ok) {
                const data = await res.json();
                if(data.id){
                    console.log("album id: ",data.id);
                    array.push(data);
                }else{
                    i--;
                    console.log("id non valido");
                }
            } else {
                i--;
                throw new Error('Error getting album');
            }
        } catch (err) {
            console.log("Errore durante la richiesta:", err);
        }
    }
    console.log(array);
}

// Funzione per popolare l'HTML esistente con i dati dell'album
function displayAlbums(albums) {
    albums.forEach((album, index) => {
        // Seleziona l'elemento HTML esistente per ogni album
        const albumElement = document.getElementById(`album-${index + 1}`); 

        if (albumElement) {
            // Popola i dettagli dell'album
            const albumTitle = albumElement.querySelector(".album-title");
            const albumCover = albumElement.querySelector(".album-cover");
            const artistName = albumElement.querySelector(".artist-name");

            if (albumTitle) albumTitle.textContent = album.title;
            if (albumCover) albumCover.src = album.cover_medium;
            if (albumCover) albumCover.alt = `Copertina di ${album.title}`;
            if (artistName) artistName.textContent = album.artist.name;

            // Aggiungi un event listener per il click sull'album
            albumElement.addEventListener("click", () => handleAlbumClick(album));
        }
    });
}

// Funzione per gestire il click su un album
function handleAlbumClick(album) {
    const selectedAlbum = {
        id: album.id,
        title: album.title,
        cover: album.cover_medium,
        artist: album.artist.name,
        tracks: album.tracks.data.map(track => ({
            title: track.title,
        })),
    };

    // Salva i dati nel sessionStorage
    sessionStorage.setItem("selectedAlbum", JSON.stringify(selectedAlbum));

    // Naviga verso la pagina album.html
    window.location.href = "album.html";
}