import React, { Component } from 'react';
import { action, observable } from 'mobx';
import { View, StatusBar } from 'react-native';
import { observer } from 'mobx-react/native';
import Text from '../../controls/custom-text';
import PopupLayout from '../../layout/popup-layout';
import { User } from '../../../lib/icebear';
import contactState from '../../contacts/contact-state';
import { vars } from '../../../styles/styles';
import mockContactStore from '../mock-contact-store';
import BeaconLayout from '../../beacons/beacon-layout';
import routes from '../../routes/routes';
import MeasureableView from '../../shared/measureable-view';
import beaconState from '../../beacons/beacon-state';
import filesBeacons from '../../beacons/files-beacons';

const filesView = {
    borderWidth: 2,
    borderColor: 'blue',
    height: 400
};

@observer
export default class MockBeaconFiles extends Component {
    componentWillMount() {
        User.current = mockContactStore.createMock();
        User.current.activePlans = [];
        User.current.beacons = {
            get() { return null; }
        };
        contactState.store = mockContactStore;
        contactState.init();
        routes.main.route = 'files';
    }

    @action.bound onMeasure(position) {
        const beacon = filesBeacons.fileReceivedBeacon;
        beacon.position = position;
        beaconState.requestBeacon(beacon);
    }

    render() {
        return (
            <View style={{ backgroundColor: 'white', flex: 1, flexGrow: 1, paddingTop: vars.layoutPaddingTop }}>
                <MeasureableView onMeasure={this.onMeasure}>
                    <View style={filesView} />
                </MeasureableView>
                <PopupLayout key="popups" />
                <StatusBar barStyle="default" />
                <BeaconLayout />
            </View>
        );
    }
}
