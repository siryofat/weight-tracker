
export interface WeightEntry {
  id: string;
  date: string; // ISO string for the entry date
  updatedAt: string; // ISO string for when the entry was last updated or created
  currentWeight: number;
  fatPercentage?: number;
  musclePercentage?: number;
}

export interface ChartDataPoint {
  date: string; // Formatted for chart display
  currentWeight?: number | null;
  fatPercentage?: number | null;
  musclePercentage?: number | null;
  trendWeight?: number | null;
  trendFat?: number | null;
  trendMuscle?: number | null;
  slopeWeight?: number | null;
  slopeFat?: number | null;
  slopeMuscle?: number | null;
}

export interface VisibleMetrics {
  weight: boolean;
  fat: boolean;
  muscle: boolean;
}
