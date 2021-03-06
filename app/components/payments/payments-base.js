import { observable } from 'mobx';
import { User } from '../../lib/icebear';

class PaymentsBase {
    @observable inProgress = false;

    get canUpgradeUser() {
        return true;
    }

    get showFileUpgradeOffer() {
        return this.canUpgradeUser && User.current.fileQuotaUsedPercent >= 90;
    }

    get showArchiveUpgradeOffer() {
        return this.canUpgradeUser;
    }

    purchase(/* id */) {
        throw new Error('must override');
    }

    test() {
        throw new Error('must override');
    }
}

export default PaymentsBase;
