import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import icons from '../helpers/icons';
import beaconState from '../beacons/beacon-state';

@observer
export default class MeasureableIcon extends SafeComponent {
    layout = () => {
        const { beacon } = this.props;
        if (beacon) {
            this.ref.measure(
                (frameX, frameY, frameWidth, frameHeight, pageX, pageY) => {
                    console.log(
                        `frameWidth: ${frameWidth},
                        frameHeight: ${frameHeight},
                        pageX: ${pageX},
                        pageY: ${pageY}`);
                    beacon.position = { frameWidth, frameHeight, pageX, pageY };
                    beaconState.requestBeacon(beacon);
                });
        }
    };

    // TODO clean up mock beacons
    // ---------------------
    componentWillUnmount() {
        // removeBeacon is NOP for undefined
        beaconState.removeBeacon(this.props.beacon);
    }

    setRef = ref => { this.ref = ref; };

    renderThrow() {
        return (
            <View
                onLayout={this.layout}
                ref={this.setRef} // TODO clean up mock beacons
                style={{ borderWidth: 1, borderColor: 'yellow' }}>
                {icons.plain(this.props.icon, undefined, this.props.color)}
            </View>
        );
    }
}

