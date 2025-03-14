import ReactComponent from './spain.svg?react'
import { SvgIcon, SvgIconProps } from '@mui/material';
export const SpainFlagIcon = (props: SvgIconProps) => {
    const { sx, ...other } = props
    return (
        <SvgIcon
            component={ReactComponent}
            inheritViewBox {...other}
        />
    );
};