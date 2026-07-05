import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CataloguePage from './pages/CataloguePage';
import AdminPage from './pages/AdminPage';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  return (
    <>
      <Analytics />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CataloguePage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
