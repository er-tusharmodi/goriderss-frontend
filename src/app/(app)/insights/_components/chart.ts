// Single source of truth: registers everything once and returns Chart
let _Chart: any | null = null;

export async function getChart() {
  if (_Chart) return _Chart;

  const mod = await import("chart.js");
  const {
    Chart,
    // controllers
    BarController,
    LineController,
    DoughnutController,
    // scales
    CategoryScale,
    LinearScale,
    // elements
    BarElement,
    LineElement,
    ArcElement,
    PointElement,
    // plugins
    Filler,
    Tooltip,
    Legend,
    Title,
  } = mod as any;

  Chart.register(
    // controllers
    BarController,
    LineController,
    DoughnutController,
    // scales
    CategoryScale,
    LinearScale,
    // elements
    BarElement,
    LineElement,
    ArcElement,
    PointElement,
    // plugins
    Filler,
    Tooltip,
    Legend,
    Title,
  );

  _Chart = Chart;
  return Chart;
}
