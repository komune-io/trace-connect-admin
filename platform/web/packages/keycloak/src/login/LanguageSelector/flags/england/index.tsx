import ReactComponent from './england.svg?react'
import { SvgIcon, SvgIconProps } from '@mui/material';
export const EnglandFlagIcon = (props: SvgIconProps) => {
    const { sx, ...other } = props
    return (
        <SvgIcon
            component={ReactComponent}
            inheritViewBox {...other}
        />
    );
};