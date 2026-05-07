"use client";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Link from "next/link";
import HouseIcon from '@mui/icons-material/House';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
const drawerWidth = 240;

export default function ClippedDrawer({ children }) {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <img src="https://img.freepik.com/premium-vector/text-flat-style-vector-logo-concept-right-arrow-letters-isolated-icon-white-background_159025-671.jpg?w=360" alt="Logo" style={{ width: 40, height: 40, marginRight: 16 }} />
          <Typography variant="h6" noWrap component="div">
            MYNEXTAPP
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          {/* <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List> */}
          <List>
  {[
    { text: "Home", href: "/" },
    { text: "User List", href: "/test" },
    { text: "Add User", href: "/add" },
    { text: "Sign In", href: "/login" },
    { text: "Blog", href: "/blog" },
  ].map((item, index) => (
    <ListItem key={item.text} disablePadding>
      <ListItemButton component={Link} href={item.href}>
        <ListItemIcon>
          {index % 2 === 0 ? <HouseIcon /> : <PersonAddAltIcon />}
        </ListItemIcon>
        <ListItemText primary={item.text} />
      </ListItemButton>
    </ListItem>
  ))}
</List>
          <Divider />
          <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
