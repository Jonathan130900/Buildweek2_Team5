const heartIcons = document.getElementsByClassName("heart");
const firstCards = document.querySelectorAll(".first-cards");
const ALBUM_URL = "https://striveschool-api.herokuapp.com/api/deezer/album/";
const TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzViMmQ1ZGQyMjA3MTAwMTVkZTJmMWYiLCJpYXQiOjE3MzQ0Njg0NjEsImV4cCI6MTczNTY3ODA2MX0.Q89cp9cHweU9w5ZWnXYvoPa9mO26MvOv3dP8Qzmkusc";

const arrAlbums = [];



class Albums {
    constructor(_title, _cover_big, _label, _tracklistURL) {
        this.title = _title;
        this.cover_big = _cover_big;
        this.label = _label;
        this.tracklistURL = _tracklistURL;
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

window.onload = function () {
    randomAlbum();
}

async function randomAlbum() {
    let i = 0;
    for (let i = 0; i < 17; i++) {
        let id = Math.floor(Math.random() * 50) + 500000;
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
                    let album = new Albums(data.title, data.cover_big, data.label, data.tracklist);
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
    console.log(array);
}

