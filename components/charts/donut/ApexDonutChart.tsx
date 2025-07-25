import './apexDonutChart.scss';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useState } from 'react';

interface ApexDonutChartDataTypes {
  name: string;
  value: any;
}
interface ApexDonutChartPropTypes {
  data: ApexDonutChartDataTypes[];
  displayCurrency: string;
}

/**
 * Donut chart component that takes simple data in the form of {name: string, value: any}[]
 * @param param0 Array of objects {name: string, value: any}
 * @returns Donut chart component
 */
function ApexDonutChart({ data, displayCurrency }: ApexDonutChartPropTypes) {
  const series = data.map((item) => item.value);
  const totalVal = series
    .reduce((acc, val) => acc + val, 0)
    .toLocaleString('de-DE');
  const labels = data.map((item) => item.name);

  const options: ApexOptions = {
    labels: labels,
    dataLabels: {
      formatter: function (val: number, opts: any) {
        const value = series[opts.seriesIndex];
        return `${value.toLocaleString('de-DE')} ${displayCurrency}`;
      },
    },
    tooltip: {
      custom: function ({ series, seriesIndex, w }) {
        const label = w.globals.labels[seriesIndex];
        const val = series[seriesIndex];
        return `
          <div class="custom-tooltip">
            <div>
              <div class="label">${label}:</div>
              <div class="value">${val.toLocaleString('de-DE')} ${displayCurrency}</div>
            </div>
            <div>
              <div class="label">Total:</div>
              <div class="total">${totalVal} ${displayCurrency}</div>
            </div>
          </div>
        `;
      },
    },
    legend: {
      position: 'bottom',
    },
    responsive: [
      {
        breakpoint: 280,
        options: {
          chart: { width: 100 },
          legend: { position: 'bottom' },
        },
      },
    ],
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total',
              formatter: function () {
                return totalVal.toLocaleString('de-DE') + ' ' + displayCurrency;
              },
            },
          },
        },
      },
    },
  };

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="donut"
      width="300"
    />
  );
}

export default ApexDonutChart;
