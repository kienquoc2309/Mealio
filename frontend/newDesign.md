import { useState } from "react";

const DELIVERY_IMG = "https://images.unsplash.com/photo-1659353739926-4c7df1a645a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGVsaXZlcnklMjBtYW4lMjBzbWlsaW5nfGVufDF8fHx8MTc3MzExNjc1OHww&ixlib=rb-4.1.0&q=80&w=1080";

/_ ── Inline SVG Logo Icon ── _/
function LogoIcon({ size = 36 }: { size?: number }) {
return (
<svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<defs>
<linearGradient id="navBg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
<stop offset="0%" stopColor="#40916C" />
<stop offset="100%" stopColor="#2D6A4F" />
</linearGradient>
<linearGradient id="navLeaf" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stopColor="#B7E4C7" />
<stop offset="100%" stopColor="#74C69D" />
</linearGradient>
</defs>
<circle cx="32" cy="32" r="30" fill="url(#navBg)" />
<ellipse cx="32" cy="38" rx="16" ry="5" fill="white" fillOpacity="0.15" />
<path d="M16 36 Q16 48 32 48 Q48 48 48 36" fill="white" fillOpacity="0.92" />
<path d="M24 28 Q22 24 24 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" fill="none" />
<path d="M32 26 Q30 22 32 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" fill="none" />
<path d="M40 28 Q38 24 40 20" stroke="white" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" fill="none" />
<ellipse cx="32" cy="43" rx="6" ry="2.5" fill="url(#navLeaf)" opacity="0.9" />
<path d="M32 43 Q35 40 38 42" stroke="#2D6A4F" strokeWidth="0.8" fill="none" strokeOpacity="0.6" />
</svg>
);
}

/_ ── Navbar ── _/
function Navbar() {
const [menuOpen, setMenuOpen] = useState(false);

return (
<header className="absolute top-0 left-0 right-0 z-20 px-6 md:px-12 py-4 flex items-center justify-between">
{/_ Logo _/}
<div className="flex items-center gap-2.5">
<LogoIcon size={38} />
<span style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1.3rem", color: "#fff", letterSpacing: "-0.5px" }}>
Meal<span style={{ color: "#74C69D" }}>io</span>
</span>
</div>

      {/* Nav links desktop */}
      <nav className="hidden md:flex items-center gap-8">
        {["Home", "Menu", "Mobile App", "Contact Us"].map((item) => (
          <a
            key={item}
            href="#"
            className="text-sm transition-colors"
            style={{
              color: item === "Home" ? "#74C69D" : "rgba(255,255,255,0.85)",
              fontWeight: item === "Home" ? 600 : 400,
              textDecoration: item === "Home" ? "underline" : "none",
              textUnderlineOffset: "4px",
            }}
          >
            {item}
          </a>
        ))}
      </nav>

      {/* Actions */}
      <div className="hidden md:flex items-center gap-3">
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors" style={{ color: "rgba(255,255,255,0.8)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </button>
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors" style={{ color: "rgba(255,255,255,0.8)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all hover:opacity-90"
          style={{ background: "#40916C", color: "#fff", fontWeight: 500 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
          Login
        </button>
      </div>

      {/* Mobile menu toggle */}
      <button className="md:hidden p-2" style={{ color: "#fff" }} onClick={() => setMenuOpen(!menuOpen)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 py-4 px-6 flex flex-col gap-4 md:hidden" style={{ background: "#1a3d2b" }}>
          {["Home", "Menu", "Mobile App", "Contact Us"].map((item) => (
            <a key={item} href="#" className="text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>{item}</a>
          ))}
        </div>
      )}
    </header>

);
}

/_ ── Decorative blobs ── _/
function Blobs() {
return (
<>
{/_ Top-right large blob _/}
<div
className="absolute top-[-80px] right-[-80px] rounded-full pointer-events-none"
style={{ width: 420, height: 420, background: "radial-gradient(circle, #40916C44 0%, transparent 70%)" }}
/>
{/_ Bottom-left blob _/}
<div
className="absolute bottom-[-60px] left-[-60px] rounded-full pointer-events-none"
style={{ width: 320, height: 320, background: "radial-gradient(circle, #74C69D33 0%, transparent 70%)" }}
/>
{/_ Center glow _/}
<div
className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
style={{ width: 700, height: 500, background: "radial-gradient(ellipse, #2D6A4F55 0%, transparent 70%)" }}
/>
{/_ Leaf pattern top-left _/}
<svg className="absolute top-24 left-8 opacity-10 pointer-events-none" width="80" height="80" viewBox="0 0 80 80" fill="none">
<ellipse cx="40" cy="40" rx="35" ry="20" fill="#74C69D" transform="rotate(-30 40 40)" />
<line x1="40" y1="40" x2="70" y2="30" stroke="#74C69D" strokeWidth="2" />
</svg>
{/_ Small circle accents _/}
<div className="absolute top-32 right-1/3 w-3 h-3 rounded-full opacity-30 pointer-events-none" style={{ background: "#74C69D" }} />
<div className="absolute bottom-24 right-1/4 w-5 h-5 rounded-full opacity-20 pointer-events-none" style={{ background: "#B7E4C7" }} />
<div className="absolute top-1/2 left-1/4 w-2 h-2 rounded-full opacity-25 pointer-events-none" style={{ background: "#74C69D" }} />
</>
);
}

/_ ── Stats ── _/
const stats = [
{ value: "50K+", label: "Happy Customers" },
{ value: "200+", label: "Dishes Available" },
{ value: "30+", label: "Cities Served" },
{ value: "8+", label: "Years of Taste" },
];

/_ ── Hero ── _/
export function MealioHero() {
return (
<div className="min-h-screen flex flex-col" style={{ background: "#f4faf6" }}>
{/_ Hero section _/}
<section
className="relative overflow-hidden flex flex-col"
style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0d2818 0%, #1a3d2b 35%, #2D6A4F 65%, #1f4d38 100%)",
        }} >
{/_ Decorative blobs _/}
<Blobs />

        {/* Navbar */}
        <Navbar />

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex items-center px-6 md:px-12 pt-24 pb-8">
          <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

            {/* Left: text */}
            <div className="flex flex-col gap-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 w-fit px-4 py-1.5 rounded-full text-sm" style={{ background: "rgba(116,198,157,0.15)", border: "1px solid rgba(116,198,157,0.35)", color: "#74C69D" }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#74C69D" }} />
                Now Delivering to Your Area
              </div>

              {/* Headline */}
              <div>
                <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", fontWeight: 800, lineHeight: 1.15, color: "#fff" }}>
                  Taste the Best<br />
                  <span style={{ color: "#74C69D" }}>Food Delivered</span><br />
                  Right to Your Door
                </h1>
              </div>

              {/* Subtitle */}
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: 420 }}>
                Welcome to <span style={{ color: "#74C69D", fontWeight: 500 }}>Mealio</span> — where every meal is crafted with passion. Explore our diverse menu and enjoy restaurant-quality food from the comfort of your home.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-sm transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "#40916C", color: "#fff", fontWeight: 600 }}
                >
                  View Menu
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
                <button
                  className="px-6 py-3 rounded-full text-sm transition-all hover:bg-white/10 active:scale-95"
                  style={{ border: "1.5px solid rgba(255,255,255,0.3)", color: "#fff", fontWeight: 500, backdropFilter: "blur(8px)" }}
                >
                  Learn More
                </button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                {stats.map((s) => (
                  <div key={s.label} className="flex flex-col">
                    <span style={{ color: "#fff", fontWeight: 700, fontSize: "1.4rem" }}>{s.value}</span>
                    <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.75rem" }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: image with frame */}
            <div className="relative flex justify-center md:justify-end">
              {/* Glow behind image */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{ background: "radial-gradient(ellipse at center, #40916C55 0%, transparent 70%)", transform: "scale(1.1)" }}
              />

              {/* Decorative ring */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 380, height: 380,
                  top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  border: "1.5px dashed rgba(116,198,157,0.25)",
                }}
              />
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: 460, height: 460,
                  top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  border: "1px dashed rgba(116,198,157,0.12)",
                }}
              />

              {/* Image */}
              <div className="relative z-10" style={{ width: "min(100%, 420px)" }}>
                <img
                  src={DELIVERY_IMG}
                  alt="Mealio delivery"
                  className="w-full object-cover"
                  style={{
                    borderRadius: "40% 40% 50% 50% / 30% 30% 50% 50%",
                    maxHeight: 480,
                    objectPosition: "top center",
                    filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.5))",
                  }}
                />

                {/* Floating card: delivery time */}
                <div
                  className="absolute flex items-center gap-3 px-4 py-3 rounded-2xl"
                  style={{
                    bottom: 60, left: -20,
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                    minWidth: 160,
                  }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#e8f7f0" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D6A4F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ color: "#1a2e1a", fontWeight: 700, fontSize: "0.85rem" }}>30 min</p>
                    <p style={{ color: "#6b7280", fontSize: "0.7rem" }}>Avg. Delivery Time</p>
                  </div>
                </div>

                {/* Floating card: rating */}
                <div
                  className="absolute flex items-center gap-2 px-3 py-2 rounded-2xl"
                  style={{
                    top: 30, right: -10,
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(12px)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                  }}
                >
                  <span style={{ fontSize: "1rem" }}>⭐</span>
                  <div>
                    <p style={{ color: "#1a2e1a", fontWeight: 700, fontSize: "0.85rem" }}>4.9/5</p>
                    <p style={{ color: "#6b7280", fontSize: "0.7rem" }}>2.4k Reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-10 flex justify-center pb-8">
          <div
            className="flex flex-col items-center gap-1 animate-bounce"
            style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.7rem", letterSpacing: "0.1em" }}
          >
            <div
              className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
              style={{ border: "1.5px solid rgba(255,255,255,0.25)" }}
            >
              <div className="w-1 h-2 rounded-full" style={{ background: "rgba(255,255,255,0.5)" }} />
            </div>
          </div>
        </div>

        {/* Bottom wave divider */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 60 }}>
            <path d="M0 60 Q360 0 720 30 Q1080 60 1440 10 L1440 60 Z" fill="#f4faf6" />
          </svg>
        </div>
      </section>

      {/* Below hero — teaser section */}
      <section className="py-16 px-6 md:px-12 max-w-5xl mx-auto w-full text-center flex flex-col items-center gap-4">
        <h2 className="text-gray-700" style={{ fontWeight: 700, fontSize: "1.5rem" }}>Why Choose Mealio?</h2>
        <p className="text-gray-400 max-w-xl" style={{ lineHeight: 1.7 }}>
          Fresh ingredients, lightning-fast delivery, and a menu that never gets old. Your next great meal is just a tap away.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full">
          {[
            { icon: "🥗", title: "Fresh & Healthy", desc: "Sourced daily from local farms and restaurants." },
            { icon: "⚡", title: "Fast Delivery", desc: "From kitchen to your door in under 30 minutes." },
            { icon: "💚", title: "Eco-Friendly", desc: "Sustainable packaging and green delivery routes." },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center gap-3 text-center">
              <span style={{ fontSize: "2rem" }}>{f.icon}</span>
              <h3 className="text-gray-800" style={{ fontWeight: 600 }}>{f.title}</h3>
              <p className="text-gray-400 text-sm" style={{ lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>

);
}
