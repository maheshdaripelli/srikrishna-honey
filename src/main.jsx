import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Leaf,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  PackageCheck,
  Plus,
  ShoppingBag,
  Truck,
  X,
} from "lucide-react";
import "./styles.css";
import "./3d-effects.css";
import "./brand.css";
import logoImage from "./assets/logo.png";
import smallBeeImage from "./assets/small-bee-1000g.png";
import halfSmallBeeImage from "./assets/small-bee-500g.png";
import bigBeeImagefull from "./assets/big-bee-1000g.png";
import bigBeeImageHalf from "./assets/big-bee-500g.png";
import wildForestImageFull from "./assets/forest-1000g.png";
import wildForestImageHalf from "./assets/forest-500g.png";

const WA = "916281450596";
const products = [
  {
    id: "small-bee-500g",
    name: "Small Bee Honey",
    desc: "A lovely golden choice for everyday sweetness.",
    tag: "NATURE'S PICK",
    size: "500 g",
    price: 399,
    img: halfSmallBeeImage,
  },
  {
    id: "wild-forest-500g",
    name: "Wild Forest Honey",
    desc: "A distinctive honey inspired by the forest.",
    tag: "WILD FOREST",
    size: "500 g",
    price: 549,
    img: wildForestImageHalf,
  },
  {
    id: "big-bee-500g",
    name: "Big Bee Honey",
    desc: "A smooth, versatile honey for your kitchen.",
    tag: "EVERYDAY FAVOURITE",
    size: "500 g",
    price: 299,
    img: bigBeeImageHalf,
  },
  {
    id: "wild-forest-1kg",
    name: "Wild Forest Honey",
    desc: "A distinctive honey inspired by the forest.",
    tag: "WILD FOREST",
    size: "1 kg",
    price: 999,
    img: wildForestImageFull,
  },
  {
    id: "big-bee-1kg",
    name: "Big Bee Honey",
    desc: "A smooth, versatile honey for your kitchen.",
    tag: "EVERYDAY FAVOURITE",
    size: "1 kg",
    price: 599,
    img: bigBeeImagefull,
  },
  {
    id: "small-bee-1kg",
    name: "Small Bee Honey",
    desc: "A lovely golden choice for everyday sweetness.",
    tag: "NATURE'S PICK",
    size: "1 kg",
    price: 799,
    img: smallBeeImage,
  },
];
const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
function Brand() {
  return (
    <a className="brand" href="#home" aria-label="Sri Krishna Honey home">
      <img className="brand-icon" src={logoImage} alt="" />
      <span>
        <b>Sri Krishna</b>
        <small>H O N E Y</small>
      </span>
    </a>
  );
}
function App() {
  const [cart, setCart] = useState([]),
    [flyingBees, setFlyingBees] = useState([]),
    [cartPulse, setCartPulse] = useState(false),
    [drawer, setDrawer] = useState(false),
    [menu, setMenu] = useState(false),
    [toast, setToast] = useState(""),
    [address, setAddress] = useState(""),
    [phone, setPhone] = useState(""),
    [formError, setFormError] = useState("");
  const cartButtonRef = useRef(null);
  const beeSequence = useRef(0);
  const cartPulseTimer = useRef(null);
  const count = cart.reduce((n, i) => n + i.qty, 0);
  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const msg = useMemo(
    () =>
      cart.length
        ? `Hello Sri Krishna Honey! I would like to place an order.

CUSTOMER DETAILS
Phone: ${phone.trim()}
Delivery address: ${address.trim()}

ORDER DETAILS
${cart.map((i) => `• ${i.name} — ${i.size} × ${i.qty} = ${money(i.price * i.qty)}`).join("\n")}

Subtotal: ${money(subtotal)}
Delivery charges: Please confirm based on my delivery location.

Please confirm availability, final delivery charges and the final payable amount before dispatch.`
        : "Hello Sri Krishna Honey! I'd like to enquire about your honey.",
    [cart, phone, address, subtotal],
  );
  useEffect(
    () => () => {
      window.clearTimeout(cartPulseTimer.current);
    },
    [],
  );
  function flyBee(source) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const productImage = source
        .closest(".product")
        ?.querySelector(".product-img img"),
      cartButton = cartButtonRef.current;
    if (!productImage || !cartButton) return;
    const from = productImage.getBoundingClientRect(),
      to = cartButton.getBoundingClientRect(),
      x = from.left + from.width / 2,
      y = from.top + from.height / 2;
    setFlyingBees((current) => [
      ...current,
      {
        id: beeSequence.current++,
        x,
        y,
        deltaX: to.left + to.width / 2 - x,
        deltaY: to.top + to.height / 2 - y,
      },
    ]);
  }
  function finishBee(id) {
    setFlyingBees((current) => current.filter((bee) => bee.id !== id));
    setCartPulse(true);
    window.clearTimeout(cartPulseTimer.current);
    cartPulseTimer.current = window.setTimeout(() => setCartPulse(false), 500);
  }
  function wa(message) {
    window.open(
      `https://wa.me/${WA}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }
  function placeOrder() {
    const digits = phone.replace(/\D/g, "");
    if (!address.trim()) {
      setFormError(
        "Please enter your complete delivery address to place your order.",
      );
      return;
    }
    if (!phone.trim()) {
      setFormError(
        "Please enter your contact number so we can coordinate your delivery.",
      );
      return;
    }
    if (digits.length < 10 || digits.length > 13) {
      setFormError("Please enter a valid phone number with 10 digits.");
      return;
    }
    if (!cart.length) {
      setFormError(
        "Please add at least one product to your basket before placing an order.",
      );
      return;
    }
    setFormError("");
    wa(msg);
  }
  function add(p, event) {
    flyBee(event.currentTarget);
    const key = p.id,
      qtyToAdd = 1;
    setCart((old) => {
      const f = old.find((i) => i.key === key);
      return f
        ? old.map((i) => (i.key === key ? { ...i, qty: i.qty + qtyToAdd } : i))
        : [
            ...old,
            {
              key,
              id: p.id,
              name: p.name,
              size: p.size,
              price: p.price,
              qty: qtyToAdd,
            },
          ];
    });
    setToast(`${qtyToAdd} × ${p.name} added to cart`);
    setTimeout(() => setToast(""), 2200);
  }
  function qty(key, d) {
    setCart((old) =>
      old
        .map((i) => (i.key === key ? { ...i, qty: i.qty + d } : i))
        .filter((i) => i.qty > 0),
    );
  }
  return (
    <div id="home">
      <div className="topline">
        <img className="brand-mark topline-mark" src={logoImage} alt="" />A
        little golden goodness, delivered across India
      </div>
      <header>
        <div className="wrap nav">
          <Brand />
          <button
            className="mobile"
            aria-label="Toggle navigation"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
          <nav className={menu ? "open" : ""}>
            <a href="#story" onClick={() => setMenu(false)}>
              Our Story
            </a>
            <a href="#collection" onClick={() => setMenu(false)}>
              Our Honey
            </a>
            <a href="#delivery" onClick={() => setMenu(false)}>
              Delivery
            </a>
            <a href="#contact" onClick={() => setMenu(false)}>
              Contact
            </a>
          </nav>
          <div className="nav-buttons">
            <button
              ref={cartButtonRef}
              className={`basket${cartPulse ? " cart-arrival" : ""}`}
              onClick={() => setDrawer(true)}
            >
              <span className="basket-icon">
                <ShoppingBag size={18} />
                {count > 0 && (
                  <span className="basket-orbit" aria-hidden="true">
                    {Array.from({ length: 4 }, (_, index) => (
                      <span
                        key={index}
                        className="orbit-bee"
                        style={{ "--bee-delay": `${index * -1.7}s` }}
                      >
                        <svg
                          className="bee-3d"
                          viewBox="0 0 48 36"
                          role="presentation"
                        >
                          <defs>
                            <radialGradient
                              id={`bee-abdomen-${index}`}
                              cx="35%"
                              cy="28%"
                            >
                              <stop offset="0" stopColor="#ffe99a" />
                              <stop offset=".48" stopColor="#e9a92e" />
                              <stop offset="1" stopColor="#875019" />
                            </radialGradient>
                            <radialGradient
                              id={`bee-thorax-${index}`}
                              cx="32%"
                              cy="26%"
                            >
                              <stop offset="0" stopColor="#8b6440" />
                              <stop offset=".5" stopColor="#38251a" />
                              <stop offset="1" stopColor="#100d0b" />
                            </radialGradient>
                            <radialGradient
                              id={`bee-wing-${index}`}
                              cx="30%"
                              cy="20%"
                            >
                              <stop
                                offset="0"
                                stopColor="#fff"
                                stopOpacity=".96"
                              />
                              <stop
                                offset=".7"
                                stopColor="#d8f1ee"
                                stopOpacity=".74"
                              />
                              <stop
                                offset="1"
                                stopColor="#9cc5c2"
                                stopOpacity=".34"
                              />
                            </radialGradient>
                          </defs>
                          <g className="bee-wings">
                            <path
                              className="bee-wing bee-wing-back"
                              d="M22 17C17 8 12 3 8 5c-4 2-1 9 8 15 2 1 4 0 6-3Z"
                              fill={`url(#bee-wing-${index})`}
                              stroke="#9bbdba"
                              strokeWidth=".7"
                            />
                            <path
                              className="bee-wing bee-wing-front"
                              d="M24 17C23 8 25 2 30 2c5 0 7 6 2 14-2 3-5 4-8 3Z"
                              fill={`url(#bee-wing-${index})`}
                              stroke="#a9c8c5"
                              strokeWidth=".7"
                            />
                            <path
                              d="M22 17 10 7m13 11 8-14"
                              fill="none"
                              stroke="#fff"
                              strokeOpacity=".7"
                              strokeWidth=".45"
                            />
                          </g>
                          <g
                            fill="none"
                            stroke="#241a13"
                            strokeLinecap="round"
                            strokeWidth="1.25"
                          >
                            <path d="m22 22-4 6m8-6-1 7m4-8 3 6" />
                            <path
                              d="M34 12c2-4 4-5 6-4m-5 5c3-2 5-2 7-1"
                              strokeWidth=".8"
                            />
                          </g>
                          <path
                            d="M17 16c3-5 12-6 18-2 5 4 5 10 0 13-6 3-16 0-19-5-1-2 0-4 1-6Z"
                            fill={`url(#bee-abdomen-${index})`}
                            stroke="#664017"
                            strokeWidth=".9"
                          />
                          <path
                            d="M22 14c2 3 2 9 0 12m6-13c2 4 2 9 0 13"
                            fill="none"
                            stroke="#302017"
                            strokeWidth="2.6"
                          />
                          <path
                            d="M22 14c2 3 2 9 0 12m6-13c2 4 2 9 0 13"
                            fill="none"
                            stroke="#17110d"
                            strokeWidth="1.25"
                          />
                          <ellipse
                            cx="22"
                            cy="17"
                            rx="5"
                            ry="5.5"
                            fill={`url(#bee-thorax-${index})`}
                          />
                          <circle
                            cx="34"
                            cy="15"
                            r="4.3"
                            fill={`url(#bee-thorax-${index})`}
                          />
                          <circle cx="35.5" cy="14" r=".75" fill="#fff" />
                          <circle cx="35.7" cy="14.1" r=".35" fill="#17100c" />
                          <path
                            d="M19 15c5-3 12-3 16-1"
                            fill="none"
                            stroke="#fff3c4"
                            strokeOpacity=".45"
                            strokeWidth=".8"
                          />
                        </svg>
                      </span>
                    ))}
                  </span>
                )}
              </span>{" "}
              <span>Cart</span> <b>{count}</b>
            </button>
            <button
              className="nav-cta"
              onClick={() =>
                wa(
                  "Hello Sri Krishna Honey! I'd like to enquire about your honey.",
                )
              }
            >
              Order on WhatsApp <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </header>
      <main>
        <section className="hero">
          <div className="wrap hero-grid">
            <div className="hero-copy">
              <div className="eyebrow">FROM NATURE, WITH CARE</div>
              <h1>
                A little jar of
                <br />
                <em>golden goodness.</em>
              </h1>
              <p>
                Bring a little sweetness to your everyday rituals — from morning
                tea to breakfast, sharing, and thoughtful gifting.
              </p>
              <div className="actions">
                <a className="btn dark" href="#collection">
                  Explore our honey <ArrowRight size={17} />
                </a>
                <button
                  className="btn outline"
                  onClick={() =>
                    wa(
                      "Hello Sri Krishna Honey! Please tell me about your honey.",
                    )
                  }
                >
                  Chat with us <MessageCircle size={16} />
                </button>
              </div>
              <div className="hero-note">
                <span>
                  <Truck size={19} />
                </span>
                <div>
                  <b>Home delivery across India</b>
                  <small>Ask us to confirm delivery to your pincode</small>
                </div>
              </div>
            </div>
            <div className="hero-art">
              <img
                src="https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=1400&q=90"
                alt="Golden honey and honeycomb in warm natural light"
              />
              <div className="photo-seal">
                PURE{" "}
                <img className="brand-mark seal-mark" src={logoImage} alt="" />{" "}
                NATURAL
              </div>
              <div className="float-card">
                <img className="brand-mark" src={logoImage} alt="" />
                <div>
                  <small>THE SIMPLE THINGS</small>
                  <b>Nature's golden gift</b>
                </div>
              </div>
            </div>
          </div>
          <div className="wrap hero-foot">
            <span>SMALL MOMENTS. SWEET MEMORIES.</span>
            <i></i>
            <span>MADE FOR YOUR EVERYDAY TABLE</span>
          </div>
        </section>
        <section className="trust">
          <div className="wrap trust-grid">
            <div>
              <Leaf />
              <span>
                <b>Nature inspired</b>
                <small>For everyday use</small>
              </span>
            </div>
            <div>
              <PackageCheck />
              <span>
                <b>Carefully packed</b>
                <small>Handled with care</small>
              </span>
            </div>
            <div>
              <Truck />
              <span>
                <b>India-wide delivery</b>
                <small>Ask about your location</small>
              </span>
            </div>
            <div>
              <MessageCircle />
              <span>
                <b>Friendly support</b>
                <small>Order directly with us</small>
              </span>
            </div>
          </div>
        </section>
        <section className="section collection" id="collection">
          <div className="wrap">
            <div className="section-head">
              <div>
                <div className="eyebrow">THE HONEY SHELF</div>
                <h2>
                  Find your <em>favourite.</em>
                </h2>
              </div>
              <p>
                Choose a jar for your kitchen, your loved ones, or your next
                slow morning.
              </p>
            </div>
            <div className="products">
              {products.map((p) => {
                const quantity =
                  cart.find((item) => item.key === p.id)?.qty || 0;
                const displayQuantity = quantity || 1;
                return (
                  <article className="product" key={p.id}>
                    <div className="product-img">
                      <img src={p.img} alt={p.name} loading="lazy" />
                      <span>{p.tag}</span>
                    </div>
                    <div className="product-body">
                      <h3>{p.name}</h3>
                      <p>{p.desc}</p>
                      <small>PACK SIZE · {p.size.toUpperCase()}</small>
                      <div className="buyrow">
                        {quantity === 0 ? (
                          <button
                            type="button"
                            className="add-button"
                            onClick={(event) => add(p, event)}
                          >
                            <Plus size={15} /> Add
                          </button>
                        ) : (
                          <div
                            className="add-quantity-control"
                            aria-label={`Quantity of ${p.name}, ${p.size}`}
                          >
                            <button
                              type="button"
                              aria-label={"Remove one " + p.name}
                              onClick={() => qty(p.id, -1)}
                            >
                              <Minus size={15} />
                            </button>
                            <span aria-live="polite">
                              {quantity} {quantity === 1 ? "jar" : "jars"}
                            </span>
                            <button
                              type="button"
                              aria-label={"Add one " + p.name}
                              disabled={quantity >= 10}
                              onClick={(event) => {
                                flyBee(event.currentTarget);
                                qty(p.id, 1);
                              }}
                            >
                              <Plus size={15} />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="price">
                        <span className="price-label">
                          TOTAL FOR {displayQuantity}{" "}
                          {displayQuantity === 1 ? "JAR" : "JARS"}
                        </span>
                        <strong>{money(p.price * displayQuantity)}</strong>
                        <span className="price-note">
                          {money(p.price)} per {p.size} jar · delivery confirmed
                          separately
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="note">
              ⓘ &nbsp; Delivery charges are calculated based on your delivery
              location and will be confirmed with you on WhatsApp before your
              order is finalised.
            </div>
          </div>
        </section>
        <section className="story" id="story">
          <div className="wrap story-grid">
            <div className="story-img">
              <img
                src="https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=1200&q=85"
                alt="Honeycomb and honey dipper"
                loading="lazy"
              />
              <div>A taste of the natural world</div>
            </div>
            <div>
              <div className="eyebrow">A LITTLE ABOUT US</div>
              <h2>
                Sweetness that
                <br />
                <em>brings us together.</em>
              </h2>
              <p>
                Sri Krishna Honey is a small business built around a simple
                idea: make it easy to bring honey into the everyday moments that
                matter. From our home base in Hyderabad, we help customers
                discover our honey and arrange delivery across India.
              </p>
              <p>
                Questions about the honey, packing, or delivery to your area? We
                would love to hear from you before you order.
              </p>
              <a className="textlink" href="#contact">
                Get in touch <ArrowUpRight size={17} />
              </a>
              <div className="signature">
                <img className="brand-mark" src={logoImage} alt="" />
                <b>
                  Sri Krishna Honey<small>PURE · NATURAL · EVERYDAY</small>
                </b>
              </div>
            </div>
          </div>
        </section>
        <section className="quote">
          <img className="brand-mark" src={logoImage} alt="" />
          <p>“The sweetest things in life are often the simplest.”</p>
          <small>BRING A LITTLE GOLDEN GOODNESS HOME</small>
        </section>
        <section className="section delivery" id="delivery">
          <div className="wrap delivery-grid">
            <div>
              <div className="eyebrow">FROM OUR DOOR TO YOURS</div>
              <h2>
                Good things travel.
                <br />
                <em>So does our honey.</em>
              </h2>
              <p>
                Based in Hyderabad, we welcome enquiries from across India.
                Message us with your preferred jar size and delivery pincode;
                we’ll confirm availability, price and shipping before you pay.
              </p>
              <button
                className="btn dark"
                onClick={() =>
                  wa(
                    "Hello Sri Krishna Honey! Please check delivery to my pincode and share available sizes, prices and shipping charges.",
                  )
                }
              >
                Check delivery options <ArrowRight size={17} />
              </button>
            </div>
            <div className="delivery-card">
              <div className="delivery-top">
                <Truck />
                <span>INDIA-WIDE</span>
              </div>
              <h3>
                Home delivery
                <br />
                across India
              </h3>
              <p>
                Tell us where you’d like your honey delivered. We’ll help you
                with the next steps.
              </p>
              <div className="address">
                <MapPin size={17} /> Raghavendra Colony, Hyderabad, Telangana
              </div>
              <img className="watermark" src={logoImage} alt="" />
            </div>
          </div>
        </section>
        <section className="contact" id="contact">
          <div className="wrap contact-grid">
            <div>
              <div className="eyebrow light">SAY HELLO</div>
              <h2>
                Let's make your
                <br />
                <em>day a little sweeter.</em>
              </h2>
              <p>
                Questions, bulk enquiries, or ready to order? Get in touch with
                Sri Krishna Honey.
              </p>
            </div>
            <div className="contacts">
              <a href={`https://wa.me/${WA}`} target="_blank" rel="noreferrer">
                <MessageCircle />
                <span>
                  <small>CALL / WHATSAPP</small>
                  <b>+91 6281450596</b>
                </span>
                <ArrowRight />
              </a>
              <a href="tel:+919441496863">
                <span className="contact-icon">☎</span>
                <span>
                  <small>ALTERNATE CONTACT</small>
                  <b>+91 9441496863</b>
                </span>
                <ArrowRight />
              </a>
              <div className="contact-row">
                <MapPin />
                <span>
                  <small>OUR LOCATION</small>
                  <b>
                    Raghavendra Colony
                    <br />
                    Hyderabad, Telangana, India
                  </b>
                </span>
              </div>
              <button
                className="btn gold"
                onClick={() =>
                  wa(
                    "Hello Sri Krishna Honey! I'd like to enquire about your honey.",
                  )
                }
              >
                Start a WhatsApp conversation <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <div className="wrap footer-top">
          <Brand />
          <p>A little jar of golden goodness.</p>
          <div>
            <a href="#story">Our Story</a>
            <a href="#collection">Our Honey</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
        <div className="wrap footer-bottom">
          <span>© {new Date().getFullYear()} Sri Krishna Honey</span>
          <span>Made with care in Hyderabad, India</span>
          <a href="#home">Back to top ↑</a>
        </div>
      </footer>
      <a
        className="float-wa"
        href={`https://wa.me/${WA}?text=${encodeURIComponent("Hello Sri Krishna Honey! I'd like to enquire about your honey.")}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Sri Krishna Honey on WhatsApp"
      >
        <MessageCircle /> <span>Chat with us</span>
      </a>
      {toast && (
        <div className="toast" role="status">
          <Check size={17} />
          {toast}
        </div>
      )}
      {drawer && (
        <div
          className="overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setDrawer(false);
          }}
        >
          <aside
            className="drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="basket-title"
          >
            <div className="drawer-head">
              <div>
                <small>YOUR SELECTION</small>
                <h2 id="basket-title">Your basket ({count})</h2>
              </div>
              <button
                aria-label="Close basket"
                onClick={() => setDrawer(false)}
              >
                <X />
              </button>
            </div>
            {!cart.length ? (
              <div className="empty">
                <ShoppingBag />
                <h3>Your basket is waiting.</h3>
                <p>
                  Add a few favourites and we’ll help you complete your order.
                </p>
                <button
                  className="btn dark"
                  onClick={() => {
                    setDrawer(false);
                    document
                      .getElementById("collection")
                      .scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Explore honey <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((i) => (
                    <div className="cart-item" key={i.key}>
                      <img className="cart-art" src={logoImage} alt="" />
                      <div className="cart-info">
                        <b>{i.name}</b>
                        <small>
                          {i.size} · {money(i.price)} each
                        </small>
                        <strong className="cart-line-total">
                          {money(i.price * i.qty)}
                        </strong>
                        <div className="qty">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() => qty(i.key, -1)}
                          >
                            <Minus size={13} />
                          </button>
                          {i.qty}
                          <button
                            aria-label="Increase quantity"
                            onClick={() => qty(i.key, 1)}
                          >
                            <Plus size={13} />
                          </button>
                        </div>
                      </div>
                      <button
                        className="remove"
                        aria-label={"Remove " + i.name}
                        onClick={() =>
                          setCart((c) => c.filter((x) => x.key !== i.key))
                        }
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cart-bottom">
                  <div className="cart-subtotal">
                    <span>Subtotal</span>
                    <b>{money(subtotal)}</b>
                  </div>
                  <p className="delivery-message">
                    <Truck size={16} /> Delivery charges depend on your delivery
                    location. We’ll confirm the shipping fee with you on
                    WhatsApp before finalising your order.
                  </p>
                  <div className="checkout-fields">
                    <label htmlFor="delivery-address">
                      Complete delivery address <span>*</span>
                    </label>
                    <textarea
                      id="delivery-address"
                      rows="3"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (formError) setFormError("");
                      }}
                      placeholder="House / flat, street, area, city, state and PIN code"
                      autoComplete="street-address"
                    />
                    <label htmlFor="delivery-phone">
                      Contact phone number <span>*</span>
                    </label>
                    <input
                      id="delivery-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (formError) setFormError("");
                      }}
                      placeholder="e.g. 98765 43210"
                      autoComplete="tel"
                      inputMode="tel"
                    />
                    {formError && (
                      <div className="form-error" role="alert">
                        {formError}
                      </div>
                    )}
                  </div>
                  <button className="btn dark full" onClick={placeOrder}>
                    Place order on WhatsApp <ArrowRight size={17} />
                  </button>
                  <button className="continue" onClick={() => setDrawer(false)}>
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
      {flyingBees.map((bee) => (
        <span
          key={bee.id}
          className="flying-bee"
          aria-hidden="true"
          onAnimationEnd={() => finishBee(bee.id)}
          style={{
            left: `${bee.x}px`,
            top: `${bee.y}px`,
            "--fly-x": `${bee.deltaX}px`,
            "--fly-y": `${bee.deltaY}px`,
            "--fly-mid-x": `${bee.deltaX * 0.48}px`,
            "--fly-mid-y": `${bee.deltaY * 0.48 - 80}px`,
          }}
        >
          🐝
        </span>
      ))}
    </div>
  );
}
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
