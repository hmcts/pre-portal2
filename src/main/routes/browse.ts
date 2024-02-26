import { Application } from 'express';

export default function (app: Application): void {
  app.get('/browse', async (req, res) => {
    // having to check if oidc is defined is a bit of a code smell but needed whilst pa11y is testing when logged out
    res.render('browse', { user: req.oidc?.user });
  });
}
