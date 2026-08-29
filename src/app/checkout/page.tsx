'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { defaultStoreConfig } from '@/config/storeConfig';
import {
  ArrowLeft,
  Lock,
  ChevronDown,
  ShoppingBag,
  Truck,
  CreditCard,
  PhoneCall,
  CheckCircle,
  MapPin,
  ShieldCheck,
  User,
  Phone
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

// Authentic Bangladesh Administrative Divisions, Districts & Thanas Data
const bdLocations: Record<string, Record<string, string[]>> = {
  'Dhaka (ঢাকা)': {
    'Dhaka (ঢাকা)': ['Dhanmondi', 'Gulshan', 'Uttara', 'Mirpur', 'Mohammadpur', 'Badda', 'Khilgaon', 'Motijheel', 'Old Dhaka', 'Savar', 'Dhamrai', 'Keraniganj'],
    'Gazipur (গাজীপুর)': ['Gazipur Sadar', 'Kaliakair', 'Kapasia', 'Sreepur', 'Kaliganj'],
    'Narayanganj (নারায়ণগঞ্জ)': ['Narayanganj Sadar', 'Araihazar', 'Bandar', 'Rupganj', 'Sonargaon'],
    'Tangail (টাঙ্গাইল)': ['Tangail Sadar', 'Basail', 'Bhuapur', 'Delduar', 'Ghatail', 'Gopalpur', 'Madhupur', 'Mirzapur', 'Nagarpur', 'Sakhipur'],
    'Narsingdi (নরসিংদী)': ['Narsingdi Sadar', 'Belabo', 'Monohardi', 'Palash', 'Raipura', 'Shibpur'],
    'Faridpur (ফরিদপুর)': ['Faridpur Sadar', 'Alfadanga', 'Boalmari', 'Charbhadrashen', 'Madhukhali', 'Nagarkanda', 'Sadarpur', 'Saltha'],
    'Manikganj (মানিকগঞ্জ)': ['Manikganj Sadar', 'Singair', 'Saturia', 'Ghiror', 'Harirampur', 'Shivalaya', 'Daulatpur'],
    'Munshiganj (মুন্সীগঞ্জ)': ['Munshiganj Sadar', 'Gazaria', 'Tongibari', 'Sirajdikhan', 'Lohajang', 'Sreenagar'],
    'Gopalganj (গোপালগঞ্জ)': ['Gopalganj Sadar', 'Kashiani', 'Kotalipara', 'Muksudpur', 'Tungipara'],
    'Madaripur (মাদারীপুর)': ['Madaripur Sadar', 'Kalkini', 'Rajoir', 'Shibchar'],
    'Rajbari (রাজবাড়ী)': ['Rajbari Sadar', 'Baliakandi', 'Goalandaghat', 'Pangsha'],
    'Shariatpur (শরীয়তপুর)': ['Shariatpur Sadar', 'Bhedarganj', 'Damudya', 'Gosairhat', 'Naria', 'Zajira']
  },
  'Chattogram (চট্টগ্রাম)': {
    'Chattogram (চট্টগ্রাম)': ['Agrabad', 'GEC', 'Halishahar', 'Panchlaish', 'Kotwali', 'Patiya', 'Hathazari', 'Sitakunda', 'Mirsarai', 'Anwara', 'Banshkhali', 'Raozan'],
    'Cox\'s Bazar (কক্সবাজার)': ['Cox\'s Bazar Sadar', 'Chakaria', 'Maheshkhali', 'Teknaf', 'Ukhiya', 'Ramu', 'Pekua'],
    'Cumilla (কুমিল্লা)': ['Cumilla Sadar', 'Barura', 'Brahmanpara', 'Burichang', 'Chandina', 'Chouddagram', 'Daudkandi', 'Debidwar', 'Homna', 'Laksam', 'Muradnagar'],
    'Feni (ফেনী)': ['Feni Sadar', 'Chhagalnaiya', 'Daganbhuiyan', 'Fulgazi', 'Parshuram', 'Sonagazi'],
    'Brahmanbaria (ব্রাহ্মণবাড়িয়া)': ['Brahmanbaria Sadar', 'Akhaura', 'Ashuganj', 'Bancharampur', 'Kasba', 'Nabinagar', 'Nasirnagar', 'Sarail'],
    'Noakhali (নোয়াখালী)': ['Noakhali Sadar', 'Begumganj', 'Chatkhil', 'Companiganj', 'Hatiya', 'Senbagh', 'Subarnachar'],
    'Lakshmipur (লক্ষ্মীপুর)': ['Lakshmipur Sadar', 'Raipur', 'Ramganj', 'Ramgati', 'Kamalnagar'],
    'Chandpur (চাঁদপুর)': ['Chandpur Sadar', 'Faridganj', 'Haimchar', 'Hajiganj', 'Kachua', 'Matlab North', 'Matlab South', 'Shahrasti']
  },
  'Rajshahi (রাজশাহী)': {
    'Rajshahi (রাজশাহী)': ['Boalia', 'Rajpara', 'Shah Makhdum', 'Motihar', 'Paba', 'Godagari', 'Tanore', 'Mohanpur', 'Bagha', 'Charghat', 'Durgapur', 'Puthia'],
    'Bogra (বগুড়া)': ['Bogra Sadar', 'Adamdighi', 'Dhunat', 'Dupchanchia', 'Gabtali', 'Kahaloo', 'Nandigram', 'Sariakandi', 'Shajahanpur', 'Sherpur', 'Shibganj'],
    'Pabna (পাবনা)': ['Pabna Sadar', 'Atgharia', 'Bera', 'Bhangura', 'Chatmohar', 'Faridpur', 'Ishwardi', 'Santhia', 'Sujanagar'],
    'Naogaon (নওগাঁ)': ['Naogaon Sadar', 'Atrai', 'Badalgachhi', 'Dhamoirhat', 'Manda', 'Niamatpur', 'Patnitala', 'Porsha', 'Raninagar', 'Sapahar'],
    'Sirajganj (সিরাজগঞ্জ)': ['Sirajganj Sadar', 'Belkuchi', 'Chauhali', 'Kamarkhanda', 'Kazipur', 'Rayganj', 'Shahjadpur', 'Tarash', 'Ullapara'],
    'Natore (নাটোর)': ['Natore Sadar', 'Bagatipara', 'Baraigram', 'Gurudaspur', 'Lalpur', 'Singra']
  },
  'Khulna (খুলনা)': {
    'Khulna (খুলনা)': ['Khulna Sadar', 'Sonadanga', 'Khalishpur', 'Daulatpur', 'Batiaghata', 'Dacope', 'Dumuria', 'Dighalia', 'Koyra', 'Paikgachha', 'Rupsha'],
    'Jashore (যশোর)': ['Jashore Sadar', 'Abhaynagar', 'Bagherpara', 'Chaugachha', 'Jhikargachha', 'Keshabpur', 'Manirampur', 'Sharsha'],
    'Kushtia (কুষ্টিয়া)': ['Kushtia Sadar', 'Kumarkhali', 'Daulatpur', 'Mirpur', 'Bheramara', 'Khoksa'],
    'Satkhira (সাতক্ষীরা)': ['Satkhira Sadar', 'Assasuni', 'Debhata', 'Kalaroa', 'Kaliganj', 'Shyamnagar', 'Tala']
  },
  'Barishal (বরিশাল)': {
    'Barishal (বরিশাল)': ['Barishal Sadar', 'Agailjhara', 'Babuganj', 'Bakerganj', 'Banaripara', 'Gaurnadi', 'Hizla', 'Mehendiganj', 'Muladi', 'Wazirpur'],
    'Bhola (ভোলা)': ['Bhola Sadar', 'Burhanuddin', 'Char Fasson', 'Daulatkhan', 'Lalmohan', 'Manpura', 'Tazumuddin'],
    'Patuakhali (পটুয়াখালী)': ['Patuakhali Sadar', 'Bawalfal', 'Dashmina', 'Galachipa', 'Kalapara', 'Mirzaganj', 'Rangabali']
  },
  'Sylhet (সিলেট)': {
    'Sylhet (সিলেট)': ['Sylhet Sadar', 'Beanibazar', 'Bishwanath', 'Companiganj', 'Fenchuganj', 'Golapganj', 'Gowainghat', 'Jaintiapur', 'Kanaighat', 'Zakiganj'],
    'Moulvibazar (মৌলভীবাজার)': ['Moulvibazar Sadar', 'Barlekha', 'Juri', 'Kamalganj', 'Kulaura', 'Rajnagar', 'Sreemangal'],
    'Habiganj (হবিগঞ্জ)': ['Habiganj Sadar', 'Ajmiriganj', 'Bahubal', 'Baniyachong', 'Chhatak', 'Chunarughat', 'Lakhai', 'Madhabpur', 'Nabiganj']
  },
  'Rangpur (রংপুর)': {
    'Rangpur (রংপুর)': ['Rangpur Sadar', 'Badarganj', 'Gangachara', 'Kaunia', 'Mithapukur', 'Pirgachha', 'Pirganj', 'Taraganj'],
    'Dinajpur (দিনাজপুর)': ['Dinajpur Sadar', 'Birampur', 'Birganj', 'Biral', 'Bochaganj', 'Chirirbandar', 'Fulbari', 'Ghoraghat', 'Hakimpur'],
    'Gaibandha (গাইবান্ধা)': ['Gaibandha Sadar', 'Fulchhari', 'Gobindaganj', 'Palashbari', 'Sadullapur', 'Saghata', 'Sundarganj']
  },
  'Mymensingh (ময়মনসিংহ)': {
    'Mymensingh (ময়মনসিংহ)': ['Mymensingh Sadar', 'Bhaluka', 'Dhobaura', 'Fulbaria', 'Gafargaon', 'Gauripur', 'Haluaghat', 'Ishwarganj', 'Muktagachha', 'Nandail'],
    'Jamalpur (জামালপুর)': ['Jamalpur Sadar', 'Baksiganj', 'Dewanganj', 'Isampur', 'Madarganj', 'Melandaha', 'Sarishabari']
  }
};

export default function CheckoutPage() {
  const router = useRouter();
  const [storeConfig] = useState(defaultStoreConfig);
  const { cartItems, clearCart } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');

  // Bangladesh Cascading Address States
  const [selectedDivision, setSelectedDivision] = useState('Dhaka (ঢাকা)');
  const [selectedDistrict, setSelectedDistrict] = useState('Dhaka (ঢাকা)');
  const [selectedThana, setSelectedThana] = useState('Dhanmondi');
  const [streetAddress, setStreetAddress] = useState('');

  // Delivery & Payment Selection
  const [deliveryMethod, setDeliveryMethod] = useState<'inside' | 'outside'>('inside');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'bKash' | 'Card'>('COD');

  const divisionsList = Object.keys(bdLocations);
  const districtsList = selectedDivision && bdLocations[selectedDivision] ? Object.keys(bdLocations[selectedDivision]) : [];
  const thanasList = selectedDivision && selectedDistrict && bdLocations[selectedDivision]?.[selectedDistrict] ? bdLocations[selectedDivision][selectedDistrict] : [];

  const handleDivisionChange = (div: string) => {
    setSelectedDivision(div);
    const availableDistricts = Object.keys(bdLocations[div] || {});
    const firstDist = availableDistricts[0] || '';
    setSelectedDistrict(firstDist);

    const availableThanas = bdLocations[div]?.[firstDist] || [];
    setSelectedThana(availableThanas[0] || '');

    if (div.includes('Dhaka') && firstDist.includes('Dhaka')) {
      setDeliveryMethod('inside');
    } else {
      setDeliveryMethod('outside');
    }
  };

  const handleDistrictChange = (dist: string) => {
    setSelectedDistrict(dist);
    const availableThanas = bdLocations[selectedDivision]?.[dist] || [];
    setSelectedThana(availableThanas[0] || '');

    if (selectedDivision.includes('Dhaka') && dist.includes('Dhaka')) {
      setDeliveryMethod('inside');
    } else {
      setDeliveryMethod('outside');
    }
  };

  const cartSubtotal = cartItems.length > 0
    ? cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
    : 0;
  const shippingFee = deliveryMethod === 'inside' ? 80 : 120;
  const grandTotal = cartSubtotal + shippingFee;

  const handlePlaceOrder = async () => {
    if (!customerName.trim() || !phone.trim() || !streetAddress.trim()) {
      alert('Please enter your Name, Phone Number, and Detailed Street/House Address.');
      return;
    }

    setIsSubmitting(true);
    const fullShippingAddress = `${streetAddress.trim()}, ${selectedThana}, ${selectedDistrict}, ${selectedDivision}`;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ardhimart-backend.onrender.com/api/v1';
      const itemsPayload = cartItems.map((i) => ({
        productId: i.product.id,
        productName: i.product.title,
        quantity: i.quantity,
        price: i.product.price,
        image: i.product.image,
      }));

      const res = await fetch(`${baseUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: phone.trim(),
          shippingAddress: fullShippingAddress,
          city: selectedDistrict,
          items: itemsPayload,
          subtotal: cartSubtotal,
          shippingFee: shippingFee,
          totalAmount: grandTotal,
          paymentMethod: paymentMethod,
        }),
      });

      if (res.ok) {
        clearCart();
        router.push('/checkout/success');
      } else {
        router.push('/checkout/success');
      }
    } catch (err) {
      router.push('/checkout/success');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans pb-28 select-none">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200/80 dark:border-slate-800 h-16 flex items-center justify-between px-4">
        <button
          onClick={() => router.back()}
          aria-label="Back"
          className="p-2 -ml-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <span className="font-extrabold text-sm uppercase tracking-wider text-gray-900 dark:text-white">
          INSTANT CHECKOUT
        </span>

        <div className="p-2 text-gray-400">
          <Lock className="w-4 h-4" />
        </div>
      </header>

      {/* SINGLE UNIFIED CHECKOUT PAGE */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 space-y-4">
        {/* 1. Customer & Bangladesh Address Section */}
        <section className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-3">
            <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
              Customer Information & Delivery Address
            </h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                Your Full Name (আপনার পুরো নাম) *
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Shakib Al Hasan"
                className="w-full h-11 px-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold outline-none focus:border-indigo-600 dark:focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                Mobile Number (মোবাইল নম্বর) *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 01700000000"
                className="w-full h-11 px-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold outline-none focus:border-indigo-600 dark:focus:border-indigo-400"
              />
            </div>

            {/* BANGLADESH CASCADING LOCATION DROPDOWNS */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block mb-1">
                  Division (বিভাগ) *
                </label>
                <select
                  value={selectedDivision}
                  onChange={(e) => handleDivisionChange(e.target.value)}
                  className="w-full h-10 px-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none text-gray-900 dark:text-white"
                >
                  {divisionsList.map((div) => (
                    <option key={div} value={div}>
                      {div}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block mb-1">
                  District (জেলা) *
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full h-10 px-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none text-gray-900 dark:text-white"
                >
                  {districtsList.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block mb-1">
                  Upazila/Thana (উপজেলা/থানা) *
                </label>
                <select
                  value={selectedThana}
                  onChange={(e) => setSelectedThana(e.target.value)}
                  className="w-full h-10 px-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none text-gray-900 dark:text-white"
                >
                  {thanasList.map((thana) => (
                    <option key={thana} value={thana}>
                      {thana}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1">
                House / Road / Flat Details (বাসা/রাস্তা বিবরণ) *
              </label>
              <input
                type="text"
                value={streetAddress}
                onChange={(e) => setStreetAddress(e.target.value)}
                placeholder="e.g. House #12, Road #4, Block B"
                className="w-full h-11 px-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold outline-none focus:border-indigo-600 dark:focus:border-indigo-400"
              />
            </div>
          </div>
        </section>

        {/* 2. Delivery Charge Selection */}
        <section className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-2.5">
            <Truck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
              Delivery Method
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              onClick={() => setDeliveryMethod('inside')}
              className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${
                deliveryMethod === 'inside'
                  ? 'border-indigo-600 bg-indigo-50/30 dark:bg-slate-800'
                  : 'border-gray-200 dark:border-slate-800'
              }`}
            >
              <div>
                <span className="font-extrabold text-xs text-gray-900 dark:text-white block">
                  Inside Dhaka City
                </span>
                <span className="text-[10px] text-gray-500 block">
                  Express Delivery (24 Hours)
                </span>
              </div>
              <span className="font-black text-xs text-indigo-600 dark:text-indigo-400">
                ৳80
              </span>
            </label>

            <label
              onClick={() => setDeliveryMethod('outside')}
              className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${
                deliveryMethod === 'outside'
                  ? 'border-indigo-600 bg-indigo-50/30 dark:bg-slate-800'
                  : 'border-gray-200 dark:border-slate-800'
              }`}
            >
              <div>
                <span className="font-extrabold text-xs text-gray-900 dark:text-white block">
                  Outside Dhaka (All Bangladesh)
                </span>
                <span className="text-[10px] text-gray-500 block">
                  Courier Delivery (2-3 Days)
                </span>
              </div>
              <span className="font-black text-xs text-indigo-600 dark:text-indigo-400">
                ৳120
              </span>
            </label>
          </div>
        </section>

        {/* 3. Payment Method */}
        <section className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-2.5">
            <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
              Payment Method
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('COD')}
              className={`py-3 px-2 border rounded-xl font-bold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
                paymentMethod === 'COD'
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                  : 'border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              Cash On Delivery
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('bKash')}
              className={`py-3 px-2 border rounded-xl font-bold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
                paymentMethod === 'bKash'
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                  : 'border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              bKash
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('Card')}
              className={`py-3 px-2 border rounded-xl font-bold text-xs flex flex-col items-center gap-1 transition-all cursor-pointer ${
                paymentMethod === 'Card'
                  ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm'
                  : 'border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Card
            </button>
          </div>

          {paymentMethod === 'COD' && (
            <p className="text-xs text-gray-500 bg-gray-50 dark:bg-slate-800/80 p-3 rounded-xl">
              💵 পণ্য হাতে পেয়ে কুরিয়ার ডেলিভারিম্যানকে ক্যাশ টাকা পরিশোধ করুন।
            </p>
          )}
        </section>

        {/* 4. Order Items Summary */}
        <section className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
                Ordered Items ({cartItems.length})
              </h2>
            </div>
            <span className="font-black text-sm text-indigo-600 dark:text-indigo-400">
              ৳{grandTotal.toLocaleString()}
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-9 h-9 object-cover rounded-lg bg-gray-100 dark:bg-slate-800 shrink-0"
                  />
                  <span className="font-semibold text-gray-900 dark:text-white truncate">
                    {item.product.title}
                  </span>
                </div>
                <span className="font-bold text-gray-500 shrink-0">
                  {item.quantity} x ৳{item.product.price}
                </span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-gray-200/80 dark:border-slate-800 p-4 z-40 shadow-2xl">
        <div className="max-w-2xl mx-auto space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 font-semibold">Total Payable Amount</span>
            <span className="font-black text-base text-indigo-600 dark:text-indigo-400">
              ৳{grandTotal.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            {isSubmitting ? 'Confirming Order...' : 'Confirm Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
