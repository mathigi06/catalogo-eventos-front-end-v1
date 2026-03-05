export type FeaturedCardVM = {
  kind: "evento" | "ponto";
  id: number;
  title: string;
  subtitle: string;
  image: string;
  href: string;
  badge: string;
};