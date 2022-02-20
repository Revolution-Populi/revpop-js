Feature: IPFS storage
  In order to upload files to IPFS
  As a user
  I want to get storage class with IPFS adapter

  Background: Credentials
    Given I have a credentials for IPFS adapter

  Scenario: Get storage with IPFS adapter
    Given IPFS storage factory
    When I create IPFS storage
    Then I should get storage with IPFS adapter