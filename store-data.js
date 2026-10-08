/*
  STORE SETTINGS AND PRODUCT CATALOG
  ----------------------------------
  This is the one file you edit to change your store name, prices and products.
  It is used by the website AND by the checkout function, so prices charged at
  checkout always match what this file says (customers cannot change them).

  PRICES BELOW ARE SAMPLES. Replace every price with your real price (in U.S. dollars).

  Product fields:
    id          unique, lowercase, no spaces (used in the page address)
    name        product name shown to customers
    category    "clothing", "shoes" or "herbs"
    who         "Women", "Men", "Kids" or "All"
    price       price in dollars, e.g. 49.99
    options     sizes or package sizes the customer picks from
    optionLabel what the options are called ("Size", "Package")
    image       path to a photo, e.g. "images/ankara-wrap-dress.jpg"
                leave "" to show a colorful pattern until you have a photo
    pattern     pattern shown when there is no photo: "weave", "kente", "dots", "leaf"
    featured    true to show it on the home page
    description short paragraph for the product page
    details     list of short facts (fabric, care, how to use)
*/

var STORE = {
  name: "Kola House",
  tagline: "African clothing, shoes and herbs.",
  email: "hello@example.com",           // your customer service email
  currency: "usd",
  flatShipping: 8.00,                    // shipping charge for orders under the free-shipping amount
  freeShippingOver: 75.00,               // orders at or above this ship free
  shippingDays: "3–7",                   // shown on the site
  returnDays: 30,                        // returns window for clothing and shoes
  social: {
    instagram: "https://instagram.com/",
    facebook: "https://facebook.com/",
    tiktok: "https://tiktok.com/"
  }
};

var PRODUCTS = [
  // ---------- CLOTHING ----------
  {
    id: "ankara-wrap-dress", name: "Ankara Wrap Dress", category: "clothing", who: "Women",
    price: 68.00, optionLabel: "Size", options: ["XS", "S", "M", "L", "XL", "2XL"],
    image: "", pattern: "weave", featured: true,
    description: "A flattering wrap dress in bold Ankara wax print. Ties at the waist and falls just below the knee — easy to dress up for a wedding or down for Sunday lunch.",
    details: ["100% cotton wax print", "Adjustable wrap tie", "Machine wash cold, hang to dry"]
  },
  {
    id: "embroidered-kaftan-set", name: "Embroidered Kaftan Set", category: "clothing", who: "Men",
    price: 95.00, optionLabel: "Size", options: ["S", "M", "L", "XL", "2XL", "3XL"],
    image: "", pattern: "kente", featured: true,
    description: "A two-piece kaftan set with hand-finished embroidery at the neckline. Matching trousers with an elastic, drawstring waist.",
    details: ["Top and trousers included", "Cotton blend", "Dry clean or hand wash"]
  },
  {
    id: "print-dashiki-shirt", name: "Print Dashiki Shirt", category: "clothing", who: "Men",
    price: 42.00, optionLabel: "Size", options: ["S", "M", "L", "XL", "2XL"],
    image: "", pattern: "dots", featured: true,
    description: "A classic dashiki with a bold printed panel. Relaxed fit that looks just as good with jeans as with matching trousers.",
    details: ["100% cotton", "Relaxed fit", "Machine wash cold"]
  },
  {
    id: "kente-trim-maxi-skirt", name: "Kente-Trim Maxi Skirt", category: "clothing", who: "Women",
    price: 55.00, optionLabel: "Size", options: ["XS", "S", "M", "L", "XL", "2XL"],
    image: "", pattern: "kente", featured: false,
    description: "A flowing maxi skirt finished with a woven kente-style hem. Elastic waist and side pockets.",
    details: ["Elastic waist", "Side pockets", "Hand wash cold"]
  },
  {
    id: "kids-ankara-set", name: "Kids' Ankara Set", category: "clothing", who: "Kids",
    price: 38.00, optionLabel: "Size", options: ["2T", "3T", "4T", "5", "6", "8", "10"],
    image: "", pattern: "dots", featured: true,
    description: "A matching top and bottom set in bright Ankara print — perfect for family photos, church and celebrations.",
    details: ["Top and bottom included", "Soft cotton", "Machine wash cold"]
  },
  {
    id: "family-print-headwrap", name: "Ankara Headwrap", category: "clothing", who: "All",
    price: 22.00, optionLabel: "Style", options: ["One size"],
    image: "", pattern: "weave", featured: false,
    description: "A long, generous headwrap in Ankara print. Tie it as a gele, turban or bow.",
    details: ["About 70 × 22 inches", "100% cotton", "Hand wash"]
  },

  // ---------- SHOES ----------
  {
    id: "beaded-leather-slides", name: "Beaded Leather Slides", category: "shoes", who: "Women",
    price: 48.00, optionLabel: "Size", options: ["6", "7", "8", "9", "10", "11"],
    image: "", pattern: "leaf", featured: true,
    description: "Leather slides topped with hand-beaded straps. Cushioned footbed for all-day wear.",
    details: ["Genuine leather upper", "Hand-beaded strap", "True to size"]
  },
  {
    id: "print-lined-loafers", name: "Print-Lined Loafers", category: "shoes", who: "Men",
    price: 85.00, optionLabel: "Size", options: ["8", "9", "10", "11", "12", "13"],
    image: "", pattern: "weave", featured: true,
    description: "Smooth leather loafers with an Ankara-print lining that shows with every step.",
    details: ["Leather upper", "Print fabric lining", "Rubber sole"]
  },
  {
    id: "kids-print-sandals", name: "Kids' Print Sandals", category: "shoes", who: "Kids",
    price: 28.00, optionLabel: "Size", options: ["9", "10", "11", "12", "13", "1", "2"],
    image: "", pattern: "leaf", featured: false,
    description: "Comfortable sandals with an adjustable strap wrapped in colorful print fabric.",
    details: ["Adjustable hook-and-loop strap", "Non-slip sole"]
  },

  // ---------- HERBS ----------
  // Keep herb descriptions about cooking, flavor and tradition. Do not claim an
  // herb treats, cures or prevents any illness (U.S. FDA rules).
  {
    id: "bitter-leaf", name: "Bitter Leaf", category: "herbs", who: "All",
    price: 12.00, optionLabel: "Package", options: ["2 oz", "4 oz", "8 oz"],
    image: "", pattern: "leaf", featured: true,
    description: "Dried, washed bitter leaf, ready for ofe onugbu (bitter leaf soup), egusi and other soups. Soak, rinse and add to the pot.",
    details: ["Dried, washed leaves", "Soak 10–15 minutes before cooking", "Store sealed in a cool, dry place"]
  },
  {
    id: "moringa-powder", name: "Moringa Leaf Powder", category: "herbs", who: "All",
    price: 14.00, optionLabel: "Package", options: ["4 oz", "8 oz", "16 oz"],
    image: "", pattern: "leaf", featured: true,
    description: "Finely ground dried moringa leaves with an earthy, green flavor. Stir into soups, stews, smoothies or a warm cup of tea.",
    details: ["100% moringa leaf", "Fine powder", "Store sealed, away from light"]
  },
  {
    id: "hibiscus-sorrel", name: "Hibiscus (Sorrel)", category: "herbs", who: "All",
    price: 10.00, optionLabel: "Package", options: ["4 oz", "8 oz", "16 oz"],
    image: "", pattern: "dots", featured: true,
    description: "Deep red dried hibiscus calyces for sobolo, bissap and holiday sorrel drink. Tart, bright and beautiful in the glass.",
    details: ["Whole dried calyces", "Steep with ginger and spices", "Store sealed in a cool, dry place"]
  },
  {
    id: "alligator-pepper", name: "Alligator Pepper", category: "herbs", who: "All",
    price: 11.00, optionLabel: "Package", options: ["3 pods", "6 pods", "12 pods"],
    image: "", pattern: "weave", featured: true,
    description: "Whole alligator pepper (grains of paradise) pods. Peppery and aromatic — grind the seeds for pepper soup and spice blends.",
    details: ["Whole pods", "Crack open and grind seeds as needed", "Keeps well sealed"]
  }
];

// Lets the checkout function (Node.js) read this same file.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { STORE: STORE, PRODUCTS: PRODUCTS };
}
