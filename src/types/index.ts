export interface Car {
  id: string;
  brand: string;
  model: string;
  slug: string;
  year: number;
  price: number;
  mileage: number;
  fuel: "petrol" | "diesel" | "electric" | "hybrid";
  transmission: "manual" | "automatic";
  power_kw: number;
  engine_capacity: number;
  color: string;
  body_type: string;
  doors: number;
  vin: string;
  description_sk: string;
  description_hu: string;
  description_de: string;
  description_en: string;
  images: string[];
  featured: boolean;
  status: "available" | "reserved" | "sold";
  autobazar_eu_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Reservation {
  id: string;
  car_id: string;
  name: string;
  email: string;
  phone: string;
  preferred_date: string;
  message: string | null;
  status: "new" | "confirmed" | "cancelled";
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  created_at: string;
}
