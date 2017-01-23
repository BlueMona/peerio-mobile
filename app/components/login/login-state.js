import { when, observable, action } from 'mobx';
import RNRestart from 'react-native-restart';
import state from '../layout/state';
import mainState from '../main/main-state';
import { User, TinyDb, validation, fileStore, socket } from '../../lib/icebear';
import touchId from '../touchid/touchid-bridge';
import { rnAlertYesNo } from '../../lib/alerts';

const { isValidLoginUsername } = validation.validators;

const loginState = observable({
    username: '',
    usernameValid: null,
    firstName: 'Peerio',
    lastName: 'Test',
    passphrase: '',
    savedPassphrase: '',
    language: 'English',
    changeUser: false,
    savedUserInfo: false,
    isInProgress: false,
    pin: false,
    error: null,

    get isActive() {
        return state.route.startsWith('login');
    },

    get isConnected() {
        return socket.connected;
    },

    clean: action.bound(function() {
        console.log('transitioning to clean');
        this.username = '';
        this.usernameValid = null;
        this.passphrase = '';
        this.savedPassphrase = '';
        this.savedUserInfo = false;
        this.isInProgress = false;
        this.pin = false;
        state.routes.loginClean.transition();
    }),

    changeUserAction: action.bound(async function() {
        await TinyDb.system.setValue('userData', null);
        this.username = null;
        this.usernameValid = null;
        this.passphrase = '';
        this.savedPassphrase = '';
    }),

    saved: action.bound(function() {
        this.savedUserInfo = true;
        state.routes.loginSaved.transition();
    }),

    _login: action.bound(function(user) {
        console.log(`login-state.js: logging in ${user.username}`);
        return isValidLoginUsername(user.username)
            .then(valid => {
                if (valid) {
                    return user.login();
                }
                this.error = 'badUsername';
                return Promise.reject(new Error('Bad username'));
            })
            .then(() => console.log('login-state.js: logged in'))
            .then(() => mainState.activateAndTransition(user))
            .catch(e => {
                console.error(e);
                if (!this.error) this.error = 'loginFailed';
                return Promise.reject(new Error(this.error));
            })
            .finally(() => {
                this.isInProgress = false;
                setTimeout(() => (this.error = null), 1000);
            });
    }),

    login: action.bound(function(pin) {
        const user = new User();
        user.username = this.username;
        user.passphrase = pin || this.passphrase || this.savedPassphrase || 'such a secret passphrase';
        this.isInProgress = true;
        return new Promise(resolve => {
            when(() => socket.connected, () => resolve(this._login(user)));
        });
    }),

    async signOut() {
        const inProgress = !!fileStore.files.filter(f => f.downloading || f.uploading).length;
        return (inProgress ? rnAlertYesNo('Are you sure?', 'File tasks are not completed') : Promise.resolve(true))
            .then(() => TinyDb.system.setValue('userData', null))
            .then(() => TinyDb.system.setValue('lastUsername', null))
            .then(() => RNRestart.Restart())
            .catch(() => null);
    },

    load: action.bound(async function() {
        console.log(`login-state.js: loading`);
        const userData = await TinyDb.system.getValue('userData');
        this.username = await TinyDb.system.getValue('lastUsername');
        this.username && this.triggerTouchId();
        if (userData) {
            console.log(`login-state.js: loaded ${userData}`);
            const { username, firstName, lastName } = userData;
            // we logged in with someone else
            if (this.username && this.username !== username) return false;
            this.username = username;
            this.firstName = firstName;
            this.lastName = lastName;
            const user = new User();
            user.username = username;
            return user.hasPasscode()
                .then(result => {
                    console.log(`login-state.js: ${result}`);
                    result && this.saved();
                });
        }
        return false;
    }),

    save: action.bound(async function() {
        // const { username, firstName, lastName } = this;
        // TinyDb.openUserDb(username);
        // await TinyDb.user.set('userData', {
        //     username,
        //     firstName,
        //     lastName
        // });
        // await TinyDb.user.set('registration', {});
    }),

    triggerTouchId: action.bound(async function() {
        await touchId.load();
        touchId.available && touchId.get(`user::${this.username}`)
            .then(passphrase => {
                if (passphrase) {
                    this.passphrase = passphrase;
                    this.login();
                }
            });
    })
});

// loginState.mount();

export default loginState;

this.Peerio = this.Peerio || {};
this.Peerio.loginState = loginState;
