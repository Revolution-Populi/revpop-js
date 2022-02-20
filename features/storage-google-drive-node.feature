Feature: Google Drive node storage
  In order to upload files to Google Drive storage
  As a user
  I want to get storage class with Google Drive node adapter

  Background: Credentials
    Given I have a credentials for Google Drive node adapter

  Scenario: get storage with Google Drive node adapter
    Given Google Drive node storage factory
    When I create Google Drive node storage
    Then I should get storage with Google Drive node adapter