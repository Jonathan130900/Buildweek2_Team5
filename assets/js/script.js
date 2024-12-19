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
const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzViMmQ1ZGQyMjA3MTAwMTVkZTJmMWYiLCJpYXQiOjE3MzQ0Njg0NjEsImV4cCI6MTczNTY3ODA2MX0.Q89cp9cHweU9w5ZWnXYvoPa9mO26MvOv3dP8Qzmkusc";
const arrAlbums = [];
let arrFourAlbums = [];
let arrSixAlbums = [];

class Albums {
    constructor(_title, _cover_big, _label, _tracklistURL, _artist, _year, _nbTracks, _duration) {
        this.title = _title;
        this.cover_big = _cover_big;
        this.label = _label;
        this.tracklistURL = _tracklistURL;
        this.artist = _artist;
        this.year = String(_year).substring(0, 4);
        this.nbTracks = _nbTracks;
        this.duration = _duration;
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
    await randomAlbum();
    await printSecondCards();
    main.classList.remove("d-none");
    skeleton.classList.add("d-none");
    btnPlay.addEventListener("click", () => handleAlbumClick(arrAlbums[10]));
    listenersBtn();
}
async function printSecondCards() {
    for (let i = 0; i < 6; i++) {
        arrFourAlbums = [];
        await randomFourAlbums();

        const imgs = secondCards[i].getElementsByTagName("img");
        for (let j = 0; j < imgs.length; j++) {
            const linkImg = arrFourAlbums[j].cover_big;
            imgs[j].src = linkImg;
        }

        const title = secondCards[i].getElementsByTagName("p")[0];
        const titleAlbum = arrFourAlbums[0].title;
        title.innerText = titleAlbum;
        arrSixAlbums[i] = arrFourAlbums[0];
    }
}

async function randomFourAlbums() {
    let i = 0;
    for (let i = 0; i < 4; i++) {
        let id = Math.floor(Math.random() * 150) + 700000;
        try {
            const result = await fetch(ALBUM_URL + id, {
                headers: {
                    authorization: TOKEN,
                },
            });

            if (result.ok) {
                const data = await result.json();
                if (data.id) {
                    console.log("album4 id: ", data.id);
                    let album = new Albums(data.title, data.cover_big, data.label, data.tracklist, data.artist.name, data.release_date, data.nb_tracks, data.duration);
                    arrFourAlbums.push(album);
                } else {
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
}

async function randomAlbum() {
    let i = 0;
    for (let i = 0; i < 11; i++) {
        let id = Math.floor(Math.random() * 150) + 500000;
        try {
            const result = await fetch(ALBUM_URL + id, {
                headers: {
                    authorization: TOKEN,
                },
            });

            if (result.ok) {
                const data = await result.json();
                if (data.id) {
                    console.log("album id: ", data.id);
                    let album = new Albums(data.title, data.cover_big, data.label, data.tracklist, data.artist.name, data.release_date, data.nb_tracks, data.duration);
                    arrAlbums.push(album);
                } else {
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
    console.log(arrAlbums);
    printCards();
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

function listenersBtn(){
    for(let i=0; i<6; i++){
        cards[i].addEventListener("click", () => handleAlbumClick(arrSixAlbums[i]));
    }
    for(let i=6; i<11; i++){
        cards[i].addEventListener("click", () => handleAlbumClick(arrAlbums[i-6]));
        cards[i+5].addEventListener("click", () => handleAlbumClick(arrAlbums[i-6]));
    }
    for(let i=16; i<21; i++){
        cards[i].addEventListener("click", () => handleAlbumClick(arrAlbums[i-11]));
    }
}

// Funzione per gestire il click su un album
function handleAlbumClick(album) {
    // Salva i dati nel sessionStorage
    sessionStorage.setItem("selectedAlbum", JSON.stringify(album));

    // Naviga verso la pagina album.html
    window.location.href = "album.html";
}


