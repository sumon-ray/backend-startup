import { Response } from 'express'

type TPaginationMeta = {
  total: number
  page: number
  limit: number
  totalPages: number
}

type TSuccessResponse<T> = {
  statusCode: number
  success: boolean
  message: string
  token?: string
  data: T | T[] | null
  meta?: TPaginationMeta | null
}

const sendResponse = <T>(res: Response, data: TSuccessResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    token: data.token,
    data: data.data,
    meta: data.meta ?? null,
  })
}

export default sendResponse;