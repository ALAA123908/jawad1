import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { Container, Grid, Card, CardMedia, CardContent, Typography, CardActions, Button, Box, Input } from '@mui/material';
import { Link } from 'react-router-dom';

function Home({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = React.useState("");

  // جلب المنتجات من Firestore عند تحميل الصفحة
  useEffect(() => {
    const fetchProducts = async () => {
      let firestoreProducts = [];
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        firestoreProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (e) {
        console.error("خطأ في جلب المنتجات من Firestore:", e);
      }
      // المنتجات المحلية (اختياري)
      const local = localStorage.getItem('products');
      const localProducts = local ? JSON.parse(local) : [];
      setProducts([...firestoreProducts, ...localProducts]);
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    (product.name && product.name.toLowerCase().includes(search.toLowerCase())) ||
    (product.desc && product.desc.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">منتجاتنا</Typography>
      <Box display="flex" justifyContent="center" mb={3}>
        <Input
          type="text"
          placeholder="ابحث عن منتج..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '320px',
            padding: '10px',
            fontSize: '1rem',
            borderRadius: '24px',
            border: '1px solid #ccc',
            textAlign: 'right'
          }}
        />
      </Box>
      <Grid container spacing={4}>
        {filteredProducts.map(product => (
          <Grid item xs={12} sm={6} md={3} key={product.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={product.image}
                alt={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div" align="center">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  {product.desc}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center">
                  السعر: {product.price} ريال
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center' }}>
                <Button size="small" component={Link} to={`/product/${product.id}`}>تفاصيل</Button>
                <Button size="small" variant="contained" onClick={() => addToCart(product)}>أضف للسلة</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
        {filteredProducts.length === 0 && (
          <Grid item xs={12}>
            <Typography align="center" color="text.secondary">لا يوجد منتجات مطابقة للبحث.</Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default Home;
