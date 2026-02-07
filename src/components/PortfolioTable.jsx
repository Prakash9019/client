import React, { useMemo } from 'react';
import { ArrowUpCircle, ArrowDownCircle, AlertCircle } from 'lucide-react';

const PortfolioTable = ({ data }) => {
  const groupedData = useMemo(() => {
    const groups = {};
    data.forEach(stock => {
      const sector = stock.sector || "Other";
      if (!groups[sector]) groups[sector] = [];
      groups[sector].push(stock);
    });
    return groups;
  }, [data]);

  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(val);
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-800 text-gray-100 uppercase font-medium">
          <tr>
            <th className="px-4 py-3">Stock Name</th>
            <th className="px-4 py-3 text-right">Qty</th>
            <th className="px-4 py-3 text-right">Avg. Cost</th>
            <th className="px-4 py-3 text-right">Invested</th>
            <th className="px-4 py-3 text-right">CMP</th>
            <th className="px-4 py-3 text-right">Present Value</th>
            <th className="px-4 py-3 text-center">Gain/Loss</th>
            <th className="px-4 py-3 text-center">Weight (%)</th>
            <th className="px-4 py-3 text-center">P/E</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {Object.keys(groupedData).map((sector) => {
            const stocks = groupedData[sector];
            
            const totalInv = stocks.reduce((sum, s) => sum + (s.investment || 0), 0);
            const totalPV = stocks.reduce((sum, s) => sum + (s.presentValue || 0), 0);
            const totalGL = totalPV - totalInv;

            return (
              <React.Fragment key={sector}>
                <tr className="bg-gray-100 font-bold text-gray-700">
                  <td colSpan="9" className="px-4 py-2 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full uppercase tracking-wide">
                      {sector} Sector
                    </span>
                  </td>
                </tr>

                {stocks.map((stock) => (
                  <tr key={stock._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {stock.name}
                      <span className="block text-xs text-gray-500 font-normal">
                        {stock.ticker} • {stock.exchange}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">{stock.quantity}</td>
                    <td className="px-4 py-3 text-right">{formatINR(stock.purchasePrice)}</td>
                    <td className="px-4 py-3 text-right">{formatINR(stock.investment)}</td>
                    
                   
                    <td className="px-4 py-3 text-right font-semibold text-blue-600">
                      {stock.cmp > 0 ? formatINR(stock.cmp) : <span className="text-gray-400">N/A</span>}
                    </td>

                    <td className="px-4 py-3 text-right">{formatINR(stock.presentValue)}</td>

                    
                    <td className={`px-4 py-3 text-right font-bold ${stock.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <div className="flex items-center justify-end gap-1">
                        {stock.gainLoss >= 0 ? <ArrowUpCircle size={14} /> : <ArrowDownCircle size={14} />}
                        {formatINR(stock.gainLoss)}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-center">{stock.portfolioWeight}%</td>
                    
                    <td className="px-4 py-3 text-center text-xs text-gray-500">
                      {stock.peRatio !== "N/A" ? stock.peRatio : "-"}
                    </td>
                  </tr>
                ))}

                <tr className="bg-gray-50 border-t-2 border-gray-200 italic">
                  <td colSpan="3" className="px-4 py-2 text-right font-bold text-gray-600">Total {sector}:</td>
                  <td className="px-4 py-2 text-right font-bold text-gray-800">{formatINR(totalInv)}</td>
                  <td className="px-4 py-2"></td>
                  <td className="px-4 py-2 text-right font-bold text-gray-800">{formatINR(totalPV)}</td>
                  <td className={`px-4 py-2 text-right font-bold ${totalGL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatINR(totalGL)}
                  </td>
                  <td colSpan="2"></td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioTable;