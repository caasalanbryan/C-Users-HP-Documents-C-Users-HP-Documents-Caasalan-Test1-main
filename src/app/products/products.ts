import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available?: boolean;
  stock: number; // inventory remaining
}

interface CartItem extends Product {
  cartId?: string; // unique id for each cart item
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.css'],
})
export class Products {
  // full catalog with local images
  private readonly allProducts = signal<Product[]>([
    {
      name: 'Bentley Continental GT',
      description: '6.0L W12 | Grand Tourer',
      price: 238000,
      image: 'https://www.bentleymotors.com/content/dam/bm/websites/bmcom/bentleymotors-com/models/25my/gt-mulliner/Gallary%20Exterior%20-%204.jpg/_jcr_content/renditions/original.image_file.1332.749.file/Gallary%20Exterior%20-%204.jpg',
      category: 'luxury',
      available: true,
      stock: 4,
    },
    {
      name: 'Ferrari SF90 Stradale',
      description: '4.0L V8 Hybrid | 986 HP',
      price: 524000,
      image: 'https://www.thecarexpert.co.uk/wp-content/uploads/2022/07/Ferrari-SF90-Stradale.jpg.webp',
      category: 'hybrid',
      available: false,
      stock: 0,
    },
    {
      name: 'Lamborghini Aventador SVJ',
      description: '6.5L V12 | 770 HP',
      price: 517000,
      image: 'https://www.supercars.net/blog/wp-content/uploads/2024/03/2019-Lamborghini-Aventador-SVJ-009-1536.jpg',
      category: 'supercar',
      available: true,
      stock: 3,
    },
    {
      name: 'McLaren 765LT',
      description: '4.0L V8 | Track Focused',
      price: 382000,
      image: 'https://bringatrailer.com/wp-content/uploads/2024/06/2021_mclaren_765lt_img_0347-05306.jpg',
      category: 'supercar',
      available: false,
      stock: 0,
    },
    {
      name: 'Porsche 911 GT3 RS',
      description: '4.0L Flat-6 | Pure Performance',
      price: 223800,
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu9PiIeHsFLJRz21e6EzG_w4Dj3y9YzO4dTA&s',
      category: 'sports',
      available: true,
      stock: 2,
    },
    {
      name: 'Rolls-Royce Phantom',
      description: '6.75L V12 | Ultra-Luxury',
      price: 460000,
      image: 'https://www.topgear.com/sites/default/files/cars-car/image/2017/10/_jl58227.jpg',
      category: 'luxury',
      available: true,
      stock: 1,
    },
  ]);

  selectedCategory = signal<string>('all');

  filtered = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'all') {
      return this.allProducts();
    }
    return this.allProducts().filter(p => p.category === cat);
  });

  cart = signal<CartItem[]>([]);

  // derived values
  cartCount = computed(() => this.cart().length);
  cartTotal = computed(() => this.cart().reduce((s, p) => s + p.price, 0));

  addToCart(p: Product) {
    if (p.stock > 0) {
      alert(p.name + ' added to cart!');
      const cartItem: CartItem = { ...p, cartId: Math.random().toString(36).substr(2, 9) };
      this.cart.update(c => [...c, cartItem]);
      // decrement stock and toggle availability if needed
      p.stock--;
      if (p.stock === 0) {
        p.available = false;
      }
    } else {
      alert('Out of stock!');
    }
  }

  removeFromCart(cartId: string | undefined) {
    const item = this.cart().find(i => i.cartId === cartId);
    if (item) {
      // restore stock when removed
      const original = this.allProducts().find(p => p.name === item.name);
      if (original) {
        original.stock++;
        original.available = original.stock > 0;
      }
    }
    this.cart.update(c => c.filter(i => i.cartId !== cartId));
  }

  categories() {
    const cats = new Set<string>(this.allProducts().map(p => p.category));
    return ['all', ...Array.from(cats)];
  }
}
