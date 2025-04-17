import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home/Homepage';
import IssueReportingPage from './pages/IssueReporting/IssueReportingPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ProjectsPage from './pages/ProjectsPage/ProjectsPage';
import CitizenPortalPage from './pages/CitizenPortal/CitizenPortalPage';
import LoginPage from './pages/loginSingupPage/LoginPage';
import SignupPage from './pages/loginSingupPage/SignupPage';
import ProjectDetails from './pages/Dashboard/ProjectDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/report-issue" element={<IssueReportingPage />} />
        <Route path="/dashboard/*" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/citizen-portal" element={<CitizenPortalPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetails />} />
      </Routes>
    </Router>
  );
};

export default App;