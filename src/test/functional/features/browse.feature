Feature: View Browse Page

    Scenario: The browse page should show a list of all the videos after signing in
      When I go to '/health'
      Then the page should include 'status'
