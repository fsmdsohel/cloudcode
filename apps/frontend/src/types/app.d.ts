export type IFeatureCard = {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  title: string;
  description: string;
};

export type IPricingCard = {
  title: string;
  price: string;
  features: string[];
  highlight?: boolean;
};
