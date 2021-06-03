const router = require('express').Router();

const routes = ['users', 'session'];

routes.forEach(route => router.use(`/${route}`, require(`./${route}`)));

// for (const route of routes) {
//     router.use(`/${route}`, require(`./${route}`));
// }

module.exports = router;
