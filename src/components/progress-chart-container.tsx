"use client";

import { useState, useEffect, useCallback } from "react";
import type { WeightEntry, ChartDataPoint, VisibleMetrics } from "@/types";
import { getEntries } from "@/lib/storage";
import { calculateTrendline, type DataPoint as TrendDataPoint } from "@/lib/trendline";
import ProgressChartDisplay from "./progress-chart-display";
import MetricToggle from "./metric-toggle";
import { format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";

export default function ProgressChartContainer() {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleMetrics, setVisibleMetrics] = useState<VisibleMetrics>({
    weight: true,
    fat: true,
    muscle: true,
  });

  const loadEntries = useCallback(() => {
    setIsLoading(true);
    const storedEntries = getEntries();
    setEntries(storedEntries);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  useEffect(() => {
    if (entries.length > 0) {
      const processDataForChart = (): ChartDataPoint[] => {
        const dataPointsWeight: TrendDataPoint[] = [];
        const dataPointsFat: TrendDataPoint[] = [];
        const dataPointsMuscle: TrendDataPoint[] = [];

        entries.forEach((entry, index) => {
          if (entry.currentWeight !== undefined && entry.currentWeight !== null) {
            dataPointsWeight.push({ x: index, y: entry.currentWeight });
          }
          if (entry.fatPercentage !== undefined && entry.fatPercentage !== null) {
            dataPointsFat.push({ x: index, y: entry.fatPercentage });
          }
          if (entry.musclePercentage !== undefined && entry.musclePercentage !== null) {
            dataPointsMuscle.push({ x: index, y: entry.musclePercentage });
          }
        });
        
        const trendWeightParams = calculateTrendline(dataPointsWeight);
        const trendFatParams = calculateTrendline(dataPointsFat);
        const trendMuscleParams = calculateTrendline(dataPointsMuscle);

        return entries.map((entry, index) => {
          const chartPoint: ChartDataPoint = {
            date: format(new Date(entry.date), "MMM dd"),
            currentWeight: entry.currentWeight ?? null, 
            fatPercentage: entry.fatPercentage ?? null,
            musclePercentage: entry.musclePercentage ?? null,
          };

          if (dataPointsWeight.length >=2) {
             chartPoint.trendWeight = trendWeightParams.m * index + trendWeightParams.b;
             chartPoint.slopeWeight = trendWeightParams.m;
          }
          if (dataPointsFat.length >=2) {
             chartPoint.trendFat = trendFatParams.m * index + trendFatParams.b;
             chartPoint.slopeFat = trendFatParams.m;
          }
          if (dataPointsMuscle.length >=2) {
            chartPoint.trendMuscle = trendMuscleParams.m * index + trendMuscleParams.b;
            chartPoint.slopeMuscle = trendMuscleParams.m;
          }
          return chartPoint;
        });
      };
      setChartData(processDataForChart());
    } else {
      setChartData([]);
    }
  }, [entries]);

  const handleToggleMetric = (metric: keyof VisibleMetrics) => {
    setVisibleMetrics((prev) => ({ ...prev, [metric]: !prev[metric] }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MetricToggle visibleMetrics={visibleMetrics} onToggle={handleToggleMetric} />
      <ProgressChartDisplay data={chartData} visibleMetrics={visibleMetrics} />
    </div>
  );
}
