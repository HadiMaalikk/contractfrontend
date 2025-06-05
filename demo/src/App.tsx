import React from 'react';
import {Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ContractComparison from './components/ContractComparison';
import CustomCursor from './components/CustomCursor';
import ComparisonViewer from './components/ComparisonViewer';

const App: React.FC = () => {
  return (
      <main className="w-full max-w-screen overflow-x-hidden" role="main" aria-label="Main content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/compare" element={<ContractComparison />} />
          <Route path="/results" element={<ComparisonViewer />} />
        </Routes>
        <CustomCursor />
      </main>
  );
};

export default App;
// This is the main entry point for the React application.
// It sets up the routing for the application, defining the main landing page and the contract comparison page.
// The `CustomCursor` component is included to enhance the user experience with a custom cursor.
// The `BrowserRouter` component wraps the entire application to enable routing capabilities.
// The `Routes` component defines the different routes available in the application, mapping paths to their respective components.
// The `LandingPage` component serves as the initial page users see, while the `ContractComparison` component is for comparing contracts.
// The `main` element is used to semantically mark the main content area of the page, improving accessibility and SEO.
// The `role` and `aria-label` attributes on the `main` element enhance accessibility by providing context to assistive technologies.
// The application is structured to be responsive and visually appealing, with a focus on user interaction and ease of use.