import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface StreakData {
    date: string;
    count: number;
}

interface StreakChartProps {
    data: StreakData[];
}

export default function StreakChart({ data }: StreakChartProps) {
    return (
        <div className="w-full h-full min-h-[250px] p-6 rounded-3xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-xl">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" opacity={0.5} />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#71717a', fontSize: 10, fontWeight: 'bold' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#09090b',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '1.5rem',
                            padding: '12px 16px',
                            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(20px)',
                            fontSize: '11px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em'
                        }}
                        itemStyle={{ color: '#10b981' }}
                        cursor={{ stroke: '#27272a', strokeWidth: 1 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="count"
                        stroke="#10b981"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorCount)"
                        animationDuration={2500}
                        activeDot={{
                            r: 8,
                            fill: '#10b981',
                            stroke: '#fff',
                            strokeWidth: 3,
                            className: 'drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]'
                        }}
                        dot={{
                            r: 4,
                            fill: '#09090b',
                            stroke: '#10b981',
                            strokeWidth: 2,
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
