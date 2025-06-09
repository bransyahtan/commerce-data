import { AccountCircle } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";
import type { RootState } from "../store/store";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate("/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        width: "100%",
        background: "linear-gradient(180deg, #f5f7fa 0%, #e4e8eb 100%)",
      }}
    >
      <AppBar
        position="static"
        sx={{
          background: "linear-gradient(90deg, #2196F3 30%, #21CBF3 90%)",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          borderRadius: 0,
        }}
      >
        <Toolbar disableGutters sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          <Typography
            variant="h5"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            E-Commerce Data
          </Typography>
          {isAuthenticated ? (
            <>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                sx={{
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": { transform: "scale(1.1)" },
                }}
              >
                <AccountCircle sx={{ fontSize: 30 }} />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    navigate("/dashboard");
                    handleClose();
                  }}
                  sx={{ fontWeight: 500 }}
                >
                  Dashboard
                </MenuItem>
                {user?.role !== 1 && (
                  <MenuItem
                    onClick={() => {
                      navigate("/transactions");
                      handleClose();
                    }}
                    sx={{ fontWeight: 500 }}
                  >
                    Transaksi
                  </MenuItem>
                )}

                {user?.role === 1 && (
                  <MenuItem
                    onClick={() => {
                      navigate("/customers");
                      handleClose();
                    }}
                    sx={{ fontWeight: 500 }}
                  >
                    List Customer
                  </MenuItem>
                )}
                <MenuItem
                  onClick={handleLogout}
                  sx={{ fontWeight: 500, color: theme.palette.error.main }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button
              color="inherit"
              onClick={() => navigate("/login")}
              sx={{
                display: location.pathname === "/login" ? "none" : "block",
                borderRadius: 2,
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: "none",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.2)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container
        component="main"
        sx={{ flexGrow: 1, py: 4, px: { xs: 2, sm: 3, md: 4 } }}
        maxWidth={false}
      >
        {children}
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: theme.palette.primary.main,
          color: "white",
          boxShadow: "0 -4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Container>
          <Typography variant="body2" color="inherit" align="center">
            © {new Date().getFullYear()} E-Commerce Data. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
