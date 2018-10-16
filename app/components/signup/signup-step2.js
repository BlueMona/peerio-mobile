import React from 'react';
import { observable, action, reaction, when } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity, LayoutAnimation } from 'react-native';
import randomWords from 'random-words';
import Text from '../controls/custom-text';
import { vars, signupStyles } from '../../styles/styles';
import signupState from './signup-state';
import { tx } from '../utils/translator';
import StyledTextInput from '../shared/styled-text-input';
import { socket, validation, telemetry, config } from '../../lib/icebear';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';
import SignupButtonBack from './signup-button-back';
import SignupHeading from './signup-heading';
import SignupStepIndicator from './signup-step-indicator';
import TmHelper from '../../telemetry/helpers';
import tm from '../../telemetry';

const { S } = telemetry;

const { validators } = validation;
const { username } = validators;

const MAX_USERNAME_LENGTH = config.user.maxUsernameLength;

function signupTelemetryHelper(name) {
    return {
        eventName: S.TEXT_INPUT,
        item: name,
        location: S.ONBOARDING
    };
}

@observer
export default class SignupStep2 extends SafeComponent {
    // used for telemetry option to know if user autofilled username before or after getting error
    errorFlag = S.FIRST;

    usernameState = observable({ value: '' });

    @action.bound usernameInputRef(ref) { this.usernameInput = ref; }

    componentDidMount() {
        this.startTime = Date.now();
        TmHelper.currentRoute = S.ACCOUNT_USERNAME;
        // QUICK SIGNUP DEV FLAG
        if (__DEV__ && process.env.PEERIO_QUICK_SIGNUP) {
            this.usernameInput.onChangeText(randomWords({ min: 2, max: 2, join: 'o' }).substring(0, 16));
        }
        // fill fields when returning from another step
        if (signupState.username) {
            this.usernameState.value = signupState.username;
            this.usernameInput.onChangeText(this.usernameState.value);
        }

        this.suggestionAnimationReaction = reaction(
            () => signupState.usernameSuggestions,
            () => LayoutAnimation.easeInEaseOut()
        );
        signupState.suggestUsernames();

        when(() => this.usernameInput.valid === false, () => {
            this.errorFlag = S.SECOND;
        });
    }

    componentWillUnmount() {
        this.suggestionAnimationReaction();
        tm.signup.duration(this.startTime);
    }

    @action.bound handleNextButton() {
        if (this.isNextDisabled) return;
        signupState.username = this.usernameState.value;
        signupState.next();
        tm.signup.navigate(S.NEXT);
    }

    get isNextDisabled() { return !socket.connected || !this.usernameState.value || !this.usernameInput.isValid; }

    @action.bound fillField(suggestion) {
        this.usernameState.value = suggestion;
        this.usernameInput.onChangeText(this.usernameState.value);
        tm.signup.pickUsername(this.errorFlag);
    }

    suggestionPill = (suggestion) => {
        if (!suggestion) return null;
        const style = {
            height: 21,
            borderColor: vars.peerioPurple,
            borderWidth: 1,
            borderRadius: 16,
            marginRight: vars.spacing.small.midi2x,
            marginBottom: vars.spacing.small.midi,
            paddingHorizontal: vars.spacing.small.midi
        };
        const textStyle = {
            color: vars.peerioPurple,
            backgroundColor: 'transparent'
        };

        return (
            <TouchableOpacity
                key={suggestion}
                pressRetentionOffset={vars.retentionOffset}
                onPress={() => this.fillField(suggestion)}>
                <View style={style}>
                    <Text style={textStyle}>{suggestion}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    get suggestionBlock() {
        if (!signupState.usernameSuggestions.length) return null;
        const suggestionTitle = this.usernameInput && this.usernameInput.errorMessageText === 'error_usernameNotAvailable' ?
            tx('title_try') : tx('title_available');
        return (
            <View>
                <View style={signupStyles.separator} />
                <View style={{ flexDirection: 'row' }}>
                    <View>
                        <Text style={signupStyles.suggestionTitle}>{suggestionTitle}</Text>
                    </View>
                    <View style={signupStyles.suggestionContainer}>
                        {signupState.usernameSuggestions.map(this.suggestionPill)}
                    </View>
                </View>
            </View>
        );
    }

    renderThrow() {
        return (
            <View style={signupStyles.page}>
                <SignupStepIndicator />
                <View style={signupStyles.container}>
                    <SignupButtonBack />
                    <SignupHeading title="title_createYourAccount" subTitle="title_usernameHeading" />
                    <StyledTextInput
                        autoFocus
                        state={this.usernameState}
                        validations={username}
                        telemetry={signupTelemetryHelper(S.USERNAME)}
                        helperText={this.usernameState.value.length >= MAX_USERNAME_LENGTH ?
                            tx('title_characterLimitReached') :
                            tx('title_hintUsername')}
                        maxLength={MAX_USERNAME_LENGTH}
                        label={`${tx('title_username')}*`}
                        lowerCase
                        required
                        clearTextIcon
                        keyboardType="email-address"
                        returnKeyType="next"
                        onSubmitEditing={this.handleNextButton}
                        ref={this.usernameInputRef}
                        testID="username" />
                    {this.suggestionBlock}
                    <View style={{ alignItems: 'flex-end', marginVertical: 30 }}>
                        {buttons.roundBlueBgButton(
                            tx('button_next'),
                            this.handleNextButton,
                            this.isNextDisabled,
                            'button_next',
                            { width: vars.signupButtonWidth })}
                    </View>
                </View>
            </View>
        );
    }
}
