import { ROUTE_CONSTANTS } from '@/constants/routeConstants'
import { DashboardConfig } from 'types'

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: 'Documentation',
      href: '/docs',
    },
    {
      title: 'Support',
      href: '/support',
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: 'Dashboard',
      href: ROUTE_CONSTANTS.HOME,
      icon: 'circleGauge',
    },
    {
      title: 'Items',
      href: ROUTE_CONSTANTS.ITEMS,
      icon: 'page',
    },
    {
      title: 'Invoice',
      href: ROUTE_CONSTANTS.INVOICE,
      icon: 'post',
    },
    {
      title: 'Company',
      href: ROUTE_CONSTANTS.COMPANY,
      icon: 'building',
    },
  ],
}
