
import React from 'react';
import { MaterialEstimate } from '../types';
import { Ruler, Scissors, Box, Layers, Coins, ArrowUpToLine, GitCommitHorizontal, MoveHorizontal } from 'lucide-react';
import { Texts } from '../translations';

interface ResultsTableProps {
  data: MaterialEstimate[];
  mainPrice?: string;
  liningPrice?: string;
  insulationPrice?: string;
  texts: Texts;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ data, mainPrice, liningPrice, insulationPrice, texts }) => {
  if (!data || data.length === 0) return null;

  // Helper to parse quantity string (e.g. "1.5 м" -> 1.5)
  const parseQuantity = (str: string | undefined): number => {
    if (!str) return 0;
    // Replace comma with dot for European format, then remove non-numeric chars except dot
    const normalized = str.replace(',', '.');
    const match = normalized.match(/[\d.]+/);
    const val = match ? parseFloat(match[0]) : 0;
    return isNaN(val) ? 0 : val;
  };

  const pMain = parseFloat(mainPrice || '0') || 0;
  const pLining = parseFloat(liningPrice || '0') || 0;
  const pInsulation = parseFloat(insulationPrice || '0') || 0;
  
  const showCost = pMain > 0 || pLining > 0 || pInsulation > 0;

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in pb-12">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Scissors className="text-indigo-600" />
            {texts.resultsTitle}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {texts.resultsSubtitle}
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-100 text-slate-600 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold border-b border-slate-200 w-16 sticky left-0 bg-slate-100 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">{texts.size}</th>
                
                {/* Product Dimensions Group */}
                <th className="p-4 font-semibold border-b border-slate-200 border-l border-slate-200 w-24 bg-indigo-50/30 text-indigo-900">
                  <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1"><ArrowUpToLine size={14}/> {texts.length}</span>
                    <span className="text-[10px] text-slate-400 normal-case">{texts.back}</span>
                  </div>
                </th>
                <th className="p-4 font-semibold border-b border-slate-200 w-24 bg-indigo-50/30 text-indigo-900">
                   <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1"><MoveHorizontal size={14}/> {texts.chest}</span>
                    <span className="text-[10px] text-slate-400 normal-case">{texts.halfGirth}</span>
                  </div>
                </th>
                 <th className="p-4 font-semibold border-b border-slate-200 border-r border-slate-200 w-24 bg-indigo-50/30 text-indigo-900">
                   <div className="flex flex-col gap-1">
                    <span className="flex items-center gap-1"><GitCommitHorizontal size={14}/> {texts.sleeve}</span>
                    <span className="text-[10px] text-slate-400 normal-case">{texts.fromShoulder}</span>
                  </div>
                </th>

                {/* Materials Group */}
                <th className="p-4 font-semibold border-b border-slate-200 w-32">
                  <div className="flex items-center gap-2">
                    <Layers size={16} /> {texts.main}
                  </div>
                </th>
                <th className="p-4 font-semibold border-b border-slate-200 w-32">
                   <div className="flex items-center gap-2">
                    <Layers size={16} /> {texts.liningFabric}
                  </div>
                </th>
                <th className="p-4 font-semibold border-b border-slate-200 w-32">
                   <div className="flex items-center gap-2">
                    <Box size={16} /> {texts.insulation}
                  </div>
                </th>
                <th className="p-4 font-semibold border-b border-slate-200">
                   <div className="flex items-center gap-2">
                    <Ruler size={16} /> {texts.hardware}
                  </div>
                </th>
                {showCost && (
                  <th className="p-4 font-semibold border-b border-slate-200 w-36 bg-emerald-50 text-emerald-700">
                    <div className="flex items-center gap-2">
                      <Coins size={16} /> {texts.cost}
                    </div>
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {data.map((row, index) => {
                const qtyMain = parseQuantity(row.mainFabric);
                const qtyLining = parseQuantity(row.liningFabric);
                const qtyInsulation = parseQuantity(row.insulation);
                
                // Cost calculation
                // Base material cost
                const materialCost = (qtyMain * pMain) + (qtyLining * pLining) + (qtyInsulation * pInsulation);
                
                // Hardware surcharge = 15% of Main + Lining (as originally requested)
                const hardwareBase = (qtyMain * pMain) + (qtyLining * pLining);
                const hardwareCost = hardwareBase * 0.15;
                
                const totalCost = materialCost + hardwareCost;

                return (
                  <tr 
                    key={row.size} 
                    className={`hover:bg-indigo-50/30 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                  >
                    <td className="p-4 font-bold text-indigo-900 bg-slate-50/80 sticky left-0 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                      {row.size}
                    </td>
                    
                    {/* Dimensions Data */}
                    <td className="p-4 text-slate-600 bg-indigo-50/10 border-l border-slate-100 font-mono">
                      {row.backLength || '-'}
                    </td>
                    <td className="p-4 text-slate-600 bg-indigo-50/10 font-mono">
                      {row.chestWidth || '-'}
                    </td>
                     <td className="p-4 text-slate-600 bg-indigo-50/10 border-r border-slate-100 font-mono">
                      {row.sleeveLength || '-'}
                    </td>

                    {/* Materials Data */}
                    <td className="p-4 text-slate-700 font-medium">
                      {row.mainFabric}
                      {showCost && pMain > 0 && <div className="text-xs text-slate-400 mt-1">~{(qtyMain * pMain).toFixed(0)}</div>}
                    </td>
                    <td className="p-4 text-slate-700 font-medium">
                      {row.liningFabric}
                      {showCost && pLining > 0 && <div className="text-xs text-slate-400 mt-1">~{(qtyLining * pLining).toFixed(0)}</div>}
                    </td>
                    <td className="p-4 text-slate-700">
                      {(!row.insulation || row.insulation === '0' || row.insulation === '-') 
                        ? <span className="text-slate-400">-</span> 
                        : (
                            <>
                              {row.insulation}
                              {showCost && pInsulation > 0 && qtyInsulation > 0 && <div className="text-xs text-slate-400 mt-1">~{(qtyInsulation * pInsulation).toFixed(0)}</div>}
                            </>
                          )
                      }
                    </td>
                    <td className="p-4 text-slate-600 text-xs leading-relaxed max-w-xs">{row.hardware}</td>
                    
                    {/* Cost Data */}
                    {showCost && (
                      <td className="p-4 text-emerald-800 font-bold bg-emerald-50/30">
                        {totalCost > 0 ? totalCost.toFixed(2) : '-'}
                        <span className="text-xs font-normal text-emerald-600 ml-1">{texts.currency}</span>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {showCost ? (
           <div className="p-4 bg-emerald-50/50 text-xs text-slate-500 border-t border-slate-200">
            <p className="font-semibold text-emerald-700 mb-1">{texts.formulaTitle}</p>
            {texts.formula}
          </div>
        ) : (
          <div className="p-4 bg-slate-50 text-xs text-slate-400 italic text-center border-t border-slate-200">
            {texts.disclaimer}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsTable;
