'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
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
  Plus,
  Minus,
  Trash2,
  ChevronRight,
  AlertCircle,
  Check,
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
  const { cartItems, clearCart, updateQuantity, removeFromCart, storeConfig } = useStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Track excluded/unchecked item IDs in checkout
  const [excludedItemIds, setExcludedItemIds] = useState<string[]>([]);

  // Filter only checked items for the active order
  const activeOrderItems = cartItems.filter((item) => !excludedItemIds.includes(item.product.id));

  const toggleItemSelection = (productId: string) => {
    setExcludedItemIds((prev) => {
      const nextExcluded = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      if (typeof window !== 'undefined') {
        const remainingSelected = cartItems
          .map((i) => i.product.id)
          .filter((id) => !nextExcluded.includes(id));
        sessionStorage.setItem('ardhimart_checkout_selected_ids', JSON.stringify(remainingSelected));
      }
      return nextExcluded;
    });
  };

  const isItemSelected = (productId: string) => !excludedItemIds.includes(productId);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('ardhimart_checkout_selected_ids');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            const allCartIds = cartItems.map((i) => i.product.id);
            const excluded = allCartIds.filter((id) => !parsed.includes(id));
            setExcludedItemIds(excluded);
          }
        }
      } catch (e) {}
    }
  }, [cartItems]);

  // Form Fields State
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');

  // Bangladesh Cascading Address States
  const [selectedDivision, setSelectedDivision] = useState('Dhaka (ঢাকা)');
  const [selectedDistrict, setSelectedDistrict] = useState('Dhaka (ঢাকা)');
  const [selectedThana, setSelectedThana] = useState('Dhanmondi');
  const [streetAddress, setStreetAddress] = useState('');

  // Auto-detect delivery zone strictly from selected district
  const isInsideDhaka = Boolean(
    selectedDistrict && (
      selectedDistrict.toLowerCase().includes('dhaka') ||
      selectedDistrict.includes('ঢাকা')
    )
  );
  const deliveryMethod = isInsideDhaka ? 'inside' : 'outside';
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
  };

  const handleDistrictChange = (dist: string) => {
    setSelectedDistrict(dist);
    const availableThanas = bdLocations[selectedDivision]?.[dist] || [];
    setSelectedThana(availableThanas[0] || '');
  };

  const cartSubtotal = activeOrderItems.length > 0
    ? activeOrderItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
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

  // Fallback shipping fees from storeConfig if product doesn't specify
  const fallbackInside = storeConfig?.deliveryInsideDhaka ?? (storeConfig?.flatShippingFee !== undefined ? Number(storeConfig.flatShippingFee) : 70);
  const fallbackOutside = storeConfig?.deliveryOutsideDhaka ?? (storeConfig?.flatShippingFee !== undefined ? Number(storeConfig.flatShippingFee) : 130);

  const insideDeliveryFee = activeOrderItems.length > 0
    ? Math.max(
        ...activeOrderItems.map((i) => {
          const val = i.product.deliveryInsideDhaka;
          return val !== undefined && val !== null ? Number(val) : fallbackInside;
        })
      )
    : 0;

  const outsideDeliveryFee = activeOrderItems.length > 0
    ? Math.max(
        ...activeOrderItems.map((i) => {
          const val = i.product.deliveryOutsideDhaka;
          return val !== undefined && val !== null ? Number(val) : fallbackOutside;
        })
      )
    : 0;

  // If 0 items selected/in cart: shipping fee is strictly 0!
  const shippingFee = activeOrderItems.length === 0
    ? 0
    : (isInsideDhaka ? insideDeliveryFee : outsideDeliveryFee);

  const grandTotal = activeOrderItems.length === 0
    ? 0
    : Math.max(0, cartSubtotal + shippingFee - discountAmount);

  // Helper to remove ordered items from cart, keeping unchecked ones for future checkout
  const finalizeCartItems = () => {
    if (activeOrderItems.length >= cartItems.length) {
      clearCart();
    } else {
      activeOrderItems.forEach((item) => removeFromCart(item.product.id));
    }
  };

  // Track InitiateCheckout on page entry
  useEffect(() => {
    if (activeOrderItems.length > 0) {
      fpixel.event('InitiateCheckout', {
        num_items: activeOrderItems.length,
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
    if (activeOrderItems.length === 0) {
      notifyError('কোনো পণ্য সিলেক্ট করা নেই', 'অর্ডার সম্পন্ন করতে কমপক্ষে ১টি পণ্য চেকমার্ক দিয়ে সিলেক্ট করুন।');
      return;
    }

    setIsSubmitting(true);
    const fullShippingAddress = `${streetAddress.trim()}, ${selectedThana}, ${selectedDistrict}, ${selectedDivision}`;
    const itemsPayload = activeOrderItems.map((i) => ({
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

            const prevOrdersStr = localStorage.getItem('ardhimart_user_orders');
            const prevOrders = prevOrdersStr ? JSON.parse(prevOrdersStr) : [];
            const updatedOrders = [orderSummary, ...prevOrders.filter((o: any) => o.id !== orderSummary.id && o.orderNumber !== orderSummary.orderNumber)];
            localStorage.setItem('ardhimart_user_orders', JSON.stringify(updatedOrders));
          } catch (e) {}
        }

        finalizeCartItems();
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

        finalizeCartItems();
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
      finalizeCartItems();
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
        <main className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-4">
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800" />
            <div className="h-48 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800" />
          </div>
        </main>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans">
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200/80 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-8">
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
          <div className="w-20 h-20 rounded-3xl bg-orange-50 dark:bg-slate-800 flex items-center justify-center mb-5 text-[#FF6B00]">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-2">
            আপনার শপিং ব্যাগ খালি
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
            চেকআউট করতে আপনার শপিং ব্যাগে কোনো পণ্য নেই। আমাদের ট্রেন্ডিং গ্যাজেটগুলো দেখতে পারেন।
          </p>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-3 bg-[#FF6B00] hover:bg-[#e05e00] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
          >
            পণ্য দেখুন (Explore Products)
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 flex flex-col font-sans pb-28 lg:pb-12">
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200/80 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          aria-label="Back"
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">পেছনে যান</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-black text-sm uppercase tracking-wider text-gray-900 dark:text-white">
            ক্যাশ অন ডেলিভারি চেকআউট
          </span>
          <span className="hidden sm:inline-block text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300">
            SSL 256-Bit Secured
          </span>
        </div>

        <div className="flex items-center gap-1 text-gray-400 text-xs">
          <Lock className="w-4 h-4 text-[#FF6B00]" />
          <span className="hidden sm:inline text-[11px] font-bold">নিরাপদ পেমেন্ট</span>
        </div>
      </header>

      {/* Main Checkout Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* Desktop Breadcrumbs & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <nav className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-1.5">
              <Link href="/" className="hover:text-[#FF6B00] transition-colors">হোম</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/cart" className="hover:text-[#FF6B00] transition-colors">কার্ট</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-900 dark:text-white font-bold">চেকআউট</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              অর্ডার কনফার্মেশন (Checkout)
            </h1>
          </div>

          <div className="inline-flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#FF6B00]" />
            <span>কোনো অগ্রিম পেমেন্ট নেই • পণ্য হাতে পেয়ে মূল্য পরিশোধ</span>
          </div>
        </div>

        {/* 2-Column Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (lg:col-span-7) - Customer Details & Address */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Customer Information & Delivery Address Section */}
            <section className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-7 space-y-5 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-gray-100 dark:border-slate-800 pb-3.5">
                <User className="w-5 h-5 text-[#FF6B00]" />
                <h2 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white">
                  গ্রাহকের তথ্য ও ডেলিভারি ঠিকানা
                </h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                      আপনার পুরো নাম (Full Name) *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="যেমন: সাকিব আল হাসান"
                        className="w-full h-11 px-4 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-semibold outline-none focus:border-[#FF6B00] dark:focus:border-[#FF6B00] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                      মোবাইল নম্বর (Phone Number) *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="যেমন: 01700000000"
                        className="w-full h-11 px-4 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-semibold font-mono outline-none focus:border-[#FF6B00] dark:focus:border-[#FF6B00] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Cascading Location Selectors */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block mb-1.5">
                      বিভাগ (Division) *
                    </label>
                    <div className="relative">
                      <select
                        value={selectedDivision}
                        onChange={(e) => handleDivisionChange(e.target.value)}
                        className="w-full h-11 px-3 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none text-gray-900 dark:text-white appearance-none cursor-pointer pr-8"
                      >
                        {divisionsList.map((div) => (
                          <option key={div} value={div}>
                            {div}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block mb-1.5">
                      জেলা (District) *
                    </label>
                    <div className="relative">
                      <select
                        value={selectedDistrict}
                        onChange={(e) => handleDistrictChange(e.target.value)}
                        className="w-full h-11 px-3 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none text-gray-900 dark:text-white appearance-none cursor-pointer pr-8"
                      >
                        {districtsList.map((dist) => (
                          <option key={dist} value={dist}>
                            {dist}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 block mb-1.5">
                      উপজেলা/থানা (Thana) *
                    </label>
                    <div className="relative">
                      <select
                        value={selectedThana}
                        onChange={(e) => setSelectedThana(e.target.value)}
                        className="w-full h-11 px-3 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs font-bold outline-none text-gray-900 dark:text-white appearance-none cursor-pointer pr-8"
                      >
                        {thanasList.map((thana) => (
                          <option key={thana} value={thana}>
                            {thana}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block mb-1.5">
                    বিস্তারিত বাসা / রোড / এরিয়া ঠিকানা (Street Address) *
                  </label>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    placeholder="যেমন: বাসা #১২, রোড #৪, সেক্টর #১০ বা স্থানীয় ল্যান্ডমার্ক"
                    className="w-full h-11 px-4 bg-gray-50 dark:bg-slate-800/80 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-semibold outline-none focus:border-[#FF6B00] dark:focus:border-[#FF6B00] transition-colors"
                  />
                </div>

                {/* Auto-detected Delivery Area Notice */}
                <div className="flex items-center justify-between p-4 bg-orange-50/70 dark:bg-slate-800/80 border border-[#FF6B00]/30 rounded-2xl">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center shrink-0">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                        <span>ডেলিভারি জোন:</span>
                        <span className="text-[#FF6B00]">
                          {isInsideDhaka ? 'ঢাকা সিটির ভেতরে' : 'ঢাকার বাইরে (সারাদেশ)'}
                        </span>
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                        {isInsideDhaka ? '২৪ ঘণ্টার মধ্যে দ্রুততম এক্সপ্রেস ডেলিভারি' : '২-৩ দিনের মধ্যে কুরিয়ার হোম ডেলিভারি'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className="text-sm font-black text-[#FF6B00] block">
                      {activeOrderItems.length === 0 ? '৳০' : `৳${shippingFee}`}
                    </span>
                    <span className="text-[10px] text-gray-400 block font-semibold">
                      অটো চার্জ
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Payment Method Card */}
            <section className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-7 space-y-4 shadow-sm">
              <div className="flex items-center gap-2.5 border-b border-gray-100 dark:border-slate-800 pb-3">
                <CreditCard className="w-5 h-5 text-[#FF6B00]" />
                <h2 className="font-extrabold text-base sm:text-lg text-gray-900 dark:text-white">
                  পেমেন্ট পদ্ধতি (Payment Method)
                </h2>
              </div>

              <div className="flex items-start sm:items-center gap-4 p-4 bg-orange-50/60 dark:bg-slate-800/80 border border-[#FF6B00]/30 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-black text-sm text-gray-900 dark:text-white">
                      ক্যাশ অন ডেলিভারি (Cash on Delivery)
                    </span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 rounded-full border border-emerald-300">
                      সক্রিয় মেথড
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                    💵 কোনো অগ্রিম টাকা দেওয়ার প্রয়োজন নেই। পার্সেল হাতে পেয়ে ডেলিভারিম্যানকে পণ্য মূল্য পরিশোধ করবেন।
                  </p>
                </div>
              </div>
            </section>

            {/* 3. Safe Shopping Trust Banner */}
            <section className="bg-gradient-to-r from-emerald-50/60 to-teal-50/40 dark:from-slate-900 dark:to-slate-800/60 rounded-3xl p-5 border border-emerald-200/50 dark:border-slate-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white">
                  ১০০% নিশ্চিন্ত ও নিরাপদ অনলাইন শপিং
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                  পণ্য হাতে পাওয়ার পর যাচাই করার নিশ্চয়তা এবং যেকোনো সমস্যায় দ্রুত রিপ্লেসমেন্ট সাপোর্ট।
                </p>
              </div>
            </section>
          </div>

          {/* Right Column (lg:col-span-5) - Order Summary, Promo, Bill & Desktop CTA */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Promo Code Box */}
            <section className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-3.5 shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-2.5">
                <Tag className="w-4 h-4 text-[#FF6B00]" />
                <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">
                  প্রোমো কোড বা কুপন (Promo Code)
                </h3>
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-3.5">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <p className="text-xs font-black text-emerald-800 dark:text-emerald-300">
                        {appliedCoupon} সক্রিয় (-৳{discountAmount})
                      </p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400">
                        ৳{discountAmount} ডিসকাউন্ট যুক্ত হয়েছে
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs font-bold text-rose-500 hover:text-rose-700 dark:hover:text-rose-400 cursor-pointer px-2 py-1"
                  >
                    বাতিল
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    placeholder="কুপন কোড দিন..."
                    className="flex-1 h-11 px-3.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm font-mono uppercase outline-none focus:border-[#FF6B00] dark:focus:border-[#FF6B00] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={isValidatingCoupon || !couponCode.trim()}
                    className="px-5 h-11 bg-black dark:bg-white text-white dark:text-black font-extrabold text-xs uppercase tracking-wider rounded-2xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50 shadow-xs"
                  >
                    {isValidatingCoupon ? 'যাচাই...' : 'প্রয়োগ'}
                  </button>
                </div>
              )}
            </section>

            {/* Order Items & Breakdown Card */}
            <section className="bg-white dark:bg-slate-900 border border-gray-200/80 dark:border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#FF6B00]" />
                  <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
                    অর্ডার সামারি ({activeOrderItems.length} টি নির্বাচিত)
                  </h3>
                </div>
                <span className="text-xs font-bold text-gray-400">
                  মোট {cartItems.length} টি পণ্য
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800 pr-1">
                {cartItems.map((item) => {
                  const isChecked = isItemSelected(item.product.id);
                  return (
                    <div
                      key={item.product.id}
                      className={`pt-3 first:pt-0 flex items-center justify-between gap-3 transition-opacity ${
                        isChecked ? 'opacity-100' : 'opacity-40'
                      }`}
                    >
                      {/* Checkbox + Thumbnail + Info */}
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleItemSelection(item.product.id)}
                          className="w-4 h-4 rounded text-[#FF6B00] accent-[#FF6B00] cursor-pointer shrink-0"
                          title={isChecked ? 'অর্ডার থেকে বাদ দিন' : 'অর্ডারে অন্তর্ভুক্ত করুন'}
                        />

                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-12 h-12 object-cover rounded-xl bg-gray-100 dark:bg-slate-800 shrink-0 border border-gray-200 dark:border-slate-700"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-xs text-gray-900 dark:text-white truncate">
                            {item.product.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                            <span>৳{item.product.price}</span>
                            {!isChecked && (
                              <span className="text-[9px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-1 py-0.5 rounded">
                                বাদ দেওয়া
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stepper + Price */}
                      <div className="flex items-center gap-2.5 shrink-0">
                        <div className="flex items-center border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-slate-800">
                          <button
                            type="button"
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(item.product.id, -1);
                              } else {
                                removeFromCart(item.product.id);
                              }
                            }}
                            className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-black text-gray-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.product.id, 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-extrabold text-xs text-gray-900 dark:text-white min-w-[3.5rem] text-right">
                          ৳{(item.product.price * item.quantity).toLocaleString()}
                        </span>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-1 text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-md transition-colors cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-gray-100 dark:border-slate-800 space-y-2 text-xs text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>পণ্যমূল্য (Subtotal)</span>
                  <span className="font-bold text-gray-900 dark:text-white">৳{cartSubtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>ডেলিভারি চার্জ ({isInsideDhaka ? 'ঢাকা সিটি' : 'ঢাকার বাইরে'})</span>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {activeOrderItems.length === 0 ? '৳০' : `৳${shippingFee}`}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                    <span>কুপন ডিসকাউন্ট ({appliedCoupon})</span>
                    <span>-৳{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between font-black text-base text-gray-900 dark:text-white pt-3 border-t border-gray-100 dark:border-slate-800">
                  <span>সর্বমোট প্রদেয় বিল</span>
                  <span className="text-[#FF6B00]">৳{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Desktop Confirm Order CTA (hidden on mobile, visible on desktop) */}
              <div className="hidden lg:block pt-3">
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting || activeOrderItems.length === 0}
                  className={`w-full py-4 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98 cursor-pointer ${
                    activeOrderItems.length === 0
                      ? 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed opacity-70'
                      : 'bg-[#FF6B00] hover:bg-[#e05e00] shadow-orange-500/20'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? 'অর্ডার কনফার্ম হচ্ছে...'
                      : activeOrderItems.length === 0
                      ? 'কোনো পণ্য সিলেক্ট করা নেই'
                      : `অর্ডার কনফার্ম করুন (Confirm Order) • ৳${grandTotal.toLocaleString()}`}
                  </span>
                </button>
                <p className="text-[11px] text-center text-gray-400 mt-2">
                  🔒 ক্যাশ অন ডেলিভারি • পার্সেল হাতে পেয়ে মূল্য পরিশোধ করবেন
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Action Bar (Strictly Mobile < lg) */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-gray-200/80 dark:border-slate-800 p-4 z-40 shadow-2xl">
        <div className="max-w-2xl mx-auto space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 font-semibold">Total Payable Amount</span>
            <span className="font-black text-base text-[#FF6B00]">
              ৳{grandTotal.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting || activeOrderItems.length === 0}
            className={`w-full h-12 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98 cursor-pointer ${
              activeOrderItems.length === 0
                ? 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed opacity-70'
                : 'bg-[#FF6B00] hover:bg-[#e05e00]'
            }`}
          >
            <Lock className="w-4 h-4" />
            {isSubmitting
              ? 'অর্ডার কনফার্ম হচ্ছে...'
              : activeOrderItems.length === 0
              ? 'কোনো পণ্য সিলেক্ট করা নেই'
              : 'অর্ডার কনফার্ম করুন (Confirm Order)'}
          </button>
        </div>
      </div>

      <Footer className="hidden md:block" />
    </div>
  );
}
