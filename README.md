# Kola House — online store

A complete website for selling African clothing, shoes and herbs, with a shopping cart and secure card checkout through Stripe. It runs on Netlify, which has a free plan.

## What's included

| Page | File |
|---|---|
| Home | `index.html` |
| Shop (filter by Clothing / Shoes / Herbs and Women / Men / Kids) | `shop.html` |
| Product page (choose size or package, add to cart) | `product.html` |
| Cart and checkout | `cart.html` |
| Order confirmation | `success.html` |
| Our story | `about.html` |
| Contact form | `contact.html` |
| Shipping, returns and size guide | `shipping.html` |
| Privacy policy | `privacy.html` |

Behind the scenes:
- `js/store-data.js` — **your store name, prices, shipping and products. This is the main file you edit.**
- `js/app.js` — how the pages, cart and checkout button work.
- `css/styles.css` — colors, fonts and layout.
- `netlify/functions/create-checkout.js` — talks to Stripe to take payment.

---

## Step 1: Make it yours

Open `js/store-data.js` in any text editor (Notepad, TextEdit, or the free VS Code).

1. **Store name** — change `name: "Kola House"`. It updates on every page automatically. (Also change "Kola House" in each page's `<title>` line at the top of each `.html` file if you want the browser tab to match.)
2. **Email** — change `email:` to your real customer service email.
3. **Shipping** — set `flatShipping`, `freeShippingOver`, `shippingDays` and `returnDays`.
4. **Prices** — every price in the file is a **sample**. Replace each one with your real price.
5. **Products** — edit, delete or copy a product block to add a new one. Each needs its own `id` (lowercase, dashes, no spaces).

## Step 2: Add photos

1. Put your photos in the `images` folder. Use simple names like `ankara-wrap-dress.jpg`.
2. In `js/store-data.js`, set that product's `image: "images/ankara-wrap-dress.jpg"`.
3. Until a product has a photo, it shows a colorful pattern instead.

Tips: take photos in daylight against a plain wall, use the same shape for every photo (portrait, about 4:5), and keep files under 500 KB (squoosh.app shrinks them for free).

To use photos on the home page and Our story page, see the notes inside `index.html` and `about.html`.

## Step 3: Fill in your words

Search the `.html` files for square brackets like `[Tell customers who you are…]` and replace them with your own text. The most important ones:
- Our story (home page and `about.html`)
- Size guide and return shipping (`shipping.html`)
- Privacy policy date (`privacy.html`)

## Step 4: Set up payments (Stripe)

1. Create a free account at **stripe.com** and complete the business details so you can get paid to your bank account.
2. In the Stripe dashboard, go to **Developers → API keys** and copy the **Secret key**.
   - Start with the **test** key (begins with `sk_test_`) so you can try fake orders first.
3. Turn on Apple Pay / Google Pay in **Settings → Payment methods** if you'd like.

Stripe charges a small fee per sale (check their pricing page). There's no monthly fee.

## Step 5: Put the site online (Netlify)

1. Create a free account at **netlify.com**.
2. Easiest way: put this folder on GitHub, then in Netlify choose **Add new site → Import an existing project** and pick it. (Drag-and-drop uploads don't install the checkout function, so use GitHub.)
3. In Netlify, go to **Site configuration → Environment variables** and add:
   - Key: `STRIPE_SECRET_KEY`
   - Value: the secret key from Stripe
4. Redeploy the site. Your store is live at an address like `your-store.netlify.app`.
5. Optional: connect your own domain (like `kolahouse.com`) in **Domain management**.

## Step 6: Test, then go live

1. With the **test** key, add items to the cart and check out using Stripe's test card `4242 4242 4242 4242`, any future date and any 3 digits.
2. Check the order appears in Stripe under **Payments**.
3. When everything works, replace the test key in Netlify with your **live** key (begins with `sk_live_`) and redeploy.

## Where to see orders and messages

- **Orders:** Stripe dashboard → Payments. Each order shows the items, sizes, customer's shipping address and phone. Turn on email notifications for new payments in Stripe settings.
- **Contact messages and newsletter signups:** Netlify → your site → **Forms**. Set up email notifications there so new messages come to your inbox.

---

## Important before you launch

**Herbs and health claims.** In the U.S., herbs sold as food can't be advertised as treating, curing or preventing illness. The site's herb descriptions talk about cooking, flavor and tradition, and include the standard disclaimer. Keep any new descriptions the same way.

**Selling herbs and food.** Check whether your state or city requires a license to sell packaged food or herbs, and label packages with the name, net weight and your business name and address. If you import herbs, they must clear FDA and USDA import rules.

**Sales tax.** You may need to collect sales tax. Stripe Tax can calculate it at checkout: turn it on in your Stripe dashboard, then remove the `//` in front of `automatic_tax` in `netlify/functions/create-checkout.js`.

**Business basics.** Register your business name in your state, and keep the privacy policy and return policy up to date.

## Trying it on your computer

You can open `index.html` in a browser to see the site and use the cart. Checkout only works once the site is on Netlify (or by running `npm install` and `npx netlify dev` if you're comfortable with the command line).
