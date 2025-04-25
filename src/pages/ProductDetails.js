import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Typography, Button, Card, CardMedia, CardContent, CardActions } from '@mui/material';

function ProductDetails({ products, addToCart }) {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return <Typography variant="h6">المنتج غير موجود</Typography>;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Card sx={{ maxWidth: 400, margin: '0 auto' }}>
        <CardMedia
          component="img"
          height="200"
          image={product.image}
          alt={product.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" align="center">
            {product.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center">
            {product.desc}
          </Typography>
          <Typography variant="h6" align="center" sx={{ mt: 2 }}>
            السعر: {product.price} ريال
          </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center' }}>
          <Button variant="contained" onClick={() => addToCart(product)}>أضف للسلة</Button>
          <Button component={Link} to="/">عودة للمنتجات</Button>
        </CardActions>
      </Card>
    </Container>
  );
}

export default ProductDetails;
