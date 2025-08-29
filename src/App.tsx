import './App.css';
import { useState, Suspense } from 'react';
import { useGetCo2DataQuery } from './api/co2-api';
import Spinner from './components/spinner/spinner';
import CountryList from './components/country-list';
import { Modal } from './components/modal/modal';

function AppContent() {
  const { data, isLoading, error } = useGetCo2DataQuery();

  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'population'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div>
        Loading data... <Spinner />
      </div>
    );
  }

  if (error) {
    return <div>Error: {(error as Error).message}</div>;
  }

  if (!data) {
    return <div>Data not fount</div>;
  }

  const filteredCountries = Object.entries(data).filter((country) => {
    const name = country[0];
    return (
      !search || name.toLowerCase().includes(search.toLowerCase())
      // &&
      // (region === 'All' || countryCode.startsWith(region))
    );
  });

  // filteredCountries.sort((a, b) => {
  //   const aData = a.data.find((d) => d.year === selectedYear);
  //   const bData = b.data.find((d) => d.year === selectedYear);
  //   const aValue =
  //     sortBy === 'name' ? a.iso_code || '' : aData?.population || 0;
  //   const bValue =
  //     sortBy === 'name' ? b.iso_code || '' : bData?.population || 0;
  //   const order = sortOrder === 'asc' ? 1 : -1;
  //   return (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) * order;
  // });

  return (
    <div className="container">
      <h1>CO2 Emissions by Country</h1>
      <div className="controls">
        <select
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          value={selectedYear}
        >
          {[
            ...new Set(
              Object.values(data).flatMap((c) => c.data.map((d) => d.year))
            ),
          ]
            .sort()
            .map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
        </select>
        <input
          type="text"
          placeholder="Search country..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => setIsModalOpen(true)}>Select columns</button>
      </div>
      <div className="sort-buttons">
        <button
          onClick={() => {
            setSortBy('name');
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          }}
        >
          Sort by name
        </button>
        <button
          onClick={() => {
            setSortBy('population');
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
          }}
        >
          Sort by population
        </button>
      </div>
      <CountryList
        countries={filteredCountries}
        selectedYear={selectedYear}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <Suspense
      fallback={
        <div>
          Loading data... <Spinner />
        </div>
      }
    >
      <AppContent />
    </Suspense>
  );
}

export default App;
