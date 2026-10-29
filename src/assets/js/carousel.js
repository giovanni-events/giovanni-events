// Arrow buttons scroll the track one slide at a time; scroll-snap does the rest.
document.querySelectorAll(".carousel").forEach((carousel) => {
  const track = carousel.querySelector(".carousel__track");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  carousel.querySelectorAll(".carousel__arrow").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.classList.contains("carousel__arrow--next") ? 1 : -1;
      track.scrollBy({
        left: direction * track.clientWidth,
        behavior: reduceMotion.matches ? "auto" : "smooth",
      });
    });
  });
});
