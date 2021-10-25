import { FC } from 'react';
import { SvgIconProps } from '@mui/material';
import DateIcon from '../TypeIcons/DateIcon';

const DateTimeStringIcon: FC<SvgIconProps> = (props: SvgIconProps) => {
    return (
        <>
            <DateIcon {...props} />
        </>
    );
};

export default DateTimeStringIcon;
