import { useState, useEffect } from 'react';
import TimerPage from './components/TimerPage';
import RealtimeGalleryPage from './components/RealtimeGalleryPage';

const App = () => {
  const [currentPage, setCurrentPage] = useState(() => {
    return window.location.hash === '#gallery' ? 'gallery' : 'timer';
  });

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#gallery') {
        setCurrentPage('gallery');
      } else {
        setCurrentPage('timer');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.location.hash = page === 'gallery' ? '#gallery' : '';
  };

  return (
    <>
      {currentPage === 'gallery' ? (
        <RealtimeGalleryPage onNavigateToTimer={() => navigateTo('timer')} />
      ) : (
        <TimerPage onNavigateToGallery={() => navigateTo('gallery')} />
      )}
    </>
  );
};

export default App;
