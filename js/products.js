/* الأقسام */
const categories = [
  {
    id: "sneakers",
    name: "سنيكرز",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85",
    description: "اكتشف المجموعة",
  },
  {
    id: "classic",
    name: "جزم كلاسيك",
    image:
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=700&q=85",
    description: "أناقة في كل خطوة",
  },
  {
    id: "bags",
    name: "شنط",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=85",
    description: "اختيارات تناسبك",
  },
  {
    id: "accessories",
    name: "إكسسوارات",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=85",
    description: "التفاصيل بتفرق",
  },
  {
    id: "mirror",
    name: "الميرور",
    image: "img/mirror.jpg",
    description: "اكتشف مجموعة الميرور",
  },
  {
    id: "high-copy",
    name: "الهاي كوبي",
    image: "img/high-copy.jpg",
    description: "شوف أحدث الموديلات",
  },
  {
    id: "sherbat",
    name: "الشربات",
    image: "img/sherbat.jpg",
    description: "اختار اللي يناسبك",
  },
];

/* المنتجات - عدّل أسماء الصور والأسعار حسب منتجاتك */
const sneakerProducts = Array.from({ length: 27 }, (_, index) => {
  const number = index + 1;
  const image = `img/productsImg/pro${number}.${number === 15 ? "webp" : "jpg"}`;

  return {
    id: `sneaker-${number}`,
    category: "sneakers",
    categoryName: "سنيكرز",
    name: `سنيكرز DANZO - ${String(number).padStart(2, "0")}`,
    price: 1450,
    oldPrice: null,
    image,
    images: [image],
    description: "سنيكرز عملي بتصميم مميز وراحة في كل خطوة.",
    badge: "",
    rating: "4.8",
  };
});

const products = [
  ...sneakerProducts,
  {
    id: "3",
    category: "classic",
    categoryName: "جزم كلاسيك",
    name: "حذاء كلاسيك جلد",
    price: 1850,
    image:
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=700&q=85",
    description: "اختيار أنيق للمناسبات والإطلالات الرسمية.",
    rating: "4.7",
  },
  {
    id: "4",
    category: "classic",
    categoryName: "جزم كلاسيك",
    name: "حذاء رسمي أسود",
    price: 1650,
    image:
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=700&q=85",
    description: "تصميم راقٍ يناسب المناسبات المختلفة.",
    rating: "4.8",
  },
  {
    id: "5",
    category: "bags",
    categoryName: "شنط",
    name: "شنطة أنيقة",
    price: 1150,
    oldPrice: 1400,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=700&q=85",
    description: "عملية وأنيقة للاستخدام اليومي.",
    badge: "عرض خاص",
    rating: "4.9",
  },
  {
    id: "6",
    category: "bags",
    categoryName: "شنط",
    name: "شنطة كاجوال",
    price: 950,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85",
    description: "اختيار مناسب للخروجات اليومية.",
    rating: "4.6",
  },
  {
    id: "7",
    category: "accessories",
    categoryName: "إكسسوارات",
    name: "حزام جلد أنيق",
    price: 450,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=85",
    description: "تفاصيل بسيطة تكمل إطلالتك.",
    rating: "4.7",
  },
  {
    id: "8",
    category: "accessories",
    categoryName: "إكسسوارات",
    name: "ساعة أنيقة",
    price: 1350,
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=700&q=85",
    description: "لمسة مميزة تناسب إطلالتك اليومية.",
    badge: "مميز",
    rating: "4.8",
  },
  {
    id: "9",
    category: "mirror",
    categoryName: "الميرور",
    name: "حذاء ميرور",
    price: 1800,
    image: "img/mirror-product.jpg",
    description: "موديل ميرور بتصميم مميز.",
    badge: "الميرور",
    rating: "5.0",
  },
  {
    id: "10",
    category: "high-copy",
    categoryName: "الهاي كوبي",
    name: "حذاء هاي كوبي",
    price: 1500,
    image: "img/high-copy-product.jpg",
    description: "ستايل مميز من قسم الهاي كوبي.",
    badge: "هاي كوبي",
    rating: "4.9",
  },
  {
    id: "11",
    category: "sherbat",
    categoryName: "الشربات",
    name: "شربات",
    price: 150,
    image: "img/sherbat-product.jpg",
    description: "اختيارات متنوعة من الشربات.",
    badge: "جديد",
    rating: "4.8",
  },
];
