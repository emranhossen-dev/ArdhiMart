"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ExtendedProduct } from "../data/products";
import { useCart } from "../context/CartContext";

interface CustomizerPreviewModalProps {
  product: ExtendedProduct | null;
  onClose: () => void;
}

export const CustomizerPreviewModal: React.FC<CustomizerPreviewModalProps> = ({
  product,
  onClose,
}) => {
  const { addToCart } = useCart();
  const [customText, setCustomText] = useState("Your Name Here");
  const [selectedFont, setSelectedFont] = useState("font-serif");
  const [selectedColor, setSelectedColor] = useState("#fbbf24"); // Amber Gold
  const [customNotes, setCustomNotes] = useState("");
  const [simulatedPhoto, setSimulatedPhoto] = useState<string | null>(null);

  if (!product) return null;

  const fontOptions = [
    { label: "Classic Serif", value: "font-serif" },
    { label: "Modern Sans", value: "font-sans" },
    { label: "Monospace", value: "font-mono" },
  ];

  const colorOptions = [
    { label: "Amber Gold", hex: "#fbbf24" },
    { label: "Rose Pink", hex: "#f43f5e" },
    { label: "Pure White", hex: "#ffffff" },
    { label: "Emerald", hex: "#10b981" },
    { label: "Sky Blue", hex: "#38bdf8" },
  ];

  const handlePhotoUploadSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setSimulatedPhoto(url);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, {
      variantColor: selectedColor,
      variantSize: selectedFont,
      quantity: 1,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center text-sm font-bold transition-colors"
        >
          ✕
        </button>

        {/* Left Side: Live Personalizer Mockup Preview */}
        <div className="w-full md:w-1/2 p-6 bg-zinc-950 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-zinc-800 relative">
          <div className="text-center mb-3">
            <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-extrabold uppercase tracking-wider">
              ✨ Live Customizer Preview
            </span>
          </div>

          <div className="relative w-full max-w-xs aspect-square rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl flex items-center justify-center group">
            {/* Product Image */}
            <Image
              src={simulatedPhoto || product.image}
              alt={product.name}
              fill
              className="object-cover"
            />

            {/* Custom Overlay Text on Product */}
            {product.supportsCustomText && customText && (
              <div className="absolute inset-0 flex items-center justify-center p-6 bg-black/30 pointer-events-none text-center">
                <p
                  style={{ color: selectedColor }}
                  className={`text-xl sm:text-2xl font-black drop-shadow-md break-words max-w-[85%] ${selectedFont}`}
                >
                  &quot;{customText}&quot;
                </p>
              </div>
            )}
          </div>

          <p className="text-[11px] text-zinc-400 mt-3 text-center">
            * Preview is a real-time digital render. High-resolution HD sublimation print will be applied upon ordering.
          </p>
        </div>

        {/* Right Side: Customization Form */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto flex flex-col justify-between space-y-5">
          <div>
            <h3 className="text-xl font-black text-white">{product.name}</h3>
            <p className="text-xs text-zinc-400 mt-1">{product.description}</p>
            
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm font-medium text-zinc-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            {/* Custom Text Input */}
            {product.supportsCustomText && (
              <div className="mt-5 space-y-2">
                <label className="block text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  1. Enter Custom Name / Text:
                </label>
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="e.g. Happy Birthday Sarah!"
                  maxLength={35}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-rose-500 transition-colors"
                />
                <span className="text-[10px] text-zinc-500 block text-right">
                  {35 - customText.length} characters left
                </span>
              </div>
            )}

            {/* Font Selector */}
            <div className="mt-4 space-y-2">
              <label className="block text-xs font-bold text-zinc-200 uppercase tracking-wider">
                2. Select Font Style:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {fontOptions.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => setSelectedFont(font.value)}
                    className={`py-2 px-2 text-xs rounded-xl border font-semibold transition-all ${
                      selectedFont === font.value
                        ? "bg-rose-500/10 border-rose-500 text-rose-400"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                    } ${font.value}`}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Color Picker */}
            <div className="mt-4 space-y-2">
              <label className="block text-xs font-bold text-zinc-200 uppercase tracking-wider">
                3. Choose Engraving / Text Color:
              </label>
              <div className="flex items-center gap-3">
                {colorOptions.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setSelectedColor(c.hex)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      selectedColor === c.hex
                        ? "scale-125 border-white ring-2 ring-rose-500/50"
                        : "border-zinc-800 opacity-80 hover:opacity-100"
                    }`}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {/* Photo Upload Simulation */}
            {product.supportsPhotoUpload && (
              <div className="mt-5 space-y-2">
                <label className="block text-xs font-bold text-zinc-200 uppercase tracking-wider">
                  4. Upload Custom Photo (Optional):
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUploadSimulate}
                  className="w-full text-xs text-zinc-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-rose-400 hover:file:bg-zinc-700 cursor-pointer"
                />
              </div>
            )}

            {/* Special Printing Instructions */}
            <div className="mt-4 space-y-2">
              <label className="block text-xs font-bold text-zinc-200 uppercase tracking-wider">
                Special Customization Notes:
              </label>
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. Place date on back, add gift wrapping tag..."
                rows={2}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          </div>

          {/* Add to Cart CTA */}
          <div className="pt-4 border-t border-zinc-800">
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-black text-sm shadow-xl shadow-rose-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Customized Gift to Cart (${product.price})
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
