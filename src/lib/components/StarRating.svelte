<script lang="ts">
	let {
		rating,
		size = 'medium',
		showText = false,
		ratingText = ''
	}: {
		rating: number;
		size?: 'small' | 'medium' | 'large';
		showText?: boolean;
		ratingText?: string;
	} = $props();
	let normalized = $derived(Math.max(0, Math.min(5, Number.isFinite(rating) ? rating : 0)));
</script>

<div class="rating {size}" aria-label="Βαθμολογία {normalized} από 5">
	<span class="stars" aria-hidden="true"
		>{#each [0, 1, 2, 3, 4] as star}<span class="star"
				>★<span class="fill" style:width="{Math.max(0, Math.min(1, normalized - star)) * 100}%"
					>★</span
				></span
			>{/each}</span
	>
	{#if showText && ratingText}<span class="rating-text">{ratingText}</span>{/if}
</div>

<style>
	.rating {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
	}
	.stars {
		display: inline-flex;
		gap: 2px;
	}
	.star {
		position: relative;
		color: #d6d1c1;
		line-height: 1;
	}
	.fill {
		position: absolute;
		inset: 0 auto 0 0;
		color: var(--red);
		overflow: hidden;
	}
	.small {
		font-size: 13px;
	}
	.medium {
		font-size: 16px;
	}
	.large {
		font-size: 21px;
	}
	.rating-text {
		font-size: 11px;
		color: var(--color-text-gray);
	}
</style>
