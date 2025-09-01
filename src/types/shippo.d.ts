export interface Address {
  name: string;
  street1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  email?: string;
  company?: string;
}

export interface Parcel {
  length: number;
  width: number;
  height: number;
  distance_unit: 'cm' | 'in';
  weight: number;
  mass_unit: 'kg' | 'lb' | 'g' | 'oz';
}