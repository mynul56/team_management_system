import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, NavLink } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Avatar,
  Stack,
  Badge,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import TodayIcon from '@mui/icons-material/Today';
import EditNoteIcon from '@mui/icons-material/EditNote';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import BarChartIcon from '@mui/icons-material/BarChart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

import { useAuth } from '../contexts/AuthContext';

const DRAWER_WIDTH = 280;

const userNav = [
  { to: '/daily-update', label: 'Daily Update', icon: <EditNoteIcon /> },
  { to: '/attendance', label: 'Attendance', icon: <TodayIcon /> },
  { to: '/profile', label: 'Profile', icon: <PersonIcon /> },
  { to: '/leave', label: 'Leave Request', icon: <BeachAccessIcon /> },
  { to: '/kpis', label: 'My KPIs', icon: <BarChartIcon /> },
];

const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/admin/projects', label: 'Projects', icon: <FolderIcon /> },
  { to: '/admin/users', label: 'Team Members', icon: <PeopleIcon /> },
  { to: '/admin/daily-updates', label: 'Daily Updates', icon: <EditNoteIcon /> },
  { to: '/admin/attendance', label: 'Attendance', icon: <TodayIcon /> },
  { to: '/admin/leave', label: 'Leave Mgmt', icon: <BeachAccessIcon /> },
  { to: '/admin/kpis', label: 'KPI Reports', icon: <BarChartIcon /> },
  { to: '/admin/kpi-distribution', label: 'KPI Distribution', icon: <BarChartIcon /> },
];

import { useNotification } from '../contexts/NotificationContext';
import { useThemeContext } from '../contexts/ThemeContext';

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount, markAllAsRead, notifications } = useNotification();
  const { mode, toggleColorMode } = useThemeContext();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [time, setTime] = useState(dayjs());
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(dayjs()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotifMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNotifAnchorEl(event.currentTarget);
    markAllAsRead();
  };

  const handleNotifClose = () => {
    setNotifAnchorEl(null);
  };

  const nav = user?.role === 'admin' ? adminNav : userNav;

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          component="img"
          src="https://cdn-icons-png.flaticon.com/512/3048/3048122.png" // Placeholder logo
          sx={{ width: 40, height: 40 }}
          alt="Logo"
        />
        <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Team AlphaPrime
        </Typography>
      </Box>

      <Box sx={{ mb: 2, mx: 2.5, p: 2, bgcolor: 'rgba(145, 158, 171, 0.12)', borderRadius: 1.5 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={user?.name} src="/static/mock-images/avatars/avatar_default.jpg" />
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>
              {user?.name}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {user?.role === 'admin' ? 'Administrator' : user?.position?.replace(/_/g, ' ') || 'Team Member'}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <List sx={{ px: 2 }}>
        {nav.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            selected={location.pathname === item.to}
            onClick={isMobile ? () => setOpen(false) : undefined}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ p: 2.5 }}>
        <Box sx={{ p: 2, bgcolor: 'primary.lighter', borderRadius: 2, textAlign: 'center', color: 'primary.darker' }}>
          <Typography variant="subtitle2">Need Help?</Typography>
          <Typography variant="caption">Contact Support</Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { lg: `${DRAWER_WIDTH}px` }
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setOpen(!open)}
            sx={{ mr: 2, display: { lg: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" alignItems="center" spacing={2}>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 600 }}>
                {time.format('h:mm A')}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {time.format('ddd, MMM D')}
              </Typography>
            </Box>

            <IconButton onClick={toggleColorMode} color="inherit">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            <IconButton color="default" onClick={handleNotifMenu}>
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <Menu
              anchorEl={notifAnchorEl}
              open={Boolean(notifAnchorEl)}
              onClose={handleNotifClose}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              PaperProps={{ sx: { width: 360, maxHeight: 400 } }}
            >
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1">Notifications</Typography>
                <Typography variant="caption" color="text.secondary">{notifications.length} new</Typography>
              </Box>
              <Divider />
              {notifications.length === 0 ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No notifications</Typography>
                </Box>
              ) : (
                notifications.map((n) => (
                  <MenuItem key={n.id} onClick={handleNotifClose} sx={{ py: 1.5, px: 2.5 }}>
                    <Box>
                      <Typography variant="subtitle2">{n.title}</Typography>
                      <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 300 }}>
                        {n.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {dayjs(n.createdAt).fromNow()}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Menu>

            <IconButton onClick={handleMenu} sx={{ p: 0 }}>
              <Avatar alt={user?.name} src="/static/mock-images/avatars/avatar_default.jpg" />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle1" noWrap>
                  {user?.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                  {user?.email}
                </Typography>
              </Box>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>Profile</MenuItem>
              <MenuItem onClick={() => { handleClose(); navigate('/settings'); }}>Settings</MenuItem>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <MenuItem onClick={() => { logout(); navigate('/login'); }} sx={{ color: 'error.main' }}>
                Logout
              </MenuItem>
            </Menu>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { lg: DRAWER_WIDTH }, flexShrink: { lg: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={open}
          onClose={() => setOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', lg: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, borderRightStyle: 'dashed' },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          mt: 8,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
