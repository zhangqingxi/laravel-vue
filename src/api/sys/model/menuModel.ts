import type { RouteMeta } from 'vue-router';

export interface RouteItem {
  id: number;
  visible: boolean;
  sort: number;
  icon: string;
  path: string;
  component: any;
  meta: RouteMeta;
  name: string;
  alias?: string | string[];
  redirect?: string;
  caseSensitive?: boolean;
  children?: RouteItem[];
  allChildren?: RouteItem[];
}

export type MenuParams = {
  name?: string;
  status?: string;
};

export type UpdateMenuParams = {
  id: number;
  sort?: string;
  icon?: string;
};

export type DeleteMenuParams = {
  id: number;
};

/**
 * @description: Get menu return value
 */
export type getMenuListResultModel = RouteItem[];
