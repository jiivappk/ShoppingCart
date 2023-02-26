import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  constructor(private route:ActivatedRoute, private authService: AuthService, private router: Router) { }
  
  userName = 'User';
  userImageUrl = '../assets/User-Image-Male.webp';

  ngOnInit(): void {
  }
 

  changeNavigate(route){
    this.router.navigate([route],{relativeTo: this.route});
  }

}

