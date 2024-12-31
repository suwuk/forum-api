const config = {
    database: {
      host: process.env.PGHOST,
      port: process.env.PGPORT,
      user: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE,
    },
    jwt: {
      accessTokenKey: process.env.ACCESS_TOKEN_KEY,
      refreshTokenKey: process.env.REFRESH_TOKEN_KEY,
      accessTokenAge: process.env.ACCESS_TOKEN_AGE,
    },
  };
  
  module.exports = config;