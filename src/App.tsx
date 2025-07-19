import './App.css';
import { useState } from 'react';
// import { detectSymbols } from './service/SymbolDetector';
import { ImageIcon } from 'lucide-react';
import type { RoboflowResult } from './types/roboflow';
import ProductsModal from './partials/ProductsModal';
import { detectSymbolsViaRoboFlow } from './service/RoboFlowAPI';
import { countPredictionClasses } from './helpers/SymbolClassCounter';
import { gatherQuote } from './service/GatherQuote';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [roboflowResult, setRoboFlowResult] = useState<RoboflowResult | undefined>(undefined);
  const [result, setResult] = useState<string | undefined>(undefined);
  const [quoteResult, setQuoteResult] = useState<any | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState<string | undefined>(undefined);
  const [stepPercent, setStepPercent] = useState<number>(0);

  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!geminiApiKey) {
    console.error("Gemini API key is not set. Please check your environment variables.");
  }

  const handleSymbolDetection = async () => {

    if(!image){
      toast.error("Please upload an image");
      return;
    }
    setResult(undefined);
    try {
      setIsLoading(true);
      
      setLoadingText('Detecting Symbols...');
      toast.info("Detecting Symbols...");
      setStepPercent(25);
      const result = await detectSymbolsViaRoboFlow(image!);
      console.log(result);
      // Parse the JSON string into RoboflowResult object
      
      setLoadingText('Parsing Results...');
      toast.info("Parsing Results...");
      setStepPercent(50);
      const parsedResult = await JSON.parse(result) as RoboflowResult;
      setRoboFlowResult(parsedResult);

      console.log(parsedResult);
      setLoadingText('Counting Components...');
      toast.info("Counting Components...");
      setStepPercent(75);
      const classCounts = await countPredictionClasses(parsedResult);
      if(classCounts){
        setLoadingText('Generating Quote...');
        toast.info("Generating Quote...");
        const quote = await gatherQuote(JSON.stringify(classCounts, null, 2));
        setStepPercent(100);
        setQuoteResult(quote);
        setLoadingText('Quote Generated');

      }
      setResult(JSON.stringify(classCounts, null, 2));
      toast.success("Quote Generated");
    } catch (error) {
      console.error("Error during symbol detection:", error);
      toast.error("Error during symbol detection");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setResult(undefined);
    if(!isLoading){
       const file = event.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const image = e.target?.result as string;
            setImage(image);
          };
          reader.readAsDataURL(file);
        }
        return;
    }
    toast.info("Please wait for the previous detection to complete");
   
  };

  return (    
    <div className="w-screen min-h-screen h-fit dark:text-white text-gray-800 bg-gradient-to-br backdrop-blur-3xl  dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 bg-amber-50 dark:bg-amber-50 grid grid-cols-1 lg:grid-cols-2">
      <div className="col-span-1 p-10 text-center">
        <div className="relative text-center z-20 p-10">
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-white/20 backdrop-blur-md border border-white/20 rounded-xl px-6 py-4 shadow-lg">
              <h1 className="text-4xl font-bold font-electrolize">ArchiTronix Detector
              </h1>
            </div>
          </div>
        </div>
        <div className="mt-10 px-10">
          <div className="border rounded p-2 mb-5 cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
            {image ? (
              <div className="flex bg-white rounded-md p-2 items-center justify-center text-gray-400 min-h-100">
                <img src={image} alt="Uploaded" className="h-full object-contain max-h-100" />
              </div>
            ) : (
              <div className="flex bg-white rounded-md p-2 items-center justify-center text-gray-400 min-h-100">
                <div className="flex flex-col items-center">
                  <ImageIcon size={48} />
                  <p className="mt-2">Upload an image to get started</p>
                </div>
              </div>
            )}
          </div>
          <div className="grid lg:grid-cols-8 grid-cols-1 lg:justify-between items-center gap-2">
            <input id="file-upload" className="lg:col-span-6 col-span-12 w-full  bg-white text-gray-700  p-2 rounded-lg border border-gray-300" type="file" accept="image/*" onChange={handleImageUpload} />
            <div className="lg:col-span-2 col-span-12 w-full p-2 rounded-lg bg-amber-500 hover:bg-amber-600 border border-gray-300 cursor-pointer font-extrabold" onClick={handleSymbolDetection}>{isLoading ? loadingText : 'Detect Symbols'}</div>
          </div>
          <div className="h-2 mt-5 text-start">
            <div className="bg-gray-200 rounded-full h-2">
              <div className={`bg-blue-600 h-2 rounded-full transition-all duration-2000 ${((result && !isLoading) ? '' : 'animate-pulse')}`} style={{ width: `${stepPercent}%` }}></div>
            </div>
            <span className="text-sm text-gray-500">{image && !isLoading && !result ? 'Image uploaded' : ''}{isLoading && !result ? loadingText : ''}{result && !isLoading ? 'Detection Complete' : ''}</span>
          </div>
          <div className="mt-10">
          <ProductsModal resultDetected={result ? JSON.parse(result) : undefined} quoteResult={quoteResult ? quoteResult : undefined} />
          </div>
        </div>
      </div>
      <div className="col-span-1 p-10">
          <span className="text-2xl font-bold">About</span>
          <br />
          <span className="text-justify">
          This application helps to detect the electrical components in the architectural layout. 
          It utilizes Roboflow Worflow Custom Model to identify the component symbols and provides report of the detected components. 
          And suggests the standard electrical components to be used in the layout based on the philippine electrical codes requirements.
          It utilizes Roboflow Worflow Custom Model built specifically for this application to detect the components in the image. 
          </span>
          <br />
          <br />
          Note: This application is still in development and is not ready for production use. As of now, it is only a proof of concept and has limitations based on current AI capabilities.
          <br />
          <br />
          <span className="text-2xl font-bold">Output:</span>
          <br />
          <label htmlFor="">Output Image:</label>
          <img src={roboflowResult?.outputs[0]?.output_image?.value ? `data:image/png;base64,${roboflowResult?.outputs[0]?.output_image?.value}` : 
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAB4AAAAUAAQMAAACcQ910AAAABlBMVEXg4OD///9NNgK4AAAE40lEQVR42u3dPW7jRhiAYRGDhCXbdOz3DAHYbxlkrxPqEunTpEguER3F5ZYqVRjmgrJDkVyTRgwEsL7veapdqHox8szwx+PDAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnv3wy1+//v3l0++f//zuH39E7C3DjmPA4GYv+BwwuNsLvgQM3usdnuL1VrvBQ7I5K+KsVe8HP+SapCMGt/vB8dalbj/4Ivje9fvBj4JDb7QibrUExw8+7y7SAa8djrsbbcH3H/zuTwUL/piztBFOHHwwwoIFCxb8gddhs7RgwXcSXL9+VRw3uBvOuYK37tZFDS4bj77DjvD4zPSUKbjdeBIcNrjbeBIcNrjfeDAadi+99Zww6ghXW0+RogaXrVeyogbXW69kCQ4S/Pyu1klw2L10u/XSXSVY8F0Gd1uvVQoOspc2wtmCf8wW3OQIvt0BaI/Bg/vVCHenZCPcPwTfS69/hqd/Jpm0qun+VpLgki24nm7oJQlupsyoe+nV5WE73d9Kcj3cTbd7kgT309c7SfAQPnh517K67bpy3IgvtydrOYLr2ZO1FA/Tmtt/cjw9bG8/0DmeD3fxg5dvAPS3NSrHOx6zjXXYdzzmb/FUs9sfKd7TKrNfhQ8bXK+W4X/n7CrDu5ZNhuDDbJJuZ6cOxQ1uF1fD00IcN7jcXkvr56cOZfidh/mpQxl+yaOaH9GSIbhkC67nJ5ZkCG7mx/9l+N3D6QS1U5IR7rIF9/Pj/zIEL47/SxBcLU7DSxBcFofDJQiul8fSxg9uFsEJRrhdnMObIHh2rucpRXC/OJY2QfAQPXg1D1fLY2lDj/BPy2X4uhCHDv55tQyPV8Shg39bLcMvjxXjBg+rZXhclyIHV9db712e4HK94u+XB+JHDq6vV/yrA/EjBzcvG43FQhw5uB03GmV1XHrk4G7caNSJgvtxo9HED5720sPtLdMUI1xdr/i7PMHlutHo8wTX143GkGdZGqerczXkGeFxurqURMHjdPVYJwoep6unJlHwtbDNE/w8Xf2TZ5Yur/+tpchHtWYJftlLN9lGuM0W3GUL7l//E4CR35fONcJVtuCSLbjOFtxkC26HZLN0l22E+yHZXnpINsJVtuCSLbgeks3STbYRbrMFd9mCe8E5gy9+hn2l73Qv3VuWfKVTjPDFCAs2aRlhwWZpI2zSspf2lfaVdsfDV9pX2gjHH+GvKU5b+g+fChb8UffS7/3UCAsWLFiwYMH/Y7B1WHC44KeAe+nj9ocl5MXDafvDOmTwrifBgu9Mvx/8KPjedYJXD9SiafeDz+GCG8HD8jDPaOr94FO44LIffAwX/MZWK17v/s7jMWBwm2sZfmPWeggYfEh1rQQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwHt9A4U/UY8FiH/kAAAAAElFTkSuQmCC'
          }
          alt="" className="w-full max-h-100 object-contain border rounded bg-white mb-2" />
          <label htmlFor="">Output JSON:</label>
          <textarea className="border rounded p-2 w-full min-h-100 bg-white/20" value={JSON.stringify(roboflowResult, null, 2)}/>
      </div>
    </div>
  );
}

export default App;
