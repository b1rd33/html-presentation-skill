const CONFIG = {
  brand: 'ACME LABS',
  theme: 'midnight',
};

const SLIDES = [
  {
    type: 'title',
    title: 'ACME LABS',
    subtitle: 'PRODUCT LAUNCH 2026',
    tagline: 'Reinventing the way teams collaborate',
    notes: 'Welcome everyone. Today we are presenting our Q1 product launch.',
  },
  {
    type: 'text',
    title: 'The Problem',
    preTitle: 'CONTEXT',
    body: 'Teams waste 4.2 hours per week on fragmented communication tools.\n\n- Email threads get lost\n- Chat messages lack context\n- Documents live in silos\n- Decisions are never recorded',
    notes: 'Set up the pain point before presenting our solution.',
  },
  {
    type: 'metrics',
    title: 'Market Opportunity',
    preTitle: 'THE NUMBERS',
    metrics: [
      { value: '$48B', label: 'TAM', desc: 'Global collaboration market', color: 'primary' },
      { value: '23%', label: 'CAGR', desc: 'Annual growth rate', color: 'success' },
      { value: '4.2M', label: 'TEAMS', desc: 'Underserved segment', color: 'secondary' },
      { value: '142%', label: 'NRR', desc: 'Net revenue retention', color: 'warning' },
    ],
    notes: 'Emphasize the growth rate and retention metrics.',
  },
  {
    type: 'comparison',
    title: 'Why Us',
    preTitle: 'COMPETITIVE EDGE',
    badge: 'VS',
    left: {
      title: 'Status Quo',
      items: ['Fragmented tools', 'Manual updates', 'No single source of truth', 'Context switching'],
    },
    right: {
      title: 'ACME Labs',
      items: ['Unified workspace', 'Real-time sync', 'AI-powered summaries', 'One-click decisions'],
    },
    notes: 'Drive home the contrast between current pain and our solution.',
  },
  {
    type: 'closing',
    title: 'THANK YOU',
    subtitle: 'hello@acmelabs.io',
    tagline: 'Let\'s build the future of teamwork',
    website: 'acmelabs.io',
    notes: 'Open the floor for questions.',
  },
];
