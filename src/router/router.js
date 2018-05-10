import Main from '@/components/Main'
export const appRouter = [
  {
    path: '/',
    name: 'Main',
    component: Main,
    children: [
      {
        path: 'test1',
        name: 'Test1',
        component: () => import('@/components/test/test1')
      },
      {
        path: 'test2',
        name: 'Test2',
        component: () => import('@/components/test/test2')
      },
      {
        path: 'test3',
        name: 'Test3',
        component: () => import('@/components/test/test3')
      },
      {
        path: '403',
        name: '403',
        component: () => import('@/components/403')
      },
      {
        path: '404',
        name: '404',
        component: () => import('@/components/404')
      }
    ]
  }
]

export const routers = [
  ...appRouter
]
