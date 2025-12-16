import express from 'express'
import { articleRoutes } from '../modules/article/article.route'
import { bannerRoutes } from '../modules/banner/banner.route'
import { careerRoutes } from '../modules/career/career.route'


const router = express.Router()

const moduleRoutes = [

  {
    path: '/article',
    route: articleRoutes,
  },
  {
    path: '/banner',
    route: bannerRoutes,
  },
  {
    path: '/career',
    route: careerRoutes,
  },

]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router
