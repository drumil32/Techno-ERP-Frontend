'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

export default function ProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      trickleSpeed: 300,
      minimum: 0.1
    });

    const handleAnchorClick = (event: Event) => {
      const target = event.currentTarget as HTMLAnchorElement;
      if (!target) return;

      if (!(event as MouseEvent).ctrlKey && !(event as MouseEvent).metaKey) {
        event.preventDefault();
      }

      const currentUrl = new URL(window.location.href);
      const targetUrl = new URL(target.href);

      if (target.target || target.download) return;
      if (currentUrl.origin !== targetUrl.origin) return;
      if (currentUrl.pathname === targetUrl.pathname && currentUrl.search === targetUrl.search) {
        return;
      }

      NProgress.start();

      if (!target.hasAttribute('data-nextjs-link')) {
        window.location.href = target.href;
      }
    };

    const handleMutation: MutationCallback = (mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            node.querySelectorAll('a[href]').forEach((anchor) => {
              if (anchor.hasAttribute('data-no-progress')) return;
              anchor.addEventListener('click', handleAnchorClick);
            });
          }
        });
      });
    };

    const mutationObserver = new MutationObserver(handleMutation);
    mutationObserver.observe(document, { childList: true, subtree: true });

    const originalPush = window.history.pushState;
    const originalReplace = window.history.replaceState;

    window.history.pushState = function (...args) {
      NProgress.start();
      return originalPush.apply(this, args);
    };

    window.history.replaceState = function (...args) {
      NProgress.done();
      return originalReplace.apply(this, args);
    };

    document.querySelectorAll('a[href]').forEach((anchor) => {
      if (anchor.hasAttribute('data-no-progress')) return;
      anchor.addEventListener('click', handleAnchorClick);
    });

    return () => {
      mutationObserver.disconnect();
      document.querySelectorAll('a[href]').forEach((anchor) => {
        anchor.removeEventListener('click', handleAnchorClick);
      });
      window.history.pushState = originalPush;
      window.history.replaceState = originalReplace;
    };
  }, []);

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  return <></>;
}
