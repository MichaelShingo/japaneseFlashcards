'use client';
import { IconButton, Menu, MenuItem } from "@mui/material";
import { FC, MouseEvent, ReactNode, useRef, useState } from "react";

export type MenuItem = {
  label: string;
  onClick: () => void;
  action: () => void;
};

interface IconWithMenuProps {
  icon: ReactNode;
  menuItems: MenuItem[];
  itemId: number;
  onClick: () => void;
}

const IconWithMenu: FC<IconWithMenuProps> = ({ icon, menuItems, itemId, onClick }) => {
  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorElement);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onClick();
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
        onClick={(e) => e.stopPropagation()}
        PopoverClasses={{ pointerEvents: 'none' }}
      >
        {menuItems.map((item: MenuItem) => (
          <MenuItem key={item.label} onClick={(e: MouseEvent) => {
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