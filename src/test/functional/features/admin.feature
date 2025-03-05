Feature: View Admin Page
@CrossBrowser
    Scenario: The admin status page should display for Super Users
      When I go to '/'
      Then the page should include 'Sign in'
      Then I sign in with valid credentials as a super user
      Then I accept the terms and conditions if I need to
      Then I am on the '/browse' page
      Then the page should include 'Welcome back,'
      Then I see the link 'Admin'
      Then I click the link 'Admin'
      Then the page URL should be '/admin/status'
      Then I am on the '/admin/status' page
      Then the page should include 'Admin'
      Then the page should include 'System Status'

    Scenario: The live events page should display for Super Users
      When I go to '/'
      Then the page should include 'Sign in'
      Then I sign in with valid credentials as a super user
      Then I accept the terms and conditions if I need to
      Then I am on the '/browse' page
      Then the page should include 'Welcome back,'
      Then I see the link 'Admin'
      Then I click the link 'Admin'
      Then I am on the '/admin/status' page
      Then I see the link 'MediaKind live events'
      Then I click the link 'MediaKind live events'
      Then I am on the '/admin/MK-live-events' page
      Then the page should include 'MediaKind Live Events'

    Scenario: The admin pages should not display for non Super Users
      When I go to '/'
      Then the page should include 'Sign in'
      Then I sign in with valid credentials as the test user
      Then I accept the terms and conditions if I need to
      Then I am on the '/browse' page
      Then the page should include 'Welcome back,'
      Then I do not see the link 'Admin'
      Given I go to '/admin'
      Then the page should include 'Page is not available'
      Given I go to '/admin/status'
      Then the page should include 'Page is not available'
      Given I go to '/admin/MK-live-events'
      Then the page should include 'Page is not available'




