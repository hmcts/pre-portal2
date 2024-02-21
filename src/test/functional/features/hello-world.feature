Feature: Initial Functional test

    Scenario: The sign in page loads
        When I go to '/sign-in'
        Then the page should include 'Sign in'
