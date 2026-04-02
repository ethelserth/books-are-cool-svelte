<script lang="ts">
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
  
    let cursor: HTMLElement;
    let isReading = $state(false);
  
    onMount(() => {
      if (!browser) return;
  
      const handleMouseMove = (e: MouseEvent) => {
        if (cursor) {
          cursor.style.left = e.clientX + 'px';
          cursor.style.top = e.clientY + 'px';
        }
      };
  
      const handleTextEnter = () => {
        isReading = true;
      };
  
      const handleTextLeave = () => {
        isReading = false;
      };
  
      document.addEventListener('mousemove', handleMouseMove);
      
      // Add listeners to text elements
      const textElements = document.querySelectorAll('p, .article-excerpt, .main-excerpt');
      textElements.forEach(el => {
        el.addEventListener('mouseenter', handleTextEnter);
        el.addEventListener('mouseleave', handleTextLeave);
      });
  
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        textElements.forEach(el => {
          el.removeEventListener('mouseenter', handleTextEnter);
          el.removeEventListener('mouseleave', handleTextLeave);
        });
      };
    });
  </script>
  
  <div 
    bind:this={cursor}
    class="custom-cursor {isReading ? 'reading' : ''}"
  ></div>