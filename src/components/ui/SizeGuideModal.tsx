import React, { useState } from 'react';
import { X, Ruler, Check } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize?: (size: number) => void;
  currentSelectedSize?: number;
}

const SIZE_CHART = [
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

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectSize,
  currentSelectedSize,
}) => {
  const [activeUnit, setActiveUnit] = useState<'eu' | 'cm'>('eu');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#17151C] text-[#FAF8F4] border border-stone-700 rounded-3xl shadow-2xl p-6 sm:p-8 z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C8FF35]/10 border border-[#C8FF35]/30 flex items-center justify-center text-[#C8FF35]">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display text-white">
                Sizing & Fit Conversion
              </h3>
              <p className="text-xs text-stone-400">
                Official SOLEVERSE international conversion scale
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
            aria-label="Close size guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Measuring Tip Banner */}
        <div className="my-6 p-4 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#C8FF35]">
              How to Measure Foot Length (CM)
            </h4>
            <p className="text-xs text-stone-300 mt-1">
              Place your heel against a flat wall on a blank paper sheet. Mark the tip of your longest toe and measure the distance in centimeters. Add 5mm for breathing room.
            </p>
          </div>
          <div className="text-[11px] font-mono px-3 py-1.5 rounded-lg bg-[#FF4F9A]/20 text-[#FF4F9A] border border-[#FF4F9A]/40 shrink-0">
            True To Size (TTS)
          </div>
        </div>

        {/* Conversion Table */}
        <div className="overflow-x-auto rounded-2xl border border-stone-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-stone-900/90 text-stone-300 border-b border-stone-800 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 text-[#C8FF35]">EU Size</th>
                <th className="py-3 px-4">UK</th>
                <th className="py-3 px-4">US Men</th>
                <th className="py-3 px-4">US Women</th>
                <th className="py-3 px-4 text-[#FF873D]">Foot (CM)</th>
                {onSelectSize && <th className="py-3 px-4 text-right">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60">
              {SIZE_CHART.map((row) => {
                const isCurrent = currentSelectedSize === row.eu;
                return (
                  <tr
                    key={row.eu}
                    className={`hover:bg-stone-800/40 transition-colors ${
                      isCurrent ? 'bg-[#C8FF35]/10 font-bold' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-1.5">
                      <span>EU {row.eu}</span>
                      {isCurrent && <Check className="w-3.5 h-3.5 text-[#C8FF35]" />}
                    </td>
                    <td className="py-3 px-4 text-stone-300">{row.uk}</td>
                    <td className="py-3 px-4 text-stone-300">{row.usMen}</td>
                    <td className="py-3 px-4 text-stone-300">{row.usWomen}</td>
                    <td className="py-3 px-4 text-[#FF873D]">{row.cm} cm</td>
                    {onSelectSize && (
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            onSelectSize(row.eu);
                            onClose();
                          }}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                            isCurrent
                              ? 'bg-[#C8FF35] text-[#17151C]'
                              : 'bg-stone-800 text-stone-300 hover:bg-[#C8FF35] hover:text-[#17151C]'
                          }`}
                        >
                          {isCurrent ? 'Selected' : 'Pick Size'}
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Disclaimer */}
        <p className="text-[11px] text-stone-500 mt-4 leading-relaxed">
          *Note: Conversions are approximate guidelines based on standard streetwear lasts. For chunky platform sneakers with heavy padding, if you have wider feet, choosing one half-size up is recommended.
        </p>
      </div>
    </div>
  );
};
