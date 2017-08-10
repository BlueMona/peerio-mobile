import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView } from 'react-native';
import { observable } from 'mobx';
import { MenuContext } from 'react-native-popup-menu';
import SafeComponent from '../shared/safe-component';
import SnackBarConnection from '../snackbars/snackbar-connection';
import uiState from '../layout/ui-state';

@observer
export default class Layout1 extends SafeComponent {
    @observable height = 0;

    componentDidMount() {
        uiState.currentScrollView = this._scrollView;
    }

    componentWillUnmount() {
        uiState.currentScrollView = null;
    }

    renderThrow() {
        const boxStyle = {
            flex: 1,
            flexGrow: 1,
            flexDirection: 'column',
            justifyContent: 'space-between'
        };

        const contentContainerStyle = {
            flexGrow: 1,
            minHeight: this.props.noFitHeight ? undefined : this.height
        };

        const fillerStyle = {
            flexGrow: 1,
            justifyContent: 'space-between'
        };

        return (
            <MenuContext>
                <View
                    onLayout={event => (this.height = event.nativeEvent.layout.height)}
                    testID="layout1"
                    style={[boxStyle, this.props.style]}>
                    {this.props.header}
                    <ScrollView
                        ref={ref => (this._scrollView = ref)}
                        contentContainerStyle={contentContainerStyle}
                        style={{ flex: 1, flexGrow: 1 }}
                        scrollEnabled={!this.props.noScroll}
                        keyboardShouldPersistTaps="handled">
                        <View style={fillerStyle}>
                            {this.props.body}
                            {this.props.footer}
                        </View>
                    </ScrollView>
                    {this.props.footerAbsolute}
                    <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
                        <SnackBarConnection />
                    </View>
                </View>
            </MenuContext>
        );
    }
}

Layout1.propTypes = {
    body: PropTypes.any,
    style: PropTypes.any,
    footer: PropTypes.any,
    footerAbsolute: PropTypes.any,
    header: PropTypes.any,
    padding: PropTypes.any,
    noScroll: PropTypes.bool,
    noFitHeight: PropTypes.bool,
    noAutoHide: PropTypes.bool,
    noKeyboard: PropTypes.bool,
    defaultBar: PropTypes.bool
};
