import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { MasterService } from '../../service/master.service';
import { APIResponseModel, CartModel, Category, Customer, ProductList } from '../../models/Product';
import { map, Observable, Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { Constant } from '../../constant/constant';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, OnDestroy {

  categoryList$: Observable<Category[]> = new Observable<Category[]>();
  subscriptionList: Subscription[] = [];

  ngOnDestroy(): void {
    this.subscriptionList.forEach((subscription) => {
      subscription.unsubscribe();
    })
  }
  //Old Way
  //productList : ProductList[] = []; 

  //New Way
  productList = signal<ProductList[]>([]);

  masterService = inject(MasterService);
  loggedUserData: Customer = new Customer();

  constructor() {
    const isUser = localStorage.getItem(Constant.LOCALSTORAGE_KEY);
    if (isUser != null) {
      const parseObj = JSON.parse(isUser);
      this.loggedUserData = parseObj;
    }
  }

  ngOnInit(): void {
    debugger;
    this.loadAllProducts();
    this.categoryList$ = this.masterService.getAllCategories().pipe(
      map(category => category.data)
    )
  }

  loadAllProducts() {
    debugger;
    this.subscriptionList.push(this.masterService.getAllProducts().subscribe((response: APIResponseModel) => {
      // this.productList= response.data;
      this.productList.set(response.data)
    }))
  }
  getproductBycategory(id: number) {
    this.masterService.getAllProductsByCategoryId(id).subscribe((response: APIResponseModel) => {
      this.productList.set(response.data)
    })
  }

  onAddToCart(productId: number) {
    debugger;
    if (this.loggedUserData.custId == 0) {
      alert("Please log on");
    } else {
      const newCartObj: CartModel = new CartModel();
      newCartObj.ProductId = productId;
      newCartObj.custId = this.loggedUserData.custId;
      this.masterService.addToCart(newCartObj).subscribe((response: APIResponseModel) => {
        if (response.result) {
          alert("Product added to cart");
          this.masterService.onCartAdded.next(true);
        } else {
          alert(response.message);
        }
      })
    }
  }

}
