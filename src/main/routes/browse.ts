import { Application } from 'express';

export default function (app: Application): void {
  app.get('/browse', async (req, res) => {
    // const userInfo = await req.oidc.fetchUserInfo();
    // res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
    // having to check if oidc is defined is a bit of a code smell but needed whilst pa11y is testing when logged out
    res.render('browse', { user: req.oidc?.user });
  });
}
