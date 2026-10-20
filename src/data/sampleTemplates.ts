import { ReportType, TargetLanguage } from '../types/report';

export interface SampleTemplate {
  id: string;
  name: string;
  badge: string;
  description: string;
  reportType: ReportType;
  targetLanguage: TargetLanguage;
  projectName: string;
  clientName: string;
  timeframe: string;
  notes: string;
  highlightFocus: string;
}

export const SAMPLE_TEMPLATES: SampleTemplate[] = [
  {
    id: 'ecommerce-seo-hinglish',
    name: 'E-Commerce SEO Case Study (Hinglish Input)',
    badge: 'Popular • Hinglish to English',
    description: 'Raw Hindi/Hinglish notes converted into a high-stakes, attractive client case study.',
    reportType: 'case-study',
    targetLanguage: 'English',
    projectName: 'D2C Organic Revenue Explosion',
    clientName: 'UrbanStyle Apparel',
    timeframe: 'May 2026 - September 2026 (5 Months)',
    notes: `bhai humne urbanstyle ke liye SEO aur technical fix kiya tha.
Pehle inki organic traffic sirf 8,000 monthly visits thi aur sales sirf 2-3 lakh per month aa rahi thi.
Main problem:
1. Website bohot slow thi (PageSpeed mobile pe 28 tha)
2. 404 broken links the lagbhag 400 se zyada
3. Duplicate meta tags the aur collection pages rank nahi ho rahe the.

Humne kya kiya:
- Full technical audit kiya, Core Web Vitals fix kiya (PageSpeed 28 se 89 ho gaya).
- High intent keywords target kiye jaise "oversized graphic tees india", "cargo joggers for men".
- 45 high quality blog posts aur buyer guides likhi with internal linking.
- Tier 1 fashion publications se 22 high authority backlinks banwaye.

Result (5 mahine baad):
- Traffic 8,000 se badhkar 84,000 monthly visits ho gaya (10x growth!).
- Revenue organic se 2.5 lakh se seedha 31.8 lakh per month pahuch gaya.
- Top 15 commercial keywords Google ke 1st page pe rank #1 to #3 aa gaye.
- Conversion rate 0.9% se badh kar 2.4% ho gaya.
Client ka feedback bohot khush tha bola "Best agency investment we made".`,
    highlightFocus: 'Emphasize 10x organic traffic jump, 12.7x revenue increase, and PageSpeed transformation.',
  },
  {
    id: 'weekly-ppc-performance',
    name: 'Weekly Performance Report (Paid Ads & ROAS)',
    badge: 'Weekly Report',
    description: 'Weekly sprint breakdown of Google & Meta ads spend, ROAS, CPA, and next sprint priorities.',
    reportType: 'weekly-report',
    targetLanguage: 'English',
    projectName: 'Meta & Google Ads Performance Sprint',
    clientName: 'Apex Fitness Gear',
    timeframe: 'Week 42 (Oct 12 - Oct 18, 2026)',
    notes: `Weekly Paid Media Summary:
Total Ad Spend: $14,250 across Meta Ads ($9,000) and Google Search/PMax ($5,250).
Generated Revenue: $61,275 (Overall Blended ROAS: 4.3x vs target of 3.5x).
New Customer Acquisitions: 842 orders (CPA dropped from $22.40 to $16.92).

Key Wins this week:
- Creative variation #4 (UGC workout challenge video) became the top performer on Instagram Reels with a 5.1x ROAS.
- Google PMax audience signals refreshed with high LTV customer list, reducing bounce rate by 18%.
- Scaled budget by 15% on weekends without sacrificing CPA.

Blockers / Watch items:
- Cost per click on Meta increased slightly (+8%) on Thursday due to festive competition.
- Ad account creative fatigue detected on the static banner set #2.

Next Week Plan:
- Deploy 6 new TikTok-style hook videos for UGC testing.
- Launch retargeting catalog campaign for cart abandoners with dynamic discount codes.`,
    highlightFocus: 'Highlight blended ROAS of 4.3x, CPA drop to $16.92, and UGC creative scalability.',
  },
  {
    id: 'monthly-saas-growth',
    name: 'Monthly Executive Business Report',
    badge: 'Monthly Report',
    description: 'Comprehensive month-over-month executive review of ARR, churn, product usage, and pipeline.',
    reportType: 'monthly-report',
    targetLanguage: 'English',
    projectName: 'Q3 SaaS Growth & Retention Review',
    clientName: 'CloudScale CRM',
    timeframe: 'September 2026 (Monthly Review)',
    notes: `Monthly business metrics for CloudScale CRM:
- MRR closed at $148,500 (up from $126,000 in August, +17.8% MoM growth).
- Net New Customers: 46 new enterprise teams onboarded.
- Net Revenue Retention (NRR): 118% (upsells from tier 1 to tier 2 plan).
- Churn Rate: 1.4% (historic low, down from 2.9% two months ago).
- CAC Payback Period: Reduced from 8.2 months to 6.1 months due to referral program launch.

Major Strategic Initiatives Delivered:
1. Rolled out Automated Workflows v2.0 (active adoption reached 64% in 14 days).
2. Partner integration with HubSpot & Slack finalized.
3. Sales pipeline value grew to $480K for Q4 closing.`,
    highlightFocus: 'Focus on 17.8% MoM MRR surge, record low churn of 1.4%, and NRR at 118%.',
  },
  {
    id: 'website-audit-action-plan',
    name: 'Website & Conversion Rate Audit',
    badge: 'Audit & Roadmap',
    description: 'Technical, UX, and conversion rate analysis with prioritized action matrix.',
    reportType: 'audit',
    targetLanguage: 'English',
    projectName: 'E-Commerce UX & Conversion Rate Optimization Audit',
    clientName: 'PureBotanicals Skincare',
    timeframe: 'Comprehensive Audit (October 2026)',
    notes: `We did an end-to-end UX, speed, and checkout audit for PureBotanicals.
Current metrics:
- Monthly visitors: 110,000
- Add to cart rate: 5.8% (healthy)
- Cart-to-checkout dropoff: 68% (critical bottleneck!)
- Overall store conversion rate: 1.25% (industry benchmark is 2.8%)
- Revenue loss estimated: $45,000/month due to checkout friction.

Major issues found:
1. Forced account creation during checkout - users abandon rather than sign up.
2. Missing local payment methods (UPI, Apple Pay, Klarna).
3. Mobile layout shifts during add to cart button click.
4. No trust badges or customer reviews visible on product page above the fold.
5. Delivery time estimate not shown until the final payment step.

Recommendations:
- Enable 1-click guest checkout (Priority: High, expected +22% checkout completion)
- Integrate instant UPI and Apple Pay express buttons
- Add sticky "Buy Now" bar on mobile screens
- Highlight free shipping threshold bar dynamically in slide-out cart`,
    highlightFocus: 'Highlight the 68% checkout dropoff fix and estimated $45K monthly revenue recapture.',
  },
];
