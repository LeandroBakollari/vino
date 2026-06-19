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

const reviewCarousel = document.querySelector("[data-review-carousel]");

if (reviewCarousel) {
    const reviews = [
        {
            quote: "A deep, balanced wine that feels effortless through long dinners.",
            name: "Arta K.",
            location: "Tirana",
            product: "Vino Red Reserve",
            image: "assets/images/ui/wineB.png",
            alt: "Vino Red Reserve"
        },
        {
            quote: "The freshness was exactly right. We opened it with appetizers and everyone loved it.",
            name: "Elio M.",
            location: "Durres",
            product: "Mediterranean White",
            image: "assets/images/ui/wineB1.png",
            alt: "Mediterranean White"
        },
        {
            quote: "Clean aroma, beautiful color, and a soft finish. A great choice for summer evenings.",
            name: "Nora D.",
            location: "Vlore",
            product: "Summer Rose",
            image: "assets/images/ui/wineB2.png",
            alt: "Summer Rose"
        },
        {
            quote: "The staff recommendation was spot on. Elegant bottle, polished taste, and real character.",
            name: "Gent P.",
            location: "Shkoder",
            product: "Special Collection",
            image: "assets/images/ui/wineB4.png",
            alt: "Special Collection"
        }
    ];

    const previousButton = reviewCarousel.querySelector("[data-review-prev]");
    const nextButton = reviewCarousel.querySelector("[data-review-next]");
    const quote = reviewCarousel.querySelector("[data-review-quote]");
    const name = reviewCarousel.querySelector("[data-review-name]");
    const locationLabel = reviewCarousel.querySelector("[data-review-location]");
    const product = reviewCarousel.querySelector("[data-review-product]");
    const image = reviewCarousel.querySelector("[data-review-image]");
    let activeReview = 0;

    function updateReview() {
        const review = reviews[activeReview];

        quote.textContent = review.quote;
        name.textContent = review.name;
        locationLabel.textContent = review.location;
        product.textContent = review.product;
        image.src = review.image;
        image.alt = review.alt;
    }

    previousButton.addEventListener("click", () => {
        activeReview = (activeReview - 1 + reviews.length) % reviews.length;
        updateReview();
    });

    nextButton.addEventListener("click", () => {
        activeReview = (activeReview + 1) % reviews.length;
        updateReview();
    });
}

document.querySelectorAll(".product-actions .product-button-primary").forEach((button) => {
    button.addEventListener("click", () => {
        button.textContent = "Added";
        window.setTimeout(() => {
            button.textContent = "Add to cart";
        }, 1200);
    });
});

document.querySelectorAll("[data-subscribe-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const note = form.closest(".footer-subscribe").querySelector("[data-subscribe-note]");
        note.textContent = "Thank you for subscribing. We will send our next Vino update to your inbox.";
        form.reset();
    });
});
