import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, TextField, Paper, Snackbar, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Checkout({ cart, clearCart, setOrders }) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  // جلب الطلبات من localStorage
  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (orders.length > 0) {
      // آخر طلب للزبون الحالي (حسب الاسم/الهاتف)
      const lastOrder = orders.find(o => o.phone === phone && o.reply && o.replyTime && Date.now() - o.replyTime < 60000);
      if (lastOrder) {
        setSnackbarMsg(lastOrder.reply);
        setSnackbarOpen(true);
        // بعد عرض الرد لمرة واحدة، احذف replyTime حتى لا يعرض مجدداً
        lastOrder.replyTime = 0;
        localStorage.setItem('orders', JSON.stringify(orders));
      }
    }
    // eslint-disable-next-line
  }, [phone]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // حفظ الطلب مع بيانات الزبون
    setOrders(prev => {
      const updated = [
        {
          id: Date.now(),
          name,
          address,
          phone,
          items: cart,
          total
        },
        ...(Array.isArray(prev) ? prev : [])
      ];
      localStorage.setItem('orders', JSON.stringify(updated));
      return updated;
    });
    setSuccess(true);
    clearCart();
    setTimeout(() => {
      setSuccess(false);
      navigate('/');
    }, 3000);
  };

  if (success) {
    return (
      <Container sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
          <Typography variant="h5" color="success.main" gutterBottom>
            تم تأكيد الطلب بنجاح!
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            سيتم التواصل معك قريباً.
          </Typography>
          <Button variant="contained" component={Link} to="/">
            العودة للرئيسية
          </Button>
        </Paper>
        <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={() => setSnackbarOpen(false)} severity="info" sx={{ width: '100%' }}>
            {snackbarMsg}
          </Alert>
        </Snackbar>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Paper sx={{ p: 4, maxWidth: 500, margin: '0 auto' }}>
        <Typography variant="h5" align="center" gutterBottom>تأكيد الطلب</Typography>
        <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={() => setSnackbarOpen(false)} severity="info" sx={{ width: '100%' }}>
            {snackbarMsg}
          </Alert>
        </Snackbar>
        <Typography variant="h6" align="center" sx={{ mb: 2 }}>ملخص الطلب</Typography>
        {cart.length === 0 ? (
          <Typography align="center">سلة المشتريات فارغة.</Typography>
        ) : (
          <>
            {cart.map(item => (
              <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <img src={item.image} alt={item.name} style={{ width: 40, height: 40, objectFit: 'cover', marginLeft: 10 }} />
                <Typography sx={{ flexGrow: 1 }}>{item.name} × {item.qty}</Typography>
                <Typography>{item.price * item.qty} ريال</Typography>
              </Box>
            ))}
            <Typography variant="body1" align="center" sx={{ my: 2 }}>المجموع الكلي: {total} ريال</Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="الاسم كامل"
                variant="outlined"
                fullWidth
                required
                value={name}
                onChange={e => setName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="العنوان"
                variant="outlined"
                fullWidth
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="رقم الهاتف"
                variant="outlined"
                fullWidth
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Box display="flex" justifyContent="center" mt={2}>
                <Button type="submit" variant="contained" color="primary">تأكيد الطلب</Button>
              </Box>
            </form>
          </>
        )}
      </Paper>
    </Container>
  );
}


export default Checkout;
