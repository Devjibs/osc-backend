export const tokenExpiration = () =>
  process.env.TOKEN_EXPIRES_IN ? Number(process.env.TOKEN_EXPIRES_IN) : '1h';
