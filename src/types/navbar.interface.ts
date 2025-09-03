export interface INavbarItem {
  label: string;
  keyword: string;
  href: string;
  order: number;
}

export interface INavbarCategory {
  id: string;
  title: string;
  order: number;
  items: INavbarItem[];
}

export interface INavbarSection {
  id: string;
  title: string;
  order: number;
  categories: INavbarCategory[];
}

export interface INavbarData {
  navItems: INavbarSection[];
  lastUpdated?: Date;
  version?: number;
}

export interface ICreateNavbarItem {
  label: string;
  keyword: string;
  href: string;
}

export interface ICreateNavbarCategory {
  title: string;
  items: ICreateNavbarItem[];
}

export interface ICreateNavbarSection {
  title: string;
  categories: ICreateNavbarCategory[];
}

export interface IUpdateNavbarData {
  navItems: ICreateNavbarSection[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
