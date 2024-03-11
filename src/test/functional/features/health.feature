Feature: View Browse Page

    Scenario: The health check should be accessible and include a status
      When I go to '/health'
      Then the page should include 'status'
