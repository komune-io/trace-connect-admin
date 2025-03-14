import ReactComponent from './france.svg?react'

import { SvgIcon, SvgIconProps } from '@mui/material';
export const FranceFlagIcon = (props: SvgIconProps) => {
    const { sx, ...other } = props
    return (
        <SvgIcon
            component={ReactComponent}
            inheritViewBox {...other}
        />
    );
};