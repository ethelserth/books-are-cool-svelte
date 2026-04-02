export function intersectionObserver(
    element: HTMLElement,
    options: {
      threshold?: number;
      rootMargin?: string;
      onIntersect?: (entry: IntersectionObserverEntry) => void;
    } = {}
  ) {
    const { threshold = 0.1, rootMargin = '0px 0px -50px 0px', onIntersect } = options;
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            onIntersect?.(entry);
          }
        });
      },
      { threshold, rootMargin }
    );
  
    // Initial setup
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.8s ease';
  
    observer.observe(element);
  
    return {
      destroy() {
        observer.disconnect();
      }
    };
  }