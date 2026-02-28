export const Permissions = {
  /* ============================
   * USER / AUTH
   * ============================ */
  USER_VIEW: 'user:view',
  USER_UPDATE_PROFILE: 'user:update:profile',
  USER_UPDATE_PASSWORD: 'user:update:password',
  USER_VERIFY_EMAIL: 'user:verify:email',
  USER_DISABLE: 'user:disable',

  /* ============================
   * COURSE (Instructor / Admin)
   * ============================ */
  COURSE_CREATE: 'course:create',
  COURSE_UPDATE: 'course:update',
  COURSE_DELETE: 'course:delete',
  COURSE_PUBLISH: 'course:publish',
  COURSE_UNPUBLISH: 'course:unpublish',
  COURSE_VIEW_ALL: 'course:view:all',

  /* ============================
   * LECTURE / CONTENT
   * ============================ */
  LECTURE_ADD: 'lecture:add',
  LECTURE_UPDATE: 'lecture:update',
  LECTURE_DELETE: 'lecture:delete',
  LECTURE_UPLOAD: 'lecture:upload',
  LECTURE_VIEW: 'lecture:view',

  /* ============================
   * ENROLLMENT
   * ============================ */
  ENROLL_COURSE: 'enrollment:create',
  UNENROLL_COURSE: 'enrollment:delete',
  VIEW_ENROLLED_COURSES: 'enrollment:view',

  /* ============================
   * CATEGORY / SUBCATEGORY
   * ============================ */
  CATEGORY_CREATE: 'category:create',
  CATEGORY_UPDATE: 'category:update',
  CATEGORY_DELETE: 'category:delete',
  CATEGORY_VIEW: 'category:view',

  SUBCATEGORY_CREATE: 'subcategory:create',
  SUBCATEGORY_UPDATE: 'subcategory:update',
  SUBCATEGORY_DELETE: 'subcategory:delete',

  /* ============================
   * REVIEWS / RATINGS
   * ============================ */
  REVIEW_ADD: 'review:add',
  REVIEW_UPDATE: 'review:update',
  REVIEW_DELETE: 'review:delete',
  REVIEW_VIEW: 'review:view',

  /* ============================
   * ADMIN / RBAC
   * ============================ */
  ROLE_VIEW: 'role:view',
  ROLE_ASSIGN: 'role:assign',
  PERMISSION_VIEW: 'permission:view',
  PERMISSION_ASSIGN: 'permission:assign',

  /* ============================
   * SYSTEM / AUDIT
   * ============================ */
  VIEW_AUDIT_LOGS: 'audit:view',
} as const;

/**
 * PermissionKey type
 * Usage:
 *   PermissionKey
 *   keyof typeof Permissions
 */
export type PermissionKey =
  typeof Permissions[keyof typeof Permissions];
