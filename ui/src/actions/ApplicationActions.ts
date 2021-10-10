import { PageActionProps } from './PageActions';
import {
    launchHidden,
    openDrawer,
    openDrawerContextOnly,
    openLightboxNoRefresh,
} from '../utils/PageActionUtils';
import { AppCreate } from '../dialogPages/tagManager/app/AppCreate';
import { AppDelete } from '../dialogPages/tagManager/app/AppDelete';
import { AppUpdate } from '../dialogPages/tagManager/app/AppUpdate';
import { AppInstallInstructions } from '../dialogPages/tagManager/app/AppInstallInstructions';

const applicationActions = {
    createApplication: (
        pageActionProps: PageActionProps,
        accountID: string,
        followUp: (
            id: string,
            pageRefresh: () => void,
            handleDialogClose: (checkChanges: boolean) => void,
        ) => void,
    ): void => {
        openDrawerContextOnly(
            pageActionProps,
            AppCreate,
            accountID,
            true,
            false,
            undefined,
            followUp,
        );
    },
    deleteApplication: (pageActionProps: PageActionProps, id: string): void => {
        launchHidden(pageActionProps, AppDelete, id);
    },
    updateApplication: (pageActionProps: PageActionProps, id: string): void => {
        openDrawer(pageActionProps, AppUpdate, id);
    },
    installApp: (pageActionProps: PageActionProps, id: string): void => {
        openLightboxNoRefresh(pageActionProps, AppInstallInstructions, id);
    },
};

export { applicationActions };
