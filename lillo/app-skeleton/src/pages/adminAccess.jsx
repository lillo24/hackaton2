import { useEffect } from 'react';

export function useAdminDocumentScroll() {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    const root = document.getElementById('root');

    document.documentElement.classList.add('admin-route');
    document.body.classList.add('admin-route');
    root?.classList.add('admin-route');

    return () => {
      document.documentElement.classList.remove('admin-route');
      document.body.classList.remove('admin-route');
      root?.classList.remove('admin-route');
    };
  }, []);
}
