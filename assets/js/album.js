document.addEventListener("DOMContentLoaded", function () {
  const albumCover = document.querySelector("#album-cover");

  if (albumCover) {
    albumCover.onload = () => {
      const vibrant = new Vibrant(albumCover);
      vibrant
        .getPalette()
        .then((palette) => {
          const dominantColor =
            palette.Vibrant || palette.Midnight || palette.LightVibrant;

          if (dominantColor) {
            const gradientBg = document.getElementById("gradient-bg");
            gradientBg.style.background = `linear-gradient(to bottom, rgba(${dominantColor
              .getRgb()
              .join(",")}, 0.5), rgba(18, 18, 18, 1))`;
          }
        })
        .catch((err) => {
          console.error("Error fetching palette:", err);
        });
    };
  }
});
