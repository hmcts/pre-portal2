import { Application } from 'express';

export default function (app: Application): void {
  app.post('/login', (req, res) => {
    res.render('login'); // process login
  });
}
