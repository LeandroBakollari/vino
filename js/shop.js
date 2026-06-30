/**
 * shop.js — Vino Shop Page
 * Loads products from data/products.json and handles search, filtering, and sorting.
 */

const products = [
    {
        id: "vino-red-reserve",
        name: "Vino Red Reserve",
        year: 2021,
        style: "Full-bodied",
        color: "Red",
        categories: ["red", "reserve", "dry"],
        price: 28.00,
        description: "A robust blend of Merlot and Cabernet Sauvignon with notes of dark berries and oak.",
        image: "assets/images/ui/wineB.png",
        alcohol: "13.5%",
        volume: "750ml",
        rating: 4.8
    },
    {
        id: "mediterranean-white",
        name: "Mediterranean White",
        year: 2022,
        style: "Crisp & Aromatic",
        color: "White",
        categories: ["white", "dry", "crisp"],
        price: 22.50,
        description: "Refreshing citrus aroma, green apple notes, and a beautifully soft, clean finish.",
        image: "assets/images/ui/wineB1.png",
        alcohol: "12.5%",
        volume: "750ml",
        rating: 4.6
    },
    {
        id: "summer-rose",
        name: "Summer Rose",
        year: 2023,
        style: "Light & Fruity",
        color: "Rose",
        categories: ["rose", "light", "fruit-forward"],
        price: 19.00,
        description: "Crisp acidity with aromas of fresh strawberry, raspberry, and subtle mineral undertones.",
        image: "assets/images/ui/wineB2.png",
        alcohol: "12.0%",
        volume: "750ml",
        rating: 4.5
    },
    {
        id: "sparkling-vino",
        name: "Sparkling Vino",
        year: 2022,
        style: "Extra Dry",
        color: "Sparkling",
        categories: ["sparkling", "white", "festive"],
        price: 24.00,
        description: "Fresh and festive sparkling wine with fine bubbles and notes of pear and white flowers.",
        image: "assets/images/ui/wineB3.png",
        alcohol: "11.5%",
        volume: "750ml",
        rating: 4.7
    },
    {
        id: "special-collection",
        name: "Special Collection",
        year: 2019,
        style: "Complex & Aged",
        color: "Red",
        categories: ["red", "special", "aged", "limited"],
        price: 34.00,
        description: "Limited cellar edition crafted from hand-picked grapes, aged in French oak barrels.",
        image: "assets/images/ui/wineB4.png",
        alcohol: "14.0%",
        volume: "750ml",
        rating: 4.9
    },
    {
        id: "kallmet-classic",
        name: "Kallmet Classic",
        year: 2020,
        style: "Medium-bodied",
        color: "Red",
        categories: ["red", "albanian", "classic"],
        price: 26.00,
        description: "Traditional Albanian Kallmet grape offering rich cherry notes with a smooth, earthy finish.",
        image: "assets/images/ui/wineB8.png",
        alcohol: "13.0%",
        volume: "750ml",
        rating: 4.7
    },
    {
        id: "cellar-reserve",
        name: "Cellar Reserve",
        year: 2018,
        style: "Bold & Oaky",
        color: "Red",
        categories: ["red", "reserve", "aged"],
        price: 45.00,
        description: "Our premium staff-selected reserve with a deep character, structured tannins, and a long finish.",
        image: "assets/images/ui/wineB9.png",
        alcohol: "14.5%",
        volume: "750ml",
        rating: 5.0
    }
];

/* ── Elements ─────────────────────────────────────────────────────────── */
const grid          = document.getElementById("shop-grid");
const emptyState    = document.getElementById("shop-empty");
const resultsCount  = document.getElementById("shop-results-count");
const searchInput   = document.getElementById("shop-search");
const sortSelect    = document.getElementById("shop-sort");
const priceSlider   = document.getElementById("shop-price");
const priceDisplay  = document.getElementById("price-display");
const clearAllBtns  = document.querySelectorAll("#shop-clear-filters, #shop-empty-clear");
const filterCheckboxes = document.querySelectorAll(".filter-checkbox");

/* ── State ─────────────────────────────────────────────────────────────── */
let state = {
    query: "",
    colors: [],
    styles: [],
    years: [],
    maxPrice: 50,
    sort: "default"
};

/* ── Stars helper ──────────────────────────────────────────────────────── */
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

/* ── Card renderer ─────────────────────────────────────────────────────── */
function renderCard(product) {
    const card = document.createElement("article");
    card.className = "shop-card";
    card.dataset.productId = product.id;

    card.innerHTML = `
        <div class="shop-card__image-wrap">
            <img src="${product.image}" alt="${product.name}" class="shop-card__image" loading="lazy">
            <span class="shop-card__color-badge shop-card__color-badge--${product.color.toLowerCase()}">${product.color}</span>
        </div>
        <div class="shop-card__body">
            <div class="shop-card__meta">
                <span class="shop-card__year">${product.year}</span>
                <span class="shop-card__sep">·</span>
                <span class="shop-card__style">${product.style}</span>
            </div>
            <h3 class="shop-card__name">${product.name}</h3>
            <p class="shop-card__desc">${product.description}</p>
            ${renderStars(product.rating)}
            <div class="shop-card__footer">
                <span class="shop-card__price">€${product.price.toFixed(2)}</span>
                <div class="shop-card__actions">
                    <button type="button" class="product-button product-button-primary shop-card__add" data-product-id="${product.id}">Add to cart</button>
                    <a href="product.html?id=${product.id}" class="product-button">Details</a>
                </div>
            </div>
        </div>
    `;

    /* Add to cart feedback */
    card.querySelector(".shop-card__add").addEventListener("click", function () {
        this.textContent = "Added ✓";
        this.disabled = true;
        setTimeout(() => {
            this.textContent = "Add to cart";
            this.disabled = false;
        }, 1400);
    });

    return card;
}

/* ── Filter & sort logic ───────────────────────────────────────────────── */
function applyFilters() {
    let result = [...products];

    /* Search */
    if (state.query) {
        const q = state.query.toLowerCase();
        result = result.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.style.toLowerCase().includes(q) ||
            p.color.toLowerCase().includes(q) ||
            String(p.year).includes(q) ||
            p.categories.some(c => c.toLowerCase().includes(q))
        );
    }

    /* Color filter */
    if (state.colors.length) {
        result = result.filter(p => state.colors.includes(p.color));
    }

    /* Style/category filter */
    if (state.styles.length) {
        result = result.filter(p =>
            state.styles.some(s => p.categories.includes(s))
        );
    }

    /* Year filter */
    if (state.years.length) {
        result = result.filter(p => {
            if (state.years.includes("2018") && p.year <= 2018) return true;
            return state.years.includes(String(p.year));
        });
    }

    /* Price filter */
    result = result.filter(p => p.price <= state.maxPrice);

    /* Sort */
    switch (state.sort) {
        case "price-asc":
            result.sort((a, b) => a.price - b.price);
            break;
        case "price-desc":
            result.sort((a, b) => b.price - a.price);
            break;
        case "year-desc":
            result.sort((a, b) => b.year - a.year);
            break;
        case "year-asc":
            result.sort((a, b) => a.year - b.year);
            break;
        case "rating-desc":
            result.sort((a, b) => b.rating - a.rating);
            break;
        case "name-asc":
            result.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            break;
    }

    renderGrid(result);
}

/* ── Render grid ───────────────────────────────────────────────────────── */
function renderGrid(filtered) {
    grid.innerHTML = "";

    if (filtered.length === 0) {
        grid.hidden = true;
        emptyState.hidden = false;
        resultsCount.textContent = "No wines found";
        return;
    }

    grid.hidden = false;
    emptyState.hidden = true;
    const label = filtered.length === 1 ? "wine" : "wines";
    resultsCount.textContent = `Showing ${filtered.length} ${label}`;

    filtered.forEach((p, i) => {
        const card = renderCard(p);
        card.style.animationDelay = `${i * 60}ms`;
        grid.appendChild(card);
    });
}

/* ── Event listeners ───────────────────────────────────────────────────── */

/* Search */
let searchDebounce;
searchInput.addEventListener("input", () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {
        state.query = searchInput.value.trim();
        applyFilters();
    }, 220);
});

/* Sort */
sortSelect.addEventListener("change", () => {
    state.sort = sortSelect.value;
    applyFilters();
});

/* Price slider */
priceSlider.addEventListener("input", () => {
    state.maxPrice = Number(priceSlider.value);
    priceDisplay.textContent = `€${priceSlider.value}`;
    applyFilters();
});

/* Checkboxes */
filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        const name  = checkbox.name;
        const value = checkbox.value;

        if (name === "color") {
            if (checkbox.checked) {
                state.colors.push(value);
            } else {
                state.colors = state.colors.filter(v => v !== value);
            }
        } else if (name === "style") {
            if (checkbox.checked) {
                state.styles.push(value);
            } else {
                state.styles = state.styles.filter(v => v !== value);
            }
        } else if (name === "year") {
            if (checkbox.checked) {
                state.years.push(value);
            } else {
                state.years = state.years.filter(v => v !== value);
            }
        }

        applyFilters();
    });
});

/* Clear all filters */
function clearFilters() {
    state = { query: "", colors: [], styles: [], years: [], maxPrice: 50, sort: state.sort };
    searchInput.value = "";
    priceSlider.value = 50;
    priceDisplay.textContent = "€50";
    filterCheckboxes.forEach(cb => { cb.checked = false; });
    applyFilters();
}

clearAllBtns.forEach(btn => btn.addEventListener("click", clearFilters));

/* ── Initial render ────────────────────────────────────────────────────── */
applyFilters();
