import { injectable } from 'inversify';
import PlatformEvent from '../../models/tag/PlatformEvent';
import UnderPlatformRevisionControl from './abstractions/UnderPlatformRevisionControl';
import { IndexDescription } from 'mongodb';

@injectable()
export default class PlatformEventRepo extends UnderPlatformRevisionControl<PlatformEvent> {
    protected readonly auditEnabled = true;

    protected readonly indexes: IndexDescription[] = [
        {
            key: {
                ___persisting_id: 1,
                _revision_id: 1,
            },
            unique: true,
        },
        {
            key: {
                _platform_id: 1,
            },
        },
    ];
}
