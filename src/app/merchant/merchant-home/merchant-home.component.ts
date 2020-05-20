import { Component, OnInit, OnDestroy } from '@angular/core';
import { MerchantService } from '../services/merchant.service';
import { Product } from 'src/app/models/product.model';
import { Customer } from 'src/app/models/customer.model';
import { LoadingSpinnerService } from '../services/loading-spinner.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-merchant-home',
  templateUrl: './merchant-home.component.html',
  styleUrls: ['./merchant-home.component.css']
})
export class MerchantHomeComponent implements OnInit,OnDestroy {

  todaySoldProducts : number;
  activeCustomers : number;
  cancelledOrders : number = 0;
  usernameList = new Set<string>();
  todayRevenue : number = 0;
  trendingProducts : Product[];
  prod = new Product();

  constructor(private merchantService : MerchantService,  private loaderService:LoadingSpinnerService) { }
  
  
  ngOnInit() {
    this.merchantService.getMerchantOrders().subscribe(data => {
      this.todaySoldProducts = data.length;
      data.forEach(element => {
        this.usernameList.add(element.customer.username);
        if(element.orderStatus == "Cancelled"){
          this.cancelledOrders += 1;
        }
        
        //console.log(new Date(element.transaction.transactionDate).toLocaleDateString() ==  new Date().toLocaleDateString());
        if(new Date(element.transaction.transactionDate).toLocaleDateString() ==  new Date().toLocaleDateString()){
          this.todayRevenue += element.transaction.transactionMoney;
        }

      });
      this.activeCustomers = this.usernameList.size;
      
    });

    this.merchantService.getMerchantProducts().subscribe(data => {
      this.trendingProducts = data;
      this.trendingProducts = this.trendingProducts.sort((a , b) => {
        if(a.noOfViews >= b.noOfViews){
          return -1;
        }
        else{
          return 1;
        }
      });
      console.log(this.trendingProducts);
      if(this.trendingProducts.length >= 5){
        this.trendingProducts = this.trendingProducts.slice(0,5);
      }
      this.loaderService.hide();
    }, (err:HttpErrorResponse)=>{
      this.loaderService.hide();
    });
  }

  setProduct(product : Product){
    this.prod = product;
    console.log(this.prod);
  }

  counter(i:number){
    return new Array(i);
  }
  ngOnDestroy(){
    this.loaderService.show();
  }
}
