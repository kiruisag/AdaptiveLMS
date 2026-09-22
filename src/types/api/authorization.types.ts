export type UserRole =
  | 'learner'
  | 'instructor'
  | 'org_admin'
  | 'sys_admin';

export interface RoleResourceDTO {
  name: string;
  guard_name: string;
  team_id?: number | null;
  permissions: string[];
}
