<script lang="ts">
    interface StarRatingProps {
      rating: number;
      size?: 'small' | 'medium' | 'large';
      showText?: boolean;
      ratingText?: string;
    }
    
    let { rating, size = 'medium', showText = false, ratingText = '' }: StarRatingProps = $props();
    
    function generateStars(rating: number): string {
      let starsHtml = '';
      
      for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
          // Full star
          starsHtml += `
            <svg class="star star-full" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          `;
        } else if (rating >= i - 0.5) {
          // Half star
          starsHtml += `
            <svg class="star star-half" viewBox="0 0 24 24">
              <defs>
                <linearGradient id="half-fill-${rating}-${i}" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="50%" style="stop-color:#ffc107;stop-opacity:1" />
                  <stop offset="50%" style="stop-color:#e0e0e0;stop-opacity:1" />
                </linearGradient>
              </defs>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#half-fill-${rating}-${i})" stroke="#e0e0e0" stroke-width="0.5"/>
            </svg>
          `;
        } else {
          // Empty star
          starsHtml += `
            <svg class="star star-empty" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          `;
        }
      }
      
      return starsHtml;
    }
    
    const sizeClass = $derived({
      small: 'star-rating-small',
      medium: 'star-rating-medium', 
      large: 'star-rating-large'
    }[size]);
  </script>
  
  <!-- Always show, no conditions -->
  <div class="star-rating {sizeClass}">
    <div class="stars">
      {@html generateStars(rating || 0)}
    </div>
    {#if showText && ratingText}
      <span class="rating-text">{ratingText}</span>
    {/if}
  </div>
  
  <style>
    .star-rating {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
  
    .stars {
      display: inline-flex;
      align-items: center;
      gap: 2px;
    }
  
    .rating-text {
      font-weight: bold;
      color: var(--color-text-black, #1a1a1a);
    }
  
    /* Size variations */
    .star-rating-small .stars {
      gap: 1px;
    }
  
    .star-rating-small :global(.star) {
      width: 0.9em;
      height: 0.9em;
    }
  
    .star-rating-small .rating-text {
      font-size: 0.8rem;
    }
  
    .star-rating-medium .stars {
      gap: 2px;
    }
  
    .star-rating-medium :global(.star) {
      width: 1em;
      height: 1em;
    }
  
    .star-rating-medium .rating-text {
      font-size: 0.9rem;
    }
  
    .star-rating-large .stars {
      gap: 3px;
    }
  
    .star-rating-large :global(.star) {
      width: 1.4em;
      height: 1.4em;
    }
  
    .star-rating-large .rating-text {
      font-size: 1.1rem;
    }
  
    /* Star colors */
    :global(.star) {
      display: inline-block;
    }
  
    :global(.star-full) {
      color: #ffc107; /* Gold color for full stars */
    }
  
    :global(.star-empty) {
      color: #e0e0e0; /* Light gray for empty stars */
    }
  
    :global(.star-half) {
      /* Half stars use gradient fill defined in SVG */
    }
  </style>