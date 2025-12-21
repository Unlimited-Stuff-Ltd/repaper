import { dev } from '$app/environment';
import { injectAnalytics } from '@vercel/analytics/sveltekit';
import { injectSpeedInsights } from '@vercel/speed-insights';

injectAnalytics({ mode: dev ? 'development' : 'production' });
injectSpeedInsights();
