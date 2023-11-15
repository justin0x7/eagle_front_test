import BorderColorIcon from '@mui/icons-material/BorderColor';
import ListIcon from '@mui/icons-material/List';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import WysiwygRoundedIcon from '@mui/icons-material/WysiwygRounded';
import {
  Box,
  Button,
  Container,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from 'react-router-dom';

import NewClientModal from '../components/modal/NewClientModal';
import { useAppDispatch, useAppSelector } from "../hooks/rtkHooks";
import { clearState } from "../store/slices/userSlice";
import { setStorageValue } from "../util/localStorage.util";
import { homePath, settingsPath, systematicFollowUpPath } from '../util/pathBuilder.util';
import dayjs from 'dayjs';
import { createClient } from '@supabase/supabase-js';

const SideMenu = (props: {
  onClickNew: () => void;
  onClickNew1: () => void;
}) => {
  const supabaseUrl = 'https://lxstflrwscwaenzwsiwv.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4c3RmbHJ3c2N3YWVuendzaXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTExMzk4NzYsImV4cCI6MjAwNjcxNTg3Nn0.ieQl89Swq9w-VJ6gOYtXG2sjEyhXlImJprtHhJWjxMU';
  const supabaseClient = createClient(supabaseUrl, supabaseKey);
  const { username, email } = useAppSelector(state => state.user);
  const [name, setName] = useState('');
  const [role, setRole] = useState(false);
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');



  React.useEffect(() => {
    supabaseClient
      .from('vallentuna_users')
      .select('name, role, title, department, address, phone, email')
      .eq('email', email)
      .then(({ data: user, error }) => {
        if (error) {
          console.error(error);
        } else if (user.length > 0) {
          console.log('User:', user[0]);
          setName(user[0].name);
          setRole(user[0].role);
          // setEmail(user[0].email);
          setTitle(user[0].title);
          setAddress(user[0].address);
          setDepartment(user[0].department);
          setPhone(user[0].phone);
        } else {
          console.error('User not found');
        }
      });
  }, [email]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onLogOut = () => {
    setStorageValue("token", "");
    dispatch(clearState());
    navigate("/login");
  };

  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // const handleVuxClick = () => {
  //   alert('Coming soon!');
  //   handleMenuClose();
  // };

  return (
    <StyledDrawer variant="permanent" anchor="left">
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant='h4' color="#68D7BB">{t("SideMenu.Menu")}</Typography>
        <Button variant="text" onClick={handleMenuOpen}>
          <Stack direction="column" alignItems="center">
            <BorderColorIcon sx={{ color: "success.main" }} />
            <Typography variant='caption' sx={{ textTransform: "capitalize" }}>{t("SideMenu.NewClient")}</Typography>
          </Stack>
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}

        >
          <MenuItem onClick={props.onClickNew}>BoF</MenuItem>
          <MenuItem onClick={props.onClickNew1}>Vux</MenuItem>
        </Menu>
      </Stack>
      <List component="nav" className='pt-[16px]'>
        {role &&
          <NavLink to={systematicFollowUpPath()} className={({ isActive }) => isActive ? "active" : ""}>
            <ListItemButton key="Systematic follow-up">
              <ListItemIcon>
                <WysiwygRoundedIcon />
              </ListItemIcon>
              <ListItemText primary={
                <Typography fontWeight="600">{t("SideMenu.SystematicFollowUp")}</Typography>
              } />
            </ListItemButton>
          </NavLink>
        }
        <NavLink to={homePath()} className={({ isActive }) => isActive ? "active" : ""}>
          <ListItemButton key="Case list">
            <ListItemIcon>
              <ListIcon />
            </ListItemIcon>
            <ListItemText primary={
              <Typography fontWeight="600">{t("SideMenu.ChildCaseList")}</Typography>
            } />
          </ListItemButton>
        </NavLink>
      </List>

      <Button startIcon={<SettingsIcon />} className="mt-auto mb-4 justify-start">
        <NavLink to={settingsPath()} className={({ isActive }) => isActive ? "active" : ""}>
          <Typography fontWeight="600">{t("SideMenu.Settings")}</Typography>
        </NavLink>
      </Button>

      <Button startIcon={<LogoutIcon />} className="mb-10 justify-start" onClick={onLogOut}>
        <Typography fontWeight="600">{t("SideMenu.LogOut")}</Typography>
      </Button>
    </StyledDrawer>
  );
};

interface Props {
  children: any;
}

export default function DashboardLayout({ children }: Props) {
  const [openNewClientModal, setOpenNewClientModal] = useState(false);
  const [choose, setChoose] = useState('');
  const strNumber = `${dayjs().format("YYYY")}-${dayjs().unix()}`;

  function resetNewClientModal() {
    setOpenNewClientModal(true);
    setChoose("Bof");
  }

  function resetNewClientModal1() {
    setOpenNewClientModal(true);
    setChoose("Vux");
  }

  return (
    <Container maxWidth={false} className="bg-[#F2FAFF] min-h-[100vh] flex">
      <SideMenu onClickNew={resetNewClientModal} onClickNew1={resetNewClientModal1} />
      <Box className="flex-1">
        {children}
      </Box>
      <NewClientModal strNumber={strNumber} choose={choose} open={openNewClientModal} onClose={() => setOpenNewClientModal(false)} />
    </Container>
  );
}

const StyledDrawer = styled(Drawer)({
  width: '300px',
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: '300px',
    padding: "32px 16px 0px 32px",
    boxSizing: 'border-box',
  },
  '& a': {
    color: "#363D4B",
    textDecoration: "none",
    '.MuiListItemButton-root': {
      borderLeftWidth: "0px",
      borderColor: "#016A54",
      borderStyle: "solid"
    },
    '.MuiListItemIcon-root': {
      minWidth: "40px"
    }
  },
  '& a.active': {
    color: "#016A54",
    '.MuiListItemButton-root': {
      borderLeftWidth: "4px",
    },
    '.MuiListItemIcon-root': {
      color: "#016A54"
    }
  },
  '& button': {
    color: "#363D4B",
    textTransform: "none",
  },
});