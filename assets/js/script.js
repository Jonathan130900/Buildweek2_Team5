const heartIcons = document.getElementsByClassName("heart");
const firstCards = document.querySelectorAll(".first-cards");
const secondCards = document.querySelectorAll(".tagStart");
const thirdCard = document.querySelector(".album-big");
const main = document.getElementById("main-home");
const skeleton = document.getElementsByClassName("skeleton-container")[0];
const responsiveCards = document.querySelectorAll(".albums .card");
const btnPlay = document.getElementById("uno");
const cards = document.getElementsByClassName("card-button");


const ALBUM_URL = "https://striveschool-api.herokuapp.com/api/deezer/album/";
const ARTIST_URL = "https://striveschool-api.herokuapp.com/api/deezer/artist/";
const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzViMmQ1ZGQyMjA3MTAwMTVkZTJmMWYiLCJpYXQiOjE3MzQ0Njg0NjEsImV4cCI6MTczNTY3ODA2MX0.Q89cp9cHweU9w5ZWnXYvoPa9mO26MvOv3dP8Qzmkusc";
let arrAlbums = [];
let arrArtists = [];
let arrTracks = [];

let randomIdAlbum = [];
let randomIdArtist = [];
let urlsArtist = [];

class Albums {
    constructor(_title, _cover_big, _label, _tracks, _artist, _artistImg, _year, _nbTracks, _duration) {
        this.title = _title;
        this.cover_big = _cover_big;
        this.label = _label;
        this.tracks = _tracks;
        this.artist = _artist;
        this.year = String(_year).substring(0, 4);
        this.nbTracks = _nbTracks;
        this.duration = _duration;
        this.artistImg = _artistImg;
    }
}
class Artists {
    constructor(_name, _picture_big, _nb_fan, _tracklistURL) {
        this.name = _name;
        this.picture_big = _picture_big;
        this.nb_fan = _nb_fan;
        this.tracklistURL = _tracklistURL;
    }
}

class Tracks {
    constructor(_title, _cover_big, _rank, _duration, _preview) {
        this.title = _title;
        this.cover_big = _cover_big;
        this.rank = _rank;
        this.duration = _duration;
        this.preview = _preview;
    }
}

class TracksAlbum {
    constructor(_title, _artist, _rank, _duration, _preview) {
        this.title = _title;
        this.artist = _artist;
        this.rank = _rank;
        this.duration = _duration;
        this.preview = _preview;
    }
}

for (let i = 0; i < heartIcons.length; i++) {
    heartIcons[i].addEventListener("mouseover", () => {
        heartIcons[i].classList.remove("bi-heart");
        heartIcons[i].classList.add("bi-heart-fill");
    });

    heartIcons[i].addEventListener("mouseout", () => {
        heartIcons[i].classList.remove("bi-heart-fill");
        heartIcons[i].classList.add("bi-heart");
    });
}

window.onload = async function () {
    randomIdAlbums();
    randomIdArtists();
    // Esegui le funzioni solo la prima volta
    await randomAlbum();
    await randomArtists();
    main.classList.remove("d-none");
    skeleton.classList.add("d-none");
    btnPlay.addEventListener("click", () => handleAlbumClick(arrAlbums[10]));
    listenersBtn();

}

// window.onload = async function () {
//     // Controlla se il sito è stato già caricato
//     const isFirstLoad = sessionStorage.getItem("isFirstLoad");

//     if (!isFirstLoad) {
//         randomIdAlbums();
//         randomIdArtists();
//         // Esegui le funzioni solo la prima volta
//         await randomAlbum();
//         await randomArtists();
//         main.classList.remove("d-none");
//         skeleton.classList.add("d-none");
//         btnPlay.addEventListener("click", () => handleAlbumClick(arrAlbums[10]));
//         listenersBtn();

//         //carica in sessionStorage gli array
//         sessionStorage.setItem("isFirstLoad", "true");
//         sessionStorage.setItem("arrAlbums", JSON.stringify(arrAlbums));
//         sessionStorage.setItem("arrArtists", JSON.stringify(arrArtists));
//         sessionStorage.setItem("arrTracksArtists", JSON.stringify(arrTracks));
//     } else {
//         console.log("Il sito è stato già caricato. Niente funzioni iniziali.");
//         arrAlbums = JSON.parse(sessionStorage.getItem("arrAlbums"));
//         arrArtists = JSON.parse(sessionStorage.getItem("arrArtists"));
//         arrTracks = JSON.parse(sessionStorage.getItem("arrTracksArtists"));
//         printCards();
//         printSecondCards();
//         main.classList.remove("d-none");
//         skeleton.classList.add("d-none");
//         btnPlay.addEventListener("click", () => handleAlbumClick(arrAlbums[10]));
//         listenersBtn();
//     }
// }

function printSecondCards() {
    for (let i = 0; i < 6; i++) {
        const imgs = secondCards[i].getElementsByTagName("img");
        for (let j = 0; j < imgs.length; j++) {
            if (arrTracks[i][j]) {
                const linkImg = arrTracks[i][j].cover_big;
                imgs[j].src = linkImg;
            }
        }

        const name = secondCards[i].getElementsByTagName("p")[0];
        const nameArtist = arrArtists[i].name;
        name.innerText = nameArtist;
    }
}

async function fetchArtist(id) {
    try {
        const result = await fetch(ARTIST_URL + id, {
            headers: {
                authorization: TOKEN,
            },
        });

        if (result.ok) {
            const data = await result.json();
            if (data.id && data.nb_album) {
                urlsArtist.push(data.tracklist);
                return data;
            } else {
                return fetchArtist(Math.floor(Math.random() * 150) + 1);
            }
        } else {
            return fetchArtist(Math.floor(Math.random() * 150) + 1);
            throw new Error('Error getting artist');
        }
    } catch (err) {
        console.log("Errore durante la richiesta:", err);
    }
}

async function randomArtists() {
    try {
        const promises = randomIdArtist.map(fetchArtist);
        const artists = await Promise.all(promises);
        console.log("Artisti: ", artists);
        artists.forEach((data) => {
            let artist = new Artists(data.name, data.picture_big, data.nb_fan, data.tracklist, data.id);
            arrArtists.push(artist);
        });
    } catch (error) {
        console.error('Errore durante il fetch degli artisti:', error);
    }
    const promises = urlsArtist.map(fetchTracks);
    const tracksArtistsAll = await Promise.all(promises);
    tracksArtistsAll.forEach((artist) => {
        const arrTracksOneArtist = [];
        artist.data.forEach((track) => {
            arrTracksOneArtist.push(new Tracks(track.title, track.album.cover_big, track.rank, track.duration, track.preview));
        });
        arrTracks.push(arrTracksOneArtist);
    });
    printSecondCards();
}

//faccio la fetch delle traccie di ogni artista, cosi da ricavarmi le immagini delle canzoni e tutti i dati utili per la pagina artist
async function fetchTracks(url) {
    try {
        const result = await fetch(url, {
            headers: {
                authorization: TOKEN,
            },
        });

        if (result.ok) {
            const data = await result.json();
            return data;
        } else {
            throw new Error('Error getting track');
        }
    } catch (err) {
        console.log("Errore durante la richiesta:", err);
    }
}

async function fetchAlbum(id) {
    try {
        const result = await fetch(ALBUM_URL + id, {
            headers: {
                authorization: TOKEN,
            },
        });

        if (result.ok) {
            const data = await result.json();
            if (data.id) {
                return data;
            } else {
                return fetchAlbum(Math.floor(Math.random() * 550) + 500000);
            }
        } else {
            return fetchAlbum(Math.floor(Math.random() * 550) + 500000);
            throw new Error('Error getting album');
        }
    } catch (err) {
        console.log("Errore durante la richiesta:", err);
    }
}

async function randomAlbum() {
    try {
        const promises = randomIdAlbum.map(fetchAlbum);
        const albums = await Promise.all(promises);
        console.log("Album: ", albums);
        albums.forEach((albumElement) => {
            const arrTracksAlbum = [];
            albumElement.tracks.data.forEach((element) => {
                arrTracksAlbum.push(new TracksAlbum(element.title, element.artist.name, element.rank, element.duration, element.preview));
            });
            let album = new Albums(albumElement.title, albumElement.cover_big, albumElement.label, arrTracksAlbum, albumElement.artist.name, albumElement.artist.picture_big, albumElement.release_date, albumElement.nb_tracks, albumElement.duration);
            arrAlbums.push(album);
        });
        printCards();
    } catch (error) {
        console.error('Errore durante il fetch degli album:', error);
    }
}


function printCards() {
    firstCards.forEach((card, index) => {
        const img = card.querySelector('.card-img-top');
        const linkImg = arrAlbums[index].cover_big;
        img.src = linkImg;

        const title = card.querySelector(".card-title");
        const titleAlbum = arrAlbums[index].title;
        title.innerText = titleAlbum;

        const label = card.getElementsByTagName("p")[0];
        const labelAlbum = arrAlbums[index].label;
        label.innerText = labelAlbum;
    });

    responsiveCards.forEach((card, index) => {
        const img = card.getElementsByTagName("img")[0];
        const linkImg = arrAlbums[index].cover_big;
        img.src = linkImg;

        const title = card.getElementsByTagName("h4")[0];
        const titleAlbum = arrAlbums[index].title;
        title.innerText = titleAlbum;

        const nb_tracks = card.getElementsByTagName("p")[1];
        const nbAlbum = arrAlbums[index].nbTracks;
        nb_tracks.innerText = `${nbAlbum} brani`;
    });

    const img = thirdCard.getElementsByTagName("img")[0];
    const linkImg = arrAlbums[10].cover_big;
    img.src = linkImg;

    const title = thirdCard.getElementsByTagName("h2")[0];
    const titleAlbum = arrAlbums[10].title;
    title.innerText = titleAlbum;

    const artist = thirdCard.getElementsByTagName("p")[0];
    const artistAlbum = arrAlbums[10].artist;
    artist.innerText = artistAlbum;
}

function listenersBtn() {
    for (let i = 0; i < 6; i++) {
        cards[i].addEventListener("click", () => handleArtistClick(arrArtists[i], arrTracks[i]));
    }
    for (let i = 6; i < 11; i++) {
        cards[i].addEventListener("click", () => handleAlbumClick(arrAlbums[i - 6]));
        cards[i + 5].addEventListener("click", () => handleAlbumClick(arrAlbums[i - 6]));
    }
    for (let i = 16; i < 21; i++) {
        cards[i].addEventListener("click", () => handleAlbumClick(arrAlbums[i - 11]));
    }
}

// Funzione per gestire il click su un album
function handleAlbumClick(album) {
    // Salva i dati nel sessionStorage
    sessionStorage.setItem("selectedAlbum", JSON.stringify(album));

    // Naviga verso la pagina album.html
    window.location.href = "album.html";
}

function handleArtistClick(artist, tracks) {
    // Salva i dati nel sessionStorage
    sessionStorage.setItem("selectedArtist", JSON.stringify(artist));
    sessionStorage.setItem("selectedArtistTracks", JSON.stringify(tracks));

    // Naviga verso la pagina album.html
    window.location.href = "artist.html";
}


function randomIdAlbums() {
    for (let i = 0; i < 11; i++) {
        let id = Math.floor(Math.random() * 550) + 500000;
        randomIdAlbum.push(id);
    }
}

function randomIdArtists() {
    for (let i = 0; i < 6; i++) {
        let id = Math.floor(Math.random() * 150) + 1;
        randomIdArtist.push(id);
    }
}