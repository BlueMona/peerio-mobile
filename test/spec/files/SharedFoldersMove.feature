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

@folders @files @sharing @move  
Feature: Shared Folders (volumes) moving 
    As a Peerio user, I have access to shared folders called volumes. I may have different 
    privileges (editor, owner) with respect to a given volume. This feature contains 
    volume-related move operations.

Background: 
    Given I am any user, or viewer of the file_or_folder in question
    And   I have navigated to the file_or_folder
    When  I click on the file_or_folder options
    And   I click on move 
    Then  I am prompted to move the file_or_folder 

#this is a case for viewers only (unimplemented)
#THIS IS ONE THAT NEEDS TO BE OVERWRIDDEN IF I AM AN EDITOR OR OWNER
#A DIFFERENT VERSION IS INCLUDED IN THE EDITOR FILE (shared_folders_editor.feature)
#Scenario: move file from volume (shared folder) into regular folder
#    Given I choose a destination folder that is not a volume 
#    Then  The file will be copied to the destination folder 

### CHECK DOC TO SEE SPECIFICALLY WHAT IS INCLUDED IN THE LAST STEP ####
Scenario: move file from regular folder into shared folder
    Given I choose a destination volume
    Then  The file will be copied to the destination volume
    And   The users with whom that volume is shared will gain access to file 
