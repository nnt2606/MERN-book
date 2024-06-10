import{
    HiOutlineViewGrid,
    HiOutlineCube,
    HiOutlineShoppingCart,
    HiOutlineDocumentText,
    HiOutlineQuestionMarkCircle,
    HiOutlineUsers,
    HiOutlineCog,
    HiOutlineAnnotation,
} from "react-icons/hi";


export const DASHBOARD_SIDEBAR_LINKS = [
    {
        key:'dashboard',
        label:'Dashboard',
        path: '/admin',
        icon: <HiOutlineViewGrid />
    },
    {
        key:'products',
        label: 'Products',
        path: '/admin/product',
        icon: <HiOutlineCube />
    },
    {
        key: 'orders',
        label: 'Orders',
        path: '/admin/orders',
        icon: <HiOutlineShoppingCart />
    },
    {
        key: 'discount',
        label: 'Discount',
        path: '/admin/discount',
        icon: <HiOutlineDocumentText />
    },
    {
        key: 'manageAdmin',
        label: 'Manage account',
        path: '/admin/manage',
        icon: <HiOutlineDocumentText />
    },
    // {
    //     key: 'message',
    //     label: 'Message',
    //     path: '/admin/message',
    //     icon: <HiOutlineAnnotation />
    // }
]

export const DASHBOARD_SIDEBAR_BOTTOMS_LINKS = [
    {
        key: 'settings',
        label: 'Settings',
        path: '/admin/settings',
        icon: <HiOutlineCog />
    },
    {
        key: 'support',
        label: 'Help & Support',
        path: '/admin/support',
        icon: <HiOutlineQuestionMarkCircle />
    }
]

export const NAVBAR = [
    {
      key: 'home',
      label: "Home",
      path: "/home",
    },
    {
      key: 'shop',
      label: "Shop",
      path: "/shop",
    },
    {
      key: 'about',
      label: "About",
      path: "/about",
    },
    {
      key: 'contact',
      label: "Contact",
      path: "/contact",
    },
    {
      key: 'journal',
      label: "Journal",
      path: "/journal",
    }
  ]