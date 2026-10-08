// Creates a secure Stripe Checkout page for the items in the customer's cart.
// Prices come from js/store-data.js on the server, never from the browser,
// so nobody can change what they pay.
//
// Needs one setting in Netlify: STRIPE_SECRET_KEY (see README).

const Stripe = require("stripe");
const { STORE, PRODUCTS } = require("../../js/store-data.js");

const MAX_QTY = 20;
const MAX_LINES = 50;

function json(statusCode, body) {
  return { statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
}

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });
  if (!process.env.STRIPE_SECRET_KEY) return json(500, { error: "Checkout is not set up yet (missing STRIPE_SECRET_KEY)." });

  let items;
  try {
    items = JSON.parse(event.body || "{}").items;
  } catch (e) {
    return json(400, { error: "Invalid request" });
  }
  if (!Array.isArray(items) || items.length === 0) return json(400, { error: "Your cart is empty." });
  if (items.length > MAX_LINES) return json(400, { error: "Too many items in the cart." });

  const lineItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = PRODUCTS.find((p) => p.id === item.id);
    if (!product) return json(400, { error: "An item in your cart is no longer available." });
    if (!product.options.includes(item.option)) return json(400, { error: `Please choose a valid option for ${product.name}.` });
    const qty = Math.floor(Number(item.qty));
    if (!Number.isFinite(qty) || qty < 1 || qty > MAX_QTY) return json(400, { error: "Invalid quantity." });

    const unitAmount = Math.round(product.price * 100); // Stripe uses cents
    subtotal += product.price * qty;
    lineItems.push({
      quantity: qty,
      price_data: {
        currency: STORE.currency,
        unit_amount: unitAmount,
        product_data: {
          name: `${product.name} — ${product.optionLabel || "Option"}: ${item.option}`,
          metadata: { product_id: product.id, option: item.option }
        }
      }
    });
  }

  const shipping = subtotal >= STORE.freeShippingOver ? 0 : STORE.flatShipping;
  const site = process.env.URL || event.headers.origin || `https://${event.headers.host}`;

  try {
    const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ["US"] },
      phone_number_collection: { enabled: true },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: Math.round(shipping * 100), currency: STORE.currency },
            display_name: shipping === 0 ? "Free shipping" : "Standard shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: parseInt(STORE.shippingDays, 10) || 3 },
              maximum: { unit: "business_day", value: parseInt(String(STORE.shippingDays).split(/[^0-9]+/)[1], 10) || 7 }
            }
          }
        }
      ],
      // Turn this on after you activate Stripe Tax in your Stripe dashboard:
      // automatic_tax: { enabled: true },
      success_url: `${site}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${site}/cart.html`
    });
    return json(200, { url: session.url });
  } catch (err) {
    console.error("Stripe error:", err.message);
    return json(500, { error: "We couldn't start checkout. Please try again." });
  }
};
