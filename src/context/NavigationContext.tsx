import React, { createContext, useContext, useEffect, useState } from 'react';

interface NavigationContextType {
  currentPath: string;
  queryParams: URLSearchParams;
  navigate: (to: string, replace?: boolean) => void;
  goBack: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window === 'undefined') return '/';
    // Support hash routing or pathname
    const hash = window.location.hash.replace(/^#/, '');
    if (hash.startsWith('/')) {
      return hash;
    }
    return window.location.pathname || '/';
  });

  const [queryParams, setQueryParams] = useState<URLSearchParams>(() => {
    if (typeof window === 'undefined') return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  });

  const updateLocationState = () => {
    const hash = window.location.hash.replace(/^#/, '');
    const path = hash.startsWith('/') ? hash : window.location.pathname || '/';
    setCurrentPath(path);
    setQueryParams(new URLSearchParams(window.location.search));
  };

  useEffect(() => {
    window.addEventListener('popstate', updateLocationState);
    window.addEventListener('hashchange', updateLocationState);
    return () => {
      window.removeEventListener('popstate', updateLocationState);
      window.removeEventListener('hashchange', updateLocationState);
    };
  }, []);

  const navigate = (to: string, replace: boolean = false) => {
    if (typeof window === 'undefined') return;

    // Separate pathname and query params
    const [pathPart, queryPart] = to.split('?');
    const newPath = pathPart.startsWith('/') ? pathPart : `/${pathPart}`;

    if (replace) {
      window.history.replaceState({}, '', to);
    } else {
      window.history.pushState({}, '', to);
    }

    setCurrentPath(newPath);
    setQueryParams(new URLSearchParams(queryPart || ''));

    // Smooth scroll to top on page navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <NavigationContext.Provider value={{ currentPath, queryParams, navigate, goBack }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigate = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigate must be used within NavigationProvider');
  }
  return context;
};
