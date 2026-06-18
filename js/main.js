const carousel = document.querySelector("[data-carousel]");

if (carousel) {
    const track = carousel.querySelector("[data-carousel-track]");
    const previousButton = carousel.querySelector("[data-carousel-prev]");
    const nextButton = carousel.querySelector("[data-carousel-next]");
    const count = carousel.querySelector("[data-carousel-count]");
    const cards = Array.from(track.children);
    let activeIndex = 0;

    function visibleCards() {
        if (window.innerWidth <= 520) {
            return 1;
        }

        if (window.innerWidth <= 800) {
            return 2;
        }

        return 3;
    }

    function updateCarousel() {
        const visible = visibleCards();
        const maxIndex = Math.max(cards.length - visible, 0);
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        const cardWidth = cards[0].getBoundingClientRect().width;

        activeIndex = Math.max(0, Math.min(activeIndex, maxIndex));
        track.style.transform = `translateX(-${activeIndex * (cardWidth + gap)}px)`;

        previousButton.disabled = activeIndex === 0;
        nextButton.disabled = activeIndex === maxIndex;
        count.textContent = `${activeIndex + 1}-${Math.min(activeIndex + visible, cards.length)} / ${cards.length}`;
    }

    previousButton.addEventListener("click", () => {
        activeIndex -= 1;
        updateCarousel();
    });

    nextButton.addEventListener("click", () => {
        activeIndex += 1;
        updateCarousel();
    });

    window.addEventListener("resize", updateCarousel);
    updateCarousel();
}

document.querySelectorAll(".product-actions .product-button-primary").forEach((button) => {
    button.addEventListener("click", () => {
        button.textContent = "Added";
        window.setTimeout(() => {
            button.textContent = "Add to cart";
        }, 1200);
    });
});
