################################################################################
#
# This .feature file has been written by Mona Ghassemi for use by Peerio.
# It is part of a set of .feature files located in the mobile repository, 
# tests-folder-scenarios.
# 
# If you have any questions, comments, or concerns regarding the contents 
# of this file, please contact Mona Ghassemi, @bluemona, on Peerio. 
#
# Thanks! 
#
################################################################################

@folders @sharing @owner
Feature: Shared Folders (volumes) owner
    As a Peerio user, I have access to shared folders called volumes. I may have different 
    privileges (editor, owner) with respect to a given volume. This feature contains 
    volume operations exclusively to volume owners.

Background:
    Given I am the owner of a file

#This is also available to other users (CHECK SPEC)
Scenario: I want to share a folder in a chat 
    When I share a folder in a chat (dm)
    Then the recipient gets an invite prompting them to accept the share
    And The folder becomes a volume 

Scenario Outline: remove a user from file tab (as editor)
    Given I have navigated to the files tab
    And   I Select the volume fileActions (...)
    And   I Select share
    And   I Select "View Shared With"
    And   I Select the "-" next to a user
    Then  The app will show "removed" next to the user's name
    When  I click "Save"
    And   The user's privileges to the volume will be revoked
    And   The file volume will be removed from the user's "Files"
    And   Any chats in which the folder was shared will show "Folder was unshared" instead
    And   My chat messages where I have shared the folder will have an option "Reshare"

Scenario Outline: I delete a <file or folder> (only available to owners)
    Given I am the owner of the <file or folder>
    And   I delete the <file or folder>
    Then  the <file or folder> is removed from Peerio servers
    And   the <file or folder> is unshared and deleted for every user who ever received it
    And   I will have my storage freed for the capacity of the <file or folder>

#Not implemented
#Scenario: add a user (as the owner)
#    Given I am the owner of the folder
#    When  I share a folder in a chat (DM or room)
#    Then  I will be prompted to specify what permissions to grant recipients
#    And the users in the DM or room will receive an invitation to accept or decline with permissions specified
    #When the recipient accepts the invite
    #Then the volume will be added to their "Your Drive" with the specified role applied

Scenario Outline: unshare file (as owner)
    Given I am the owner of the file
    And   I am viewing the audit log of the file
    When  I select the file and click to unshare with a <chat_volume>
    Then  the <users> in the <chat or volume> will lose access to the file

Examples: 
    | chat_volume | users                 |  
    | DM          | recipient             | 
    #| room        | all room members      |
    | volume      | all volume recipients | 

Scenario: move file from volume (shared folder) into regular folder
    Given I have navigated to the file
    When  I click on the file options
    And   I click on move
    Then  I am prompted to move the folder 
    When  I choose a destination folder 
    Then  The file will be copied to the destination folder 
    And   The file will be deleted from the volume 
    And   The file will be unshared from users of the volume
