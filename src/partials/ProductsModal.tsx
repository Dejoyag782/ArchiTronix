import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ElectricalComponents {
  [key: string]: number;
}

interface ResultDetected {
  electrical_components?: ElectricalComponents;
  // Add other properties if they exist
}

interface ProductsModalProps {
  resultDetected?: ResultDetected;
  quoteResult?: any;
}

export default function ProductsModal({ resultDetected, quoteResult }: ProductsModalProps) {
  const [open, setOpen] = useState(false);  
  const modalRef = useRef<HTMLDivElement>(null); 
  console.log(resultDetected);
  console.log(quoteResult);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  console.log(quoteResult?.candidates?.[0]?.content?.parts?.[0]?.text);

  return (
    <>
      <div className={`border border-gray-300  rounded-full px-4 py-2 cursor-pointer transition-all duration-700 ${resultDetected ? 'bg-amber-500 hover:bg-amber-100 hover:text-gray-600' : 'bg-gray-200 blur-xs'}`} onClick={resultDetected ? () => setOpen(true) : () => setOpen(false)}>
        View Electrical Specifications
      </div>

      <div
        className={`fixed z-50 inset-0 ${open ? '' : 'hidden'}`}
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
        ref={modalRef}
        >
        {/* BACKDROP FIRST */}
            <div className="fixed inset-0 bg-white/20 backdrop-blur-sm transition-opacity z-10" aria-hidden="true" />

            {/* MODAL CONTENT */}
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 z-20 relative">
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                &#8203;
                </span>

                <div className="inline-block align-bottom bg-white min-w-[25em] md:max-w-[50em] lg:min-w-[100em] rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full sm:p-6"  ref={modalRef}>
                    <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full h-screen">
                          <div className="flex justify-between items-center w-full">
                            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                Electrical Specifications
                            </h3>
                            <div onClick={() => setOpen(false)} className=" border  rounded-full p-1 text-gray-500 cursor-pointer hover:bg-gray-100"><X size={16} /></div>
                            </div>
                              <div className="mt-10 h-200">
                                <div className="grid grid-cols-6 h-full">
                                  <div className='col-span-1'>
                                    <label className="text-sm text-gray-500 font-semibold">Electrical Specifications List:</label>
                                    <ul className="list-disc pl-4 mt-2" onClick={(e) => e.stopPropagation()}>
                                        {Object.entries(resultDetected || {}).map(([key, value]) => {
                                            const numValue = Number(value);
                                            if (!isNaN(numValue) && numValue > 0) {
                                                return <li className="text-sm text-gray-500 capitalize" key={key}>{key.replace(/_/g, ' ')}: {numValue}</li>;
                                            }
                                            return null;
                                        })}
                                    </ul>
                                  </div>
                                  <div className='min-h-full border rounded border-gray-300 col-span-5 p-2 text-gray-500 overflow-auto'>
                                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                                      <thead className="bg-gray-100">
                                        <tr>
                                          <th className="px-4 py-2 text-left font-medium text-gray-700">Class Name</th>
                                          <th className="px-4 py-2 text-left font-medium text-gray-700">Matched Product Name</th>
                                          <th className="px-4 py-2 text-left font-medium text-gray-700">Product Price</th>
                                          <th className="px-4 py-2 text-left font-medium text-gray-700">Product URL</th>
                                          <th className="px-4 py-2 text-left font-medium text-gray-700">Quantity</th>
                                          <th className="px-4 py-2 text-left font-medium text-gray-700">Total</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-200">
                                        {quoteResult?.candidates?.[0]?.content?.parts?.[0]?.text &&
                                          JSON.parse(quoteResult.candidates[0].content.parts[0].text)?.electrical_specifications?.components?.map(
                                            (component: any, idx: number) => (
                                              <tr key={idx}>
                                                <td className="px-4 py-2">{component.class_name}</td>
                                                <td className="px-4 py-2">{component.name}</td>
                                                <td className="px-4 py-2">{component.product_price}</td>
                                                <td className="px-4 py-2">
                                                  <button
                                                    onClick={() => window.open(component.product_url, '_blank')}
                                                    className="text-white bg-amber-600 hover:bg-amber-700 rounded px-3 py-1 text-sm"
                                                  >
                                                    View Product
                                                  </button>
                                                </td>
                                                <td className="px-4 py-2">{component.quantity}</td>
                                                <td className="px-4 py-2">{component.total}</td>
                                              </tr>
                                            )
                                          )}
                                          {quoteResult?.candidates?.[0]?.content?.parts?.[0]?.text &&
                                              <tr key={quoteResult.candidates[0].content.parts[0].text} className="bg-amber-100">
                                                <td className="px-4 py-2 text-left font-semibold">TOTAL QUOTATION:</td>
                                                <td className="px-4 py-2"></td>
                                                <td className="px-4 py-2"></td>
                                                <td className="px-4 py-2"></td>
                                                <td className="px-4 py-2"></td>
                                                <td className="px-4 py-2 font-semibold">{JSON.parse(quoteResult.candidates[0].content.parts[0].text)?.electrical_specifications?.total_quote}</td>
                                              </tr>
                                          }
                                      </tbody>
                                    </table>
                                  </div>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
            </div>

    </>
  );
}
