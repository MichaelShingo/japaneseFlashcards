'use client';
import { IconButton, Menu, MenuItem } from "@mui/material";
import { FC, MouseEvent, ReactNode, useRef, useState } from "react";

export type MenuItem = {
    label: string;
    onClick: () => void;
};

interface IconWithMenuProps {
    icon: ReactNode;
    menuItems: MenuItem[];
    itemId: number;
}

const IconWithMenu: FC<IconWithMenuProps> = ({ icon, menuItems, itemId }) => {
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorElement);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setAnchorElement(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorElement(null);
    };

    return (
        <>
            <IconButton onClick={handleClick}>
                {icon}
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorElement}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {menuItems.map((item: MenuItem) => (
                    <MenuItem onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        handleClose();
                        item.onClick();
                    }}>{item.label}</MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default IconWithMenu;