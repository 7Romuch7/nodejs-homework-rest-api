const responseHttp = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERORR: 500
}

const Subscription = {
  STARTER: 'starter',
  PRO: 'pro',
  BUSSINES: 'business'
}

module.exports = { responseHttp, Subscription }