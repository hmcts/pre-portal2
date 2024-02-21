import { Application } from 'express';

export default function (app: Application): void {
  app.get('/sign-in', (req, res) => {
    res.render('sign-in'); // process login
  });

  app.post('/sign-in', (req, res) => {
    // process the login
    res.redirect('/browse');
  });
}
