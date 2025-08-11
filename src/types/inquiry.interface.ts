export interface IInquiry {
  _id: string;
  name: string;
  email: string;
  purpose: string;
  message: string;
  resolved: boolean;
  resolvedBy?: {
    _id: string;
    name: string;
    email: string;
  };
  resolvingMessage?: string;
  createdAt: string;
  resolvedAt?: string;
  __v?: number;
}

export interface IInquiryFormData {
  name: string;
  email: string;
  purpose: string;
  message: string;
}

export interface IInquiryResolution {
  resolvingMessage: string;
}

export interface InquiriesResponse {
  inquiries: IInquiry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface InquiryStats {
  total: number;
  resolved: number;
  pending: number;
  recent: number;
  resolutionRate: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const INQUIRY_PURPOSES = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'order-inquiry', label: 'Order Status & Tracking' },
  { value: 'shipping-delivery', label: 'Shipping & Delivery' },
  { value: 'returns-exchanges', label: 'Returns & Exchanges' },
  { value: 'product-information', label: 'Product Information' },
  { value: 'size-fit-guide', label: 'Size & Fit Guide' },
  { value: 'payment-billing', label: 'Payment & Billing' },
  { value: 'technical-support', label: 'Technical Support' },
  { value: 'partnership-collaboration', label: 'Partnership & Collaboration' },
  { value: 'media-press', label: 'Media & Press' },
  { value: 'complaint-feedback', label: 'Complaint & Feedback' },
  { value: 'other', label: 'Other' }
];
