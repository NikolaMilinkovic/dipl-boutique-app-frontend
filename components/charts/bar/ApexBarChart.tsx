import ReactApexChart from 'react-apexcharts';
import './apexBarChart.scss';

interface BarChartPropTypes {
  data: { date: string; value: number }[];
  displayCurrency: string;
  numOfBars?: number;
}
export default function ApexBarChart({
  data,
  displayCurrency,
  numOfBars = 4,
}: BarChartPropTypes) {
  const limitedData = data.slice(-numOfBars);
  const series = [
    {
      name: 'Value',
      data: limitedData.map((d) => d.value),
    },
  ];

  const options = {
    chart: {
      type: 'bar',
      toolbar: { show: false },
    },
    xaxis: {
      categories: limitedData.map((d) => d.date),
      labels: { rotate: -45 },
    },
    yaxis: {
      labels: {
        formatter: (val: number) => `${val.toFixed(0)} ${displayCurrency}`,
      },
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val.toFixed(0)} ${displayCurrency}`,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '40%',
      },
    },
    dataLabels: { enabled: false },
  };

  return (
    <div className="bar-chart-card">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={230}
        width={320}
      />
    </div>
  );
}
