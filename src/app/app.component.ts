import { Component, OnInit, } from "@angular/core";
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from "./auth/auth.service";
// import { ErrorService } from "./error/error.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit{
  
  constructor(
    private authService: AuthService,
    public router:Router,
    // private errorService: ErrorService
  ) {}

  path: string = '';
   
  ngOnInit() {
    this.authService.autoAuthUser();
    this.router.events
    .pipe( filter(event => event instanceof NavigationEnd) )    
    .subscribe(event=> 
     {          
        this.path = event["url"]
     });
  }

  changeRoute(routePath){
    this.router.navigate([routePath]);
  }
   
}
