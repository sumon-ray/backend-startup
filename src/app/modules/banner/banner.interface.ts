export interface IBanner {
  _id: string;
  heading: string;
  subheading: string;
  description: string;
  backgroundImage: string;
  showcaseProjects: [string, string][];
  callToAction: {
    label: string;
    url: string;
  };
  createdAt: Date;
  updatedAt: Date;
};
