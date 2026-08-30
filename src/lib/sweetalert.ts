import Swal from 'sweetalert2';

export const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
  customClass: {
    popup: 'font-sans rounded-2xl shadow-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-900 dark:text-white',
  },
});

export const notifySuccess = (title: string, message?: string) => {
  toast.fire({
    icon: 'success',
    title: title,
    text: message,
    iconColor: '#10B981',
  });
};

export const notifyInfo = (title: string, message?: string) => {
  toast.fire({
    icon: 'info',
    title: title,
    text: message,
    iconColor: '#3B82F6',
  });
};

export const notifyError = (title: string, message?: string) => {
  toast.fire({
    icon: 'error',
    title: title,
    text: message,
    iconColor: '#EF4444',
  });
};

export const showConfirmModal = (
  title: string,
  text: string,
  confirmButtonText: string = 'Yes, proceed'
) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#000000',
    cancelButtonColor: '#94A3B8',
    confirmButtonText: confirmButtonText,
    customClass: {
      popup: 'font-sans rounded-3xl dark:bg-slate-900 dark:text-white',
    },
  });
};

export const showAddToCartModal = (
  productTitle: string,
  productImage?: string,
  onViewCart?: () => void
) => {
  return Swal.fire({
    title: 'Added to Cart Successfully!',
    html: `
      <div style="display:flex; align-items:center; justify-content:center; gap:12px; margin-top:12px; margin-bottom:6px;">
        ${productImage ? `<img src="${productImage}" alt="${productTitle}" style="width:64px; height:64px; object-fit:cover; border-radius:8px; border:1px solid #e2e8f0; flex-shrink:0;" />` : ''}
        <div style="text-align:left;">
          <p style="font-weight:700; font-size:13px; color:#1e293b; margin:0; line-height:1.4;">${productTitle}</p>
          <p style="font-size:11px; color:#64748b; margin-top:4px; margin-bottom:0;">Item has been added to your shopping bag.</p>
        </div>
      </div>
    `,
    icon: 'success',
    iconColor: '#FF6B00',
    showCancelButton: true,
    confirmButtonText: 'View Cart',
    cancelButtonText: 'Continue Shopping',
    confirmButtonColor: '#FF6B00',
    cancelButtonColor: '#0F396F',
    buttonsStyling: true,
    customClass: {
      popup: 'font-sans rounded-xl p-4 shadow-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-900 dark:text-white',
      title: 'text-sm sm:text-base font-extrabold text-gray-900 dark:text-white',
      confirmButton: 'px-4 py-2 text-xs font-bold text-white rounded-md shadow-xs mx-1 cursor-pointer',
      cancelButton: 'px-4 py-2 text-xs font-bold text-white rounded-md shadow-xs mx-1 cursor-pointer',
    },
  }).then((result) => {
    if (result.isConfirmed) {
      if (onViewCart) onViewCart();
    }
  });
};
