// The <dialog> element supplies the focus trap, Esc to close, and returning focus to the clicked photo.
const gallery = document.querySelector(".gallery");

if (gallery) {
  const dialog = gallery.querySelector(".lightbox");
  const image = dialog.querySelector(".lightbox__img");
  const caption = dialog.querySelector(".lightbox__caption");
  const buttons = [...gallery.querySelectorAll(".gallery__button")];
  const navButtons = dialog.querySelectorAll(".lightbox__nav");
  let index = 0;

  function show(i) {
    index = (i + buttons.length) % buttons.length;
    const thumb = buttons[index].querySelector("img");
    image.src = thumb.src;
    image.alt = thumb.alt;
    caption.textContent = buttons[index].dataset.caption;
    caption.hidden = !caption.textContent;
  }

  buttons.forEach((button, i) => {
    button.addEventListener("click", () => {
      show(i);
      dialog.showModal();
    });
  });

  navButtons.forEach((nav) => {
    nav.hidden = buttons.length < 2;
    nav.addEventListener("click", () => {
      show(index + (nav.classList.contains("lightbox__nav--next") ? 1 : -1));
    });
  });

  dialog.querySelector(".lightbox__close").addEventListener("click", () => dialog.close());

  // Clicking the dark backdrop closes it
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("keydown", (event) => {
    if (buttons.length < 2) return;
    if (event.key === "ArrowRight") show(index + 1);
    if (event.key === "ArrowLeft") show(index - 1);
  });
}
