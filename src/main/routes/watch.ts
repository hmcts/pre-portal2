import { Application } from 'express';

export default function (app: Application): void {
  app.get('/watch/:id', (req, res) => {
    res.render('watch');
  });
}
