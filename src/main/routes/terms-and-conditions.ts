import { Application } from 'express';

export default function (app: Application): void {
  app.get('/terms-and-conditions', (req, res) => {
    res.render('terms-and-conditions');
  });
}
