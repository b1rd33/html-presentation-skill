const CONFIG = { brand: 'NOVAPAY', theme: 'midnight' };

const SLIDES = [
  {
    type: 'title',
    title: 'NovaPay',
    subtitle: 'AI-Powered Payment Intelligence for the Next Billion Transactions',
    tagline: 'Series A | Q1 2026',
    notes: 'Open with the big vision. Emphasize that NovaPay is not just another payment processor — it is an intelligence layer on top of payments.'
  },
  {
    type: 'section',
    title: 'The Problem',
    subtitle: 'A $4.7T market held back by fraud and friction',
    pills: ['Payments', 'AI/ML', 'Fintech'],
    notes: 'Transition into the problem space. Frame the urgency: global digital payments are growing 15% YoY, but fraud losses and false declines are growing faster.'
  },
  {
    type: 'text',
    title: 'The Payments Paradox',
    body: 'Global digital payments hit $4.7 trillion in 2025, yet the infrastructure behind them remains brittle and reactive.\n\n- 2.8% of all transactions are falsely declined, costing merchants $443B annually\n- Fraud losses reached $48B globally, up 22% from the prior year\n- Legacy rules engines catch only 60% of sophisticated fraud patterns\n- Merchants lose 3x more revenue to false declines than to actual fraud\n\nThe industry needs a paradigm shift from reactive rules to predictive intelligence.',
    notes: 'Walk through each bullet. The false decline stat is the most powerful — merchants lose three times more to over-cautious fraud systems than to fraud itself.'
  },
  {
    type: 'numbers',
    title: 'Market Opportunity',
    items: [
      { value: '$4.7T', label: 'Global Digital Payments', desc: '2025 transaction volume', color: 'primary' },
      { value: '$443B', label: 'False Decline Losses', desc: 'Revenue merchants never see', color: 'danger' },
      { value: '$48B', label: 'Fraud Losses', desc: 'Up 22% year-over-year', color: 'warning' },
      { value: '14.2%', label: 'Market CAGR', desc: 'Through 2030', color: 'success' }
    ],
    notes: 'These numbers frame the TAM. The false decline figure always gets a reaction — it is nearly 10x the fraud losses. That asymmetry is our wedge.'
  },
  {
    type: 'quote',
    title: 'Industry Validation',
    quote: 'The next generation of payment infrastructure will not just move money — it will understand money. The companies that build intelligence into the transaction layer will define the next decade of fintech.',
    attribution: 'Sarah Chen',
    role: 'Managing Partner, Andreessen Horowitz',
    notes: 'Use this quote to build credibility. Sarah Chen has led several major fintech investments and her thesis aligns directly with our approach.'
  },
  {
    type: 'comparison',
    title: 'NovaPay vs. Legacy Approach',
    badge: 'VS',
    left: {
      title: 'Legacy Rules Engines',
      items: [
        'Static threshold-based rules',
        'Manual rule updates (weeks/months)',
        '60% fraud detection rate',
        'High false positive rate (2.8%)',
        'No cross-merchant intelligence',
        'Batch processing, delayed signals'
      ]
    },
    right: {
      title: 'NovaPay Intelligence',
      items: [
        'Adaptive ML models per merchant',
        'Real-time model retraining (minutes)',
        '94.7% fraud detection rate',
        '0.3% false positive rate',
        'Network-level pattern sharing',
        'Sub-50ms decisioning'
      ]
    },
    notes: 'This is the core differentiation slide. Emphasize the 9x reduction in false positives — that is the number that resonates most with merchant CFOs.'
  },
  {
    type: 'feature-matrix',
    title: 'Competitive Landscape',
    competitors: ['NovaPay', 'Stripe Radar', 'Forter', 'Riskified'],
    winnerCol: 0,
    features: [
      { name: 'Real-time ML decisioning', values: [true, true, false, false] },
      { name: 'Sub-50ms latency', values: [true, false, false, false] },
      { name: 'Cross-merchant intelligence', values: [true, true, false, false] },
      { name: 'Custom model training per merchant', values: [true, false, false, true] },
      { name: 'Chargeback guarantee', values: [true, false, true, true] },
      { name: 'Payment orchestration', values: [true, true, false, false] },
      { name: 'Self-serve integration (< 1 day)', values: [true, true, false, false] }
    ],
    notes: 'Walk through the matrix column by column. The key differentiators are sub-50ms latency combined with custom per-merchant models — no competitor offers both.'
  },
  {
    type: 'chart',
    title: 'Revenue Growth',
    subtitle: 'Annual Recurring Revenue (ARR)',
    labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'],
    values: [0.4, 0.9, 1.8, 3.2, 5.1, 7.8, 11.4, 16.2],
    prefix: '$',
    unit: 'M',
    chartColor: 'primary',
    annotation: { index: 7, text: '$16.2M ARR' },
    notes: 'We have grown from $400K to $16.2M ARR in eight quarters — roughly 5x year-over-year growth. Highlight that Q4 2025 acceleration came from enterprise deals landing.'
  },
  {
    type: 'metrics',
    title: 'Key Performance Indicators',
    subtitle: 'As of Q4 2025',
    metrics: [
      { value: '$16.2M', label: 'ARR', desc: '5.1x YoY growth', color: 'primary' },
      { value: '94.7%', label: 'Fraud Detection', desc: 'vs. 60% industry avg', color: 'success' },
      { value: '142%', label: 'Net Revenue Retention', desc: 'Negative churn', color: 'info' },
      { value: '340+', label: 'Merchants', desc: 'Including 12 enterprise', color: 'primary' },
      { value: '<50ms', label: 'P99 Latency', desc: 'Real-time decisioning', color: 'success' },
      { value: '$2.1B', label: 'Transactions Processed', desc: 'Monthly volume', color: 'info' }
    ],
    notes: 'The 142% NRR is critical — it means existing customers are expanding significantly. The P99 latency under 50ms is a hard technical moat.'
  },
  {
    type: 'table',
    title: 'Unit Economics',
    headers: ['Metric', 'Current', 'At Scale (2027E)'],
    highlightCol: 2,
    rows: [
      ['Gross Margin', '72%', '84%'],
      ['CAC Payback', '11 months', '7 months'],
      ['LTV/CAC Ratio', '6.2x', '9.8x'],
      ['Revenue per Employee', '$312K', '$520K'],
      ['Burn Multiple', '1.4x', '0.6x']
    ],
    notes: 'The unit economics are already strong and improve dramatically at scale. The burn multiple of 1.4x is top-decile for our stage. At scale projection assumes 84% gross margin as ML inference costs decrease.'
  },
  {
    type: 'team',
    title: 'Leadership Team',
    members: [
      { name: 'Priya Sharma', role: 'CEO & Co-founder', detail: 'Ex-Stripe, led Radar ML team. Stanford CS PhD.' },
      { name: 'Marcus Webb', role: 'CTO & Co-founder', detail: 'Ex-Google Brain. Built real-time ML systems at scale.' },
      { name: 'Elena Vasquez', role: 'VP Engineering', detail: 'Ex-Adyen. Scaled payment systems to 10B+ txns/year.' },
      { name: 'David Kim', role: 'VP Sales', detail: 'Ex-Plaid. Closed $40M+ in enterprise fintech deals.' }
    ],
    investors: [
      { name: 'Sequoia Capital', detail: 'Seed lead ($4.2M)' },
      { name: 'Ribbit Capital', detail: 'Seed participant' },
      { name: 'Elad Gil', detail: 'Angel investor' }
    ],
    notes: 'Emphasize the Stripe Radar pedigree — Priya literally built the competing product and saw its limitations firsthand. Marcus brings the deep ML infrastructure expertise.'
  },
  {
    type: 'timeline',
    title: 'Roadmap & Milestones',
    phases: [
      {
        phase: 'H1 2025',
        title: 'Foundation',
        status: 'done',
        items: ['Launched v2 ML pipeline', 'Crossed $10M ARR', 'SOC 2 Type II certified']
      },
      {
        phase: 'H2 2025',
        title: 'Scale',
        status: 'done',
        items: ['Enterprise tier launched', '12 enterprise customers signed', 'Expanded to EU markets']
      },
      {
        phase: 'H1 2026',
        title: 'Expand',
        status: 'active',
        items: ['Series A close ($35M)', 'Payment orchestration GA', 'LATAM market entry']
      },
      {
        phase: 'H2 2026',
        title: 'Dominate',
        status: 'upcoming',
        items: ['$50M ARR target', 'Issuer-side partnerships', 'NovaPay Capital launch']
      }
    ],
    notes: 'The completed milestones build credibility. The Series A use of funds is clear: payment orchestration product, geographic expansion, and the enterprise sales team.'
  },
  {
    type: 'closing',
    title: 'The Ask',
    subtitle: '$35M Series A to build the intelligence layer for global payments',
    tagline: 'Reducing fraud. Eliminating false declines. Accelerating commerce.',
    website: 'novapay.ai',
    notes: 'End with clarity. The ask is $35M. The vision is to become the default intelligence layer for payments globally. Leave time for Q&A.'
  }
];
