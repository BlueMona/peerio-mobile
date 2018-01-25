import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { Text } from 'react-native';
import SafeComponent from '../shared/safe-component';
import Avatar from '../shared/avatar';
import contactState from './contact-state';

@observer
export default class ContactItem extends SafeComponent {
    onPress = () => {
        const { contact, onPress } = this.props;
        if (onPress) return this.props.onPress();
        if (contact.username) return contactState.routerMain.contacts(contact);
        return false;
    };

    renderThrow() {
        const { contact } = this.props;
        const { username, fullName, email, isDeleted } = contact;
        const isInvited = !username;
        return (
            <Avatar
                onPress={this.onPress}
                noTap={isInvited}
                height={56}
                contact={contact}
                isDeleted={isDeleted}
                title={username || email}
                title2={fullName || <Text style={{ fontStyle: 'italic' }}>(invited)</Text>}
                hideOnline
                invited={isInvited} />
        );
    }
}

ContactItem.propTypes = {
    contact: PropTypes.any.isRequired
};
