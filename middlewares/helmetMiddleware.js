// /middlewares/helmetMiddleware.js
const helmet = require('helmet');

const helmetMiddleware = (app) => {
  // Usar Helmet para todas las cabeceras de seguridad
  app.use(helmet());

  // También puedes configurar opciones específicas si lo necesitas
  // app.use(
  //   helmet.contentSecurityPolicy({
  //     directives: {
  //       defaultSrc: ["'self'"],
  //       scriptSrc: ["'self'", "'unsafe-inline'"],
  //     }
  //   })
  // );
};

module.exports = helmetMiddleware;
