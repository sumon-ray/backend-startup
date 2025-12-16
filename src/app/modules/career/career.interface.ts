export interface ICareer {
  _id: string;
  title: string;
  department: string;
  jobType: "full-time" | "part-time" | "remote";
  location: string;
  responsibilities: string[];
  requirements: string[];
  salaryRange: {
    min: number;
    max: number;
  };
  deadline: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
