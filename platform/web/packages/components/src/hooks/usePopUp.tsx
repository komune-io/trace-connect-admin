import { useTranslation } from "react-i18next";
import React, { useCallback, useMemo, useState } from "react";
import {ConfirmationPopUp} from "@komune-io/g2";
import { Typography } from "@mui/material";

export interface UseConfirmationProps {
    title: string
    component?: React.ReactNode
    onConfirm: (event: React.ChangeEvent<{}>) => void;
    onConfirmClose?: boolean;
}

export interface UseConfirmationType {
    popup: React.ReactNode
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    open: () => void
    close: (event: React.ChangeEvent<{}>) => void
}

export const useConfirmationPopUp = (props: UseConfirmationProps): UseConfirmationType => {
    const {  title, component, onConfirm, onConfirmClose = false  } = props
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)

    const close = useCallback(
        (event: React.ChangeEvent<{}>) => {
            event.stopPropagation()
            setIsOpen(false)
        },
        [],
    )
    const open = useCallback(
        () => {
            setIsOpen(true)
        },
        [],
    )

    const handleOnConfirm = useCallback((event: React.ChangeEvent<{}>) => {
        onConfirm(event)
        if(onConfirmClose) {
            setIsOpen(false)
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
        open: open
    }
}