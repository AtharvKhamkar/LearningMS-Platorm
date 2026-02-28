import { Permissions } from './permissions';
import { Roles } from './roles';

/**
 * Role → Permissions mapping
 * This is the SINGLE source of truth for RBAC rules
 */
export const RolePermissions: Record<Roles, readonly string[]> = {
  /* ============================
   * ADMIN (System Owner)
   * ============================ */
  [Roles.ADMIN]: [
    ...Object.values(Permissions), // full access
  ],

  /* ============================
   * INSTRUCTOR
   * ============================ */
  [Roles.INSTRUCTOR]: [
    // User
    Permissions.USER_VIEW,
    Permissions.USER_UPDATE_PROFILE,

    // Course
    Permissions.COURSE_CREATE,
    Permissions.COURSE_UPDATE,
    Permissions.COURSE_PUBLISH,
    Permissions.COURSE_UNPUBLISH,
    Permissions.COURSE_VIEW_ALL,

    // Lecture / Content
    Permissions.LECTURE_ADD,
    Permissions.LECTURE_UPDATE,
    Permissions.LECTURE_DELETE,
    Permissions.LECTURE_UPLOAD,
    Permissions.LECTURE_VIEW,

    // Categories (read-only)
    Permissions.CATEGORY_VIEW,
    Permissions.SUBCATEGORY_CREATE,
    Permissions.SUBCATEGORY_UPDATE,

    // Reviews
    Permissions.REVIEW_VIEW,
  ],

  /* ============================
   * STUDENT
   * ============================ */
  [Roles.STUDENT]: [
    // User
    Permissions.USER_VIEW,
    Permissions.USER_UPDATE_PROFILE,
    Permissions.USER_UPDATE_PASSWORD,

    // Courses
    Permissions.COURSE_VIEW_ALL,

    // Enrollment
    Permissions.ENROLL_COURSE,
    Permissions.UNENROLL_COURSE,
    Permissions.VIEW_ENROLLED_COURSES,

    // Lectures (view only)
    Permissions.LECTURE_VIEW,

    // Reviews
    Permissions.REVIEW_ADD,
    Permissions.REVIEW_UPDATE,
    Permissions.REVIEW_DELETE,
    Permissions.REVIEW_VIEW,
  ],
};
