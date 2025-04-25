import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Box, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';

function Navbar({ cartCount = 0 }) {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, color: '#fff', textDecoration: 'none' }}>
          سوبر ماركت
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">المنتجات</Button>
          <Button color="inherit" component={Link} to="/dashboard">لوحة التحكم</Button>
          <Button color="inherit" component={Link} to="/cart">
            <Badge badgeContent={cartCount} color="secondary">
              <ShoppingCartIcon />
            </Badge>
            السلة
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
