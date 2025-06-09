<script>
  let currentSlide = 0;
  const totalSlides = 3;
  const carousel = document.getElementById("templateCarousel");
  const indicators = document.querySelectorAll(".indicator");

  function updateCarousel() {
    const offset = -currentSlide * 100;
    carousel.style.transform = `translateX(${offset}%)`;

    indicators.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide);
    });
  }

  function moveCarousel(direction) {
    currentSlide += direction;

    if (currentSlide < 0) {
      currentSlide = totalSlides - 1;
    } else if (currentSlide >= totalSlides) {
      currentSlide = 0;
    }

    updateCarousel();
  }

  function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
  }

  // Swipe support (optional)
  let startX = 0;
  carousel.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });
  carousel.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (diff > 50) moveCarousel(1);
    else if (diff < -50) moveCarousel(-1);
  });

  updateCarousel();
</script>
