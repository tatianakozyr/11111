
import React from 'react';
import { Ruler, Coins, Info, Settings2 } from 'lucide-react';
import { Texts } from '../translations';

interface FabricSettingsProps {
  mainWidth: string;
  setMainWidth: (value: string) => void;
  liningWidth: string;
  setLiningWidth: (value: string) => void;
  insulationWidth: string;
  setInsulationWidth: (value: string) => void;
  mainPrice: string;
  setMainPrice: (value: string) => void;
  liningPrice: string;
  setLiningPrice: (value: string) => void;
  insulationPrice: string;
  setInsulationPrice: (value: string) => void;
  disabled: boolean;
  texts: Texts;
}

const FabricSettings: React.FC<FabricSettingsProps> = ({
  mainWidth,
  setMainWidth,
  liningWidth,
  setLiningWidth,
  insulationWidth,
  setInsulationWidth,
  mainPrice,
  setMainPrice,
  liningPrice,
  setLiningPrice,
  insulationPrice,
  setInsulationPrice,
  disabled,
  texts
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-6 bg-white p-5 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-2 mb-4 text-slate-800 font-medium border-b border-slate-100 pb-2">
        <Settings2 className="text-indigo-600" size={20} />
        <h3>{texts.settingsTitle}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Fabric Section */}
        <div className="space-y-3">
          <h4 className="font-medium text-slate-700 text-sm uppercase tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            {texts.mainFabric}
          </h4>
          
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              {texts.width}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Ruler size={14} />
              </div>
              <input
                type="number"
                value={mainWidth}
                onChange={(e) => setMainWidth(e.target.value)}
                placeholder={`${texts.typical}: 150`}
                disabled={disabled}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm disabled:opacity-50"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-slate-500 text-xs">{texts.cm}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              {texts.price}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Coins size={14} />
              </div>
              <input
                type="number"
                value={mainPrice}
                onChange={(e) => setMainPrice(e.target.value)}
                placeholder="0.00"
                disabled={disabled}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Lining Fabric Section */}
        <div className="space-y-3">
          <h4 className="font-medium text-slate-700 text-sm uppercase tracking-wide flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-slate-400"></span>
             {texts.liningFabric}
          </h4>
          
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              {texts.width}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Ruler size={14} />
              </div>
              <input
                type="number"
                value={liningWidth}
                onChange={(e) => setLiningWidth(e.target.value)}
                placeholder={`${texts.typical}: 140`}
                disabled={disabled}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm disabled:opacity-50"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-slate-500 text-xs">{texts.cm}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              {texts.price}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Coins size={14} />
              </div>
              <input
                type="number"
                value={liningPrice}
                onChange={(e) => setLiningPrice(e.target.value)}
                placeholder="0.00"
                disabled={disabled}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Insulation Section */}
        <div className="space-y-3">
          <h4 className="font-medium text-slate-700 text-sm uppercase tracking-wide flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-orange-200"></span>
             {texts.insulation}
          </h4>
          
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              {texts.width}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Ruler size={14} />
              </div>
              <input
                type="number"
                value={insulationWidth}
                onChange={(e) => setInsulationWidth(e.target.value)}
                placeholder={`${texts.typical}: 150`}
                disabled={disabled}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm disabled:opacity-50"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-slate-500 text-xs">{texts.cm}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              {texts.price}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Coins size={14} />
              </div>
              <input
                type="number"
                value={insulationPrice}
                onChange={(e) => setInsulationPrice(e.target.value)}
                placeholder="0.00"
                disabled={disabled}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm disabled:opacity-50"
              />
            </div>
          </div>
        </div>

      </div>
      
      <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100">
        <Info size={14} className="mt-0.5 shrink-0 text-indigo-400" />
        <p>
          {texts.infoText}
        </p>
      </div>
    </div>
  );
};

export default FabricSettings;
