import { Application } from 'express';

export default function (app: Application): void {
  app.get('/sign-in', (req, res) => {
    res.render('sign-in'); // process login
  });
}
