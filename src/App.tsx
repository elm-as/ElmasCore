import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomCursor from './components/layout/CustomCursor';
import Home from './pages/Home';

/**
 * Elmas Core — Unified DayanaOS Web Application
 * All routes resolve directly to the corresponding DayanaOS application window.
 */
export default function App() {
  return (
    <Router>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<Home initialApp="projects" />} />
        <Route path="/projects" element={<Home initialApp="projects" />} />
        <Route path="/projects/:id" element={<Home initialApp="projects" />} />
        <Route path="/team" element={<Home initialApp="team" />} />
        <Route path="/join" element={<Home initialApp="team" />} />
        <Route path="/skills" element={<Home initialApp="engines" />} />
        <Route path="/about" element={<Home initialApp="engines" />} />
        <Route path="/labs" element={<Home initialApp="ghost-shard" />} />
        <Route path="/labs/*" element={<Home initialApp="ghost-shard" />} />
        <Route path="/terminal" element={<Home initialApp="terminal" />} />
        <Route path="/contact" element={<Home initialApp="notes" />} />
        <Route path="/sys-portal-admin" element={<Home initialApp="admin" />} />
        <Route path="/admin" element={<Home initialApp="admin" />} />
        <Route path="*" element={<Home initialApp="projects" />} />
      </Routes>
    </Router>
  );
}
