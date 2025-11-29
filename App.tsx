import React, { useState } from 'react';
import { analyzeJacketImage } from './services/geminiService';
import { MaterialEstimate, AppStatus } from './types';
import FileUpload from './components/FileUpload';
import ResultsTable from './components/ResultsTable';
import FabricSettings from './components/FabricSettings';
import { Sparkles, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [data, setData] = useState<MaterialEstimate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Fabric settings state
  const [mainFabricWidth, setMainFabricWidth] = useState<string>('');
  const [liningFabricWidth, setLiningFabricWidth] = useState<string>('');
  const [insulationWidth, setInsulationWidth] = useState<string>('');
  
  // Price settings state
  const [mainFabricPrice, setMainFabricPrice] = useState<string>('');
  const [liningFabricPrice, setLiningFabricPrice] = useState<string>('');
  const [insulationPrice, setInsulationPrice] = useState<string>('');

  const handleImageSelected = async (base64: string) => {
    setSelectedImage(base64);
    if (!base64) {
      setStatus(AppStatus.IDLE);
      setData([]);
      setError(null);
      return;
    }
    
    // Auto-start analysis when image is selected
    handleAnalyze(base64);
  };

  const handleAnalyze = async (base64: string) => {
    if (!base64) return;
    
    setStatus(AppStatus.ANALYZING);
    setError(null);
    setData([]);

    try {
      const result = await analyzeJacketImage(base64, mainFabricWidth, liningFabricWidth, insulationWidth);
      setData(result);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setStatus(AppStatus.ERROR);
      setError(err.message || "Сталася помилка при аналізі зображення.");
    }
  };

  const handleRecalculate = () => {
    if (selectedImage) {
      handleAnalyze(selectedImage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl flex items-center justify-center gap-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Sewing Estimator
            </span>
            <Sparkles className="text-yellow-500" size={36} />
          </h1>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
            Завантажте фото куртки, а ШІ розрахує витрати тканини та фурнітури для всієї розмірної сітки.
          </p>
        </div>

        {/* Upload Section */}
        <FileUpload 
          onImageSelected={handleImageSelected} 
          isLoading={status === AppStatus.ANALYZING} 
        />

        {/* Settings Section */}
        <FabricSettings 
          mainWidth={mainFabricWidth}
          setMainWidth={setMainFabricWidth}
          liningWidth={liningFabricWidth}
          setLiningWidth={setLiningFabricWidth}
          insulationWidth={insulationWidth}
          setInsulationWidth={setInsulationWidth}
          mainPrice={mainFabricPrice}
          setMainPrice={setMainFabricPrice}
          liningPrice={liningFabricPrice}
          setLiningPrice={setLiningFabricPrice}
          insulationPrice={insulationPrice}
          setInsulationPrice={setInsulationPrice}
          disabled={status === AppStatus.ANALYZING}
        />

        {/* Recalculate Button (visible only if image exists and not loading) */}
        {selectedImage && status !== AppStatus.ANALYZING && (
          <button
            onClick={handleRecalculate}
            className="mb-8 flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-full shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
          >
            <RefreshCw size={18} />
            Перерахувати з новими параметрами ширини
          </button>
        )}

        {/* Loading State */}
        {status === AppStatus.ANALYZING && (
          <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-300">
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-lg font-medium text-indigo-800">
              Аналізуємо крій та деталі...
            </p>
            <p className="text-slate-500">
              {mainFabricWidth || liningFabricWidth || insulationWidth
                ? `Розрахунок для ширини: ${mainFabricWidth ? 'Осн.' + mainFabricWidth : ''} ${liningFabricWidth ? 'Під.' + liningFabricWidth : ''} ${insulationWidth ? 'Ут.' + insulationWidth : ''}`
                : 'Використовуємо стандартну ширину тканини'}
            </p>
          </div>
        )}

        {/* Error State */}
        {status === AppStatus.ERROR && (
          <div className="w-full max-w-2xl bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-8">
            <AlertCircle className="text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">Помилка аналізу</h3>
              <p className="text-red-700 mt-1">{error}</p>
              <button 
                onClick={() => selectedImage && handleAnalyze(selectedImage)}
                className="mt-3 text-sm font-medium text-red-700 underline hover:text-red-900"
              >
                Спробувати ще раз
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {status === AppStatus.SUCCESS && (
          <ResultsTable 
            data={data} 
            mainPrice={mainFabricPrice}
            liningPrice={liningFabricPrice}
            insulationPrice={insulationPrice}
          />
        )}

      </div>
    </div>
  );
};

export default App;