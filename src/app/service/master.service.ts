import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { APIResponseModel, CartModel, Category, Customer, loginModel, OrderModel } from '../models/Product';
import { Constant } from '../constant/constant';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  apiUrl: string = "https://freeapi.miniprojectideas.com/api/BigBasket/";
  loggedUserData: Customer = new Customer();
  onCartAdded : Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient) { 
    const isUser = localStorage.getItem(Constant.LOCALSTORAGE_KEY);
    if (isUser != null) {
      const parseObj = JSON.parse(isUser);
      this.loggedUserData = parseObj;
    }

  }


  getAllProducts(): Observable<APIResponseModel> {
    debugger;
    return this.http.get<APIResponseModel>(this.apiUrl + "GetAllProducts")
  }

  getAllCategories(): Observable<APIResponseModel> {
    debugger;
    return this.http.get<APIResponseModel>(this.apiUrl + "GetAllCategory")
  }

  getAllProductsByCategoryId(categoryId: number): Observable<APIResponseModel> {
    debugger;
    const url: string = `${this.apiUrl}GetAllProductsByCategoryId?id=${categoryId}`
    return this.http.get<APIResponseModel>(url)
  }

  registerNewCustomer(obj: Customer): Observable<APIResponseModel> {
    debugger;
    const url: string = `${this.apiUrl}RegisterCustomer`
    return this.http.post<APIResponseModel>(url, obj)
  }

  addToCart(obj: CartModel): Observable<APIResponseModel> {
    debugger;
    const url: string = `${this.apiUrl}AddToCart`
    return this.http.post<APIResponseModel>(url, obj)
  }

  login(obj: loginModel): Observable<APIResponseModel> {
    debugger;
    const url: string = `${this.apiUrl}Login`
    return this.http.post<APIResponseModel>(url, obj)
  }


  getCartProductsByCustomerId(loggedUserId: number): Observable<APIResponseModel> {
    debugger;
    const url: string = `${this.apiUrl}GetCartProductsByCustomerId?id=${loggedUserId}`
    return this.http.get<APIResponseModel>(url)
  }


  deleteProductFromCartById(cartId: number): Observable<APIResponseModel> {
    debugger;
    const url: string = `${this.apiUrl}DeleteProductFromCartById?id=${cartId}`
    return this.http.get<APIResponseModel>(url)
  }

  onPlaceOrder(obj: OrderModel): Observable<APIResponseModel> {
    debugger;
    const url: string = `${this.apiUrl}PlaceOrder`
    return this.http.post<APIResponseModel>(url, obj)
  }


  getAllSaleByCustomerId(): Observable<APIResponseModel> {
    debugger;
    const custId= this.loggedUserData.custId;
    const url: string = `${this.apiUrl}GetAllSaleByCustomerId?id=${custId}`
    return this.http.get<APIResponseModel>(url)
  }


  getOrderBySaleId(saleId:number): Observable<APIResponseModel> {
    debugger;
    const url: string = `${this.apiUrl}OpenSaleBySaleId?saleId=${saleId}`
    return this.http.get<APIResponseModel>(url)
  }

}
