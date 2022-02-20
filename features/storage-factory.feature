Feature: Storage factory
  In order to upload files using storage
  As a user
  I want to use storage factory

  Scenario Outline: Get storage by using storage factory
    Given There is adapter <type> with credentials
    When I use storage factory to create cloud storage
    Then It should use appropriate storage factory

    Examples:
      | type              |
      | ipfs              |
      | google_drive_web  |
      | google_drive_node |