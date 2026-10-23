import React, { useState } from 'react';
import { Ruler, Truck, ShieldCheck, RefreshCw, MessageSquare, Mail, Phone, MapPin, ChevronDown, ChevronUp, Check, ArrowRight } from 'lucide-react';
import { STORE_CONFIG } from '../data/config';
import { getWhatsAppChatUrl } from '../lib/whatsapp';
import { useNavigate } from '../context/NavigationContext';
import { useStore } from '../context/StoreContext';

// 1. SIZE GUIDE PAGE
export const SizeGuidePage: React.FC = () => {
  const { navigate } = useNavigate();

  const SIZES = [
    { eu: 36, uk: 3.5, usMen: 4.5, usWomen: 6.0, cm: 22.5 },
    { eu: 37, uk: 4.0, usMen: 5.0, usWomen: 6.5, cm: 23.0 },
    { eu: 38, uk: 5.0, usMen: 6.0, usWomen: 7.5, cm: 24.0 },
    { eu: 39, uk: 6.0, usMen: 6.5, usWomen: 8.0, cm: 24.5 },
    { eu: 40, uk: 6.5, usMen: 7.5, usWomen: 9.0, cm: 25.0 },
    { eu: 41, uk: 7.5, usMen: 8.5, usWomen: 10.0, cm: 26.0 },
    { eu: 42, uk: 8.0, usMen: 9.0, usWomen: 10.5, cm: 26.5 },
    { eu: 43, uk: 9.0, usMen: 10.0, usWomen: 11.5, cm: 27.5 },
    { eu: 44, uk: 9.5, usMen: 10.5, usWomen: 12.0, cm: 28.0 },
    { eu: 45, uk: 10.5, usMen: 11.5, usWomen: 13.0, cm: 29.0 },
    { eu: 46, uk: 11.5, usMen: 12.5, usWomen: 14.0, cm: 30.0 },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-left space-y-10">
      <div>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF4F9A]">
          Fit Perfection · Precision Matrix
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-white mt-1">
          SHOE SIZE & MEASUREMENT GUIDE
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 mt-2">
          Compare EU, UK, US Men, US Women, and exact foot length in centimeters.
        </p>
      </div>

      {/* Measuring Technique */}
      <div className="p-6 rounded-3xl bg-[#17151C] border border-stone-800 space-y-3 shadow-xl">
        <h3 className="font-bold text-sm text-[#C8FF35] uppercase font-mono tracking-wider flex items-center gap-2">
          <Ruler className="w-4 h-4 text-[#FF4F9A]" /> How to measure your foot at home
        </h3>
        <ol className="list-decimal pl-5 space-y-2 text-xs text-stone-300 leading-relaxed">
          <li>Stand straight on a piece of paper placed against a hard wall.</li>
          <li>Mark the tip of your longest toe and the back of your heel with a pencil held vertically.</li>
          <li>Measure the distance between marks in centimeters (CM).</li>
          <li>Add <b className="text-white">5mm (0.5cm)</b> of comfort allowance for proper toe flex and socks.</li>
        </ol>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-3xl border border-stone-800 bg-[#17151C] shadow-xl">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-stone-900 text-stone-300 border-b border-stone-800">
            <tr>
              <th className="py-3.5 px-4 font-bold text-white">EU Size</th>
              <th className="py-3.5 px-4">UK Size</th>
              <th className="py-3.5 px-4">US Men</th>
              <th className="py-3.5 px-4">US Women</th>
              <th className="py-3.5 px-4 text-[#FF873D] font-bold">Length (CM)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800/60">
            {SIZES.map((row) => (
              <tr key={row.eu} className="hover:bg-stone-900/60 transition-colors">
                <td className="py-3 px-4 font-bold text-[#C8FF35]">EU {row.eu}</td>
                <td className="py-3 px-4 text-stone-300">{row.uk}</td>
                <td className="py-3 px-4 text-stone-300">{row.usMen}</td>
                <td className="py-3 px-4 text-stone-300">{row.usWomen}</td>
                <td className="py-3 px-4 text-[#FF873D] font-bold">{row.cm} cm</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center pt-4">
        <button
          onClick={() => navigate('/shop')}
          className="px-8 py-3.5 rounded-2xl bg-[#C8FF35] hover:bg-[#bbf325] text-[#17151C] font-black text-xs uppercase tracking-wider transition-colors shadow-lg shadow-[#C8FF35]/15"
        >
          Explore Sneakers In Your Size
        </button>
      </div>
    </div>
  );
};

// 2. SHIPPING & COD POLICY PAGE
export const ShippingPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-left space-y-8">
      <div>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF873D]">
          Logistics Transparency
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-white mt-1">
          SHIPPING & CASH ON DELIVERY (COD)
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 mt-2">
          Fast and reliable doorstep delivery to over 150+ cities across Pakistan.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-[#17151C] border border-stone-800 shadow-xl space-y-3">
          <Truck className="w-6 h-6 text-[#C8FF35]" />
          <h3 className="font-bold text-base text-white">Standard Delivery (Trax / TCS)</h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            Delivered within 3 to 4 business days. Standard flat shipping fee is <b className="text-white">PKR 450</b>. Orders with subtotal exceeding <b className="text-[#C8FF35]">PKR 15,000</b> automatically qualify for <b className="text-[#C8FF35]">FREE EXPRESS DELIVERY</b>.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-[#17151C] border border-stone-800 shadow-xl space-y-3">
          <ShieldCheck className="w-6 h-6 text-[#FF4F9A]" />
          <h3 className="font-bold text-base text-white">Cash on Delivery (COD)</h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            Pay cash to the courier representative when the shipment arrives at your home. You will receive an automated dispatch SMS with your Trax tracking consignment code.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-2 text-xs text-stone-300 leading-relaxed">
        <h4 className="font-bold font-mono text-[#C8FF35] uppercase">Karachi Hub Same-City Priority</h4>
        <p>
          Orders destined for Karachi (Clifton, DHA, Gulshan, PECHS, Nazimabad) often arrive within 24–48 hours from dispatch.
        </p>
      </div>
    </div>
  );
};

// 3. RETURNS & EXCHANGES PAGE
export const ReturnsPage: React.FC = () => {
  const { navigate } = useNavigate();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-left space-y-8">
      <div>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF4F9A]">
          Hassle-Free Policy
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-white mt-1">
          7-DAY RETURNS & EXCHANGES
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 mt-2">
          We want your kicks to fit effortlessly. If the size or vibe isn&apos;t 100% right, we have you covered.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-[#17151C] border border-stone-800 shadow-xl space-y-4 text-xs text-stone-300 leading-relaxed">
        <h3 className="font-bold text-sm text-[#C8FF35] uppercase font-mono">Exchange Eligibility Conditions:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>Item must be unworn and in the exact brand-new condition received.</li>
          <li>Original shoe box, dust bag, tags, and extra laces must be returned intact.</li>
          <li>Exchange request must be submitted within 7 calendar days of courier delivery.</li>
        </ul>

        <div className="pt-4 flex flex-wrap gap-4">
          <button
            onClick={() => navigate('/track-order')}
            className="px-6 py-3 rounded-xl bg-[#C8FF35] hover:bg-[#bbf325] text-[#17151C] font-bold text-xs uppercase transition-colors shadow-lg shadow-[#C8FF35]/15"
          >
            File Exchange via Order Tracker
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. FAQ PAGE
export const FaqPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const FAQS = [
    {
      q: 'Are all SOLEVERSE sneakers original and authentic?',
      a: 'Yes, every silhouette is designed, engineered, and produced by SOLEVERSE LAB and our partner streetwear collectives using high-tensile materials, certified EVA/phylon compounds, and premium leather.',
    },
    {
      q: 'Do you offer Cash on Delivery (COD) in Pakistan?',
      a: 'Yes! COD is supported nationwide across 150+ Pakistani cities including Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Multan, and Peshawar.',
    },
    {
      q: 'How long does delivery take?',
      a: 'Standard courier delivery via Trax/TCS takes 3 to 4 business days. Priority air dispatch to major cities takes 1 to 2 business days.',
    },
    {
      q: 'How do I know my shoe size?',
      a: 'Our shoes follow standard EU sizing (EU 38 to 46). Check our interactive Size Guide for centimeter conversions or take our "Find Your Pair" quiz.',
    },
    {
      q: 'What if the shoes don’t fit me properly?',
      a: 'We offer an easy 7-day size exchange guarantee. Our courier can arrange reverse pickup from your doorstep.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-left space-y-8">
      <div>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#FF4F9A]">
          Answers & Guidance
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-white mt-1">
          FREQUENTLY ASKED QUESTIONS
        </h1>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-stone-800 bg-[#17151C] overflow-hidden shadow-lg transition-colors"
          >
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full p-5 text-left font-bold text-sm text-white flex items-center justify-between gap-4 hover:bg-stone-900/40"
            >
              <span>{faq.q}</span>
              {openIdx === idx ? <ChevronUp className="w-4 h-4 text-[#C8FF35] shrink-0" /> : <ChevronDown className="w-4 h-4 text-stone-500 shrink-0" />}
            </button>
            {openIdx === idx && (
              <div className="px-5 pb-5 text-xs text-stone-400 leading-relaxed border-t border-stone-800/80 pt-3">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. CONTACT US PAGE
export const ContactPage: React.FC = () => {
  const { addToast } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    addToast('Message sent! Our Karachi crew will respond promptly.', 'success');
  };

  const wa = getWhatsAppChatUrl('Hi SOLEVERSE! Reaching out from the website contact page.');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-left space-y-10">
      <div>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#C8FF35] bg-[#17151C] border border-[#C8FF35]/30 px-3 py-1 rounded-full inline-block">
          Connect With The Crew
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-white mt-2">
          CONTACT SOLEVERSE
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 mt-1">
          Questions about sizing, custom wholesale orders, or courier tracking? We&apos;re here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Form */}
        <div className="md:col-span-7 bg-[#17151C] p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl space-y-4">
          <h3 className="font-bold text-base text-white font-display">Send a Direct Message</h3>

          {sent ? (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs">
              Thank you! Your message has been logged in this demo session.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-mono font-bold text-stone-400 block mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C8FF35]"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-stone-400 block mb-1">Phone Number *</label>
                <input
                  type="text"
                  required
                  placeholder="0300 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C8FF35] font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-stone-400 block mb-1">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C8FF35]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#C8FF35] hover:bg-[#bbf325] text-[#17151C] font-black text-xs uppercase font-mono tracking-wider transition-colors shadow-lg shadow-[#C8FF35]/15"
              >
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="md:col-span-5 space-y-4 text-xs font-mono">
          <div className="p-6 rounded-3xl bg-[#17151C] border border-stone-800 text-white space-y-4 shadow-xl">
            <h4 className="font-bold text-sm text-[#C8FF35] uppercase tracking-wider">
              Karachi Hub HQ
            </h4>
            <div className="space-y-3 text-stone-300">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C8FF35] shrink-0 mt-0.5" />
                <span>{STORE_CONFIG.hqAddress}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FF4F9A] shrink-0" />
                <span>{STORE_CONFIG.supportEmail}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF873D] shrink-0" />
                <span>+{STORE_CONFIG.supportWhatsAppNumber}</span>
              </p>
            </div>

            <div className="pt-2">
              <a
                href={wa.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 6. ABOUT PAGE
export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-left space-y-8">
      <div>
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#542C70] bg-[#542C70]/30 border border-[#542C70]/50 px-3 py-1 rounded-full text-[#FAF8F4] inline-block">
          The Collective Vision
        </span>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-white mt-2">
          ABOUT SOLEVERSE
        </h1>
      </div>

      <div className="text-xs sm:text-sm text-stone-300 leading-relaxed space-y-4">
        <p>
          Founded in 2026, <b className="text-white">SOLEVERSE</b> was created with a single uncompromising mission: to liberate Pakistan&apos;s footwear landscape from generic clones and usher in the golden era of bold, expressive, Gen Z streetwear culture.
        </p>
        <p>
          We build for creators, night-riders, collectors, and pavement explorers who refuse to blend into the background. Every silhouette features custom-tooled kinetic midsoles, high-vis electric lime and hot pink accents, and unyielding comfort built for real-world concrete.
        </p>
        <div className="p-6 rounded-3xl bg-[#17151C] text-white my-8 border border-stone-800 shadow-2xl">
          <h3 className="font-display font-black text-xl text-[#C8FF35] mb-2">
            &quot;YOUR WORLD. YOUR SOLES.&quot;
          </h3>
          <p className="text-xs text-stone-400 leading-relaxed">
            Headquartered in Clifton, Karachi with daily express dispatch to Lahore, Islamabad, Rawalpindi, and every corner of Pakistan.
          </p>
        </div>
      </div>
    </div>
  );
};

// 7. PRIVACY & TERMS
export const PrivacyPage: React.FC = () => (
  <div className="max-w-3xl mx-auto px-4 py-12 text-left space-y-6 text-xs text-stone-400 leading-relaxed">
    <h1 className="text-3xl font-black font-display text-white">Privacy Policy</h1>
    <p>SOLEVERSE respects your personal privacy. In this demo application, all cart items, orders, complaints, and preferences are stored exclusively on your local client device using browser LocalStorage.</p>
    <p>No customer payment card numbers or sensitive financial credentials are ever transmitted to or stored on external servers.</p>
  </div>
);

export const TermsPage: React.FC = () => (
  <div className="max-w-3xl mx-auto px-4 py-12 text-left space-y-6 text-xs text-stone-400 leading-relaxed">
    <h1 className="text-3xl font-black font-display text-white">Terms & Conditions</h1>
    <p>By accessing and interacting with the SOLEVERSE demonstration application, you acknowledge that orders placed are simulated demonstration records.</p>
    <p>All product silhouettes, photography, and brand copy are curated for portfolio and ecommerce testing purposes.</p>
  </div>
);
