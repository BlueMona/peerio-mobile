import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { vars } from '../../styles/styles';
import { tu } from '../utils/translator';

export default {
    uppercaseWhiteButton(text, onPress, disabled) {
        return (
            <TouchableOpacity
                onPress={disabled ? null : onPress}
                pressRetentionOffset={vars.pressRetentionOffset}
                style={{ padding: vars.spacing.medium.mini, marginTop: vars.spacing.small.mini2x, opacity: disabled ? 0 : 1 }}>
                <Text style={{ backgroundColor: 'transparent', color: disabled ? vars.txtMedium : vars.white }}>
                    {tu(text)}
                </Text>
            </TouchableOpacity>
        );
    },

    uppercaseWhiteButtonNoPadding(text, onPress, disabled, textStyle = {}) {
        return (
            <TouchableOpacity
                onPress={disabled ? null : onPress}
                pressRetentionOffset={vars.pressRetentionOffset}
                style={{ opacity: disabled ? 0 : 1 }}>
                <Text style={[textStyle, { backgroundColor: 'transparent', color: disabled ? vars.txtMedium : vars.white }]}>
                    {tu(text)}
                </Text>
            </TouchableOpacity>
        );
    },

    uppercaseBlueButton(text, onPress, disabled, hidden) {
        const opacity = hidden ? 0.0 : 1.0;
        return (
            <View style={{ opacity }}>
                <TouchableOpacity
                    disabled={disabled}
                    onPress={disabled ? null : onPress}
                    pressRetentionOffset={vars.pressRetentionOffset}
                    style={{ paddingRight: vars.spacing.small.maxi2x, paddingVertical: vars.spacing.small.maxi }}>
                    <Text style={{ fontWeight: 'bold', color: disabled ? vars.txtMedium : vars.bg }}>
                        {tu(text)}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    },

    uppercaseBlueBgButton(text, onPress, disabled, hidden) {
        const opacity = hidden ? 0.0 : 1.0;
        return (
            <View style={{ opacity }}>
                <TouchableOpacity
                    disabled={disabled}
                    onPress={disabled ? null : onPress}
                    pressRetentionOffset={vars.pressRetentionOffset}
                    style={{ borderRadius: 2, paddingHorizontal: vars.spacing.medium.mini2x, paddingVertical: vars.spacing.small.maxi, backgroundColor: disabled ? vars.txtMedium : vars.bg }}>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center', color: vars.white }}>
                        {tu(text)}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    },

    uppercaseGreenBgButton(text, onPress, disabled, hidden) {
        const opacity = hidden ? 0.0 : 1.0;
        const s = {
            borderRadius: 16,
            paddingHorizontal: vars.spacing.medium.mini2x,
            paddingVertical: vars.spacing.small.maxi,
            backgroundColor: disabled ? vars.txtMedium : vars.snackbarBgGreen
        };
        return (
            <View style={{ opacity }}>
                <TouchableOpacity
                    disabled={disabled}
                    onPress={disabled ? null : onPress}
                    pressRetentionOffset={vars.pressRetentionOffset}
                    style={s}>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center', color: vars.white }}>
                        {tu(text)}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    },

    uppercaseBlueButtonNoPadding(text, onPress, disabled) {
        return (
            <TouchableOpacity
                onPress={disabled ? null : onPress}
                pressRetentionOffset={vars.pressRetentionOffset}
                style={{ padding: vars.spacing.medium.mini }}>
                <Text style={{ fontWeight: 'bold', color: disabled ? vars.txtMedium : vars.bg }}>
                    {tu(text)}
                </Text>
            </TouchableOpacity>
        );
    },

    uppercaseGrayButtonNoPadding(text, onPress, disabled) {
        return (
            <TouchableOpacity
                onPress={disabled ? null : onPress}
                pressRetentionOffset={vars.pressRetentionOffset}
                style={{ paddingRight: vars.spacing.small.maxi2x }}>
                <Text style={{ fontWeight: 'bold', color: disabled ? vars.lightGrayBg : vars.txtDate }}>
                    {tu(text)}
                </Text>
            </TouchableOpacity>
        );
    },

    uppercaseRedButton(text, onPress, disabled) {
        return (
            <TouchableOpacity
                onPress={disabled ? null : onPress}
                pressRetentionOffset={vars.pressRetentionOffset}
                style={{ paddingRight: vars.spacing.small.maxi2x, paddingVertical: vars.spacing.small.maxi }}>
                <Text style={{ fontWeight: 'bold', color: disabled ? vars.txtMedium : vars.txtAlert }}>
                    {tu(text)}
                </Text>
            </TouchableOpacity>
        );
    }

};
