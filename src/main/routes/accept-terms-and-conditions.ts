import { Application } from 'express';

export default function (app: Application): void {
  app.get('/accept-terms-and-conditions', (req, res) => {
    res.render('accept-terms-and-conditions');
  });

  app.post('/accept-terms-and-conditions', (req, res) => {
    // @todo accept terms and conditions
    res.redirect('/browse');
  });
}
