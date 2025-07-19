import type { RoboflowResult } from '../types/roboflow';

export function countPredictionClasses(data: RoboflowResult) {
  const predictions = data?.outputs?.[0]?.predictions?.predictions || [];
  const classCounts: Record<string, number> = {};

  for (const prediction of predictions) {
    const className = prediction.class;
    if (className) {
      classCounts[className] = (classCounts[className] || 0) + 1;
    }
  }

  return classCounts;
}
