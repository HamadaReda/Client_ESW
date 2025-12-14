import React, { Fragment, useState, useEffect } from "react";
import axios from "axios"; // تأكد من استيراد axios
import CardSection from "../../components/Admin/Dashboard/CardSection";
import ChartSection from "../../components/Admin/Dashboard/ChartSection";
import TabelSection from "../../components/Admin/Dashboard/TabelSection";
import { BASE_URL } from "../../constants";

const Dashboard = () => {
  const [product, setProduct] = useState(null); // متغير لتخزين البيانات
  const [productCount, setProductCount] = useState(0); // متغير لتخزين عدد المنتجات
  const [orders, setOrders] = useState([]); // متغير لتخزين الطلبات
  const [orderCount, setOrderCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [loading, setLoading] = useState(true); // متغير للتحكم بحالة التحميل
  const [error, setError] = useState(null); // متغير لتخزين الأخطاء

  const [totalPricesByMonth, setTotalPricesByMonth] = useState(Array(12).fill(0)); // مصفوفة لتخزين إجمالي الأسعار لكل شهر
  const [orderStatusCounts, setOrderStatusCounts] = useState([0, 0, 0, 0]); // [Pending, Shipped, Completed, Cancelled]

  // Fetch products and orders
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/products`);
        const products = response.data.data.products;
        const count = response.data.data.count; // الحصول على عدد المنتجات

        // نجلب البيانات من الـ API ونخزنها في product
        setProduct(products);
        setProductCount(count); // تخزين عدد المنتجات

        setLoading(false); // ننهي حالة التحميل بعد جلب البيانات
      } catch (err) {
        setError(err.message); // تخزين الخطأ إن وجد
        setLoading(false); // ننهي حالة التحميل حتى في حالة وجود خطأ
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/orders`, {
          withCredentials: true,
        });
        const fetchedOrders = response.data.data.orders;
        const fetchOrdersCount = response.data.data["Total Orders"]


        // فرز الطلبات حسب createdAt (من الأحدث إلى الأقدم)
        const sortedOrders = fetchedOrders.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );

        // تعيين أول 5 طلبات فقط
        setOrders(sortedOrders.slice(0, 10));
        setOrderCount(fetchOrdersCount)

        // حساب إجمالي الأسعار لكل شهر
        calculateTotalPricesByMonth(sortedOrders);

        // حساب أعداد الطلبات حسب الحالة
        const statusCounts = calculateOrderCountsByStatus(sortedOrders);
        setOrderStatusCounts(statusCounts); // تحديث الحالة بالعد الجديد


        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };

    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/admins`, {
          withCredentials: true,
        });

        // جلب جميع المستخدمين من الاستجابة
        const fetchedUsers = response.data.data.allUsers;

        // حساب عدد المستخدمين الذين لديهم دور "customer"
        const customerCount = fetchedUsers.filter(user => user.role === "customer").length;

        // تعيين عدد العملاء
        setCustomerCount(customerCount);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    // دالة لحساب إجمالي الأسعار لكل شهر
    const calculateTotalPricesByMonth = (orders) => {
      const monthlyTotals = Array(12).fill(0); // مصفوفة تحتوي على 12 عنصر، كل عنصر مبدئيًا يساوي 0

      orders.forEach(order => {
        const orderDate = new Date(order.createdAt); // تحويل تاريخ الطلب إلى كائن Date
        const month = orderDate.getMonth(); // الحصول على رقم الشهر (0-11)
        // تحقق من قيمة totalPrice
        const totalPrice = order.totalPrice;
        // تحقق إذا كانت totalPrice متاحة وصحيحة
        if (totalPrice != null) {
          monthlyTotals[month] += totalPrice; // إضافة إجمالي السعر إلى المصفوفة الخاصة بالشهر المناسب
        }
      });

      setTotalPricesByMonth(monthlyTotals); // تخزين إجمالي الأسعار في الحالة

    };

    const calculateOrderCountsByStatus = (orders) => {
      // تعريف الحالات بالترتيب المطلوب
      const statuses = ['Pending', 'Shipped', 'Completed', 'Cancelled'];

      // إنشاء مصفوفة لتخزين الأعداد
      const counts = Array(statuses.length).fill(0);

      // المرور على كل الطلبات
      orders.forEach(order => {
        const statusIndex = statuses.indexOf(order.status);

        if (statusIndex !== -1) {
          counts[statusIndex] += 1; // زيادة العداد للحالة المناسبة
        }
      });

      return counts;
    };

    // استدعاء كل من دوال جلب المنتجات والطلبات
    fetchProducts();
    fetchOrders();
    fetchCustomers();
  }, []); // الدالة تعمل مرة واحدة عند تحميل الـ component

  if (loading) return <p>Loading...</p>; // عرض رسالة تحميل حتى يتم جلب البيانات
  if (error) return <p>Error: {error}</p>; // عرض رسالة خطأ إن وجد

  return (
    <Fragment>
      <CardSection productCount={productCount} ordersCount={orderCount} customersCount={customerCount} /> {/* تمرير عدد المنتجات لمكون CardSection */}
      <ChartSection areaData={totalPricesByMonth} doughnutData={orderStatusCounts} />
      <TabelSection data={{ orders: orders }} /> {/* تمرير الطلبات لمكون TabelSection */}
    </Fragment>
  );
};

export default Dashboard;
