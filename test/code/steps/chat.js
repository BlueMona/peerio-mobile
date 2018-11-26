const { existingUsers } = require('../helpers/userHelper');

const { When, Then } = require('cucumber');

When('I start a DM with {word} user', async function(string) {
    const user = string === 'helper' ? this.helperUsername : existingUsers[string].name;
    await this.openContactsPickerForDM();
    await this.searchForRecipient(user);
    await this.contactSelectorPage.recipientContact(user).click();
});

When('I create a new room', async function() {
    this.roomName = new Date().getTime();
    await this.chatListPage.buttonCreateNewChat.click();
    await this.chatActionSheetPage.newRoomOption.click();
    await this.roomCreationPage.textInputRoomName.setValue(this.roomName);
    await this.roomCreationPage.hideKeyboardHelper();
    await this.roomCreationPage.nextButton.click();
    await this.roomCreationPage.goButton.click();
});

When('I create a new room named {word}', async function(string) {
    this.roomName = string;
    await this.chatListPage.buttonCreateNewChat.click();
    await this.chatActionSheetPage.newRoomOption.click();
    await this.roomCreationPage.textInputRoomName.setValue(this.roomName);
    await this.roomCreationPage.hideKeyboardHelper();
    await this.roomCreationPage.nextButton.click();
    await this.roomCreationPage.goButton.click();
});

When('I exit the current chat', async function() {
    await this.chatPage.buttonExitChat.click();
});

Then('I can send a message to the current chat', async function() {
    const message = `Test message ${new Date().getTime()}`;
    await this.chatPage.textInput.setValue(message);
    await this.chatPage.hideKeyboardHelper();
    await this.chatPage.buttonSendMessage.click();
});

Then('I send several messages to the current chat', async function() {
    if (await this.chatPage.shareFileInChatBeaconVisible)
        await this.chatPage.shareFileInChatBeacon.click();

    for (let i = 0; i < 3; i++) {
        await this.chatPage.buttonUploadToChat.click();
        await this.fileUploadPage.uploadFileFromGallery();
        await this.filesListPage.fileSharePreviewPopup.click();
        await this.app.pause(1000); // time to upload
    }
});

Then('I scroll down the chat list', async function() {
    await this.chatListPage.scrollDownHelper();
});

Then('I press the top unread message indicator', async function() {
    await this.chatListPage.topUnreadMessageIndicator.click();
    await this.chatListPage.homeScrollHelper();
});

Then('I can see the top unread chat', async function() {
    await this.chatListPage.chatWithTitle(this.roomName);
});

Then('I press the bottom unread message indicator', async function() {
    await this.chatListPage.bottomUnreadMessageIndicator.click();
    await this.chatListPage.scrollToEndHelper();
});

Then('I can see the bottom unread chat', async function() {
    await this.chatListPage.chatWithTitle(this.roomName);
});

Then('I can open a chat with {word}', async function(string) {
    await this.chatListPage.chatWithTitle(string).click();
});

Then('I open the chat', async function() {
    await this.chatListPage.chatWithTitle(this.username).click();
});

Then('I scroll up the chat', async function() {
    await this.app.pause(5000); // wait till chat loads
    if (await this.chatPage.shareFileInChatBeaconVisible)
        await this.chatPage.shareFileInChatBeacon.click();
    await this.chatPage.testAction2();
});

Then('I click the chat unread message indicator', async function() {
    await this.chatPage.chatUnreadMessageIndicator.click();
});

Then('I can no longer see the unread message indicator', async function() {
    await this.chatPage.chatUnreadMessageIndicatorDisappeared;
});

Then('They can send a message to the current chat', async function() {
    const message = `Test Message ${new Date().getTime()}`;
    await this.chatPage.textInput.setValue(message);
    await this.chatPage.hideKeyboardHelper();
    await this.chatPage.buttonSendMessage.click();
});

Then('I recieve placeholder DM', async function() {
    await this.chatListPage.chatWithTitle(this.username).click();
});

Then('They recieve placeholder DM', async function() {
    await this.chatListPage.chatWithTitle(process.env.PLACEHOLDERDM_TEST_USER).click();
});

Then('I cannot see their DM', async function() {
    const dmExists = await this.chatListPage.chatWithTitleExists(this.username);
    dmExists.should.be.false; // eslint-disable-line
});

Then('They cannot see my DM', async function() {
    const dmExists = await this.chatListPage.chatWithTitleExists(
        process.env.PLACEHOLDERDM_TEST_USER
    );
    dmExists.should.be.false; // eslint-disable-line
});

Then('User accepts placeholder DM', async function() {
    await this.chatPage.messageDmPlaceholder.click();
});

Then('User dismisses placeholder DM', async function() {
    await this.chatPage.dismissDmPlaceholder.click();
});

Then(/(?:I am|they are) in the chat list page/, async function() {
    await this.chatListPage.buttonCreateNewChat;
});

Then('I fill my chatlist', async function() {
    await this.chatListPage.testAction2();
});
