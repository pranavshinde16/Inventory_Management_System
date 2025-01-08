import { useGetDashboardMetricsQuery } from "@/state/api";
import { TrendingUp } from "lucide-react";
import React, { useState } from "react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const CardSalesSummary = () => {
    const { data, isLoading, isError } = useGetDashboardMetricsQuery();
    const [timeframe, setTimeframe] = useState("weekly");

    const getFilteredData = () => {
        if (!data?.salesSummary) return [];

        switch (timeframe) {
            case "daily":
                return data.salesSummary;
            case "weekly":
                return aggregateData(data.salesSummary, 7);
            case "monthly":
                return aggregateData(data.salesSummary, 30);
            default:
                return data.salesSummary;
        }
    };

    const aggregateData = (data: any[], days: number) => {
        const grouped: { [key: string]: any } = {};

        data.forEach((item) => {
            const date = new Date(item.date);
            const key = days === 7
                ? `Week ${Math.ceil(date.getDate() / 7)} - ${date.toLocaleString('default', { month: 'short' })}`
                : date.toLocaleString('default', { month: 'short', year: '2-digit' });

            if (!grouped[key]) {
                grouped[key] = {
                    date: item.date,
                    totalValue: 0,
                    changePercentage: 0,
                    count: 0
                };
            }
            grouped[key].totalValue += item.totalValue;
            grouped[key].changePercentage += item.changePercentage || 0;
            grouped[key].count += 1;
        });

        return Object.entries(grouped).map(([key, value]) => ({
            date: key,
            totalValue: value.totalValue,
            changePercentage: value.changePercentage / value.count
        }));
    };

    const salesData = getFilteredData();

    const totalValueSum =
        salesData.reduce((acc, curr) => acc + curr.totalValue, 0) || 0;

    const averageChangePercentage =
        salesData.reduce((acc, curr, _, array) => {
            return acc + curr.changePercentage! / array.length;
        }, 0) || 0;

    const highestValueData = salesData.reduce((acc, curr) => {
        return acc.totalValue > curr.totalValue ? acc : curr;
    }, salesData[0] || {});

    const highestValueDate = highestValueData.date
        ? new Date(highestValueData.date).toLocaleDateString("en-US", {
            month: "numeric",
            day: "numeric",
            year: "2-digit",
        })
        : "N/A";

    if (isError) {
        return <div className="m-5">Failed to fetch data</div>;
    }

    return (
        <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl flex flex-col justify-between">
            {isLoading ? (
                <div className="m-5">Loading...</div>
            ) : (
                <>
                    {/* HEADER */}
                    <div>
                        <h2 className="text-lg font-semibold mb-2 px-7 pt-5">
                            Sales Summary
                        </h2>
                        <hr />
                    </div>

                    {/* BODY */}
                    <div>
                        {/* BODY HEADER */}
                        <div className="flex justify-between items-center mb-6 px-7 mt-5">
                            <div className="text-lg font-medium">
                                <p className="text-xs text-gray-400">Value</p>
                                <span className="text-2xl font-extrabold">
                                    $
                                    {(totalValueSum / 1000000).toLocaleString("en", {
                                        maximumFractionDigits: 2,
                                    })}
                                    m
                                </span>
                                <span className="text-green-500 text-sm ml-2">
                                    <TrendingUp className="inline w-4 h-4 mr-1" />
                                    {averageChangePercentage.toFixed(2)}%
                                </span>
                            </div>
                            <select
                                className="shadow-sm border border-gray-300 bg-white p-2 rounded"
                                value={timeframe}
                                onChange={(e) => {
                                    setTimeframe(e.target.value);
                                }}
                            >
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                        {/* CHART */}
                        <ResponsiveContainer width="100%" height={350} className="px-7">
                            <BarChart
                                data={salesData}
                                margin={{ top: 0, right: 0, left: -25, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(value) => {
                                        if (timeframe === "daily") {
                                            const date = new Date(value);
                                            return `${date.getMonth() + 1}/${date.getDate()}`;
                                        }
                                        return value;
                                    }}
                                />
                                <YAxis
                                    tickFormatter={(value) => {
                                        return `$${(value / 1000000).toFixed(0)}m`;
                                    }}
                                    tick={{ fontSize: 12, dx: -1 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    formatter={(value: number) => [
                                        `$${value.toLocaleString("en")}`,
                                    ]}
                                    labelFormatter={(label) => {
                                        const date = new Date(label);
                                        return date.toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        });
                                    }}
                                />
                                <Bar
                                    dataKey="totalValue"
                                    fill="#3182ce"
                                    barSize={10}
                                    radius={[10, 10, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* FOOTER */}
                    <div>
                        <hr />
                        <div className="flex justify-between items-center mt-6 text-sm px-7 mb-4">
                            <p>{salesData.length || 0} days</p>
                            <p className="text-sm">
                                Highest Sales Date:{" "}
                                <span className="font-bold">{highestValueDate}</span>
                            </p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CardSalesSummary;