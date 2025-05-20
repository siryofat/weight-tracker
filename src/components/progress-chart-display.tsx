
"use client";

import type { ChartDataPoint, VisibleMetrics } from "@/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface ProgressChartDisplayProps {
  data: ChartDataPoint[];
  visibleMetrics: VisibleMetrics;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Filter out trend lines from being explicitly listed
    const relevantPayload = payload.filter(
      (pld: any) =>
        pld.dataKey !== 'trendWeight' &&
        pld.dataKey !== 'trendFat' &&
        pld.dataKey !== 'trendMuscle'
    );

    return (
      <div className="p-2 bg-card border border-border rounded-md shadow-lg">
        <p className="label font-semibold text-sm text-foreground">{`Date: ${label}`}</p>
        {relevantPayload.map((entry: any) => {
          if (entry.value === undefined || entry.value === null) return null;

          let trendSlope: number | undefined | null = undefined;
          let TrendIcon = null;

          if (entry.dataKey === 'currentWeight') {
            trendSlope = entry.payload.slopeWeight;
          } else if (entry.dataKey === 'fatPercentage') {
            trendSlope = entry.payload.slopeFat;
          } else if (entry.dataKey === 'musclePercentage') {
            trendSlope = entry.payload.slopeMuscle;
          }

          if (trendSlope !== undefined && trendSlope !== null) {
            // Use a small threshold to avoid arrows for very minor changes
            if (trendSlope > 0.01) { 
              TrendIcon = <ArrowUpRight className="inline-block h-3 w-3 ml-1" style={{ color: entry.color }}/>;
            } else if (trendSlope < -0.01) {
              TrendIcon = <ArrowDownRight className="inline-block h-3 w-3 ml-1" style={{ color: entry.color }}/>;
            }
            // Optionally, add an icon for flat trend here, e.g., <Minus className="inline-block h-3 w-3 ml-1" />
          }
          
          return (
            <p key={entry.name} style={{ color: entry.color }} className="text-xs flex items-center">
              {`${entry.name}: ${entry.value.toFixed(1)}`}
              {TrendIcon}
            </p>
          );
        })}
      </div>
    );
  }
  return null;
};

export default function ProgressChartDisplay({ data, visibleMetrics }: ProgressChartDisplayProps) {
  if (data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No data yet. Start by adding some entries!</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Progress Overview</CardTitle>
        <CardDescription>Visualize your journey over time. Hover over points for details.</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--foreground))" tick={{ fontSize: 12 }} />
            <YAxis stroke="hsl(var(--foreground))" tick={{ fontSize: 12 }} yAxisId="left" orientation="left" />
            <YAxis stroke="hsl(var(--foreground))" tick={{ fontSize: 12 }} yAxisId="right" orientation="right" domain={['dataMin - 5', 'dataMax + 5']} hide={!visibleMetrics.fat && !visibleMetrics.muscle} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

            {visibleMetrics.weight && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="currentWeight"
                name="Weight"
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2}
                dot={{ r: 3, fill: "hsl(var(--chart-1))" }}
                activeDot={{ r: 5 }}
                connectNulls={false}
              />
            )}
            {visibleMetrics.weight && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="trendWeight"
                name="Weight Trend"
                stroke="hsl(var(--chart-1))"
                strokeDasharray="5 5"
                dot={false}
                activeDot={false}
                connectNulls={true}
                legendType="none" 
              />
            )}

            {visibleMetrics.fat && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="fatPercentage"
                name="Fat %"
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                dot={{ r: 3, fill: "hsl(var(--chart-2))" }}
                activeDot={{ r: 5 }}
                connectNulls={false}
              />
            )}
            {visibleMetrics.fat && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="trendFat"
                name="Fat % Trend"
                stroke="hsl(var(--chart-2))"
                strokeDasharray="5 5"
                dot={false}
                activeDot={false}
                connectNulls={true}
                legendType="none"
              />
            )}

            {visibleMetrics.muscle && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="musclePercentage"
                name="Muscle %"
                stroke="hsl(var(--chart-3))" 
                strokeWidth={2}
                dot={{ r: 3, fill: "hsl(var(--chart-3))" }}
                activeDot={{ r: 5 }}
                connectNulls={false}
              />
            )}
            {visibleMetrics.muscle && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="trendMuscle"
                name="Muscle % Trend"
                stroke="hsl(var(--chart-3))"
                strokeDasharray="5 5"
                dot={false}
                activeDot={false}
                connectNulls={true}
                legendType="none"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
