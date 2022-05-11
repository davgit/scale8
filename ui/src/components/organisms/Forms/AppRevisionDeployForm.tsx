import { FC } from 'react';
import {
    AppRevisionDeployFormProps,
    AppRevisionDeployValues,
} from '../../../utils/forms/AppRevisionDeployDialogFormUtils';
import { Box, DialogContent } from '@mui/material';
import DialogActionsWithCancel from '../../molecules/DialogActionsWithCancel';
import FormFlex from '../../atoms/FormFlex';
import { DialogFormSelect } from '../../atoms/DialogFormInputs/DialogFormSelect';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';

const EnvironmentSelect: FC<AppRevisionDeployFormProps> = (props: AppRevisionDeployFormProps) => {
    const notAvailable = props.availableEnvironments.length < 1;

    if (notAvailable) {
        return <small>Already deployed to all available environments.</small>;
    }

    return (
        <DialogFormSelect
            label="Environment"
            name="environmentId"
            values={props.availableEnvironments}
        />
    );
};

const AppRevisionDeployForm: FC<AppRevisionDeployFormProps> = (
    props: AppRevisionDeployFormProps,
) => {
    const notAvailable = props.availableEnvironments.length < 1;

    return (
        <DialogFormContextProvider<AppRevisionDeployValues> formProps={props}>
            <Box
                sx={{
                    minWidth: '400px',
                    padding: (theme) => theme.spacing(0, 2, 1, 2),
                }}
            >
                <FormFlex handleSubmit={props.handleSubmit}>
                    <DialogContent>
                        <EnvironmentSelect {...props} />
                    </DialogContent>
                    <DialogActionsWithCancel
                        disableSubmit={props.isSubmitting || notAvailable}
                        handleDialogClose={props.handleDialogClose}
                        confirmText={props.submitText}
                        ignoreChanges
                    />
                </FormFlex>
            </Box>
        </DialogFormContextProvider>
    );
};

export default AppRevisionDeployForm;
