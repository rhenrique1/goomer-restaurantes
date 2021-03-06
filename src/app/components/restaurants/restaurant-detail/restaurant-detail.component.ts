import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OpeningHours } from 'src/app/shared/models/openingHours';
import { Product } from 'src/app/shared/models/product';
import { Restaurant } from 'src/app/shared/models/restaurant';
import { ProductService } from 'src/app/shared/services/product.service';
import { RestaurantService } from 'src/app/shared/services/restaurant.service';

@Component({
  selector: 'app-restaurant-detail',
  templateUrl: './restaurant-detail.component.html',
  styleUrls: ['./restaurant-detail.component.css']
})
export class RestaurantDetailComponent implements OnInit {

  public restaurant!: Restaurant;
  public productFilter: string = '';
  public products: Product[] = [];
  public hours: OpeningHours[] = [];
  private restaurantId!: number;
  private subscriptions: Subscription[] = [];
  public isLoading: boolean = true;
  public isLoadingProducts: boolean = true;
  public productSelected: boolean = false;
  public selectedProductId: number = 0;

  public weekDays: string[] = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado'
  ]

  constructor(
    private activatedRoute: ActivatedRoute,
    private restaurantService: RestaurantService,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.restaurantId = params['id'];
    });
    this.initRestaurant();
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(s => s.unsubscribe());
    }
  }

  initRestaurant() {
    this.subscriptions.push(this.restaurantService.getRestaurantById(this.restaurantId)
      .subscribe(
        res => {
          console.log(res);
          this.restaurant = res;
          this.products = res.products;
          this.hours = res.openingHours;
          this.hours.sort((a, b) => (a.day > b.day) ? 1 : -1);

          this.isLoading = false;
          this.isLoadingProducts = false;
        }, err => {
          console.log(err);
          this.isLoading = false;
          this.isLoadingProducts = false;
        }
      ));
  }

  initProducts(filter: string) {
    this.isLoadingProducts = true;
    if (filter != '') {
      this.subscriptions.push(this.productService.getProductsNameLike(this.restaurantId, filter)
        .subscribe(
          res => {
            console.log(res);
            this.products = res;
            this.isLoadingProducts = false;
            this.isLoading = false;
          }, err => {
            console.log(err);
            this.isLoadingProducts = false;
            this.isLoading = false;
          }
        ));
    }
  }

  selectProduct(productId: number) {
    this.selectedProductId = productId;
    this.productSelected = true;
  }

  closeProductDetail(boolean: any) {
    this.productSelected = false;
  }

  filterByName() {
    if (this.productFilter != '') {
      this.initProducts(this.productFilter);
    }
  }
}

