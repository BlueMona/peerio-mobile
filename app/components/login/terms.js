import React, { Component } from 'react';
import { Linking } from 'react-native';
import { t } from 'peerio-translator';
import { observer } from 'mobx-react/native';
import { config } from '../../lib/icebear';
import Button from '../controls/button';
import Center from '../controls/center';
import loginState from '../login/login-state';

@observer
export default class Terms extends Component {
    constructor(props) {
        super(props);
        this.terms = this.terms.bind(this);
    }

    terms() {
        if (loginState.isInProgress) return;
        Linking.openURL(config.translator.urlMap.openTerms.link);
    }

    render() {
        return (
            <Center>
                <Button text={t('link_HHterms')} onPress={this.terms} />
            </Center>
        );
    }
}
