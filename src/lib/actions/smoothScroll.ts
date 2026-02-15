export function smoothScroll(element: HTMLElement) {
    function handleClick(event: Event) {
      const target = event.target as HTMLAnchorElement;
      const href = target.getAttribute('href');
      
      if (href?.startsWith('#')) {
        event.preventDefault();
        const targetElement = document.querySelector(href);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    }
  
    element.addEventListener('click', handleClick);
  
    return {
      destroy() {
        element.removeEventListener('click', handleClick);
      }
    };
  }