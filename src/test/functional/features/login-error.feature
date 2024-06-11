Feature: Login failures
  Scenario: Credentials must be valid
    When I go to '/'
    Then the page should include 'Sign in'
    Then I sign in as an unknown user
    Then the page should include 'Incorrect email or password.'

  Scenario: Error message for sign up of known user must be valid
    When I go to '/'
    Then I click the link 'Sign up now'
    Then I validate email for test user
    Then the page should include 'E-mail address verified. You can now continue.'
    Then I create new password for user
    Then the page should include 'There is an issue with your credentials, or you are already registered. Please check and retry.'

    
