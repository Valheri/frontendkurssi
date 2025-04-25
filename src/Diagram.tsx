import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { fetchTrainings } from "./api";

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Diagram = () => {
    const [chartData, setChartData] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchTrainings();

                // Process data: Group by activity and sum durations
                const activityDurations: { [key: string]: number } = {};
                data.forEach((training: any) => {
                    if (training.activity) {
                        if (!activityDurations[training.activity]) {
                            activityDurations[training.activity] = 0;
                        }
                        activityDurations[training.activity] += training.duration;
                    }
                });

                // Prepare data for the chart
                const labels = Object.keys(activityDurations);
                const durations = Object.values(activityDurations);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: "Training Durations (minutes)",
                            data: durations,
                            backgroundColor: "rgba(59, 130, 246, 0.5)", // Light blue
                            borderColor: "rgba(59, 130, 246, 1)", // Darker blue
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (error) {
                console.error("Error fetching training data:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="diagram-container">
            <h1>Training Durations</h1>
            {chartData ? (
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                display: true,
                                position: "top",
                            },
                        },
                    }}
                />
            ) : (
                <p>Loading chart...</p>
            )}
        </div>
    );
};

export default Diagram;