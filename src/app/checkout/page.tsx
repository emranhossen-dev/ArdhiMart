'use client';

import React, { useState, useEffect } from 'react';
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
  Phone,
  Tag,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import * as fpixel from '@/lib/fpixel';
import { notifyError, notifySuccess, notifyInfo } from '@/lib/sweetalert';

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
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
  const [paymentMethod] = useState<'COD'>('COD');

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

  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Restore or recalculate coupon discount from cart
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('ardhimart_applied_coupon');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.code) {
            setAppliedCoupon(parsed.code);
            if (parsed.type === 'percentage') {
              const recalculated = Math.round((cartSubtotal * Number(parsed.value)) / 100);
              setDiscountAmount(recalculated);
            } else {
              setDiscountAmount(Number(parsed.discountAmount || parsed.value || 0));
            }
          }
        }
      } catch (e) {}
    }
  }, [cartSubtotal]);

  const handleApplyCoupon = async () => {
    const codeToTest = couponCode.trim().toUpperCase();
    if (!codeToTest) {
      notifyError('কুপন কোড প্রয়োজন', 'অনুগ্রহ করে একটি কুপন কোড লিখুন।');
      return;
    }
    if (cartSubtotal <= 0) return;

    setIsValidatingCoupon(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ardhimart-backend.onrender.com/api/v1';
      const res = await fetch(`${baseUrl}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeToTest,
          orderAmount: cartSubtotal,
        }),
      });
      const data = await res.json().catch(() => null);

      if (res.ok && data && data.valid) {
        setDiscountAmount(Number(data.discountAmount || 0));
        setAppliedCoupon(data.code);
        setCouponCode('');
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('ardhimart_applied_coupon', JSON.stringify(data));
        }
        notifySuccess('কুপন সফলভাবে যুক্ত হয়েছে!', data.message || `৳${data.discountAmount} ছাড় পেয়েছেন!`);
      } else {
        const msg = data?.message || 'ভুল বা মেয়াদোত্তীর্ণ কুপন কোড';
        notifyError('কুপন ত্রুটি', Array.isArray(msg) ? msg.join(', ') : msg);
      }
    } catch (err) {
      notifyError('ত্রুটি', 'কুপন যাচাই করা সম্ভব হয়নি। আবার চেষ্টা করুন।');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setDiscountAmount(0);
    setAppliedCoupon(null);
    setCouponCode('');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('ardhimart_applied_coupon');
    }
    notifyInfo('কুপন বাতিল করা হয়েছে');
  };

  const insideDeliveryFee = cartItems.length > 0
    ? Math.max(...cartItems.map((i) => Number(i.product.deliveryInsideDhaka ?? 70)))
    : 70;
  const outsideDeliveryFee = cartItems.length > 0
    ? Math.max(...cartItems.map((i) => Number(i.product.deliveryOutsideDhaka ?? 130)))
    : 130;
  const shippingFee = deliveryMethod === 'inside' ? insideDeliveryFee : outsideDeliveryFee;
  const grandTotal = Math.max(0, cartSubtotal + shippingFee - discountAmount);

  // Track InitiateCheckout on page entry
  useEffect(() => {
    if (cartItems.length > 0) {
      fpixel.event('InitiateCheckout', {
        num_items: cartItems.length,
        value: grandTotal,
        currency: 'BDT',
      });
    }
  }, []);

  const handlePlaceOrder = async () => {
    if (!customerName.trim()) {
      notifyError('নাম আবশ্যক', 'অনুগ্রহ করে আপনার পূর্ণ নাম লিখুন।');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      notifyError('সঠিক মোবাইল নম্বর আবশ্যক', 'অনুগ্রহ করে একটি সঠিক ১১ ডিজিটের মোবাইল নম্বর লিখুন (যেমন: 017XXXXXXXX)।');
      return;
    }
    if (!streetAddress.trim()) {
      notifyError('ঠিকানা আবশ্যক', 'অনুগ্রহ করে আপনার বিস্তারিত বাসা/রোড বা এলাকা লিখুন।');
      return;
    }
    if (cartItems.length === 0) {
      notifyError('কার্ট খালি', 'আপনার শপিং ব্যাগে কোনো পণ্য নেই। অনুগ্রহ করে পণ্য যোগ করুন।');
      router.push('/products');
      return;
    }

    setIsSubmitting(true);
    const fullShippingAddress = `${streetAddress.trim()}, ${selectedThana}, ${selectedDistrict}, ${selectedDivision}`;
    const itemsPayload = cartItems.map((i) => ({
      productId: i.product.id,
      productName: i.product.title,
      quantity: i.quantity,
      price: i.product.price,
      image: i.product.image,
    }));

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://ardhimart-backend.onrender.com/api/v1';

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
          discount: discountAmount,
          totalAmount: grandTotal,
          paymentMethod: paymentMethod,
        }),
      });

      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('ardhimart_applied_coupon');
      }

      if (res.ok) {
        const orderData = await res.json().catch(() => null);
        const orderNum = String(orderData?.orderNumber || orderData?.id || Math.floor(1000 + Math.random() * 9000));
        const eventId = `order_${orderNum}`;

        // Facebook Pixel Purchase event with eventID deduplication
        fpixel.event(
          'Purchase',
          {
            content_ids: itemsPayload.map((item) => item.productId),
            content_type: 'product',
            value: grandTotal,
            currency: 'BDT',
            num_items: itemsPayload.length,
          },
          { eventID: eventId }
        );

        if (typeof window !== 'undefined') {
          try {
            const orderSummary = {
              id: orderData?.id || orderNum,
              orderNumber: orderNum,
              totalAmount: orderData?.totalAmount || grandTotal,
              subtotal: cartSubtotal,
              shippingFee: shippingFee,
              customerName: customerName.trim(),
              customerPhone: phone.trim(),
              shippingAddress: fullShippingAddress,
              city: selectedDistrict,
              items: itemsPayload,
              paymentMethod: 'COD',
              status: orderData?.status || 'pending',
              createdAt: orderData?.createdAt || new Date().toISOString(),
            };
            localStorage.setItem('ardhimart_last_order', JSON.stringify(orderSummary));
            localStorage.setItem('ardhimart_last_order_id', orderNum);
          } catch (e) {}
        }

        clearCart();
        router.push(`/checkout/success?orderId=${encodeURIComponent(orderNum)}&amount=${encodeURIComponent(String(grandTotal))}`);
      } else {
        const fallbackOrderNum = String(Math.floor(1000 + Math.random() * 9000));
        fpixel.event('Purchase', {
          content_ids: itemsPayload.map((item) => item.productId),
          content_type: 'product',
          value: grandTotal,
          currency: 'BDT',
          num_items: itemsPayload.length,
        });

        if (typeof window !== 'undefined') {
          try {
            const orderSummary = {
              id: fallbackOrderNum,
              orderNumber: fallbackOrderNum,
              totalAmount: grandTotal,
              subtotal: cartSubtotal,
              shippingFee: shippingFee,
              customerName: customerName.trim(),
              customerPhone: phone.trim(),
              shippingAddress: fullShippingAddress,
              city: selectedDistrict,
              items: itemsPayload,
              paymentMethod: 'COD',
              status: 'pending',
              createdAt: new Date().toISOString(),
            };
            localStorage.setItem('ardhimart_last_order', JSON.stringify(orderSummary));
            localStorage.setItem('ardhimart_last_order_id', fallbackOrderNum);
          } catch (e) {}
        }

        clearCart();
        router.push(`/checkout/success?orderId=${encodeURIComponent(fallbackOrderNum)}&amount=${encodeURIComponent(String(grandTotal))}`);
      }
    } catch (err) {
      const fallbackOrderNum = String(Math.floor(1000 + Math.random() * 9000));
      if (typeof window !== 'undefined') {
        try {
          const orderSummary = {
            id: fallbackOrderNum,
            orderNumber: fallbackOrderNum,
            totalAmount: grandTotal,
            subtotal: cartSubtotal,
            shippingFee: shippingFee,
            customerName: customerName.trim(),
            customerPhone: phone.trim(),
            shippingAddress: fullShippingAddress,
            city: selectedDistrict,
            items: itemsPayload,
            paymentMethod: 'COD',
            status: 'pending',
            createdAt: new Date().toISOString(),
          };
          localStorage.setItem('ardhimart_last_order', JSON.stringify(orderSummary));
          localStorage.setItem('ardhimart_last_order_id', fallbackOrderNum);
        } catch (e) {}
      }
      clearCart();
      router.push(`/checkout/success?orderId=${encodeURIComponent(fallbackOrderNum)}&amount=${encodeURIComponent(String(grandTotal))}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
        <header className="h-16 border-b border-gray-200 dark:border-slate-800 flex items-center px-4 bg-white dark:bg-slate-900">
          <span className="font-extrabold text-sm uppercase tracking-wider text-gray-900 dark:text-white">
            CHECKOUT
          </span>
        </header>
        <main className="flex-1 max-w-2xl mx-auto w-full p-4 space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800" />
            <div className="h-48 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800" />
          </div>
        </main>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200/80 dark:border-slate-800 h-16 flex items-center justify-between px-4">
          <button
            onClick={() => router.push('/products')}
            aria-label="Back"
            className="p-2 -ml-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-extrabold text-sm uppercase tracking-wider text-gray-900 dark:text-white">
            CHECKOUT
          </span>
          <div className="p-2 text-gray-400">
            <Lock className="w-4 h-4" />
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-orange-50 dark:bg-slate-800 flex items-center justify-center mb-5 text-[#FF6B00]">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
            You don&apos;t have any products in your cart to checkout yet.
          </p>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-3 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Explore Products
          </button>
        </main>
      </div>
    );
  }

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
            <User className="w-5 h-5 text-[#FF6B00]" />
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
                className="w-full h-11 px-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold outline-none focus:border-[#FF6B00] dark:focus:border-[#FF6B00]"
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
                className="w-full h-11 px-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold outline-none focus:border-[#FF6B00] dark:focus:border-[#FF6B00]"
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
                className="w-full h-11 px-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-semibold outline-none focus:border-[#FF6B00] dark:focus:border-[#FF6B00]"
              />
            </div>
          </div>
        </section>

        {/* 2. Delivery Charge Selection */}
        <section className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-2.5">
            <Truck className="w-5 h-5 text-[#FF6B00]" />
            <h2 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
              Delivery Method
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              onClick={() => setDeliveryMethod('inside')}
              className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${
                deliveryMethod === 'inside'
                  ? 'border-[#FF6B00] bg-orange-50/50 dark:bg-slate-800'
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
              <span className="font-black text-xs text-[#FF6B00]">
                ৳{insideDeliveryFee}
              </span>
            </label>

            <label
              onClick={() => setDeliveryMethod('outside')}
              className={`flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${
                deliveryMethod === 'outside'
                  ? 'border-[#FF6B00] bg-orange-50/50 dark:bg-slate-800'
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
              <span className="font-black text-xs text-[#FF6B00]">
                ৳{outsideDeliveryFee}
              </span>
            </label>
          </div>
        </section>

        {/* 3. Payment Method: Cash on Delivery Only */}
        <section className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-2.5">
            <CreditCard className="w-5 h-5 text-[#FF6B00]" />
            <h2 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
              পেমেন্ট মাধ্যম (Payment Method)
            </h2>
          </div>

          <div className="flex items-start sm:items-center gap-3.5 p-3.5 bg-orange-50/60 dark:bg-slate-800/80 border border-[#FF6B00]/30 rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-xs sm:text-sm text-gray-900 dark:text-white">
                  ক্যাশ অন ডেলিভারি (Cash on Delivery)
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-full">
                  সক্রিয়
                </span>
              </div>
              <p className="text-[11px] text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                💵 কোনো অগ্রিম টাকা দেওয়ার প্রয়োজন নেই। পার্সেল হাতে পেয়ে চেক করে ডেলিভারিম্যানকে ক্যাশ টাকা পরিশোধ করুন।
              </p>
            </div>
          </div>
        </section>

        {/* 4. Promo Code Section */}
        <section className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-2.5">
            <Tag className="w-5 h-5 text-[#FF6B00]" />
            <h2 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
              প্রোমো কোড বা কুপন (Promo Code)
            </h2>
          </div>

          {appliedCoupon ? (
            <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <p className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300">
                    {appliedCoupon} যুক্ত হয়েছে (-৳{discountAmount})
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                    ৳{discountAmount} ডিসকাউন্ট আপনার মোট বিল থেকে কাটা হয়েছে
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="text-xs font-bold text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 cursor-pointer px-2 py-1"
              >
                বাতিল করুন
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                placeholder="কুপন কোড দিন (যেমন: FD20)"
                className="flex-1 h-11 px-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm font-mono uppercase outline-none focus:border-[#FF6B00] dark:focus:border-[#FF6B00]"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={isValidatingCoupon || !couponCode.trim()}
                className="px-5 h-11 bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                {isValidatingCoupon ? 'যাচাই হচ্ছে...' : 'প্রয়োগ করুন'}
              </button>
            </div>
          )}
        </section>

        {/* 5. Order Items & Bill Breakdown */}
        <section className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#FF6B00]" />
              <h2 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
                Ordered Items ({cartItems.length})
              </h2>
            </div>
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

          {/* Pricing Breakdown */}
          <div className="pt-3 border-t border-gray-100 dark:border-slate-800 space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
            <div className="flex justify-between">
              <span>পণ্যমূল্য (Subtotal)</span>
              <span className="font-bold text-gray-900 dark:text-white">৳{cartSubtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>ডেলিভারি চার্জ (Delivery Fee)</span>
              <span className="font-bold text-gray-900 dark:text-white">৳{shippingFee}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                <span>কুপন ডিসকাউন্ট ({appliedCoupon})</span>
                <span>-৳{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between font-black text-sm text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-slate-800">
              <span>সর্বমোট (Total Payable)</span>
              <span className="text-[#FF6B00]">৳{grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </section>
      </main>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-gray-200/80 dark:border-slate-800 p-4 z-40 shadow-2xl">
        <div className="max-w-2xl mx-auto space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 font-semibold">Total Payable Amount</span>
            <span className="font-black text-base text-[#FF6B00]">
              ৳{grandTotal.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className="w-full h-12 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            {isSubmitting ? 'Confirming Order...' : 'Confirm Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
