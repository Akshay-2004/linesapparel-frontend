export interface ITestimonial {
  _id: string;
  name: string;
  stars: number;
  published: boolean;
  quote: string;
  imageUrl?: string;
  occupation: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ITestimonialFormData {
  name: string;
  stars: number;
  published: boolean;
  quote: string;
  occupation: string;
  location: string;
}

export interface TestimonialsResponse {
  testimonials: ITestimonial[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
