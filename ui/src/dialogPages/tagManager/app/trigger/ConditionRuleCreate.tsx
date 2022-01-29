import { FC } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import CreateConditionRuleQuery from '../../../../gql/mutations/CreateConditionRuleQuery';
import ConditionRuleForm from '../../../../components/organisms/Forms/ConditionRuleForm';
import FetchAvailableDataContainersQuery from '../../../../gql/queries/FetchAvailableDataContainersQuery';
import { FetchAvailableDataContainers } from '../../../../gql/generated/FetchAvailableDataContainers';
import { ConditionMode } from '../../../../gql/generated/globalTypes';
import {
    buildConditionRuleCreateInput,
    ConditionRuleFormProps,
    ConditionRuleValues,
    useConditionRuleForm,
} from '../../../../hooks/form/useConditionRuleForm';
import { SelectValueWithSub } from '../../../../hooks/form/useFormValidation';
import { DataContainer } from '../../../../types/DataMapsTypes';
import { DialogPageProps } from '../../../../types/DialogTypes';
import { usePageDialogControls } from '../../../../hooks/dialog/usePageDialogControls';
import { buildStandardFormInfo } from '../../../../utils/InfoLabelsUtils';
import { QueryLoaderAndError } from '../../../../abstractions/QueryLoaderAndError';
import { getDataContainersIcon } from '../../../../utils/TypeIconsUtils';
import { useConfigState } from '../../../../context/AppContext';
import { logError } from '../../../../utils/logUtils';

type ConditionRuleCreateProps = DialogPageProps & {
    submitText: string;
    title: string;
    infoKeyBase: string;
    conditionMode: ConditionMode;
};

type ConditionRuleCreateAfterLoadProps = ConditionRuleCreateProps & {
    availableDataContainers: DataContainer[];
    consentPurposes: { id: number; name: string }[];
    consentVendors: { id: number; name: string }[];
    dataContainersSelectValues: SelectValueWithSub[];
};

const ConditionRuleCreateAfterLoad: FC<ConditionRuleCreateAfterLoadProps> = (
    props: ConditionRuleCreateAfterLoadProps,
) => {
    const [createConditionRule, { loading, data, error: gqlError }] =
        useMutation(CreateConditionRuleQuery);

    const formInitialState = {
        name: '',
        dataContainerId: '',
        match: '',
        matchId: '',
        matchKey: '',
        matchCondition: '',
        dataMapValue: '',
        comments: '',
    };

    const submitForm = async (conditionRuleValues: ConditionRuleValues) => {
        const conditionRuleCreateInput = buildConditionRuleCreateInput(
            props.id,
            props.conditionMode,
            conditionRuleValues,
        );

        try {
            await createConditionRule({
                variables: { conditionRuleCreateInput },
            });
        } catch (error) {
            logError(error);
        }
    };

    const conditionRuleFormValues = useConditionRuleForm(
        formInitialState,
        submitForm,
        props.availableDataContainers,
    );

    const successfullySubmitted = data?.createConditionRule.id !== undefined;

    usePageDialogControls(
        JSON.stringify(formInitialState) === JSON.stringify(conditionRuleFormValues.values),
        successfullySubmitted,
        props.setPageHasChanges,
        props.handleDialogClose,
        props.pageRefresh,
    );

    if (loading || successfullySubmitted) {
        return <div />;
    }

    const formProps: ConditionRuleFormProps = {
        ...conditionRuleFormValues,
        gqlError,
        submitText: props.submitText,
        title: props.title,
        formInfoProps: buildStandardFormInfo(props.infoKeyBase, 'Create'),
        handleDialogClose: props.handleDialogClose,
        dataContainers: props.dataContainersSelectValues,
        consentPurposes: props.consentPurposes,
        consentVendors: props.consentVendors,
    };

    return <ConditionRuleForm {...formProps} />;
};

const ConditionRuleCreate: FC<ConditionRuleCreateProps> = (props: ConditionRuleCreateProps) => {
    const { consentPurposes, consentVendors } = useConfigState();

    return QueryLoaderAndError<FetchAvailableDataContainers>(
        false,
        useQuery<FetchAvailableDataContainers>(FetchAvailableDataContainersQuery, {
            variables: { triggerId: props.id },
        }),
        (data: FetchAvailableDataContainers) => {
            return (
                <ConditionRuleCreateAfterLoad
                    availableDataContainers={data.getTrigger.revision.app_platform_revisions.reduce(
                        (accumulator: DataContainer[], currentValue) => {
                            return [
                                ...accumulator,
                                ...currentValue.platform_revision.platform_data_containers,
                            ] as DataContainer[];
                        },
                        [],
                    )}
                    dataContainersSelectValues={data.getTrigger.revision.app_platform_revisions.map(
                        (_) => ({
                            key: _.platform_revision.platform.id,
                            text: _.platform_revision.platform.name,
                            sub: _.platform_revision.platform_data_containers.map((c) => {
                                const Icon = getDataContainersIcon(c.icon);

                                return {
                                    key: c.id,
                                    text: c.name,
                                    iconType: c.icon,
                                    icon: <Icon />,
                                    description: c.description,
                                };
                            }) as SelectValueWithSub[],
                        }),
                    )}
                    consentPurposes={consentPurposes}
                    consentVendors={consentVendors}
                    {...props}
                />
            );
        },
    );
};

export { ConditionRuleCreate };
