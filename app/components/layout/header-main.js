import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { gradient } from '../controls/effects';
import routerMain from '../routes/router-main';
import { vars } from '../../styles/styles';
import BackIcon from './back-icon';

@observer
export default class HeaderMain extends SafeComponent {
    renderThrow() {
        let leftIcon = this.props.leftIcon || null;
        const rightIcon = this.props.rightIcon || null;
        if (routerMain.isBackVisible) {
            leftIcon = <BackIcon />;
        }
        const textStyle = {
            flex: 1,
            flexGrow: 1,
            flexShrink: 1,
            color: vars.white,
            fontSize: vars.font.size.big,
            fontWeight: 'bold',
            textAlign: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: 'blue',
            borderWidth: 0,
            backgroundColor: 'transparent'
            // marginLeft: routerMain.currentIndex === 0 ? vars.iconSize * 3 : -vars.iconSize
        };
        const containerStyle = {
            flex: -1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: vars.statusBarHeight,
            minHeight: vars.headerHeight
        };
        const titleAction = routerMain.titleAction;
        const iconPlaceHolderWidth = (32 + vars.iconSize);
        const paddingRight = !rightIcon && leftIcon ? iconPlaceHolderWidth : 0;
        const paddingLeft = rightIcon && !leftIcon ? iconPlaceHolderWidth : 0;
        const header = (
            <TouchableOpacity activeOpacity={titleAction ? 0.2 : 1} onPress={titleAction}
                pressRetentionOffset={vars.retentionOffset}>
                <View key={`header_${routerMain.route}_${routerMain.currentIndex}`} style={containerStyle}>
                    <View style={{ flex: 0 }}>
                        {leftIcon}
                    </View>
                    <Text
                        ellipsizeMode="middle"
                        numberOfLines={1}
                        style={[textStyle, { paddingRight, paddingLeft }]}>
                        {this.props.title || routerMain.title}
                        {titleAction && <Text style={{ fontSize: vars.font.size.normal }}>
                            {'  ▼  '}
                        </Text>}
                    </Text>
                    <View style={{ flex: 0 }}>
                        {rightIcon}
                    </View>
                </View>
            </TouchableOpacity>
        );
        return gradient({
            paddingTop: vars.statusBarHeight,
            height: vars.headerHeight,
            flex: -1,
            justifyContent: 'flex-end',
            backgroundColor: vars.bg
        }, header);
    }
}

