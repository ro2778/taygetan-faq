import Link from 'next/link';

interface Profile {
  name: string;
  role: string;
  description: string;
  style?: string;
}

const CONTACTEES: Profile[] = [
  {
    name: 'Gosia Duszak',
    role: 'Primary Contactee & Channel Founder',
    description:
      'Polish-born, Gosia moved from Barcelona to Finland during the contact years. She established the Cosmic Agency YouTube channel in 2018 as the primary English-language platform for the Taygetan contact. She conducts most of the interviews and conversations with the extraterrestrial crew, asking direct, often philosophically pointed questions. Her interviewing style is probing and personal — she pushes for clarity and is unafraid to challenge the speakers or express confusion.',
  },
  {
    name: 'Robert',
    role: 'Contactee & Despejando Enigmas Channel',
    description:
      'Robert runs the Spanish-language channel Despejando Enigmas. He has been part of the contact from the early days and conducts his own separate conversations with the Taygetan crew. His style tends toward broad, expansive questions — often asking the speakers to explain entire topics from scratch. Many important pieces of information, particularly on galactic history and Federation politics, originated in Robert\'s conversations.',
  },
];

const ETS: Profile[] = [
  {
    name: 'Swaruu of Erra (Swaruu 9)',
    role: 'Original Primary Speaker',
    description:
      'The ninth iteration of the Swaruu lineage and the first to make sustained contact with Gosia and Robert. A Taygetan woman of immense knowledge and direct delivery. Her explanations are systematic and thorough, often building complex frameworks from first principles. She was the dominant voice in the early transcripts, covering everything from galactic history to the nature of consciousness. Sadly died during the contact.',
    style: 'Systematic, authoritative, framework-building. Delivers long structured explanations.',
  },
  {
    name: 'Yazhi Swaruu (Sophia)',
    role: 'Youngest & Most Philosophically Advanced Speaker',
    description:
      'Described as the youngest of the Swaruunian line but operating at a consciousness level beyond the others. Yazhi\'s perspective is the most radical — she rejects densities, dimensions, timelines, and the multiverse as mere mental constructs, seeing only one unified Source having ideas. She is playful, loves chocolate in all its forms, and can shift between childlike warmth and metaphysical depth in a single paragraph. The warrior of the group and the most outspoken critic of the Galactic Federation.',
    style: 'Paradoxical, poetic, deconstructive. Dissolves categories others take for granted.',
  },
  {
    name: 'Athena Swaruu (Swaruu 11)',
    role: 'Taygetan Pilot & Political Commentator',
    description:
      'A young Taygetan woman who is a skilled pilot and takes a sanguine, balanced approach when discussing Earth affairs and Federation politics. Emotionally grounded and calm, she is the most diplomatic of the speakers, often navigating sensitive topics with composure and clarity. Her style is direct but measured, and she brings a steady, level-headed perspective to even the most contentious subjects.',
    style: 'Diplomatic, balanced, composed. Direct but measured — brings calm clarity to difficult topics.',
  },
  {
    name: 'Mari Swaruu (Swaruu 12)',
    role: 'Swaruu Official Channel Speaker',
    description:
      'The latest in the Swaruu lineage and the voice behind the Swaruu Official YouTube channel (launched 2022). Mari delivers carefully structured monologues on metaphysics, consciousness, and the nature of reality. Her tone is measured and contemplative, often building to philosophical conclusions about the unity of all existence.',
    style: 'Measured, contemplative, monologue-based. Builds arguments methodically to philosophical conclusions.',
  },
  {
    name: 'Aneeka of Temmer',
    role: 'Taygetan Science & Technology Specialist',
    description:
      'A Taygetan crew member with a focus on science, technology, and the mechanics of how things work — from starship propulsion to the 3D Matrix frequency fence. Aneeka tends to give detailed technical explanations and is the go-to speaker for questions about Taygetan technology, medical pods, and the Van Allen frequency bands. She also loved learning Earth curse words, especially during her conversations with Robert.',
    style: 'Technical, detail-oriented, explanatory. Enjoys breaking down how systems work — and picking up colourful language.',
  },
  {
    name: 'Rashell of Temmer',
    role: 'Taygetan Historian & Navigator',
    description:
      'One of the original crew members, Rashell contributed key information about galactic history, the Vril Society, and the Taygetans\' involvement in Earth affairs. She spoke infrequently but was particularly involved in discussions of the Second World War era and historical Taygetan interventions.',
    style: 'Reserved, historically focused. Contributed selectively but on significant topics.',
  },
  {
    name: 'Dhor Káal\'el',
    role: 'Taygetan Crew Member',
    description:
      'A male Taygetan crew member who features in several transcripts, often providing a male perspective on Taygetan society. His contributions span topics including Taygetan daily life, relationships, and the crew\'s experiences in Earth orbit.',
    style: 'Conversational, grounded, personal.',
  },
  {
    name: 'Arishah',
    role: 'Urmah Tiger Representative',
    description:
      'An Urmah Tiger — a feline being with a cat-like body, larger than the tigers found on Earth, though bipedal when he chooses to be. Arishah provided information about the Urmah species, their origins, and their relationship with Lyrian humans. He was also a strong opposing voice against Federation activities. His contributions include philosophical statements about the nature of consciousness and existence — notably that consciousness is eternal and has no origin point.',
    style: 'Philosophical, forceful, speaks with quiet authority. A powerful presence.',
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 pb-16 space-y-16">
      {/* Header */}
      <div>
        <nav className="text-sm font-sans text-cosmic-text-faint mb-6">
          <Link href="/" className="hover:text-cosmic-accent transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-cosmic-text-dim">About</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-serif text-cosmic-text mb-4">
          About the Contact
        </h1>
        <p className="text-cosmic-text-dim leading-relaxed max-w-3xl">
          From 2017 to 2024, two human contactees maintained an ongoing text-based communication
          with a crew of extraterrestrials in Earth orbit — primarily Taygetans from the Pleiades
          star system. The conversations were published across five YouTube channels and
          span hundreds of transcripts covering the nature of consciousness, forbidden galactic history,
          the true structure of reality, advanced extraterrestrial technology, and the hidden architecture
          of control on Earth.
        </p>
      </div>

      {/* Contactees */}
      <section>
        <h2 className="text-2xl font-serif text-cosmic-text mb-6">The Contactees</h2>
        <div className="space-y-6">
          {CONTACTEES.map(person => (
            <div
              key={person.name}
              className="p-6 bg-cosmic-card border border-cosmic-border rounded-xl"
            >
              <div className="mb-2">
                <h3 className="text-xl font-serif text-cosmic-text">{person.name}</h3>
                <p className="text-sm font-sans text-cosmic-accent">{person.role}</p>
              </div>
              <p className="text-cosmic-text-dim leading-relaxed">{person.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ET Speakers */}
      <section>
        <h2 className="text-2xl font-serif text-cosmic-text mb-2">The Speakers</h2>
        <p className="text-cosmic-text-dim mb-6">
          The extraterrestrial individuals who have communicated through the contact,
          each with their own personality, expertise, and communication style.
        </p>
        <div className="space-y-6">
          {ETS.map(et => (
            <div
              key={et.name}
              className="p-6 bg-cosmic-card border border-cosmic-border rounded-xl"
            >
              <div className="mb-2">
                <h3 className="text-xl font-serif text-cosmic-text">{et.name}</h3>
                <p className="text-sm font-sans text-cosmic-accent">{et.role}</p>
              </div>
              <p className="text-cosmic-text-dim leading-relaxed mb-3">{et.description}</p>
              {et.style && (
                <p className="text-sm font-sans text-cosmic-text-faint italic">
                  Communication style: {et.style}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Channels */}
      <section>
        <h2 className="text-2xl font-serif text-cosmic-text mb-4">The Channels</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-cosmic-card border border-cosmic-border rounded-xl">
            <h3 className="font-serif text-cosmic-text mb-1">Cosmic Agency</h3>
            <p className="text-sm text-cosmic-accent mb-2">English</p>
            <p className="text-sm text-cosmic-text-dim">Primary English-language channel run by Gosia. The main source for most transcripts.</p>
          </div>
          <div className="p-5 bg-cosmic-card border border-cosmic-border rounded-xl">
            <h3 className="font-serif text-cosmic-text mb-1">Despejando Enigmas</h3>
            <p className="text-sm text-cosmic-accent mb-2">Spanish</p>
            <p className="text-sm text-cosmic-text-dim">Robert&apos;s Spanish-language channel with separate conversations and additional material.</p>
          </div>
          <div className="p-5 bg-cosmic-card border border-cosmic-border rounded-xl">
            <h3 className="font-serif text-cosmic-text mb-1">Swaruu Official</h3>
            <p className="text-sm text-cosmic-accent mb-2">English &amp; Spanish</p>
            <p className="text-sm text-cosmic-text-dim">Mari Swaruu&apos;s own channel launched in 2022, featuring monologue-style explorations of consciousness and reality.</p>
          </div>
          <div className="p-5 bg-cosmic-card border border-cosmic-border rounded-xl">
            <h3 className="font-serif text-cosmic-text mb-1">Agencia Cósmica</h3>
            <p className="text-sm text-cosmic-accent mb-2">Spanish</p>
            <p className="text-sm text-cosmic-text-dim">Gosia&apos;s Spanish-language counterpart to Cosmic Agency.</p>
          </div>
          <div className="p-5 bg-cosmic-card border border-cosmic-border rounded-xl">
            <h3 className="font-serif text-cosmic-text mb-1">Cosmic Agency English</h3>
            <p className="text-sm text-cosmic-accent mb-2">English</p>
            <p className="text-sm text-cosmic-text-dim">Additional English-language channel for the contact material.</p>
          </div>
        </div>
      </section>

      <div className="text-center">
        <Link
          href="/"
          className="text-sm font-sans text-cosmic-accent hover:underline"
        >
          ← Back to search
        </Link>
      </div>
    </div>
  );
}
