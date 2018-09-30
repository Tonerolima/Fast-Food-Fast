import express from 'express';

const router = express();


// Other routes
router.all('/*', (req, res) => {
  res.status(404).send({ status: false, message: 'Invalid request' });
});


export default router;
