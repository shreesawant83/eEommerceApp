import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { APIResponseModel, CartData, Customer, loginModel } from './models/Product';
import { FormsModule } from '@angular/forms';
import { MasterService } from './service/master.service';
import { Constant } from './constant/constant';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule,RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'angularEcommerceApp';
  registerObj: Customer = new Customer();
  loginObj: loginModel = new loginModel();
  loggedUserData: Customer = new Customer();
  masterService = inject(MasterService);
  cartData: CartData[] = [];
  totalQuantity : number= 0;
  totalAmount : number =0;

  @ViewChild("registerModal") registerModal: ElementRef | undefined
  @ViewChild("loginModal") loginModal: ElementRef | undefined


constructor(private router : Router){

}

  ngOnInit(): void {
    const isUser = localStorage.getItem(Constant.LOCALSTORAGE_KEY);
    if (isUser != null) {
      const parseObj = JSON.parse(isUser);
      this.loggedUserData = parseObj;
      this.getCartItems();
    }
    this.masterService.onCartAdded.subscribe((response:boolean)=>{
      if(response){
        this.getCartItems();
      }
    })
  }

  openRegisterModal() {
    if (this.registerModal) {
      this.registerModal.nativeElement.style.display = "block";
    }
  }

  closeRegisterModal() {
    if (this.registerModal) {
      this.registerModal.nativeElement.style.display = "none";
    }
  }

  openLoginModal() {
    if (this.loginModal) {
      this.loginModal.nativeElement.style.display = "block";
    }
  }

  closeLoginModal() {
    if (this.loginModal) {
      this.loginModal.nativeElement.style.display = "none";
    }
  }

  onLogin() {
    debugger;
    this.masterService.login(this.loginObj).subscribe((response: APIResponseModel) => {
      if (response.result) {
        alert("Login Successfully");
        this.loggedUserData = response.data;
        localStorage.setItem(Constant.LOCALSTORAGE_KEY, JSON.stringify(response.data));
        this.closeLoginModal();
        this.loginObj = new loginModel();
      } else {
        alert(response.message);
      }
    })
  }

  onRegister() {
    debugger;
    this.masterService.registerNewCustomer(this.registerObj).subscribe((response: APIResponseModel) => {
      if (response.result) {
        alert("Customer Register Sucessfully ")
        this.closeRegisterModal();
        this.registerObj= new Customer();
      } else {
        alert(response.message);
      }
    })
  }

  logOut() {
    localStorage.removeItem(Constant.LOCALSTORAGE_KEY);
    this.loggedUserData = new Customer();
    alert("log out successfully");
    this.router.navigateByUrl("/home");
  }

  isCartPopupOpen: boolean = false;
  showCartPopup() {
    this.isCartPopupOpen = !this.isCartPopupOpen;
  }

  getCartItems() {
    this.masterService.getCartProductsByCustomerId(this.loggedUserData.custId).subscribe((response: APIResponseModel) => {
      this.cartData = response.data;
      
      //For calculate quantity and amount for each cart item
      this.totalQuantity =0;
      this.totalAmount = 0;
      this.cartData.forEach((cartItem)=>{
        this.totalQuantity +=cartItem.quantity;
        this.totalAmount += cartItem.productPrice;
      })
      //

    })
  }

  deleteCartProduct(cartId:number){
    this.masterService.deleteProductFromCartById(cartId).subscribe((response:APIResponseModel)=>{
      if(response.result){
        alert("Product removed from cart");
        this.getCartItems();
      }else{
        alert(response.message);
      }
    })
  }

}
