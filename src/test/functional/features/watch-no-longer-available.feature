Feature: Watch no longer available
    Background: portal login
      Given I go to '/'
      Then the page should include 'Sign in'
      Then I sign in with valid credentials as the test user
      Then I accept the terms and conditions if I need to

    Scenario: The correct page should be rendered when going to a case no longer available to watch
      When I am on the '/watch/37a21715-70a1-4593-bc2e-61f95c76e0c4' page
      Then the page should include 'Page is no longer available'
      Then the page should include 'Please click here to return to the homepage.'

    Scenario: The standard 404 page should be rendered when going to a case which is an invalid uuid
      When I am on the '/watch/invaliduuid' page
      Then the page should include 'Page not found'
      Then the page should include 'If you entered a web address, check it is correct.'