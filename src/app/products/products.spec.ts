import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Products } from './products';

declare const spyOn: any;

describe('Products', () => {
  let component: Products;
  let fixture: ComponentFixture<Products>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Products]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Products);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initial cart is empty', () => {
    expect(component.cartCount()).toBe(0);
    expect(component.cartTotal()).toBe(0);
  });

  it('adding product increments cart and shows alert', () => {
    const first = component['allProducts']()[0];
    let alerted = '';
    window.alert = (msg: string) => { alerted = msg; };
    component.addToCart(first);
    expect(alerted).toBe(first.name + ' added to cart!');
    expect(component.cartCount()).toBe(1);
    expect(component.cartTotal()).toBe(first.price);
  });

  it('filtering by category works', () => {
    const cats = component.categories();
    expect(cats).toContain('all');
    component.selectedCategory.set('supercar');
    const filtered = component.filtered();
    expect(filtered.every(p => p.category === 'supercar')).toBe(true);
  });

  it('availability property influences customers', () => {
    const products = component['allProducts']();
    expect(products.some(p => p.available === false)).toBe(true);
  });
});
