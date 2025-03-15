export interface Template {
  id: string;
  name: string;
  image?: string;
}

export const templates: Template[] = [
  {
    id: "modern",
    name: "Modern",
    image: "/templates/modern.png",
  },
  {
    id: "pepe",
    name: "Pepe",
    image: "/templates/pepe.png",
  },
  {
    id: "cosmic",
    name: "Cosmic",
    image: "/templates/cosmic.png",
  },
  {
    id: "stellar",
    name: "Stellar",
    image: "/templates/stellar.png",
  },
  {
    id: "rocket",
    name: "Rocket",
    image: "/templates/rocket.png",
  },
  {
    id: "minimal",
    name: "Minimal",
    image: "/templates/minimal.png",
  },
  {
    id: "playful",
    name: "Playful",
    image: "/templates/playful.png",
  },
];
