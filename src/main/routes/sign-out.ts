import { Application } from 'express';

export default function (app: Application): void {
  app.get('/sign-out', (req, res) => {
    // destroy the session
    res.redirect('/sign-in');
  });
}
