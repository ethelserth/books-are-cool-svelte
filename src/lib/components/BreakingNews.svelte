<script lang="ts">
    let isPaused = $state(false);
  
    const newsItems = [
      "New releases from Toni Morrison estate",
      "Booker Prize longlist announced", 
      "Literary festival returns to Edinburgh",
      "Independent bookstores report record sales"
    ];
  </script>
  
  <div class="bg-accent-red text-white py-2 relative overflow-hidden">
    <div 
      class="flex items-center whitespace-nowrap animate-scroll-left {isPaused ? '[animation-play-state:paused]' : ''}"
      onmouseenter={() => isPaused = true}
      onmouseleave={() => isPaused = false}
    >
      <span class="bg-text-black text-white py-2 px-4 font-bold uppercase mr-8 flex-shrink-0">
        Latest
      </span>
      <span>
        {newsItems.join(' • ')}
      </span>
    </div>
  </div>