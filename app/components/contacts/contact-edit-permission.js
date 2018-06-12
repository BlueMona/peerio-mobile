import PropTypes from 'prop-types';
import React from 'react';
import { View, FlatList } from 'react-native';
import { reaction, action } from 'mobx';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { tu } from '../utils/translator';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import Layout3 from '../layout/layout3';
import fileState from '../files/file-state';
import ContactEditPermissionItem from './contact-edit-permission-item';
import ModalHeader from '../shared/modal-header';

const INITIAL_LIST_SIZE = 10;
const PAGE_SIZE = 2;

@observer
export default class ContactEditPermission extends SafeComponent {
    get data() {
        // currentFile is a folder
        return fileState.currentFile && fileState.currentFile.isShared ?
            fileState.currentFile.otherParticipants : [];
    }

    @action.bound unshareFrom(contact) {
        // HINT: removing on layout animated listview causes side effects
        // we just collapse it inline
        fileState.currentFile.removeParticipant(contact);
    }

    componentDidMount() {
        this.reaction = reaction(() => [
            this.data
        ], () => {
            this.forceUpdate();
        }, true);
    }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
    }

    get unshareButton() {
        const extraWidth = 20;
        if (fileState.currentFile.isFolder && fileState.currentFile.isShared) {
            return icons.text(tu('button_unshare'), this.props.action, null, null, extraWidth);
        }
        return icons.disabledText(tu('button_unshare'), null, extraWidth);
    }

    exitRow() {
        const { title, onExit } = this.props;
        const leftIcon = icons.dark('close', onExit);
        /* TODO: show unshare button */
        const rightIcon = null; // this.unshareButton
        const fontSize = vars.font.size.big;
        const outerStyle = { backgroundColor: 'transparent' };
        return <ModalHeader {...{ leftIcon, rightIcon, title, fontSize, outerStyle }} />;
    }

    item = ({ item }) => {
        return (<ContactEditPermissionItem
            contact={item}
            onUnshare={this.unshareFrom} />);
    };

    body() {
        return (
            <FlatList
                initialNumToRender={INITIAL_LIST_SIZE}
                pageSize={PAGE_SIZE}
                data={this.data}
                renderItem={this.item} />);
    }

    renderThrow() {
        const { footer } = this.props;
        const header = (
            <View style={{ flex: 0 }}>
                {this.exitRow()}
            </View>
        );
        const body = this.body();
        const layoutStyle = {
            backgroundColor: 'white'
        };
        return (
            <Layout3
                defaultBar
                body={body}
                header={header}
                noFitHeight
                footer={footer}
                style={layoutStyle} />
        );
    }
}

ContactEditPermission.propTypes = {
    title: PropTypes.any,
    action: PropTypes.func,
    onExit: PropTypes.func,
    footer: PropTypes.any
};
