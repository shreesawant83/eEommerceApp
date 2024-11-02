import { Component, inject, OnInit } from '@angular/core';
import { MasterService } from '../../service/master.service';
import { APIResponseModel, CartData, OrderModel } from '../../models/Product';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent implements OnInit {
  cartData: CartData[] = [];
  totalAmount : number= 0;
  orderObj : OrderModel = new OrderModel();

  ngOnInit(): void {
    this.getCartItems();
  }

  masterService = inject(MasterService);

  getCartItems() {
    this.masterService.getCartProductsByCustomerId(this.masterService.loggedUserData.custId).subscribe((response: APIResponseModel) => {
      this.cartData = response.data;
      this.cartData.forEach(cartElement => {
        this.totalAmount += cartElement.productPrice;
      });
    })
  }

  placeOrder(){
    this.orderObj.CustId= this.masterService.loggedUserData.custId;
    this.orderObj.TotalInvoiceAmount= this.totalAmount;
    this.masterService.onPlaceOrder(this.orderObj).subscribe((response:APIResponseModel)=>{
      if(response.result){
        alert("Order Place Successfully");
        this.getCartItems();
        this.orderObj = new OrderModel();
        this.totalAmount=0;
      }else{
        alert(response.message);
      }
    })
  }


}
