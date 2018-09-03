import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import randomWords from 'random-words';
import capitalize from 'capitalize';
import { vars, signupStyles } from '../../styles/styles';
import signupState from './signup-state';
import { tx } from '../utils/translator';
import StyledTextInput from '../shared/styled-text-input';
import { socket, validation, telemetry } from '../../lib/icebear';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';
import SignupButtonBack from './signup-button-back';
import SignupHeading from './signup-heading';
import whiteLabelComponents from '../../components/whitelabel/white-label-components';
import TmHelper from '../../telemetry/helpers';
import tm from '../../telemetry';

const { S } = telemetry;

const { validators } = validation;
const { firstName, lastName } = validators;

@observer
export default class SignupStep1 extends SafeComponent {
    firstnameState = observable({ value: '' });
    lastnameState = observable({ value: '' });

    @action.bound firstNameInputRef(ref) { this.firstNameInput = ref; }
    @action.bound lastNameInputRef(ref) { this.lastNameInput = ref; }

    @action.bound onSubmitFirstName() { this.lastNameInput.onFocus(); }

    componentDidMount() {
        this.startTime = Date.now();
        TmHelper.currentRoute = S.ACCOUNT_NAME;
        // QUICK SIGNUP DEV FLAG
        if (__DEV__ && process.env.PEERIO_QUICK_SIGNUP) {
            this.firstNameInput.onChangeText(capitalize(randomWords()));
            this.lastNameInput.onChangeText(capitalize(randomWords()));
        }
        // fill fields when returning from another step
        if (signupState.firstName) {
            this.firstnameState.value = signupState.firstName;
            this.firstNameInput.onChangeText(this.firstnameState.value);
        }
        if (signupState.lastName) {
            this.lastnameState.value = signupState.lastName;
            this.lastNameInput.onChangeText(this.lastnameState.value);
        }
    }

    componentWillUnmount() {
        tm.signup.duration(this.startTime);
    }

    @action.bound async handleNextButton() {
        if (this.isNextDisabled) return;
        signupState.firstName = this.firstnameState.value;
        signupState.lastName = this.lastnameState.value;
        signupState.next();
        tm.signup.next();
    }

    get isNextDisabled() {
        return !socket.connected || (!this.firstnameState.value ||
            !this.firstNameInput.isValid || !this.lastNameInput.isValid);
    }

    renderThrow() {
        return (
            <View style={signupStyles.page}>
                <whiteLabelComponents.SignupStepIndicator />
                <View style={signupStyles.container}>
                    <SignupButtonBack />
                    <SignupHeading title="title_createYourAccount" subTitle="title_nameHeading" />
                    <StyledTextInput
                        autoFocus
                        state={this.firstnameState}
                        validations={firstName}
                        inputName={S.FIRST_NAME}
                        label={`${tx('title_firstName')}*`}
                        helperText={tx('title_hintUsername')}
                        maxLength={24}
                        required
                        clearTextIcon
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={this.onSubmitFirstName}
                        ref={this.firstNameInputRef}
                        testID="firstName" />
                    <StyledTextInput
                        state={this.lastnameState}
                        validations={lastName}
                        inputName={S.LAST_NAME}
                        label={`${tx('title_lastName')}*`}
                        helperText={tx('title_hintUsername')}
                        maxLength={24}
                        required
                        clearTextIcon
                        returnKeyType="next"
                        blurOnSubmit={false}
                        onSubmitEditing={this.handleNextButton}
                        ref={this.lastNameInputRef}
                        testID="lastName" />
                    <View style={{ alignItems: 'flex-end' }}>
                        {buttons.roundBlueBgButton(
                            tx('button_next'),
                            this.handleNextButton,
                            this.isNextDisabled,
                            'button_next',
                            { width: vars.signupButtonWidth, marginVertical: 30 })}
                    </View>
                </View>
            </View>
        );
    }
}
