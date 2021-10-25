import { ChangeEvent, FC } from 'react';
import { Checkbox, FormControlLabel, FormControlLabelProps } from '@mui/material';

export type BooleanInputProps = Omit<FormControlLabelProps, 'children' | 'control'> & {
    name: string;
    value: boolean;
    label?: string;
    setValue: (v: boolean) => void;
    validationError?: string;
};

const CheckBoxInput: FC<BooleanInputProps> = (props: BooleanInputProps) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { value, setValue, label, disabled, validationError, color, ...formControlProps } = props;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => setValue(event.target.checked);

    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={value}
                    onChange={handleChange}
                    disabled={disabled}
                    color={color as 'primary' | 'secondary' | 'default' | undefined}
                />
            }
            label={label}
            {...formControlProps}
        />
    );
};

export default CheckBoxInput;
