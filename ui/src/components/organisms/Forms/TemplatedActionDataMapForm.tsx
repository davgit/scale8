import { ChangeEvent, FC } from 'react';
import { TemplatedActionDataMapFormProps } from '../../../types/props/forms/TemplatedActionDataMapFormProps';
import DrawerFormLayout from '../../molecules/DrawerFormLayout';
import {
    getPlatformDataMapVarType,
    getSelectValuesForPlatformDataMapType,
} from '../../../utils/PlatformDataMapTypeUtils';
import { Box, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { DataMapDefaultValueFormSection } from '../../molecules/DataMapDefaultValueFormSection';
import ArrayInput from '../../atoms/InputTypes/ArrayInput';
import { VarType } from '../../../gql/generated/globalTypes';
import ValidationRulesSection from '../../molecules/ValidationRulesSection';
import { DialogFormContextProvider } from '../../../context/DialogFormContext';
import { TemplatedActionDataMapValues } from '../../../utils/forms/TemplatedActionDataMapFormUtils';
import { DialogFormTextInput } from '../../atoms/DialogFormInputs/DialogFormTextInput';
import { DialogFormTextAreaInput } from '../../atoms/DialogFormInputs/DialogFormTextAreaInput';
import { DialogFormSelect } from '../../atoms/DialogFormInputs/DialogFormSelect';

const TemplatedActionDataMapForm: FC<TemplatedActionDataMapFormProps> = (
    props: TemplatedActionDataMapFormProps,
) => {
    const getRadioValue = () => {
        if (props.values.useDefault) {
            return 'default';
        }
        if (props.values.optional) {
            return 'optional';
        }
        return 'required';
    };

    const handleRadioChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = (event.target as HTMLInputElement).value;
        const useDefault = newValue === 'default';
        props.setValues({
            ...props.values,
            useDefault,
            optional: newValue === 'optional',
            defaultValue:
                getPlatformDataMapVarType(props.values.type) === VarType.BOOLEAN ? false : '', // boolean select will default to '' otherwise
            defaultValues: [],
        });
    };

    return (
        <DialogFormContextProvider<TemplatedActionDataMapValues> formProps={props}>
            <DrawerFormLayout {...props} noSubmit={props.readOnly}>
                <DialogFormTextInput name="key" label="Key" disabled={props.readOnly} />
                <DialogFormSelect
                    label="Type"
                    name="type"
                    values={getSelectValuesForPlatformDataMapType()}
                    disabled={props.isEdit}
                />
                <DialogFormTextAreaInput
                    name="description"
                    label="Description"
                    disabled={props.isEdit}
                />
                {props.values.type !== '' && (
                    <RadioGroup
                        value={getRadioValue()}
                        onChange={handleRadioChange}
                        sx={{
                            width: '100%',
                            marginBottom: (theme) => theme.spacing(3),
                        }}
                    >
                        <FormControlLabel
                            value="optional"
                            control={<Radio />}
                            label="Optional"
                            disabled={
                                props.readOnly ||
                                props.values.type === 'Radio' ||
                                props.values.type === 'Checkbox'
                            }
                        />
                        <FormControlLabel
                            value="required"
                            control={<Radio />}
                            label="Required"
                            disabled={props.readOnly}
                        />
                        {props.values.type !== 'Object' && props.values.type !== 'Object Array' && (
                            <FormControlLabel
                                value="default"
                                control={<Radio />}
                                label="Use Default Value"
                                disabled={props.readOnly}
                            />
                        )}
                    </RadioGroup>
                )}

                {props.values.type !== '' && props.values.useDefault && (
                    <DataMapDefaultValueFormSection
                        platformDataMapType={props.values.type}
                        formProps={props}
                        readOnly={props.readOnly}
                    />
                )}

                <ValidationRulesSection
                    varType={
                        props.values.type === ''
                            ? null
                            : getPlatformDataMapVarType(props.values.type)
                    }
                    validationRules={props.values.validationRules}
                    handleChange={props.handleChange}
                    readOnly={false}
                />

                {(props.values.type === 'Radio' ||
                    props.values.type === 'Multiple Select' ||
                    props.values.type === 'Select') && (
                    <Box mt={3}>
                        <ArrayInput
                            label="Option Values"
                            contained={true}
                            values={props.values.optionValues ?? []}
                            setValue={(v, index) => {
                                props.handleChange(
                                    'optionValues',
                                    (props.values.optionValues ?? []).map((_, key) => {
                                        if (key === index) {
                                            return v;
                                        } else {
                                            return _;
                                        }
                                    }),
                                );
                            }}
                            removeArrayElement={(v, index) => {
                                props.handleChange(
                                    'optionValues',
                                    (props.values.optionValues ?? []).filter(
                                        (_, key) => key !== index,
                                    ),
                                );
                            }}
                            addArrayElement={() => {
                                props.handleChange('optionValues', [
                                    ...(props.values.optionValues ?? []),
                                    '',
                                ]);
                            }}
                            arrayType="text"
                            name="optionValues"
                            size="small"
                            required
                        />
                    </Box>
                )}
            </DrawerFormLayout>
        </DialogFormContextProvider>
    );
};

export default TemplatedActionDataMapForm;
