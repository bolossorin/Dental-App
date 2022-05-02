import React, {useEffect, useRef, useState} from "react";

// libs
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {Line} from 'react-chartjs-2';

// components
import {getMonthlyReportApi} from "../../../../api/AWS-gateway";

// assets
import styles from './Chart2.module.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  stacked: false,
  plugins: {
    title: {
      display: false,
      text: '',
    },
  },
  scales: {
    y: {
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
    },
  },
};
const labels = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const data = {
  labels,
  datasets: [
    {
      label: 'Free Accounts',
      data: [],
      borderColor: '#707070',
      backgroundColor: '#707070',
      yAxisID: 'y',
      borderWidth: 1,
      pointBorderWidth: 1,

    },
    {
      label: 'Subscriptions',
      data: [],
      borderColor: '#095C5C',
      backgroundColor: '#095C5C',
      yAxisID: 'y',
      borderWidth: 1,
      pointBorderWidth: 1
    },
  ],
};

export const Chart2 = () => {
  const [monthlyReport, setMonthlyReport] = useState<any>([]);
  const [period, setPeriod] = useState(new Date().getFullYear());

  let chartReference = useRef<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token_admin');
    if (token) {
      const config = {headers: {Authorization: `Bearer ${JSON.parse(token as string)}`}};
      getMonthlyReportApi(config)
        .then(({data}) => setMonthlyReport(data))
        .catch((error) => console.log(error, 'error'));
    }
  }, []);

  const changePeriod = (type) => {
    if (type === 'prev') {
      setPeriod((prev) => prev - 1);
    }
    if (type === 'next') {
      setPeriod((prev) => prev + 1);
    }
  }


  useEffect(() => {
    const yearlyReport = monthlyReport.filter((report) => new Date(report.date).getFullYear() === period)

    const freReport: any = [];
    const premiumReport: any = [];
    yearlyReport.map((report) => {
      freReport.push(report.free);
      premiumReport.push(report.premium);
    })

    chartReference.current.data.datasets[0].data = freReport;
    chartReference.current.data.datasets[1].data = premiumReport;
    chartReference.current.update();
  }, [period, monthlyReport]);

  return <>
    <div className={styles.period}>
      <img src={'../../images/left-arrow.svg'} alt='' onClick={() => changePeriod('prev')} />
      <span>{period}</span>
      <img src={'../../images/left-arrow.svg'} alt='' onClick={() => changePeriod('next')} />
    </div>
    <Line ref={chartReference} options={options} data={data} />
  </>;
};
