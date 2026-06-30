/**
 * product.js — Vino Single Product Page
 * Reads ?id= from the URL, fetches products.json, and renders the product.
 */

const productContainer = document.getElementById("product-container");
const productError     = document.getElementById("product-error");

if (productContainer) {
    const params    = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    if (!productId) {
        showError();
    } else {
        fetch("data/products.json")
            .then(res => res.json())
            .then(products => {
                const product = products.find(p => p.id === productId);
                if (product) {
                    renderProduct(product);
                } else {
                    showError();
                }
            })
            .catch(() => showError());
    }
}

function showError() {
    if (productContainer) productContainer.style.display = "none";
    if (productError)     productError.style.display = "block";
}

function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let html = "";
    for (let i = 0; i < 5; i++) {
        if (i < full) {
            html += `<span class="star star--full" aria-hidden="true">★</span>`;
        } else if (i === full && half) {
            html += `<span class="star star--half" aria-hidden="true">★</span>`;
        } else {
            html += `<span class="star star--empty" aria-hidden="true">★</span>`;
        }
    }
    return `<div class="product-rating" aria-label="Rated ${rating} out of 5">${html}<span class="product-rating__value">${rating.toFixed(1)}</span></div>`;
}

function renderProduct(p) {
    // Update page title
    document.title = `Vino | ${p.name}`;

    // Image
    const img = document.getElementById("pd-image");
    img.src = p.image;
    img.alt = p.name;

    // Color badge
    const badge = document.getElementById("pd-color-badge");
    badge.textContent = p.color;
    badge.className = `product-page__color-badge shop-card__color-badge--${p.color.toLowerCase()}`;

    // Meta
    document.getElementById("pd-year").textContent  = p.year;
    document.getElementById("pd-style").textContent = p.style;

    // Name
    document.getElementById("pd-name").textContent = p.name;

    // Rating
    document.getElementById("pd-rating").innerHTML = renderStars(p.rating);

    // Short description
    document.getElementById("pd-description").textContent = p.description;

    // Price
    document.getElementById("pd-price").textContent = `€${p.price.toFixed(2)}`;

    // Specs
    document.getElementById("pd-volume").textContent    = p.volume;
    document.getElementById("pd-alcohol").textContent   = p.alcohol;
    document.getElementById("pd-grapes").textContent    = p.grapes    || "—";
    document.getElementById("pd-region").textContent    = p.region    || "—";
    document.getElementById("pd-vintage").textContent   = p.year;
    document.getElementById("pd-temp").textContent      = p.servingTemp  || "—";
    document.getElementById("pd-decanting").textContent = p.decanting    || "—";

    // Long description
    document.getElementById("pd-long-desc").textContent = p.longDescription || p.description;

    // Tasting notes
    document.getElementById("pd-tasting").textContent = p.tastingNotes || "—";

    // Pairing
    document.getElementById("pd-pairing").textContent = p.pairing || "—";

    // Add to cart button
    document.getElementById("pd-add-cart").addEventListener("click", function () {
        this.textContent = "Added ✓";
        this.disabled = true;
        setTimeout(() => {
            this.textContent = "Add to cart";
            this.disabled = false;
        }, 1400);
    });
}
