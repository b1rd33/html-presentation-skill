const CONFIG = { brand: 'ESADE', theme: 'warm' };

const SLIDES = [
  {
    type: 'title',
    title: 'Introduction to Design Thinking',
    subtitle: 'A Human-Centered Approach to Innovation',
    tagline: 'MIM Program | Spring 2026',
    notes: 'Welcome the class. Today we introduce design thinking as a methodology — not just a buzzword. By the end of this session, students should be able to articulate the five stages, understand when to apply each, and recognize design thinking in real-world case studies.'
  },
  {
    type: 'section',
    title: 'Why Design Thinking?',
    subtitle: 'From linear problem-solving to creative confidence',
    pills: ['Innovation', 'Human-Centered Design', 'Methodology'],
    notes: 'Before jumping into the framework, establish why it matters. Traditional MBA problem-solving is analytical and convergent. Design thinking adds a divergent, generative phase that produces solutions traditional methods miss.'
  },
  {
    type: 'text',
    title: 'The Limits of Traditional Problem-Solving',
    body: 'Most business education trains you to be an excellent analytical thinker. You learn to define problems precisely, gather data, build models, and optimize solutions. This works brilliantly for well-defined problems.\n\nBut the most important problems in business are not well-defined. They are what Horst Rittel called "wicked problems" — situations where the problem itself is ambiguous, stakeholders disagree on what success looks like, and every attempted solution changes the problem.\n\nDesign thinking was developed at Stanford\'s d.school and IDEO specifically to address these messy, human-centered challenges. It does not replace analytical thinking — it complements it by adding structured methods for empathy, ideation, and rapid experimentation.',
    notes: 'Ask students for examples of wicked problems they have encountered in internships or case competitions. Common answers: organizational culture change, product-market fit, service design for diverse user populations. Use their examples throughout the lecture.'
  },
  {
    type: 'image-text',
    title: 'The Double Diamond',
    image: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Double_diamond.png',
    imageAlt: 'Double Diamond design process diagram showing Discover, Define, Develop, and Deliver phases',
    imagePosition: 'left',
    body: 'The Double Diamond, developed by the UK Design Council, visualizes how design thinking alternates between divergent and convergent modes.\n\nThe first diamond is about finding the right problem. You diverge through research and empathy, then converge on a clear problem definition.\n\nThe second diamond is about finding the right solution. You diverge through ideation, then converge through prototyping and testing.\n\nThis rhythm of opening up and narrowing down is what distinguishes design thinking from purely linear approaches.',
    notes: 'Point to the diagram. Emphasize the shape: the widening represents divergent thinking, the narrowing represents convergent thinking. Students often want to jump straight to solutions — the first diamond forces you to stay in the problem space longer.'
  },
  {
    type: 'process',
    title: 'The Five Stages of Design Thinking',
    subtitle: 'Based on the Stanford d.school framework',
    steps: [
      { label: 'Empathize', desc: 'Observe and engage with real users to understand their experiences, motivations, and pain points. Set aside your assumptions.' },
      { label: 'Define', desc: 'Synthesize your research into a clear, actionable problem statement. Frame the challenge from the user\'s perspective.' },
      { label: 'Ideate', desc: 'Generate a wide range of possible solutions. Defer judgment, encourage wild ideas, and build on the ideas of others.' },
      { label: 'Prototype', desc: 'Build quick, low-fidelity representations of your ideas. Make the abstract tangible so it can be experienced and tested.' },
      { label: 'Test', desc: 'Put prototypes in front of real users. Gather feedback, observe reactions, and refine your understanding of both the problem and the solution.' }
    ],
    notes: 'Walk through each stage slowly. The most common misconception is that these stages are strictly sequential. In practice, you iterate — testing often sends you back to empathize or redefine the problem. The process is iterative, not waterfall.'
  },
  {
    type: 'numbered-list',
    title: 'Principles for Effective Ideation',
    subtitle: 'Rules of brainstorming from IDEO',
    items: [
      'Defer judgment — there are no bad ideas in the divergent phase',
      'Encourage wild ideas — they often contain the seed of practical breakthroughs',
      'Build on the ideas of others — say "yes, and" rather than "no, but"',
      'Stay focused on the problem statement — creativity needs constraints',
      'One conversation at a time — listen before you speak',
      'Be visual — sketch, diagram, and make ideas tangible',
      'Go for quantity — aim for volume, not perfection'
    ],
    notes: 'These are the classic IDEO brainstorming rules. Emphasize that deferring judgment is the hardest one for business students — they are trained to evaluate and critique. In ideation, that instinct is counterproductive. Save evaluation for the convergent phase.'
  },
  {
    type: 'three-columns',
    title: 'Design Thinking in Practice',
    subtitle: 'Three case studies from different industries',
    columns: [
      {
        header: 'Airbnb',
        color: 'primary',
        items: [
          'Near bankruptcy in 2009',
          'Founders went door-to-door to understand hosts',
          'Discovered: bad listing photos killed trust',
          'Solution: free professional photography',
          'Revenue doubled in one week',
          'Empathy-driven insight saved the company'
        ]
      },
      {
        header: 'GE Healthcare',
        color: 'info',
        items: [
          'MRI machines terrified children',
          'Engineers focused on technical specs',
          'Designer observed children in hospitals',
          'Reframed: not a machine problem, an experience problem',
          'Created "Adventure Series" themed rooms',
          'Patient satisfaction rose from 50% to 90%'
        ]
      },
      {
        header: 'Bank of America',
        color: 'success',
        items: [
          'Wanted to attract new customers',
          'Observed real financial behaviors',
          'Discovered: people round up purchases mentally',
          'Created "Keep the Change" program',
          'Rounds up purchases, deposits difference',
          '12 million new accounts in first year'
        ]
      }
    ],
    notes: 'These three cases illustrate design thinking across very different contexts. Airbnb shows empathy research. GE Healthcare shows reframing the problem. Bank of America shows behavioral observation leading to product innovation. Ask students which stage was most critical in each case.'
  },
  {
    type: 'closing',
    title: 'Next Session',
    subtitle: 'Workshop: Empathy Mapping & Problem Definition',
    tagline: 'Bring a notebook and an open mind',
    notes: 'Preview the next session: it will be hands-on. Students will work in teams of four on a real empathy mapping exercise with users from a local nonprofit partner. Remind them to complete the pre-reading on empathy mapping techniques. Office hours are Thursday 14:00-16:00.'
  }
];
