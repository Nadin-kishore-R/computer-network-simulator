import React from 'react';
import { NetworkProvider, useNetwork } from './context/NetworkContext';
import { Navigation } from './components/Navigation';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { GeneralTreePage } from './pages/GeneralTreePage';
import { BSTPage } from './pages/BSTPage';
import { AVLPage } from './pages/AVLPage';
import { ExpressionTreePage } from './pages/ExpressionTreePage';
import { GraphBuilderPage } from './pages/GraphBuilderPage';
import { TraversalsPage } from './pages/TraversalsPage';
import { ShortestPathPage } from './pages/ShortestPathPage';
import { CablingMSTPage } from './pages/CablingMSTPage';
import { ConnectivityPage } from './pages/ConnectivityPage';
import { TopologicalSortPage } from './pages/TopologicalSortPage';
import { ComparisonsLabPage } from './pages/ComparisonsLabPage';
import { BenchmarkingLabPage } from './pages/BenchmarkingLabPage';
import { ComplexityTheoryPage } from './pages/ComplexityTheoryPage';
import { TestingLabPage } from './pages/TestingLabPage';
import { DocumentationPage } from './pages/DocumentationPage';

const AppContent: React.FC = () => {
  const { activeTab } = useNetwork();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'hierarchy':
        return <GeneralTreePage />;
      case 'registry-bst':
        return <BSTPage />;
      case 'registry-avl':
        return <AVLPage />;
      case 'bandwidth-calc':
        return <ExpressionTreePage />;
      case 'graph-builder':
        return <GraphBuilderPage />;
      case 'traversals':
        return <TraversalsPage />;
      case 'shortest-path':
        return <ShortestPathPage />;
      case 'cabling-mst':
        return <CablingMSTPage />;
      case 'connectivity':
        return <ConnectivityPage />;
      case 'topological-sort':
        return <TopologicalSortPage />;
      case 'lab-comparisons':
        return <ComparisonsLabPage />;
      case 'lab-benchmarking':
        return <BenchmarkingLabPage />;
      case 'lab-complexity':
        return <ComplexityTheoryPage />;
      case 'testing':
        return <TestingLabPage />;
      case 'documentation':
        return <DocumentationPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <Navigation />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen">
        <Header />
        <main className="flex-1 pb-16">{renderActivePage()}</main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <NetworkProvider>
      <AppContent />
    </NetworkProvider>
  );
}

export default App;
