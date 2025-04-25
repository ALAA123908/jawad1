import React, { useState } from 'react';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Container, Typography, TextField, Button, Box, Paper, IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';


function Dashboard({ addProduct, products, updateProduct, deleteProduct, orders = [], setOrders }) {
  // زر إضافة منتج إلى Firestore
  const addProductToFirestore = async () => {
    try {
      await addDoc(collection(db, "products"), {
        name: "iPhone 14",
        desc: "أفضل هاتف ذكي لعام 2024",
        price: 3999,
        image: "https://link-to-your-image.com/iphone14.jpg"
      });
      alert("تم إضافة المنتج إلى قاعدة البيانات بنجاح!");
    } catch (e) {
      alert("خطأ أثناء الإضافة: " + e.message);
    }
  };

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [image, setImage] = useState('');
  const [success, setSuccess] = useState(false);

  // تحويل ملف الصورة إلى base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // أضف المنتج إلى Firestore
    try {
      await addDoc(collection(db, "products"), {
        name,
        price: parseFloat(price),
        desc,
        image: image || '',
      });
    } catch (e) {
      alert("خطأ أثناء الإضافة إلى Firestore: " + e.message);
    }
    // أضف المنتج محليًا أيضًا
    addProduct({
      name,
      price: parseFloat(price),
      desc,
      image: image || '',
    });
    setSuccess(true);
    setName('');
    setPrice('');
    setDesc('');
    setImage('');
    setTimeout(() => setSuccess(false), 3000);
  };

  // إدارة التعديل
  const [editId, setEditId] = useState('');
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);

  const handleEditSelect = (e) => {
    const id = e.target.value;
    setEditId(id);
    const p = products.find(pr => pr.id === Number(id));
    if (p) {
      setEditName(p.name);
      setEditPrice(p.price);
      setEditDesc(p.desc);
      setEditImage(p.image);
    }
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateProduct({
      id: Number(editId),
      name: editName,
      price: parseFloat(editPrice),
      desc: editDesc,
      image: editImage || '',
    });
    setEditSuccess(true);
    setTimeout(() => setEditSuccess(false), 3000);
  };

  // حذف المنتج
  const handleDelete = () => {
    if (window.confirm('هل أنت متأكد أنك تريد حذف هذا المنتج؟')) {
      deleteProduct(Number(editId));
      setEditId('');
      setEditName('');
      setEditPrice('');
      setEditDesc('');
      setEditImage('');
      setEditSuccess(false);
    }
  };

  // إدارة عرض الأقسام
  const [activeSection, setActiveSection] = useState('add'); // 'add' أو 'edit'

  // حالة الرد
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyTarget, setReplyTarget] = useState(null);
  const [replyText, setReplyText] = useState("");

  // فتح نافذة الرد
  const handleReplyOpen = (order) => {
    setReplyTarget(order);
    setReplyText(order.reply || "");
    setReplyOpen(true);
  };
  // إغلاق نافذة الرد
  const handleReplyClose = () => {
    setReplyOpen(false);
    setReplyTarget(null);
    setReplyText("");
  };
  // حفظ الرد
  const handleReplySend = () => {
    setOrders(orders.map(o => o.id === replyTarget.id ? { ...o, reply: replyText, replyTime: Date.now() } : o));
    handleReplyClose();
  };

  return (
    <Container sx={{ mt: 4 }}>
      <>
        <Box display="flex" justifyContent="center" mb={2} gap={2}>
          <Tooltip title="إضافة منتج"><Button startIcon={<AddBoxIcon />} variant={activeSection === 'add' ? 'contained' : 'outlined'} color={activeSection === 'add' ? 'success' : 'inherit'} onClick={() => setActiveSection('add')} sx={{ borderRadius: '50px', px: 2, fontWeight: 'bold' }}>إضافة منتج</Button></Tooltip>
          <Tooltip title="تعديل منتج"><Button startIcon={<EditIcon />} variant={activeSection === 'edit' ? 'contained' : 'outlined'} color={activeSection === 'edit' ? 'secondary' : 'inherit'} onClick={() => setActiveSection('edit')} sx={{ borderRadius: '50px', px: 2, fontWeight: 'bold' }}>تعديل منتج</Button></Tooltip>
          <Tooltip title="طلبات الزبائن"><Button startIcon={<ListAltIcon />} variant={activeSection === 'orders' ? 'contained' : 'outlined'} color={activeSection === 'orders' ? 'primary' : 'inherit'} onClick={() => setActiveSection('orders')} sx={{ borderRadius: '50px', px: 2, fontWeight: 'bold' }}>الطلبات</Button></Tooltip>
        </Box>

        {activeSection === 'orders' && (
          <Paper sx={{ p: 4, maxWidth: 700, margin: '0 auto', mb: 4 }}>
            <Typography variant="h5" align="center" gutterBottom>طلبات الزبائن</Typography>
            {orders && orders.length > 0 ? (
              orders.map((order, idx) => (
                <Box key={order.id} sx={{ mb: 3, border: '1px solid #ddd', borderRadius: 2, p: 2, position: 'relative' }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>طلب رقم {orders.length - idx}</Typography>
                  <Typography variant="body2">الاسم: {order.name}</Typography>
                  <Typography variant="body2">العنوان: {order.address}</Typography>
                  <Typography variant="body2">رقم الهاتف: {order.phone}</Typography>
                  <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>المنتجات:</Typography>
                  {order.items.map((item, i) => (
                    <Box key={item.id} sx={{ ml: 2, mb: 1, borderBottom: '1px dashed #eee' }}>
                      <Typography variant="body2">{i + 1}. {item.name} × {item.qty} - {item.price * item.qty} ريال</Typography>
                    </Box>
                  ))}
                  <Typography variant="body1" sx={{ mt: 1, fontWeight: 'bold' }}>المجموع الكلي: {order.total} ريال</Typography>
                  <Tooltip title="حذف الطلب">
                    <IconButton color="error" sx={{ position: 'absolute', left: 16, top: 16 }} onClick={() => {
                      if (window.confirm('هل أنت متأكد أنك تريد حذف هذا الطلب؟')) {
                        setOrders(orders.filter(o => o.id !== order.id));
                      }
                    }}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="رد على الطلب">
                    <IconButton color="primary" sx={{ position: 'absolute', left: 56, top: 16 }} onClick={() => handleReplyOpen(order)}>
                      <ChatBubbleOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              ))
            ) : (
              <Typography align="center">لا توجد طلبات حالياً.</Typography>
            )}
          </Paper>
        )}

        {activeSection === 'add' && (
          <Box sx={{ mb: 2 }}>
            <Button variant="contained" color="secondary" onClick={addProductToFirestore}>
              إضافة منتج تجريبي إلى Firestore
            </Button>
          </Box>
        )}
        {activeSection === 'add' && (
          <Paper sx={{ p: 4, maxWidth: 500, margin: '0 auto', mb: 4 }}>
            <Typography variant="h4" align="center" gutterBottom>لوحة التحكم</Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="اسم المنتج"
                variant="outlined"
                fullWidth
                required
                value={name}
                onChange={e => setName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="السعر"
                variant="outlined"
                type="number"
                fullWidth
                required
                value={price}
                onChange={e => setPrice(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="تفاصيل المنتج"
                variant="outlined"
                fullWidth
                required
                value={desc}
                onChange={e => setDesc(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ mb: 2 }}
              >
                تحميل صورة المنتج
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
              {image && (
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                  <img src={image} alt="معاينة الصورة" style={{ maxWidth: '100%', maxHeight: 150 }} />
                </Box>
              )}
              <Box display="flex" justifyContent="center" mt={2}>
                <Button type="submit" variant="contained">إضافة المنتج</Button>
              </Box>
            </form>
            {success && (
              <Typography color="success.main" align="center" sx={{ mt: 2 }}>
                تم إضافة المنتج بنجاح!
              </Typography>
            )}
          </Paper>
        )}

        {activeSection === 'edit' && (
          <Paper sx={{ p: 4, maxWidth: 500, margin: '0 auto' }}>
            <Typography variant="h5" align="center" gutterBottom>تعديل منتج</Typography>
            <form onSubmit={handleEditSubmit}>
              <TextField
                select
                label="اختر المنتج"
                value={editId}
                onChange={handleEditSelect}
                fullWidth
                required
                SelectProps={{ native: true }}
                sx={{ mb: 2 }}
              >
                <option value="">-- اختر منتجاً --</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </TextField>
              {editId && (
                <>
                  <TextField
                    label="اسم المنتج"
                    variant="outlined"
                    fullWidth
                    required
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="السعر"
                    variant="outlined"
                    type="number"
                    fullWidth
                    required
                    value={editPrice}
                    onChange={e => setEditPrice(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="تفاصيل المنتج"
                    variant="outlined"
                    fullWidth
                    required
                    value={editDesc}
                    onChange={e => setEditDesc(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    تحميل صورة جديدة
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleEditImageChange}
                    />
                  </Button>
                  {editImage && (
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                      <img src={editImage} alt="معاينة الصورة" style={{ maxWidth: '100%', maxHeight: 150 }} />
                    </Box>
                  )}
                  <Box display="flex" justifyContent="center" mt={2} gap={2}>
                    <Button type="submit" variant="contained" color="secondary">حفظ التعديلات</Button>
                    <Button variant="outlined" color="error" onClick={handleDelete}>حذف المنتج</Button>
                  </Box>
                </>
              )}
            </form>
            {editSuccess && (
              <Typography color="success.main" align="center" sx={{ mt: 2 }}>
                تم تعديل المنتج بنجاح!
              </Typography>
            )}
          </Paper>
        )}
      </>
      <Dialog open={replyOpen} onClose={handleReplyClose}>
        <DialogTitle>رد على طلب الزبون</DialogTitle>
        <DialogContent>
          <TextField
            label="نص الرد"
            fullWidth
            multiline
            minRows={2}
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReplyClose}>إلغاء</Button>
          <Button onClick={handleReplySend} variant="contained" disabled={!replyText.trim()}>إرسال الرد</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Dashboard;
