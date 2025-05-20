
"use client";

import type { VisibleMetrics } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

interface MetricToggleProps {
  visibleMetrics: VisibleMetrics;
  onToggle: (metric: keyof VisibleMetrics) => void;
}

export default function MetricToggle({ visibleMetrics, onToggle }: MetricToggleProps) {
  const metricOptions: { id: keyof VisibleMetrics; label: string }[] = [
    { id: "weight", label: "Weight" },
    { id: "fat", label: "Fat %" },
    { id: "muscle", label: "Muscle %" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chart Metrics</CardTitle>
        <CardDescription>Select which metrics to display on the chart.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap justify-center gap-3">
        {metricOptions.map((metric) => (
          <Button
            key={metric.id}
            variant={visibleMetrics[metric.id] ? "default" : "outline"}
            onClick={() => onToggle(metric.id)}
            aria-pressed={visibleMetrics[metric.id]}
            className="flex items-center space-x-2"
          >
            {visibleMetrics[metric.id] ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            <span>{metric.label}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
