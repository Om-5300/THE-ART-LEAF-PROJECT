export type ServiceItem = {
  _id?: string;
  title: string;
  icon: string;
  shortDescription: string;
  description: string;
};

export type GalleryItem = {
  _id?: string;
  title: string;
  category: string;
  imageUrl: string;
  description?: string;
};

export type ContactMessage = {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt?: string;
};

