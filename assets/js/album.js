/*
function fetchAlbumData() {
  const albumId = "YOUR_ALBUM_ID";
  const apiUrl = `https://api.deezer.com/album/${albumId}`;

  if (sessionStorage.getItem("albumAccessed")) {
    alert("You have already accessed this album. Reloading the page...");
    window.location.href = "index.html";
    return;
  }

  sessionStorage.setItem("albumAccessed", "true");

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch album data");
      }
      return response.json();
    })
    .then((data) => {
      document.querySelector(".titleAlbum").innerText = data.title;
      document.querySelector(".bandPfp").src = data.artist.picture_small;
    })
    .catch((error) => {
      console.error("Error fetching album data:", error);
      alert(
        "Something went wrong while fetching album data. Please try again later."
      );
    });
}

fetchAlbumData();
*/
