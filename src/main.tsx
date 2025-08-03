import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App.tsx';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AboutPage } from './components/AboutPage/about-page.tsx';
import { NotFound } from './components/not-found/not-found.tsx';
import { CardDetails } from './components/main/card-details/card-details.tsx';
import Layout from './components/Layout/layout.tsx';
import { Provider } from 'react-redux';
import store from './store';
import { ThemeProvider } from './context/ThemeProvider.tsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Provider store={store}>
        <ThemeProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/1" replace />}></Route>
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
        </ThemeProvider>
      </Provider>
    </StrictMode>
  );
} else {
  console.error("'root' not found");
}
