import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AboutPage from './components/AboutPage/about-page.tsx';
import NotFound from './components/not-found/not-found.tsx';
import CardDetails from './components/main/card-list/card/card-details/card-details.tsx';
import Layout from './components/Layout/layout.tsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<App />}></Route>
            <Route path=":page" element={<App />}>
              <Route
                index
                element={
                  <div className="placeholder-text">Select a Pokemon</div>
                }
              ></Route>
              <Route path=":detailsId" element={<CardDetails />}></Route>
            </Route>
            <Route path="about" element={<AboutPage />}></Route>
          </Route>
          <Route path="/404" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
} else {
  console.error("'root' not found");
}
