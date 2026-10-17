<script lang="ts">
	import { ArrowUpRight, ArrowUp } from 'lucide-svelte';
</script>

<footer>
	<div class="shell">
		<div class="footer-top">
			<div>
				<span class="eyebrow">Μείνε περίεργος. Συνέχισε να διαβάζεις.</span>
				<p>Η επόμενη σελίδα<br />είναι πάντα η αρχή.</p>
			</div>
			<div class="footer-links">
				<a href="/reviews">Όλες οι κριτικές <ArrowUpRight size={16} /></a><a href="/tags"
					>Εξερεύνησε τις κατηγορίες <ArrowUpRight size={16} /></a
				><a href="#top">Πίσω στην κορυφή <ArrowUp size={16} /></a>
			</div>
		</div>
		<a class="footer-wordmark" href="/">Books Are Cool<span>✳</span></a>
		<div class="footer-bottom">
			<span>© {new Date().getFullYear()} Books Are Cool</span><span>Για την αγάπη των βιβλίων.</span
			><span>Κριτικές · Ιδέες · Ανακαλύψεις</span>
		</div>
	</div>
</footer>

<style>
	footer {
		margin-top: 90px;
		background: var(--olive);
		color: var(--paper);
		padding: 58px 0 24px;
	}
	.footer-top {
		display: flex;
		justify-content: space-between;
		gap: 30px;
	}
	.eyebrow {
		color: #d4d7c7;
		font-size: 9px;
	}
	p {
		font-family: var(--font-serif);
		font-size: clamp(26px, 3vw, 40px);
		line-height: 1.4;
		letter-spacing: -0.03em;
		margin-top: 18px;
	}
	.footer-links {
		width: 280px;
		padding-top: 18px;
	}
	.footer-links a {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 24px;
		font-size: 12px;
		border-bottom: 1px solid #ffffff30;
		padding: 14px 0;
	}
	.footer-links a:hover {
		color: #d5dabb;
	}
	.footer-wordmark {
		font-family: Georgia, serif;
		font-weight: 700;
		font-size: clamp(48px, 10.2vw, 146px);
		letter-spacing: -0.075em;
		line-height: 1.4;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 45px;
	}
	.footer-wordmark span {
		font-family: var(--font-sans);
		font-weight: 400;
		font-size: 0.8em;
		color: #c3c7a5;
	}
	.footer-bottom {
		border-top: 1px solid #ffffff30;
		padding-top: 22px;
		display: flex;
		justify-content: space-between;
		gap: 15px;
		font-size: 9px;
		color: #d4d7c7;
	}
	@media (max-width: 600px) {
		footer {
			margin-top: 60px;
			padding-top: 40px;
		}
		.footer-top {
			flex-direction: column;
		}
		.footer-links {
			width: 100%;
		}
		.footer-bottom {
			flex-wrap: wrap;
		}
		.footer-bottom span:last-child {
			display: none;
		}
	}
</style>
