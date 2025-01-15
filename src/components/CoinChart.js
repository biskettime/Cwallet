import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import { FaTimes } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ChartContainer = styled.div`
  height: 120px;
  width: 100%;
  cursor: pointer;
  position: relative;
  padding: 5px;
  overflow: hidden;
`;

const CoinChart = ({ coinId }) => {
  const [chartData, setChartData] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data for:', coinId); // 디버깅용
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=1&interval=hourly`
        );
        const data = await response.json();
        console.log('Received data:', data); // 디버깅용

        if (data.prices && data.prices.length > 0) {
          const chartData = {
            labels: data.prices.map(price => {
              const date = new Date(price[0]);
              return `${date.getHours()}:00`;
            }),
            datasets: [
              {
                label: 'Price',
                data: data.prices.map(price => price[1]),
                borderColor: '#2ecc71',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                fill: true,
                tension: 0.4,
                borderWidth: 1.5,
              }
            ]
          };
          console.log('Processed chart data:', chartData); // 디버깅용
          setChartData(chartData);
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000); // 1분마다 업데이트
    return () => clearInterval(interval);
  }, [coinId]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => `$${context.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          font: {
            size: 8
          },
          color: '#666',
          maxTicksLimit: 6
        }
      },
      y: {
        display: true,
        position: 'right',
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 8
          },
          color: '#666',
          callback: value => `$${value.toLocaleString()}`,
          maxTicksLimit: 4
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <ChartContainer>
      {chartData && (
        <Line 
          data={chartData}
          options={options}
        />
      )}
    </ChartContainer>
  );
};

export default CoinChart; 