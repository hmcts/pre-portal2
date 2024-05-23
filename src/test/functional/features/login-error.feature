Feature: Login failures
  Scenario: Credentials must be valid
    When I go to '/'
    Then the page should include 'Sign in'
    Then I sign in as an unknown user
    Then the page should include 'Incorrect email or password.'
