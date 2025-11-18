"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

interface ContestantResult {
    id: string;
    name: string;
    votes: number;
    percentage: number;
    isWinner: boolean;
}

interface CategoryResult {
    categoryId: string;
    categoryName: string;
    totalVotes: number;
    contestants: ContestantResult[];
    result?: {
        rounds?: Array<{
            round: number;
            candidates: Array<{
                candidateId: string;
                votes: number;
                percentage: number;
            }>;
        }>;
    };
}

interface VotingChartsProps {
    categories: CategoryResult[];
}

const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#00ff00",
    "#0088fe",
    "#ff00ff",
    "#00ffff",
];

export function VotingCharts({ categories }: VotingChartsProps) {
    return (
        <div className="space-y-6">
            {categories.map((category) => {
                // Prepare data for charts
                const barChartData = category.contestants
                    .sort((a, b) => b.votes - a.votes)
                    .map((c) => ({
                        name: c.name.length > 15 ? c.name.substring(0, 15) + "..." : c.name,
                        fullName: c.name,
                        votes: c.votes,
                        percentage: c.percentage,
                        isWinner: c.isWinner,
                    }));

                const pieChartData = category.contestants
                    .filter((c) => c.votes > 0)
                    .map((c) => ({
                        name: c.name,
                        value: c.votes,
                        percentage: c.percentage,
                    }));

                // Round-by-round data for line chart (if available)
                const roundData = category.result?.rounds?.map((round) => {
                    const roundObj: any = { round: round.round };
                    round.candidates.forEach((candidate) => {
                        const contestant = category.contestants.find((ct) => ct.id === candidate.candidateId);
                        if (contestant) {
                            roundObj[contestant.name] = candidate.votes;
                        }
                    });
                    return roundObj;
                });

                return (
                    <div key={category.categoryId} className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>{category.categoryName}</CardTitle>
                                <CardDescription>
                                    {category.totalVotes} total votes
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Bar Chart */}
                                {barChartData.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium mb-4">Vote Distribution</h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={barChartData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    dataKey="name"
                                                    angle={-45}
                                                    textAnchor="end"
                                                    height={100}
                                                />
                                                <YAxis />
                                                <Tooltip
                                                    formatter={(value: number, name: string, props: any) => [
                                                        `${value} votes (${props.payload.percentage.toFixed(1)}%)`,
                                                        "Votes",
                                                    ]}
                                                />
                                                <Legend />
                                                <Bar
                                                    dataKey="votes"
                                                    fill="#8884d8"
                                                    radius={[8, 8, 0, 0]}
                                                >
                                                    {barChartData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.isWinner ? "#ffc658" : COLORS[index % COLORS.length]}
                                                        />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}

                                {/* Pie Chart */}
                                {pieChartData.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-medium mb-4">Vote Share</h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <PieChart>
                                                <Pie
                                                    data={pieChartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percentage }) =>
                                                        `${name}: ${percentage.toFixed(1)}%`
                                                    }
                                                    outerRadius={100}
                                                    fill="#8884d8"
                                                    dataKey="value"
                                                >
                                                    {pieChartData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={COLORS[index % COLORS.length]}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value: number, name: string, props: any) => [
                                                        `${value} votes (${props.payload.percentage.toFixed(1)}%)`,
                                                        "Votes",
                                                    ]}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}

                                {/* Round-by-Round Line Chart (for ranked voting) */}
                                {roundData && roundData.length > 1 && (
                                    <div>
                                        <h3 className="text-sm font-medium mb-4">Round-by-Round Progression</h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <LineChart data={roundData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="round" label={{ value: "Round", position: "insideBottom", offset: -5 }} />
                                                <YAxis label={{ value: "Votes", angle: -90, position: "insideLeft" }} />
                                                <Tooltip />
                                                <Legend />
                                                {category.contestants.map((contestant, index) => (
                                                    <Line
                                                        key={contestant.id}
                                                        type="monotone"
                                                        dataKey={contestant.name}
                                                        stroke={COLORS[index % COLORS.length]}
                                                        strokeWidth={contestant.isWinner ? 3 : 2}
                                                        dot={{ r: 4 }}
                                                        activeDot={{ r: 6 }}
                                                    />
                                                ))}
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                );
            })}
        </div>
    );
}

