// Calculates simple linear regression (y = mx + b)
export interface DataPoint {
  x: number;
  y: number;
}

export function calculateTrendline(
  data: DataPoint[]
): { m: number; b: number } {
  const n = data.length;

  if (n < 2) {
    // Not enough data points for a trend line.
    // Return a flat line at the level of the single point, or 0 if no points.
    return { m: 0, b: data.length === 1 ? data[0].y : 0 };
  }

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (const point of data) {
    sumX += point.x;
    sumY += point.y;
    sumXY += point.x * point.y;
    sumXX += point.x * point.x;
  }

  // Calculate slope (m) and intercept (b)
  // Handle potential division by zero if all x values are the same
  const denominator = n * sumXX - sumX * sumX;
  if (denominator === 0) {
    // Vertical line, or all points are the same.
    // For simplicity, return a horizontal line at the average y value.
    return { m: 0, b: sumY / n };
  }

  const m = (n * sumXY - sumX * sumY) / denominator;
  const b = (sumY - m * sumX) / n;

  return { m, b };
}
