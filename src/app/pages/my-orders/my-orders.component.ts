import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { APIResponseModel, myOrderModel, viewOrderModel } from '../../models/Product';
import { MasterService } from '../../service/master.service';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent implements OnInit {
  allOrdersData : myOrderModel [] = [];
  masterService = inject(MasterService);
  viewOrderData : viewOrderModel [] = [];

  @ViewChild("viewOrderModal") viewOrderModal: ElementRef | undefined
  ngOnInit(): void {
    this.getAllOrders();
  }




  getAllOrders(){
    debugger;
    this.masterService.getAllSaleByCustomerId().subscribe((response:APIResponseModel)=>{
      if(response.result){
        this.allOrdersData=response.data;
      }else{
        alert("Error while retriving orders");
      }
    })
  }

  viewOrder(saleId:number){
    this.openViewOrderModa();
    this.getOrderbySaleId(saleId);
  }

  closeViewOrderModal(){
    if (this.viewOrderModal) {
      this.viewOrderModal.nativeElement.style.display = "none";
    }
  }

  openViewOrderModa() {
    if (this.viewOrderModal) {
      this.viewOrderModal.nativeElement.style.display = "block";
    }
  }

  getOrderbySaleId(saleId:number){
    this.masterService.getOrderBySaleId(saleId).subscribe((response:APIResponseModel)=>{
      if(response.result){
        this.viewOrderData = response.data;
      }else{
        alert(response.message);
      }
    })
  }

}
