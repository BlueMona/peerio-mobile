import React, { Component } from 'react';
import ContactSelector from '../contacts/contact-selector';
import { t } from '../utils/translator';
import chatState from '../messaging/chat-state';
import fileState from '../files/file-state';

export default class FileShare extends Component {
    render() {
        return (
            <ContactSelector
                onExit={() => chatState.routerModal.discard()}
                action={contacts => chatState.startChatAndShareFiles(contacts, fileState.currentFile)}
                title={t('title_shareWith')} />
        );
    }
}
