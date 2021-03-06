import React from 'react';
import { View } from 'react-native';
import Text from '../controls/custom-text';
import settingsState from '../settings/settings-state';
import { vars } from '../../styles/styles';
import plans from './payments-config';
import paymentsNative from './payments-native';
import { tx } from '../utils/translator';
import BlueButtonText from '../buttons/blue-text-button';

function upgradeMessage(title) {
    const container = {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: vars.lightGrayBg,
        height: vars.inputHeight,
        paddingLeft: vars.spacing.medium.midi,
        paddingRight: vars.spacing.small.maxi
    };

    const text = {
        color: vars.txtDark
    };

    return (
        <View style={container}>
            <Text style={text}>{title}</Text>
            <BlueButtonText text="button_upgrade" onPress={settingsState.upgrade} />
        </View>
    );
}

function upgradeForFiles() {
    return !process.env.PEERIO_DISABLE_PAYMENTS &&
        !plans.userHasPaidPlan() &&
        paymentsNative.showFileUpgradeOffer
        ? upgradeMessage(tx('title_outOfStorage'))
        : null;
}

function upgradeForArchive() {
    return !process.env.PEERIO_DISABLE_PAYMENTS &&
        !plans.userHasPaidPlan() &&
        paymentsNative.showArchiveUpgradeOffer
        ? upgradeMessage(tx('title_upgradeForArchive'))
        : null;
}

export { upgradeForFiles, upgradeForArchive };
export default paymentsNative;
