export const detectSymbolsViaRoboFlow = async (image: string) => {

  const detect = async () => {
    try {
      const response = await fetch(`https://serverless.roboflow.com/infer/workflows/architronix-detection/small-object-detection-sahi`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          api_key: import.meta.env.VITE_ROBOFLOW_API_KEY,
          inputs: {
            image: { type: 'url', value: image }
          }
        })
      });

      const result = await response.json();
      return JSON.stringify(result, null, 2);
    } catch (error) {
      return 'Error: ' + (error as Error)?.message;
    }
  };

  const response = await detect();
    
  return response;
};