/**
 * The four co-founders. See 11-SUPPLIED-CONTENT.md §1. Display spelling and bios
 * are as supplied. LinkedIn is the only social that exists — never ship a
 * fabricated Facebook/Twitter link (11 §1). Photos are pending (11 §1 TODO), so
 * the UI uses an initials tile, never a stock face on a named person.
 */
export interface Partner {
  slug: string;
  name: string;
  role: string;
  focus: string;
  linkedin: string;
  bio: string;
}

export const PARTNERS: Partner[] = [
  {
    slug: 'tayeb-khan',
    name: 'Tayeb Khan',
    role: 'Co-founder',
    focus: 'Web development and finance',
    linkedin: 'https://www.linkedin.com/in/tayebmohammedkhan/',
    bio: 'An MBA graduate, Tayeb leads web development and financial management at Scaling Socials. He makes sure clients get web work that actually converts, and that the business stays financially sound.',
  },
  {
    slug: 'jamal-khan',
    name: 'Jamal Khan',
    role: 'Co-founder',
    focus: 'Paid media',
    linkedin: 'https://www.linkedin.com/in/jamal-mohammed-khan-4555001b2/',
    bio: 'An engineer by training, Jamal drives advertising strategy at Scaling Socials. He reads market shifts early and leads the media team that turns that into campaign performance.',
  },
  {
    slug: 'maaz-khan',
    name: 'Maaz Khan',
    role: 'Co-founder',
    focus: 'Ecommerce growth',
    linkedin: 'https://www.linkedin.com/in/maazing/',
    bio: 'An MBA focused on ecommerce and business development, Maaz has led growth for brands across fashion, beauty and home. He is the person clients call when a store needs to scale, not just launch.',
  },
  {
    slug: 'khushal-sharma',
    name: 'Khushal Sharma',
    role: 'Co-founder',
    focus: 'Brand and creator growth',
    linkedin: 'https://www.linkedin.com/in/khushal-sharma-836783120/',
    bio: 'An entrepreneur who has built and grown online businesses of his own, with an audience of 60,000+ on Instagram. Khushal brings an operator perspective on brand and creator-led growth.',
  },
];
