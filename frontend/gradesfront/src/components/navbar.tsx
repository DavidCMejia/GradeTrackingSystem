/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Link from 'next/link';

import { useRouter } from 'next/router';
import { setUser } from '../redux/slices/userSlice';
import { PROFESSOR_ROLE, emptyUserInfo } from '../constants';

import styles from '../styles/navbar.module.css';
import { selectUser } from '../redux/selectors/mainSelectors';

export default function Navbar() {
  const { user } = useUser();
  const dispatch = useDispatch();
  const { push } = useRouter();
  const [handleOpenNavMenu, setHandleOpenNavMenu] = useState<null | HTMLElement>(null);
  const [handleOpenUserMenu, setHandleOpenUserMenu] = useState<null | HTMLElement>(null);
  const pages = ['Dashboard'];
  const pageLinks = ['/dashboard'];

  const userRedux = useSelector(selectUser);

  const handleCloseUserMenu = () => {
    setHandleOpenUserMenu(null);
  };

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href="/" className={styles.linkNoStyle}>
            <SchoolIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          </Link>
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            GRADE-APP
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={(e) => setHandleOpenNavMenu(e.currentTarget)}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={handleOpenNavMenu}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(handleOpenNavMenu)}
              onClose={() => setHandleOpenNavMenu(null)}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >

              {userRedux.role === PROFESSOR_ROLE && (
              <MenuItem>
                <Typography textAlign="center" onClick={() => push('/dashboard/admin')}>
                  {/* TODO: Cuando se da click on admin desde dashboard no navega */}
                  <Link href="" as="/dashboard/admin" passHref className={styles.linkNoStyle}>
                    Admin
                  </Link>
                </Typography>
              </MenuItem>
              )}
              {user && pages.map((page, index) => (
                <MenuItem key={page} onClick={() => setHandleOpenNavMenu(null)}>
                  <Typography textAlign="center">
                    <Link href="" as={pageLinks[index]} passHref className={styles.linkNoStyle}>
                      {page}
                    </Link>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <SchoolIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {userRedux.role === PROFESSOR_ROLE && (
            <Link href="" passHref className={styles.linkNoStyle}>
              <Button
                onClick={() => push('/dashboard/admin')}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Admin
              </Button>
            </Link>
            )}
            {user && pages.map((page, index) => (
              <Link key={page} href="" as={pageLinks[index]} passHref className={styles.linkNoStyle}>
                <Button
                  onClick={() => setHandleOpenNavMenu(null)}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page}
                </Button>
              </Link>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={(e) => setHandleOpenUserMenu(e.currentTarget)} sx={{ p: 0 }}>
                <Avatar src={user?.picture || '/broken-image.jpg'} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={handleOpenUserMenu}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(handleOpenUserMenu)}
              onClose={handleCloseUserMenu}
            >

              {user && (
              <MenuItem onClick={() => push('/')}>
                <Typography textAlign="center">
                  Profile
                </Typography>
              </MenuItem>
              )}
              <Link
                href={user ? '/api/auth/logout' : '/api/auth/login'}
                onClick={() => user && dispatch(setUser(emptyUserInfo))}
                className={styles.linkNoStyle}
              >
                <MenuItem>
                  <Typography textAlign="center">
                    {user ? 'Logout' : 'Login'}
                  </Typography>
                </MenuItem>
              </Link>

            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
