import './App.css';
import { useState, Suspense, useMemo, useCallback } from 'react';
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

  const years = useMemo(() => {
    if (!data) return [];
    return [
      ...new Set(Object.values(data).flatMap((c) => c.data.map((d) => d.year))),
    ].sort();
  }, [data]);

  const filteredSortedCountries = useMemo(() => {
    if (!data) return [];
    const countries = Object.entries(data).filter(
      ([name]) => !search || name.toLowerCase().includes(search.toLowerCase())
    );

    countries.sort((a, b) => {
      let aValue;
      let bValue;
      if (sortBy === 'population') {
        const aDataByYear = a[1].data.find((d) => d.year === selectedYear);
        const bDataByYear = b[1].data.find((d) => d.year === selectedYear);
        aValue = aDataByYear?.population || 0;
        bValue = bDataByYear?.population || 0;
      } else {
        aValue = a[0];
        bValue = b[0];
      }

      const order = sortOrder === 'asc' ? 1 : -1;

      return (aValue < bValue ? -1 : aValue > bValue ? 1 : 0) * order;
    });

    return countries;
  }, [data, search, sortBy, sortOrder, selectedYear]);

  const handleYearChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setSelectedYear(parseInt(e.target.value));
    },
    []
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  const handleSortByName = useCallback(() => {
    setSortBy('name');
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  const handleSortByPopulation = useCallback(() => {
    setSortBy('population');
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

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
    return <div>Data not found</div>;
  }

  return (
    <div className="container">
      <h1>CO2 Emissions by Country</h1>
      <div className="controls">
        <select onChange={handleYearChange} value={selectedYear}>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search country..."
          value={search}
          onChange={handleSearchChange}
        />
        <button onClick={handleSortByName}>Sort by name</button>
        <button onClick={handleSortByPopulation}>Sort by population</button>
        <button onClick={openModal}>Select columns</button>
      </div>

      <CountryList
        countries={filteredSortedCountries}
        selectedYear={selectedYear}
      />
      <Modal isOpen={isModalOpen} onClose={closeModal} />
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
