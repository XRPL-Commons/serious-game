// Definitions for navigation items
export interface NavigationItem {
    label: string;
    to: string;
    icon: string;
    click?: () => void;
}

// Navigation items for all users
export const COMMON_NAV_ITEMS: NavigationItem[] = [
    {
        label: 'Home',
        to: '/',
        icon: 'i-heroicons-home',
    },
];

// Navigation items for admins
export const ADMIN_NAV_ITEMS: NavigationItem[] = [
    {
        label: 'Admin Dashboard',
        to: '/admin',
        icon: 'i-heroicons-command-line',
    },
    {
        label: 'Classrooms',
        to: '/teacher',
        icon: 'i-heroicons-rectangle-stack',
    },
];

// Navigation items for teachers
export const TEACHER_NAV_ITEMS: NavigationItem[] = [
    {
        label: 'Teacher Dashboard', // Everything related to the teacher's classroom
        to: '/teacher',
        icon: 'i-heroicons-academic-cap',
    }
    // To be completed with features for teachers
];

// Navigation items for students
export const STUDENT_NAV_ITEMS: NavigationItem[] = [
    {
        label: 'Student Dashboard', // Everything related to the student's classroom
        to: '/student',
        icon: 'i-heroicons-user-circle',
    },
    // To be completed with features for students
];

// Navigation items for logged-in users
export const LOGGED_IN_NAV_ITEMS = (clickEventHandlers: { [key: string]: () => void }): NavigationItem[][] => [
    [
        // {
        //     label: 'Profile',
        //     to: '/profile',
        //     icon: 'i-heroicons-user',
        // },
    ],
    // To be completed with additional navigation items
];
