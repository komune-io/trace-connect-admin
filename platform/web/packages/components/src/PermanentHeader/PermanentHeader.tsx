import { Box, IconButton } from "@mui/material"
import { Link } from "react-router-dom"
import { Logo } from "../icons";
import { Menu } from "@mui/icons-material";
import { ElementType } from "react";
import { ThemePermanentHeaderProps } from "@komune-io/g2";
import { config } from "../config";

export interface PermanentHeaderProps extends ThemePermanentHeaderProps {
    toggleOpenDrawer: () => void
}

export const PermanentHeader: ElementType<PermanentHeaderProps> = (props: PermanentHeaderProps) => {
    const {toggleOpenDrawer} = props
    const {theme} = config()
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
                padding: "16px",
                gap: "16px",
                alignItems: "center",
            }}
        >
            <Box />
            <Link
                to="/"
                style={{
                    flexGrow: 1,
                    display: "flex",
                }}
            >
                <Logo src={theme?.logo?.url} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </Link>
            <IconButton onClick={toggleOpenDrawer}>
                <Menu />
            </IconButton>
        </Box>
    );
};