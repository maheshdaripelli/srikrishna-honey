# Sri Krishna Honey — WhatsApp Ordering Website

A React + Vite storefront for Sri Krishna Honey with a product catalogue, basket, delivery-address and phone-number collection, and WhatsApp order handoff. No payment gateway or backend is required for this WhatsApp-first version.

## Products and prices

| Product | 1 kg | 500 g |
|---|---:|---:|
| Small Bee Honey | ₹799 | ₹399 |
| Big Bee Honey | ₹599 | ₹299 |
| Wild Forest Honey | ₹999 | ₹549 |

## WhatsApp ordering

Orders are sent to the business WhatsApp number configured in `src/main.jsx` (`WA`). Before opening WhatsApp, the basket requires a delivery address and a valid contact phone number. The generated message includes the customer's details, items, quantities, product subtotal, and a note asking the business to confirm delivery charges.

Delivery charges are intentionally not fixed in the website. Customers are told that the shipping fee depends on their delivery location and will be confirmed on WhatsApp before the order is finalised.

## Run locally

Requires Node.js 18 or later.

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

Deploy the generated `dist/` directory to a static hosting provider that permits the intended business use. Configure the WhatsApp number in `src/main.jsx` if the business contact number changes.

## Notes

- This is a WhatsApp-order storefront, not a backend e-commerce system. Cart contents and form fields are held in browser memory; refresh clears them.
- No online payment is collected by the website. Payment and final delivery charges should be confirmed directly with the customer.
- Product descriptions and imagery can be updated to match the actual honey sourcing and packaging.
