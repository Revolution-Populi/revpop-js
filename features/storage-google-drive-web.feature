Feature: Google drive web storage
  In order to upload files to Google storage
  As a user
  I want to get storage class with Google Drive web adapter

  Background: Credentials
    Given I have a credentials for Google Drive web adapter

  Scenario: get storage with google drive web adapter
    Given Google Drive web storage factory
    When I create Google Drive web storage
    Then I should get storage with Google Drive web adapter