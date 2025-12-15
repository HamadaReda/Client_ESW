import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register necessary Chart.js components
Chart.register(...registerables);

const AreaChart = ({ chartdata }) => {

  // البيانات الشهرية (مثال)
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', "Nov", "Dec"],
    datasets: [
      {
        label: 'Total Sales',
        data: chartdata,
        fill: true,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        tension: 0.4,
      },
    ],
  };

  // الإعدادات الخاصة بالـ Chart
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        position: 'bottom', // مكان ظهور الأساطير (legend)
        labels: {
          font: {
            size: 14, // حجم النص
            family: 'Arial', // نوع الخط
            weight: 'normal', // وزن الخط

          },
          boxWidth: 15, // عرض مربعات الألوان في الـ legend
          padding: 30, // المسافة بين الـ legend والمخطط
          usePointStyle: true, // تغيير شكل المربعات إلى دائرة
        },
      },
    },
  };

  return (


    <Line
      data={data}
      options={options}
    />

  );
};

export default AreaChart;
