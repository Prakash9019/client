import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PortfolioTable from './components/PortfolioTable';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/portfolio');
      setData(res.data);
      setLastUpdated(new Date());
      setLoading(false);
    } catch (error) {
      console.error("API Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
      
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Portfolio</h1>
            <p className="text-gray-500 mt-1">Real-time Holdings Dashboard</p>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-500">Last Updated:</span>
            <p className="font-mono font-medium text-gray-700">
              {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
        </div>

       
        {loading ? (
          <div className="text-center py-20 bg-white rounded-lg shadow">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-500">Fetching live market data...</p>
          </div>
        ) : (
          <PortfolioTable data={data} />
        )}

      </div>
    </div>
  );
}

export default App;