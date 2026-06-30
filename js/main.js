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
            productId: "vino-red-reserve",
            image: "assets/images/ui/wineB.png",
            alt: "Vino Red Reserve"
        },
        {
            quote: "The freshness was exactly right. We opened it with appetizers and everyone loved it.",
            name: "Elio M.",
            location: "Durres",
            product: "Mediterranean White",
            productId: "mediterranean-white",
            image: "assets/images/ui/wineB1.png",
            alt: "Mediterranean White"
        },
        {
            quote: "Clean aroma, beautiful color, and a soft finish. A great choice for summer evenings.",
            name: "Nora D.",
            location: "Vlore",
            product: "Summer Rosé",
            productId: "summer-rose",
            image: "assets/images/ui/wineB2.png",
            alt: "Summer Rosé"
        },
        {
            quote: "The staff recommendation was spot on. Elegant bottle, polished taste, and real character.",
            name: "Gent P.",
            location: "Shkoder",
            product: "Special Collection",
            productId: "special-collection",
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
    const reviewLink = reviewCarousel.querySelector("[data-review-link]");
    let activeReview = 0;

    function updateReview() {
        const review = reviews[activeReview];

        quote.textContent = review.quote;
        name.textContent = review.name;
        locationLabel.textContent = review.location;
        product.textContent = review.product;
        image.src = review.image;
        image.alt = review.alt;
        if (reviewLink) reviewLink.href = `product.html?id=${review.productId}`;
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


// --- Dynamic Blog Grid Rendering Logic ---
const blogGridContainer = document.getElementById("blog-grid-container");

if (blogGridContainer) {
    fetch('articles.json')
        .then(response => response.json())
        .then(articles => {
            // Clear the container just in case
            blogGridContainer.innerHTML = ""; 

            // Loop through every article in the JSON file.
            // Skip id=1 since it is already shown as the hardcoded featured article.
            articles.filter(article => article.id !== 1).forEach(article => {
                // Create the article element
                const articleCard = document.createElement("article");
                articleCard.className = "blog-card";

                // Use the preview key if available, otherwise fall back to first content paragraph
                const excerpt = article.preview || article.content[0];

                // Build the HTML structure for the card
                articleCard.innerHTML = `
                    <img src="${article.image}" alt="${article.title}" class="blog-card__image">
                    <div class="blog-card__content">
                        <span class="blog-tag">${article.date}</span>
                        <h3 class="blog-card__title">${article.title}</h3>
                        <p class="blog-card__excerpt">${excerpt}</p>
                        <a href="article.html?id=${article.id}" class="blog-card__link">Read more &rarr;</a>
                    </div>
                `;

                // Add the completed card to the grid
                blogGridContainer.appendChild(articleCard);
            });
        })
        .catch(error => {
            console.error("Error fetching articles for the grid:", error);
            blogGridContainer.innerHTML = "<p>Unable to load articles at this time.</p>";
        });
}

// Check if we are on the single article page
const articleContainer = document.getElementById("article-container");

if (articleContainer) {
    // 1. Get the ID from the URL (e.g., article.html?id=2)
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    // DOM Elements
    const titleEl = document.getElementById("post-title");
    const dateEl = document.getElementById("post-date");
    const categoryEl = document.getElementById("post-category");
    const imageEl = document.getElementById("post-image");
    const contentEl = document.getElementById("post-content");
    const errorMessage = document.getElementById("error-message");

    if (articleId) {
        // 2. Fetch the JSON data
        fetch('articles.json')
            .then(response => response.json())
            .then(articles => {
                // Find the specific article
                const article = articles.find(a => a.id == articleId);

                if (article) {
                    // 3. Inject data into HTML
                    titleEl.textContent = article.title;
                    dateEl.textContent = article.date;
                    categoryEl.textContent = article.category;
                    imageEl.src = article.image;
                    imageEl.alt = article.title;

                    // Clear loading text and append paragraphs
                    contentEl.innerHTML = "";
                    article.content.forEach(paragraph => {
                        const p = document.createElement("p");
                        p.textContent = paragraph;
                        contentEl.appendChild(p);
                    });
                } else {
                    // Article ID not found in JSON
                    showError();
                }
            })
            .catch(error => {
                console.error("Error fetching articles:", error);
                showError();
            });
    } else {
        // No ID in URL
        showError();
    }

    function showError() {
        articleContainer.style.display = "none";
        errorMessage.style.display = "block";
    }
}