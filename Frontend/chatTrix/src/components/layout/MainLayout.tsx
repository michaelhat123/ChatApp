import { useEffect } from 'react';
import Navbar from './Navbar'; 
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const isMobile = useIsMobile();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className={`${isMobile ? 'pb-16 px-4' : 'md:ml-[120px] px-6'} pt-4`}>
        <div className="max-w-6xl mx-auto pb-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;

