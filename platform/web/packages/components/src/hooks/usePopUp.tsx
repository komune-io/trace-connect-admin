import { useTranslation } from "react-i18next";
import React, {useCallback, useMemo, useState} from "react";
import {ConfirmationPopUp} from "@komune-io/g2";
import { Typography } from "@mui/material";

export interface UseConfirmationProps {
    title: string
    component?: React.ReactNode
    onConfirm: (event: React.ChangeEvent<{}>) => void;
    onConfirmClose?: boolean;
    onClosed?: () => void
}

export interface UseConfirmationType {
    popup: React.ReactNode
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    close: (event: React.ChangeEvent<{}>) => void
}

export const useConfirmationPopUp = (props: UseConfirmationProps): UseConfirmationType => {
    const {  title, component, onConfirm, onConfirmClose = false, onClosed  } = props
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)

    const close = useCallback(
        (event: React.ChangeEvent<{}>) => {
            event.stopPropagation()
            onClosed && onClosed()
            setIsOpen(false)
        },
        [],
    )

    const handleOnConfirm = useCallback((event: React.ChangeEvent<{}>) => {
        onConfirm(event)
        if(onConfirmClose) {
            close(event)
        }
    }, [setIsOpen, onConfirm, onConfirmClose])

    const popup = useMemo(() => (
        <ConfirmationPopUp onConfirm={handleOnConfirm}  open={isOpen} onClose={(event) => close(event)}>
            <Typography sx={{ whiteSpace: "pre-line" }} color="secondary" variant="h4">{title}</Typography>
            {component && <>{component}</>}
        </ConfirmationPopUp>
    ), [isOpen, close, t, component, title]);

    return {
        popup,
        isOpen,
        setIsOpen,
        close: close,
    }
}