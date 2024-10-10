import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useFetch from "@/hooks/useFetch";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell, LineChart, XAxis, YAxis, Line } from "recharts";
import { BeatLoader } from "react-spinners";

const DashboardCharts = () => {
    const [searchParams] = useSearchParams();
    const url = searchParams.get("url") || "";
    const { fn: getStats, loading, data } = useFetch({
        method: "POST",
        endpoint: "/stats",
    });

    useEffect(() => {
        if (!data) {
            getStats({
                data: JSON.stringify({
                    urlID: url,
                }),
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return <BeatLoader />;
    }

    // Prepare Pie Chart data for devices
    const deviceCounts = data?.data.device?.reduce(
        (acc, device) => {
            acc[device] = (acc[device] || 0) + 1;
            return acc;
        },
        { desktop: 0, mobile: 0 }
    );

    const pieChartData = [
        { name: "Desktop", value: deviceCounts?.desktop },
        { name: "Mobile", value: deviceCounts?.mobile },
    ];

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    // Prepare BarChart Data for devices
    const barChartData = [
        { name: "Desktop", count: deviceCounts?.desktop },
        { name: "Mobile", count: deviceCounts?.mobile },
    ];

    return (
        <div className="dashboard w-full flex flex-col justify-around">
            {/* Pie Chart */}
            <div className="chart-container w-full  p-4">
                <h3 className="text-center mb-4">Device Distribution</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={pieChartData}
                            nameKey="name"
                            labelLine={false}
                            label={({ name, percent }) =>
                                `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                            dataKey="value"
                        >
                            {pieChartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="chart-container w-full  p-4">
                {barChartData ? (
                    <>
                        <h3 className="text-center mb-4">Device Click Counts</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={barChartData}>
                                <XAxis dataKey="name" /> 
                                <YAxis />
                                <Tooltip labelStyle={{ color: "green" }} />
                                <Legend />
                                <Line type="monotone" dataKey="count" stroke="#82ca9d" />
                            </LineChart>

                        </ResponsiveContainer>
                    </>) : <p>No data found ...</p>
                }
            </div>


        </div>
    );
};

export default DashboardCharts;
