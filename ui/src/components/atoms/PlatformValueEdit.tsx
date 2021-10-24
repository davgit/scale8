import { FC, useEffect, useState } from 'react';
import { Box, Checkbox, FormControlLabel } from '@mui/material';
import SelectInput from './InputTypes/SelectInput';
import {
    DataContainersElementsFilteredContainer,
    DataContainersFilteredPlatform,
} from '../molecules/DataMapsValueEdit';
import TextInput from './InputTypes/TextInput';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { SelectValueWithSub } from '../../hooks/form/useFormValidation';
import { splitOnce } from '../../utils/TextUtils';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';

const findCurrentDataElement = (
    dataElement: string,
    currentDataContainer: DataContainersElementsFilteredContainer | undefined,
): SelectValueWithSub | undefined => {
    if (dataElement === '') return undefined;
    if (currentDataContainer === undefined) return undefined;

    const rootElement: SelectValueWithSub | undefined = currentDataContainer.elements.find(
        (element) => element.key === dataElement,
    );

    let innerElement: SelectValueWithSub | undefined = undefined;

    if (rootElement === undefined) {
        currentDataContainer.elements.forEach((element) => {
            const currentMatch = element.sub?.find((_) => _.key === dataElement);
            innerElement = currentMatch === undefined ? innerElement : currentMatch;
        });
    }

    return rootElement ?? innerElement;
};

const findPlatformIdFromContainerId = (
    containerId: string,
    platforms: DataContainersFilteredPlatform[],
): string => {
    if (containerId === '') return '';

    const platform: DataContainersFilteredPlatform | undefined = platforms.find(
        (platform) =>
            platform.containers.find((container) => container.id === containerId) !== undefined,
    );

    if (platform === undefined) return '';

    return platform.id;
};

const checkInitialUseCustom = (
    platformId: string,
    dataContainerId: string,
    dataElement: string,
    platforms: DataContainersFilteredPlatform[],
): boolean => {
    if (platformId === '' || dataContainerId === '' || dataElement === '') {
        return false;
    }

    const platform: DataContainersFilteredPlatform | undefined = platforms.find(
        (_) => _.id === platformId,
    );

    const dataContainer =
        platform === undefined
            ? undefined
            : platform.containers.find((_) => _.id === dataContainerId);

    const currentDataElement: SelectValueWithSub | undefined = findCurrentDataElement(
        dataElement,
        dataContainer,
    );

    return currentDataElement === undefined;
};

export type PlatformValueEditProps = {
    value: string;
    setValue: (value: string) => void;
    dataContainersFilteredPlatforms: DataContainersFilteredPlatform[];
    disabled: boolean;
};

const PlatformValueEdit: FC<PlatformValueEditProps> = (props: PlatformValueEditProps) => {
    const { value, setValue, dataContainersFilteredPlatforms, disabled } = props;

    const match = value.match(/^{{([^}]+)}}$/);
    const path = match === null ? '' : match[1];
    const [initialDataContainerId, initialDataElement] = splitOnce(path, '.');
    const initialPlatformId = findPlatformIdFromContainerId(
        initialDataContainerId,
        dataContainersFilteredPlatforms,
    );
    const initialUseCustom = checkInitialUseCustom(
        initialPlatformId,
        initialDataContainerId,
        initialDataElement ?? '',
        dataContainersFilteredPlatforms,
    );

    const [platformId, setPlatformId] = useState(initialPlatformId);
    const [dataContainerId, setDataContainerId] = useState(initialDataContainerId);
    const [useCustom, setUseCustom] = useState(initialUseCustom);
    const [dataElement, setDataElement] = useState(initialDataElement ?? '');

    const [rawObjectKey, setRawObjectKey] = useState('');

    const currentPlatform: DataContainersFilteredPlatform | undefined =
        dataContainersFilteredPlatforms.find((_) => _.id === platformId);

    const currentDataContainer =
        currentPlatform === undefined
            ? undefined
            : currentPlatform.containers.find((_) => _.id === dataContainerId);

    const currentDataElement: SelectValueWithSub | undefined = findCurrentDataElement(
        dataElement,
        currentDataContainer,
    );

    useEffect(() => {
        if (dataElement !== '') {
            setValue(
                `{{${dataContainerId}.${dataElement}${
                    rawObjectKey === '' ? '' : '.'
                }${rawObjectKey}}}`,
            );
        } else {
            setValue('');
        }
    }, [dataElement, rawObjectKey]);

    const hasDataMaps =
        currentDataContainer !== undefined && currentDataContainer.elements.length > 0;

    const hasDataMapsAndCustom =
        currentDataContainer !== undefined &&
        currentDataContainer.elements.length > 0 &&
        currentDataContainer.allowCustom;

    const forceCustom =
        currentDataContainer !== undefined &&
        currentDataContainer.allowCustom &&
        currentDataContainer.elements.length < 1;

    const inputStyle: SxProps<Theme> = {
        width: '100%',
        margin: (theme) => theme.spacing(0, 0, 1),
    };

    return (
        <Box>
            <SelectInput
                name="Platform"
                label="Platform"
                value={platformId}
                setValue={(v) => {
                    setPlatformId(v);
                    setDataContainerId('');
                    setDataElement('');
                }}
                optionValues={[]}
                keyTextValues={dataContainersFilteredPlatforms.map((_) => ({
                    key: _.id,
                    text: _.name,
                }))}
                sx={inputStyle}
                disabled={disabled}
                required
            />
            {platformId !== '' && (
                <SelectInput
                    name="dataContainerId"
                    label="Data Container"
                    value={dataContainerId}
                    setValue={(v) => {
                        setDataContainerId(v);
                        setDataElement('');
                    }}
                    optionValues={[]}
                    keyTextValues={
                        currentPlatform === undefined
                            ? []
                            : currentPlatform.containers.map((_) => ({
                                  key: _.id,
                                  text: _.name,
                              }))
                    }
                    sx={inputStyle}
                    disabled={disabled}
                    required
                />
            )}
            {hasDataMapsAndCustom && (
                <FormControlLabel
                    sx={{
                        fontSize: '11px',
                        '& .MuiFormControlLabel-label': {
                            fontSize: '11px',
                        },
                    }}
                    control={
                        <Checkbox
                            sx={{ fontSize: '14px' }}
                            icon={<CheckBoxOutlineBlankIcon fontSize="inherit" />}
                            checkedIcon={<CheckBoxIcon fontSize="inherit" />}
                            name="useCustom"
                            checked={useCustom}
                            onChange={(event) => {
                                if (event.target.checked) {
                                    setDataElement('');
                                    setUseCustom(true);
                                } else {
                                    setDataElement('');
                                    setUseCustom(false);
                                }
                            }}
                            disabled={disabled}
                            color="primary"
                        />
                    }
                    label="Use Custom Data Element"
                />
            )}
            {((hasDataMapsAndCustom && useCustom) || forceCustom) && (
                <TextInput
                    value={dataElement}
                    setValue={(v) => setDataElement(v)}
                    name="customDataElement"
                    label="Custom Data Element"
                    sx={inputStyle}
                    disabled={disabled}
                    required
                />
            )}
            {currentDataContainer && hasDataMaps && !useCustom && (
                <SelectInput
                    value={dataElement}
                    setValue={(v) => setDataElement(v)}
                    sx={inputStyle}
                    label="Data Element"
                    name="matchId"
                    optionValues={[]}
                    keyTextValues={currentDataContainer.elements}
                    disabled={disabled}
                    required
                />
            )}
            {currentDataElement?.description !== undefined && (
                <Box mb={1}>
                    <Box component="small" sx={{ width: '100%', color: '#666666' }}>
                        {currentDataElement.description}
                    </Box>
                </Box>
            )}
            {currentDataElement?.unFilteredSubCount === 0 && (
                <Box mb={1}>
                    <TextInput
                        value={rawObjectKey}
                        setValue={(v) => setRawObjectKey(v)}
                        name="rawObjectKey"
                        label="Key"
                        sx={inputStyle}
                        disabled={disabled}
                        required
                    />
                </Box>
            )}
        </Box>
    );
};

export { PlatformValueEdit };
