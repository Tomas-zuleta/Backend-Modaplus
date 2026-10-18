export type Module =
  | 'dashboard'
  | 'catalogo'
  | 'inventario'
  | 'colores'
  | 'tallas'
  | 'categorias'
  | 'ventas'
  | 'compras'
  | 'proveedores'
  | 'clientes'
  | 'roles'
  | 'usuarios'
  | 'separe'
  | 'abonos'
  | 'devoluciones';

export type PermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'download' | 'annul';

export interface PermissionSet {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  download: boolean;
  annul: boolean;
}

export type RolePermissions = Partial<Record<Module, PermissionSet>>;

export function parsePermissions(permissionsJson: string | null): RolePermissions {
  if (!permissionsJson) return {};
  try {
    return JSON.parse(permissionsJson) as RolePermissions;
  } catch {
    return {};
  }
}

export function hasPermission(
  permissions: RolePermissions,
  module: Module,
  action: PermissionAction,
): boolean {
  const modulePerms = permissions[module];
  if (!modulePerms) return false;
  return modulePerms[action] === true;
}

export function isSuperAdmin(rol: string): boolean {
  return rol === 'Superadministrador';
}
