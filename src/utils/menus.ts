import { useI18n } from '@/hooks/web/useI18n';
import type { AppRouteRecordRaw } from '@/router/types';

const { t } = useI18n();

export function transformMenuData(menuData: AppRouteRecordRaw[]): AppRouteRecordRaw[] {
  return menuData.map((menu) => {
    const item: AppRouteRecordRaw = {
      path: menu.path,
      name: menu.name,
      component: menu.component,
      children: [],
      meta: {
        icon: menu.icon,
        title: t('sys.menu.' + menu.name),
        hideBreadcrumb: false,
        permissions: menu.permissions,
      },
    };

    if (menu.pid === 0) {
      //一级菜单，不隐藏子菜单，修改渲染组件方式
      item.path = '/' + menu.path;
      item.component = 'LAYOUT';

      // 设置默认 redirect
      if (menu.children && menu.children.length > 0) {
        item.redirect = `/${menu.path}/${menu.children[0].path}`;
      }
    }

    if (menu.children && menu.children.length > 0) {
      item.children = transformMenuData(menu.children);
    }
    return item;
  });
}
