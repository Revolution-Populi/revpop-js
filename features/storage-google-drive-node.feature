Feature: Google drive node storage
  In order to upload files to google storage
  As a user
  I want to get storage class with google drive adapter

  Background: Credentials
    Given I have a credentials in json format

  Scenario: get storage with google drive adapter
    Given google drive storage factory
    When I create storage
    Then I should get storage with google drive adapter