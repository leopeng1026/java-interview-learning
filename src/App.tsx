import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import KnowledgeTree from './pages/KnowledgeTree';
import KnowledgeDetail from './pages/KnowledgeDetail';
import Practice from './pages/Practice';
import PracticeResult from './pages/PracticeResult';
import Mistakes from './pages/Mistakes';
import Statistics from './pages/Statistics';

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="knowledge" element={<KnowledgeTree />} />
          <Route path="knowledge/:id" element={<KnowledgeDetail />} />
          <Route path="practice/:pointId" element={<Practice />} />
          <Route path="practice/:pointId/result" element={<PracticeResult />} />
          <Route path="mistakes" element={<Mistakes />} />
          <Route path="statistics" element={<Statistics />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
