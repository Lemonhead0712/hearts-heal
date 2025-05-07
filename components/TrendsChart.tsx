"use client"
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip as ChartTooltip,
  Filler,
} from 'chart.js'
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, ChartTooltip, Filler)

function TrendsChart({ data }: { data: any[] }) {
  if (!data || data.length === 0) return <div className="h-[250px] flex items-center justify-center text-sm text-pink-600">No trend data available</div>

  // Prepare chart data
  const labels = data.map((d) => d.day)
  const intensities = data.map((d) => d.intensity)
  const emotions = data.map((d) => d.emotion || "")
  const notes = data.map((d) => d.notes || "")

  // Find min/max
  const maxIdx = intensities.indexOf(Math.max(...intensities))
  const minIdx = intensities.indexOf(Math.min(...intensities))

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Intensity',
        data: intensities,
        fill: true,
        borderColor: '#E91E63',
        backgroundColor: (ctx: any) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300)
          gradient.addColorStop(0, 'rgba(233,30,99,0.25)')
          gradient.addColorStop(1, 'rgba(233,30,99,0.03)')
          return gradient
        },
        pointBackgroundColor: (ctx: any) => {
          if (ctx.dataIndex === maxIdx) return '#4CAF50'
          if (ctx.dataIndex === minIdx) return '#2196F3'
          return '#E91E63'
        },
        pointRadius: (ctx: any) => (ctx.dataIndex === maxIdx || ctx.dataIndex === minIdx ? 7 : 5),
        pointHoverRadius: 9,
        tension: 0.4,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title: (items: any) => `Day: ${items[0].label}`,
          label: (item: any) => `Intensity: ${item.formattedValue}/10`,
          afterBody: (items: any) => {
            const idx = items[0].dataIndex
            let extra = ''
            if (emotions[idx]) extra += `Emotion: ${emotions[idx]}`
            if (notes[idx]) extra += `\nNotes: ${notes[idx]}`
            return extra
          },
        },
        backgroundColor: '#fff0f6',
        titleColor: '#d1467d',
        bodyColor: '#d1467d',
        borderColor: '#E91E63',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 10,
        ticks: { color: '#d1467d', font: { size: 12 } },
        grid: { color: '#f9a8d4' },
      },
      x: {
        ticks: { color: '#d1467d', font: { size: 12 } },
        grid: { color: '#f9a8d4' },
      },
    },
    animation: {
      duration: 1200,
      easing: 'easeInOutQuart',
    },
  }

  return <Line data={chartData} options={options} height={250} />
}

export default TrendsChart 