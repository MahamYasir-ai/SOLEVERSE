import React, { useState } from 'react';
import { ShieldCheck, Truck, CreditCard, CheckCircle2, ArrowRight, ArrowLeft, AlertCircle, ShoppingBag, Lock } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from '../context/NavigationContext';
import { CustomerDetails, DeliveryMethod, PaymentMethod } from '../types';
import { DELIVERY_METHODS, PAKISTAN_CITIES, PAYMENT_METHODS } from '../data/config';
import { formatPKR } from '../lib/currency';
import { validateEmail, validatePakistaniPhone, validatePostalCode } from '../lib/validation';

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, discountAmount, shippingFee, total, createOrder, appliedPromo, addToast } = useStore();
  const { navigate } = useNavigate();

  // Multi-step: 1 = Details, 2 = Delivery & Payment, 3 = Review & Confirm
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State: Customer Details (Pakistan)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(PAKISTAN_CITIES[0]);
  const [area, setArea] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  // Selected Options
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryMethod>(DELIVERY_METHODS[0]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(PAYMENT_METHODS[0]);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-4 bg-[#0E0D12] text-white">
        <ShoppingBag className="w-12 h-12 text-[#C8FF35] mx-auto" />
        <h2 className="text-2xl font-bold font-display text-white">Your Bag is Empty</h2>
        <p className="text-xs text-stone-400">Add sneakers to your bag before proceeding to checkout.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2.5 rounded-xl bg-[#C8FF35] text-[#17151C] font-black text-xs uppercase tracking-wider"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 3) {
      newErrors.fullName = 'Please enter your full name.';
    }

    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    const phoneCheck = validatePakistaniPhone(phone);
    if (!phoneCheck.isValid) {
      newErrors.phone = phoneCheck.error || 'Invalid Pakistani phone number.';
    }

    if (!address.trim() || address.trim().length < 8) {
      newErrors.address = 'Please enter a complete delivery street address.';
    }

    if (!area.trim()) {
      newErrors.area = 'Please specify your neighborhood/area (e.g. DHA, Clifton, Gulberg, F-8).';
    }

    if (postalCode.trim() && !validatePostalCode(postalCode)) {
      newErrors.postalCode = 'Enter a valid 5-digit postal code (e.g. 75500, 54000).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextToStep3 = () => {
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalOrderSubmit = () => {
    if (!agreeTerms) {
      addToast('Please accept the order terms to place your order.', 'warning');
      return;
    }

    if (isSubmitting) return; // Prevent duplicate clicks
    setIsSubmitting(true);

    const customer: CustomerDetails = {
      fullName: fullName.trim(),
      email: email.trim(),
      phone: validatePakistaniPhone(phone).normalized || phone.trim(),
      address: address.trim(),
      city,
      area: area.trim(),
      postalCode: postalCode.trim() || '75500',
      deliveryInstructions: deliveryInstructions.trim() || undefined,
    };

    setTimeout(() => {
      const order = createOrder(customer, selectedDelivery, selectedPayment, deliveryInstructions);
      if (order) {
        navigate(`/order-confirmation/${order.id}`);
      } else {
        setIsSubmitting(false);
      }
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-left bg-[#0E0D12] text-[#FAF8F4]">
      {/* Checkout Progress Stepper */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-[#C8FF35] font-bold' : 'text-stone-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 1 ? 'bg-[#C8FF35] text-[#17151C] font-black' : 'bg-stone-800'}`}>
              1
            </span>
            <span className="hidden sm:inline">Delivery Info</span>
          </div>
          <div className="flex-1 h-0.5 bg-stone-800 mx-4" />
          <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-[#C8FF35] font-bold' : 'text-stone-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 2 ? 'bg-[#C8FF35] text-[#17151C] font-black' : 'bg-stone-800'}`}>
              2
            </span>
            <span className="hidden sm:inline">Method & Payment</span>
          </div>
          <div className="flex-1 h-0.5 bg-stone-800 mx-4" />
          <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-[#C8FF35] font-bold' : 'text-stone-500'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${currentStep >= 3 ? 'bg-[#C8FF35] text-[#17151C] font-black' : 'bg-stone-800'}`}>
              3
            </span>
            <span className="hidden sm:inline">Review & Confirm</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Main Steps Form Area */}
        <div className="lg:col-span-8 bg-[#17151C] rounded-3xl border border-stone-800 p-6 sm:p-8 shadow-xl">
          
          {/* STEP 1: CONTACT & PAKISTANI DELIVERY DETAILS */}
          {currentStep === 1 && (
            <form onSubmit={handleNextToStep2} className="space-y-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF4F9A]">
                  Step 1 of 3
                </span>
                <h2 className="text-2xl font-black font-display text-white mt-1">
                  DELIVERY ADDRESS (PAKISTAN)
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  We deliver nationwide via Trax and TCS Logistics. Cash on Delivery is confirmed via phone SMS.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="text-xs font-mono font-bold text-stone-300 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zain Malik"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C8FF35]"
                  />
                  {errors.fullName && <p className="text-[11px] text-[#FF4F9A] mt-1">{errors.fullName}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-xs font-mono font-bold text-stone-300 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C8FF35]"
                  />
                  {errors.email && <p className="text-[11px] text-[#FF4F9A] mt-1">{errors.email}</p>}
                </div>

                {/* Pakistani Mobile Phone */}
                <div>
                  <label className="text-xs font-mono font-bold text-stone-300 block mb-1">
                    Mobile Phone (03XX-XXXXXXX) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C8FF35] font-mono"
                  />
                  {errors.phone && <p className="text-[11px] text-[#FF4F9A] mt-1">{errors.phone}</p>}
                </div>

                {/* City Dropdown */}
                <div>
                  <label className="text-xs font-mono font-bold text-stone-300 block mb-1">
                    Destination City *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8FF35]"
                  >
                    {PAKISTAN_CITIES.map((c) => (
                      <option key={c} value={c} className="bg-stone-900 text-white">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Neighborhood / Area */}
                <div>
                  <label className="text-xs font-mono font-bold text-stone-300 block mb-1">
                    Area / Sector / Phase *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Clifton Block 4, DHA Phase 6, Gulberg III"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C8FF35]"
                  />
                  {errors.area && <p className="text-[11px] text-[#FF4F9A] mt-1">{errors.area}</p>}
                </div>

                {/* Postal Code */}
                <div>
                  <label className="text-xs font-mono font-bold text-stone-300 block mb-1">
                    Postal Code (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 75500"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C8FF35] font-mono"
                  />
                  {errors.postalCode && <p className="text-[11px] text-[#FF4F9A] mt-1">{errors.postalCode}</p>}
                </div>

                {/* Complete Street Address */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-mono font-bold text-stone-300 block mb-1">
                    Complete Street Address (House / Flat / Street / Landmark) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="House 12-C, Lane 4, Street 9..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C8FF35]"
                  />
                  {errors.address && <p className="text-[11px] text-[#FF4F9A] mt-1">{errors.address}</p>}
                </div>

                {/* Delivery Notes */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-mono font-bold text-stone-300 block mb-1">
                    Special Delivery Instructions (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Call before arrival, leave with security guard, etc."
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#C8FF35]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-2xl bg-[#C8FF35] hover:bg-[#bbf325] text-[#17151C] font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-transform active:scale-95 shadow-xl shadow-[#C8FF35]/20"
                >
                  <span>Continue to Delivery & Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: DELIVERY METHOD & PAYMENT METHOD */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF4F9A]">
                  Step 2 of 3
                </span>
                <h2 className="text-2xl font-black font-display text-white mt-1">
                  DELIVERY SPEED & PAYMENT METHOD
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Choose how fast you need your sneakers and select demo payment or Cash on Delivery.
                </p>
              </div>

              {/* Delivery Options */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase font-bold text-[#C8FF35] tracking-wider">
                  Select Delivery Courier Speed
                </h3>
                <div className="space-y-2">
                  {DELIVERY_METHODS.map((method) => {
                    const isSelected = selectedDelivery.id === method.id;
                    const effectivePrice = subtotal >= 15000 ? 0 : method.price;

                    return (
                      <div
                        key={method.id}
                        onClick={() => setSelectedDelivery(method)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-[#C8FF35] bg-stone-900/90 ring-1 ring-[#C8FF35]'
                            : 'border-stone-800 bg-[#121016] hover:border-stone-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#C8FF35] bg-[#C8FF35]' : 'border-stone-600'}`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-[#17151C]" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-white">{method.name}</h4>
                            <p className="text-[11px] text-stone-400">{method.estimatedDays}</p>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold text-[#C8FF35]">
                          {effectivePrice === 0 ? 'FREE' : formatPKR(effectivePrice)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Payment Methods (Pakistan) */}
              <div className="space-y-3 pt-4 border-t border-stone-800">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase font-bold text-[#C8FF35] tracking-wider">
                    Payment Method
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-400 font-bold">
                    Sandbox Demo Mode
                  </span>
                </div>

                <div className="space-y-2">
                  {PAYMENT_METHODS.map((payment) => {
                    const isSelected = selectedPayment.id === payment.id;
                    return (
                      <div
                        key={payment.id}
                        onClick={() => setSelectedPayment(payment)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start justify-between ${
                          isSelected
                            ? 'border-[#C8FF35] bg-stone-900 ring-1 ring-[#C8FF35]'
                            : 'border-stone-800 bg-[#121016] hover:border-stone-600'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${isSelected ? 'border-[#C8FF35] bg-[#C8FF35]' : 'border-stone-600'}`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-[#17151C]" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-xs text-white">{payment.name}</h4>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-800 text-[#C8FF35]">
                                {payment.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-400 mt-1">{payment.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 text-[11px] leading-relaxed">
                  Notice: This storefront is for demonstration and portfolio testing. No real cards or bank balances are debited. All placed demo orders are securely persisted to your local browser storage.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 rounded-xl text-stone-400 hover:text-white font-mono text-xs flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Address</span>
                </button>

                <button
                  type="button"
                  onClick={handleNextToStep3}
                  className="px-8 py-3.5 rounded-2xl bg-[#C8FF35] hover:bg-[#bbf325] text-[#17151C] font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-[#C8FF35]/20"
                >
                  <span>Review Final Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: ORDER REVIEW & CONFIRM */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FF4F9A]">
                  Step 3 of 3
                </span>
                <h2 className="text-2xl font-black font-display text-white mt-1">
                  ORDER REVIEW & CONFIRMATION
                </h2>
                <p className="text-xs text-stone-400 mt-1">
                  Please verify your order line items and shipping details before final placement.
                </p>
              </div>

              {/* Shipping & Payment Summary Review */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono p-4 rounded-2xl bg-stone-900 border border-stone-800">
                <div>
                  <span className="text-stone-500 block uppercase">Recipient:</span>
                  <p className="font-bold text-white mt-0.5">{fullName}</p>
                  <p className="text-stone-400">{phone}</p>
                  <p className="text-stone-400">{email}</p>
                </div>
                <div>
                  <span className="text-stone-500 block uppercase">Delivery Destination:</span>
                  <p className="font-bold text-white mt-0.5">{address}, {area}</p>
                  <p className="text-stone-400">{city}, Pakistan {postalCode}</p>
                  <p className="text-stone-400 mt-1">Method: {selectedDelivery.name}</p>
                  <p className="text-stone-400">Payment: <b className="text-[#C8FF35]">{selectedPayment.name}</b></p>
                </div>
              </div>

              {/* Line Items Snapshot */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase font-bold text-stone-300 tracking-wider">
                  Items in this Order ({cart.length})
                </h3>
                <div className="divide-y divide-stone-800 border border-stone-800 rounded-2xl p-4 bg-stone-900/60">
                  {cart.map((item) => (
                    <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-stone-800 shrink-0 border border-stone-700"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="font-bold text-white">{item.product.name}</h4>
                          <span className="text-stone-400 text-[11px] font-mono">
                            EU {item.selectedSize} · {item.selectedColor} · Qty: {item.quantity}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-white tabular-nums">
                        {formatPKR(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-stone-300">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 rounded text-[#C8FF35] bg-stone-800 border-stone-700 focus:ring-0 mt-0.5"
                  />
                  <span>
                    I confirm that the Pakistani shipping details are accurate and acknowledge that this is a simulated demo transaction with locally persisted order tracking.
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 rounded-xl text-stone-400 hover:text-white font-mono text-xs flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Options</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting || !agreeTerms}
                  onClick={handleFinalOrderSubmit}
                  className="px-8 py-4 rounded-2xl bg-[#C8FF35] hover:bg-[#bbf325] text-[#17151C] font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-transform active:scale-95 shadow-xl shadow-[#C8FF35]/25 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isSubmitting ? 'GENERATING DEMO ORDER...' : 'PLACE DEMO ORDER'}</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-[#17151C] text-white rounded-3xl p-6 sm:p-7 border border-stone-800 shadow-xl space-y-5">
          <h3 className="font-bold text-sm uppercase font-display tracking-wider text-[#C8FF35]">
            SUMMARY BREAKDOWN
          </h3>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between text-stone-400">
              <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span className="text-white tabular-nums">{formatPKR(subtotal)}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-[#C8FF35]">
                <span>Discount ({appliedPromo?.code || 'Promo'})</span>
                <span className="tabular-nums">-{formatPKR(discountAmount)}</span>
              </div>
            )}

            <div className="flex justify-between text-stone-400">
              <span>Delivery Charge</span>
              <span className="text-white tabular-nums">
                {subtotal >= 15000 ? 'FREE' : formatPKR(selectedDelivery.price)}
              </span>
            </div>

            <div className="pt-3 border-t border-stone-800 flex justify-between text-base font-bold">
              <span className="text-white">Total Amount</span>
              <span className="text-xl font-mono text-[#C8FF35] font-black tabular-nums">
                {formatPKR(Math.max(0, subtotal - discountAmount + (subtotal >= 15000 ? 0 : selectedDelivery.price)))}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-800 text-[11px] text-stone-400 space-y-1">
            <p>• Currency: <b>Pakistani Rupee (PKR)</b></p>
            <p>• Method: <b>{selectedPayment.name}</b></p>
            <p>• Courier: <b>{selectedDelivery.name}</b></p>
          </div>
        </div>

      </div>
    </div>
  );
};
