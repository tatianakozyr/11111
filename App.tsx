
import React, { useState } from 'react';
import { analyzeJacketImage } from './services/geminiService';
import { MaterialEstimate, AppStatus, Language } from './types';
import FileUpload from './components/FileUpload';
import ResultsTable from './components/ResultsTable';
import FabricSettings from './components/FabricSettings';
import { Sparkles, AlertCircle, Loader2, RefreshCw, Globe } from 'lucide-react';
import { translations } from './translations';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [data, setData] = useState<MaterialEstimate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // Language State
  const [language, setLanguage] = useState<Language>('uk');
  
  // Fabric settings state
  const [mainFabricWidth, setMainFabricWidth] = useState<string>('');
  const [liningFabricWidth, setLiningFabricWidth] = useState<string>('');
  const [insulationWidth, setInsulationWidth] = useState<string>('');
  
  // Price settings state
  const [mainFabricPrice, setMainFabricPrice] = useState<string>('');
  const [liningFabricPrice, setLiningFabricPrice] = useState<string>('');
  const [insulationPrice, setInsulationPrice] = useState<string>('');

  const t = translations[language];

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
      const result = await analyzeJacketImage(base64, mainFabricWidth, liningFabricWidth, insulationWidth, language);
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
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative">
      
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-20">
        <div className="relative inline-block">
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-slate-200 px-3 py-1.5">
            <Globe size={16} className="text-slate-400" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="appearance-none bg-transparent font-medium text-slate-600 text-sm focus:outline-none cursor-pointer pr-4"
            >
              <option value="uk">Українська</option>
              <option value="en">English</option>
              <option value="ru">Русский</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl flex items-center justify-center gap-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              {t.appTitle}
            </span>
            <Sparkles className="text-yellow-500" size={36} />
          </h1>
          <p className="mt-4 text-xl text-slate-600 max-w-2xl mx-auto">
            {t.appSubtitle}
          </p>
        </div>

        {/* Upload Section */}
        <FileUpload 
          onImageSelected={handleImageSelected} 
          isLoading={status === AppStatus.ANALYZING} 
          texts={t}
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
          texts={t}
        />

        {/* Recalculate Button (visible only if image exists and not loading) */}
        {selectedImage && status !== AppStatus.ANALYZING && (
          <button
            onClick={handleRecalculate}
            className="mb-8 flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-full shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
          >
            <RefreshCw size={18} />
            {t.recalculate}
          </button>
        )}

        {/* Loading State */}
        {status === AppStatus.ANALYZING && (
          <div className="flex flex-col items-center justify-center py-12 animate-in fade-in zoom-in duration-300">
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-lg font-medium text-indigo-800">
              {t.analyzing}
            </p>
            <p className="text-slate-500">
              {mainFabricWidth || liningFabricWidth || insulationWidth
                ? `${t.calculatingFor}: ${mainFabricWidth ? t.main + ' ' + mainFabricWidth : ''} ${liningFabricWidth ? t.liningFabric + ' ' + liningFabricWidth : ''} ${insulationWidth ? t.insulation + ' ' + insulationWidth : ''}`
                : t.usingStandard}
            </p>
          </div>
        )}

        {/* Error State */}
        {status === AppStatus.ERROR && (
          <div className="w-full max-w-2xl bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 mb-8">
            <AlertCircle className="text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800">{t.errorTitle}</h3>
              <p className="text-red-700 mt-1">{error}</p>
              <button 
                onClick={() => selectedImage && handleAnalyze(selectedImage)}
                className="mt-3 text-sm font-medium text-red-700 underline hover:text-red-900"
              >
                {t.retry}
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
            texts={t}
          />
        )}

      </div>
    </div>
  );
};

export default App;
