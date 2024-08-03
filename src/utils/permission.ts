import { useI18n } from '@/hooks/web/useI18n';
import { useUserStore } from '@/store/modules/user';

const { t } = useI18n();
export enum MenuPermissionModeEnum {
  VIEW = 'index',
  UPDATE = 'update',
  DELETE = 'delete',
  ADD = 'add',
  BATCH = 'batch',
  UPLOAD = 'upload',
  RESTORE = 'restore',
  DOWNLOAD = 'download',
}

export function hasPermission(title: string, action: MenuPermissionModeEnum): boolean {
  const userStore = useUserStore();

  const menus = userStore.getUserMenus;
  let permissions: any;

  menus.filter((menu) => {
    menu.children?.filter((child) => {
      if (t(child.meta.title) === title) {
        permissions = child.meta.permissions;
      }
    });
  });
  return permissions?.includes(action) as boolean;
}
