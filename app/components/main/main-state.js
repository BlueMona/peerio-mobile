import React from 'react';
import { observable, action, when } from 'mobx';
import { User, chatStore, contactStore, TinyDb } from '../../lib/icebear';
import touchid from '../touchid/touchid-bridge';
import { rnAlertYesNo } from '../../lib/alerts';
import { tx } from '../utils/translator';
import RoutedState from '../routes/routed-state';

class MainState extends RoutedState {
    @observable _loading = false;

    get loading() {
        return this._loading || chatStore.loading;
    }

    set loading(v) {
        this._loading = v;
    }

    @action async activateAndTransition(user) {
        this.routes.app.main();
        User.current = user;
        const hasPin = await user.hasPasscode();
        if (!hasPin) {
            const skipPIN = `${user.username}::skipPIN`;
            const skipPINValue = await TinyDb.system.getValue(skipPIN);
            if (!skipPINValue) {
                setTimeout(() => this.routes.modal.createPin(), 500);
            }
            await TinyDb.system.setValue(skipPIN, true);
        }
        await this.saveUser();
    }

    @action async load() {
        console.log('main-state.js: loading');
        this.loading = true;
        const s = await TinyDb.user.getValue('main-state');
        if (s) {
            this.saved = s;
        }
        this.loading = false;
        console.log('main-state.js: loaded');
    }

    @action async saveUser() {
        const user = User.current;
        await TinyDb.system.setValue('lastUsername', user.username);
        const skipTouchID = `${user.username}::skipTouchID`;
        const skipTouchIDValue = await TinyDb.system.getValue(skipTouchID);
        await touchid.load();
        !skipTouchIDValue && touchid.available && TinyDb.system.getValue(`user::${user.username}::touchid`)
            .then(result => {
                if (!result) {
                    console.log('main-state.js: touch id available but value not set');
                    console.log('main-state.js: saving');
                    rnAlertYesNo(tx('touchId'), tx('setup_touchTitle'))
                        .then(() => {
                            TinyDb.system.setValue(`user::${user.username}::touchid`, true);
                            return touchid.save(`user::${user.username}`, user.serializeAuthData());
                        })
                        .catch(() => {
                            console.log('main-state.js: user cancel touch id');
                            return TinyDb.system.setValue(skipTouchID, true);
                        });
                }
                console.log('main-state.js: touch id available and value is set');
            });
    }
}

const mainState = new MainState();

// mainState.showPopup({
//     title: tx('passphrase'),
//     text: 'blue zeppelin runs aboard all',
//     buttons: [
//         { id: 'skip', text: tx('button_skip') },
//         { id: 'use', text: tx('button_useQR') }
//     ]
// });

export default mainState;
