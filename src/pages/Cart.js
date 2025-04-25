import React from 'react';
import { Container, Typography, Button, Box, IconButton, Paper, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';

function Cart({ cart, increaseQty, decreaseQty, removeFromCart }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">سلة المشتريات</Typography>
      {cart.length === 0 ? (
        <>
          <Typography variant="body1" align="center" sx={{ mb: 2 }}>
            السلة فارغة حالياً.
          </Typography>
          <Box display="flex" justifyContent="center">
            <Button variant="contained" component={Link} to="/">تسوق الآن</Button>
          </Box>
        </>
      ) : (
        <>
          {cart.map((item) => (
            <Paper key={item.id} sx={{ mb: 2, borderRadius: 2, p: 2, boxShadow: 2, position: 'relative', display: 'flex', alignItems: 'center', gap: 2 }}>
              <img src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', marginLeft: 16 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">{item.name}</Typography>
                <Typography variant="body2">السعر: {item.price} ريال</Typography>
                <Typography variant="body2">الإجمالي: {item.price * item.qty} ريال</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Tooltip title="تقليل الكمية">
                  <IconButton color="primary" onClick={() => decreaseQty(item.id)} disabled={item.qty === 1}>
                    <RemoveIcon />
                  </IconButton>
                </Tooltip>
                <Typography variant="body1" sx={{ minWidth: 24, textAlign: 'center' }}>{item.qty}</Typography>
                <Tooltip title="زيادة الكمية">
                  <IconButton color="primary" onClick={() => increaseQty(item.id)}>
                    <AddIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="إزالة المنتج من السلة">
                  <IconButton color="error" onClick={() => removeFromCart(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>
          ))}
          <Typography variant="h6" align="center" sx={{ my: 2 }}>المجموع الكلي: {total} ريال</Typography>
          <Box display="flex" justifyContent="center">
            <Button variant="contained" color="primary" component={Link} to="/checkout">إتمام الطلب</Button>
          </Box>
        </>
      )}
    </Container>
  );
}

export default Cart;
