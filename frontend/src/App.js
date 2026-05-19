import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogInteractionPage from './pages/LogInteractionPage';
import InteractionsListPage from './pages/InteractionsListPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<LogInteractionPage />} />
          <Route path="/interactions" element={<InteractionsListPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;