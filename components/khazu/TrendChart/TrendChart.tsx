"use client";

import { Card, CardBody, Heading6 } from "@/components/ui";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TrendChartProps {
  title: string;
  data: { name: string; value: number }[];
  valueFormatter?: (value: number) => string;
}

export function TrendChart({ title, data, valueFormatter }: TrendChartProps) {
  const hasData = data.some((d) => d.value > 0);

  return (
    <Card padding="lg" elevated="sm" className="h-full">
      <CardBody className="flex flex-col h-full">
        <Heading6 className="mb-4 text-lg uppercase font-bold text-dark-light">
          {title}
        </Heading6>

        {!hasData ? (
          <div className="h-[280px] w-full flex items-center justify-center text-sm text-muted">
            No data yet.
          </div>
        ) : (
          <div className="h-[280px] w-full flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-line)" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--color-muted)", fontSize: 11 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--color-muted)", fontSize: 11 }}
                  allowDecimals={false}
                  tickFormatter={valueFormatter}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid var(--color-line)",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{ fontWeight: "bold", color: "var(--color-ink)" }}
                  formatter={(value) =>
                    valueFormatter ? valueFormatter(Number(value)) : String(value)
                  }
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fill="url(#trendFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
