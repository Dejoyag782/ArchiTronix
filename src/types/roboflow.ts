export interface Prediction {
  class: string;
  // Add other prediction properties if needed
}

export interface Predictions {
  predictions: Prediction[];
}

export interface RoboflowOutput {
  predictions?: Predictions;
  output_image?: {
    value: string;
  };
  // Add other output properties if needed
}

export interface RoboflowResult {
  outputs: RoboflowOutput[];
}
