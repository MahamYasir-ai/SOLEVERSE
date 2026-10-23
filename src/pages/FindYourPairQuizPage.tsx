import React, { useState } from 'react';
import { Compass, Sparkles, Check, ArrowRight, RotateCcw } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { ProductCard } from '../components/products/ProductCard';
import { SNEAKER_SIZES } from '../data/config';
import { useNavigate } from '../context/NavigationContext';

export const FindYourPairQuizPage: React.FC = () => {
  const { navigate } = useNavigate();
  const [step, setStep] = useState<number>(1);

  // Answers
  const [chosenStyle, setChosenStyle] = useState<string>('');
  const [chosenColorMood, setChosenColorMood] = useState<string>('');
  const [chosenBudget, setChosenBudget] = useState<string>('');
  const [chosenUse, setChosenUse] = useState<string>('');
  const [chosenSize, setChosenSize] = useState<number | null>(42);

  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const calculateRecommendations = () => {
    let pool = [...PRODUCTS];

    // Filter by Style
    if (chosenStyle === 'futuristic') {
      pool = pool.filter((p) => p.category === 'futuristic-kicks' || p.category === 'limited-editions');
    } else if (chosenStyle === 'chunky') {
      pool = pool.filter((p) => p.category === 'chunky-sneakers' || p.category === 'platform-sneakers');
    } else if (chosenStyle === 'retro') {
      pool = pool.filter((p) => p.category === 'retro-runners');
    } else if (chosenStyle === 'minimal') {
      pool = pool.filter((p) => p.category === 'everyday-essentials');
    } else if (chosenStyle === 'hoops') {
      pool = pool.filter((p) => p.category === 'basketball' || p.category === 'skate-culture');
    }

    // Filter by Budget
    if (chosenBudget === 'under15') {
      pool = pool.filter((p) => p.price <= 15000);
    } else if (chosenBudget === 'mid') {
      pool = pool.filter((p) => p.price > 15000 && p.price <= 24000);
    } else if (chosenBudget === 'premium') {
      pool = pool.filter((p) => p.price > 24000);
    }

    // Filter by Occasion
    if (chosenUse === 'office') {
      const officePool = pool.filter((p) => p.category === 'everyday-essentials');
      if (officePool.length >= 2) pool = officePool;
    } else if (chosenUse === 'skate') {
      const skatePool = pool.filter((p) => p.category === 'skate-culture');
      if (skatePool.length >= 2) pool = skatePool;
    } else if (chosenUse === 'night') {
      const nightPool = pool.filter((p) => p.category === 'futuristic-kicks' || p.category === 'limited-editions');
      if (nightPool.length >= 2) pool = nightPool;
    }

    // Filter by Size availability
    if (chosenSize) {
      const sizeFiltered = pool.filter((p) => p.availableSizes.includes(chosenSize));
      if (sizeFiltered.length > 0) pool = sizeFiltered;
    }

    // Fallback if too strict
    if (pool.length === 0) {
      pool = PRODUCTS.filter((p) => p.isFeatured || p.isBestSeller);
    }

    setRecommendedProducts(pool.slice(0, 6));
    setIsCompleted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setStep(1);
    setChosenStyle('');
    setChosenColorMood('');
    setChosenBudget('');
    setChosenUse('');
    setChosenSize(42);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-left space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#C8FF35] bg-[#17151C] border border-[#C8FF35]/30 px-3 py-1 rounded-full inline-block">
          Interactive Sneaker Matchmaker
        </span>
        <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white mt-2">
          FIND YOUR PERFECT PAIR
        </h1>
        <p className="text-xs sm:text-sm text-stone-400">
          Answer 5 quick aesthetic questions. We&apos;ll scan our actual warehouse stock and surface your ideal rotation pieces.
        </p>
      </div>

      {!isCompleted ? (
        <div className="p-6 sm:p-10 rounded-3xl bg-[#17151C] border border-stone-800 shadow-2xl space-y-8">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs font-mono text-stone-400 pb-4 border-b border-stone-800">
            <span>QUESTION {step} OF 5</span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`w-6 h-1.5 rounded-full transition-colors ${
                    step >= s ? 'bg-[#C8FF35]' : 'bg-stone-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* QUESTION 1: STYLE */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold font-display text-white">
                  What silhouette dominates your streetwear aesthetic?
                </h3>
                <p className="text-xs text-stone-400 mt-1">Select your preferred shoe anatomy.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'futuristic', title: 'Futurecore & Sculptural', desc: 'Neon ribcages, segmented kinetic soles, cyber drops' },
                  { id: 'chunky', title: 'Chunky & Platform Flatforms', desc: 'Maximalist volume, brutalist soles, 50mm elevation' },
                  { id: 'retro', title: 'Retro 80s/90s Track Runners', desc: 'Vintage nylon tongues, gum waffle traction, marathon heritage' },
                  { id: 'minimal', title: 'Minimalist Clean Courts', desc: 'Buttery calfskin, understated elegance, clean girl/boy vibes' },
                  { id: 'hoops', title: 'Hoops High-Tops & Skate', desc: 'Blacktop ankle support, reinforced suede ollie guards' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setChosenStyle(opt.id);
                      setStep(2);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      chosenStyle === opt.id
                        ? 'border-[#C8FF35] bg-stone-900 ring-2 ring-[#C8FF35]/50'
                        : 'border-stone-800 hover:border-stone-700 bg-stone-900/60'
                    }`}
                  >
                    <h4 className="font-bold text-sm text-white">{opt.title}</h4>
                    <p className="text-xs text-stone-400 mt-1">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUESTION 2: COLOR MOOD */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold font-display text-white">
                  What color energy are you looking for?
                </h3>
                <p className="text-xs text-stone-400 mt-1">How loud should your sneakers speak?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'neon', title: 'High-Voltage Neon & Lime', desc: 'Electric lime #C8FF35, hot pink, and ultraviolet accents' },
                  { id: 'monochrome', title: 'Triple Black & Stealth Obsidian', desc: 'Dark horizon, tactical textures, matte nubuck' },
                  { id: 'white', title: 'Pristine Chalk White & Cream', desc: 'Clean, crisp, everyday versatile' },
                  { id: 'warm', title: 'Tangerine Orange & Earth Suede', desc: 'Solar burst, vintage track tones' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setChosenColorMood(opt.id);
                      setStep(3);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      chosenColorMood === opt.id
                        ? 'border-[#C8FF35] bg-stone-900 ring-2 ring-[#C8FF35]/50'
                        : 'border-stone-800 hover:border-stone-700 bg-stone-900/60'
                    }`}
                  >
                    <h4 className="font-bold text-sm text-white">{opt.title}</h4>
                    <p className="text-xs text-stone-400 mt-1">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUESTION 3: BUDGET */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold font-display text-white">
                  What is your target budget for this pair?
                </h3>
                <p className="text-xs text-stone-400 mt-1">Prices in Pakistani Rupees (PKR).</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'under15', title: 'Under PKR 15,000', desc: 'Everyday staples & classic skate canvas' },
                  { id: 'mid', title: 'PKR 15,000 – 24,000', desc: 'Chunky dad runners & high-top court leather' },
                  { id: 'premium', title: 'PKR 24,000+', desc: 'Special edition futuristic drops & carbon plates' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setChosenBudget(opt.id);
                      setStep(4);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      chosenBudget === opt.id
                        ? 'border-[#C8FF35] bg-stone-900 ring-2 ring-[#C8FF35]/50'
                        : 'border-stone-800 hover:border-stone-700 bg-stone-900/60'
                    }`}
                  >
                    <h4 className="font-bold text-sm text-white">{opt.title}</h4>
                    <p className="text-xs text-stone-400 mt-1">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUESTION 4: INTENDED OCCASION */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold font-display text-white">
                  Where will these kicks spend the most time?
                </h3>
                <p className="text-xs text-stone-400 mt-1">Select your primary lifestyle usage.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'daily', title: 'All-Day Walking & University', desc: 'Cushioned foam, breathable mesh, 15k+ steps' },
                  { id: 'night', title: 'Nightlife & Streetwear Flex', desc: 'Head-turner silhouettes, metallic accents' },
                  { id: 'skate', title: 'Skatepark & Outdoor Concrete', desc: 'Durable suede, vulcanized sticky gum sole' },
                  { id: 'office', title: 'Smart Casual / Work Rotation', desc: 'Low-profile leather courts, minimal branding' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setChosenUse(opt.id);
                      setStep(5);
                    }}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      chosenUse === opt.id
                        ? 'border-[#C8FF35] bg-stone-900 ring-2 ring-[#C8FF35]/50'
                        : 'border-stone-800 hover:border-stone-700 bg-stone-900/60'
                    }`}
                  >
                    <h4 className="font-bold text-sm text-white">{opt.title}</h4>
                    <p className="text-xs text-stone-400 mt-1">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* QUESTION 5: SHOE SIZE */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold font-display text-white">
                  What is your European shoe size?
                </h3>
                <p className="text-xs text-stone-400 mt-1">We will ensure our recommendations have active stock in your size.</p>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
                {SNEAKER_SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setChosenSize(size)}
                    className={`py-3 rounded-xl font-mono text-xs font-bold border transition-all ${
                      chosenSize === size
                        ? 'bg-[#C8FF35] text-[#17151C] border-[#C8FF35] shadow-lg shadow-[#C8FF35]/20'
                        : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    EU {size}
                  </button>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={calculateRecommendations}
                  className="px-8 py-4 rounded-2xl bg-[#C8FF35] hover:bg-[#bbf325] text-[#17151C] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-[#C8FF35]/20 transition-transform active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Reveal My Matched Pairs</span>
                </button>
              </div>
            </div>
          )}

          {/* Back Step Option */}
          {step > 1 && (
            <div className="pt-4 border-t border-stone-800 flex justify-between text-xs font-mono">
              <button
                onClick={() => setStep(step - 1)}
                className="text-stone-400 hover:text-[#C8FF35] transition-colors"
              >
                ← Back to previous question
              </button>
            </div>
          )}

        </div>
      ) : (
        /* Results View */
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="p-6 rounded-3xl bg-[#17151C] border border-stone-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div>
              <span className="text-xs font-mono uppercase text-[#C8FF35] font-bold">
                Algorithm Matched
              </span>
              <h2 className="text-2xl font-black font-display mt-0.5">
                HERE ARE YOUR TOP PICKS FOR EU {chosenSize}
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Filtered from our warehouse catalog based on your vibe and budget.
              </p>
            </div>

            <button
              onClick={handleRestart}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-[#C8FF35] font-mono text-xs flex items-center gap-2 self-start sm:self-auto transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
