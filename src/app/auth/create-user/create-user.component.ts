import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth.service";
import { ActivatedRoute, ParamMap } from "@angular/router";

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  constructor(public authService: AuthService, public route: ActivatedRoute) { }

  ngOnInit(): void {
    console.log("CreateUser Route is being called");
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("token")) {
         console.log("CreateUser Route token is", paramMap.has("token"));
         const token = paramMap.get("token");
         this.authService.createUser(token);
      } else {
        console.log("Token is missing");
      }
    });

  }


}
