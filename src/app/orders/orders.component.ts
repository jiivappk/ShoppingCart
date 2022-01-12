import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  constructor(private route:ActivatedRoute) { }
  postId:string;
  postContent:string;
  postCreator:string;
  postImagePath:string;
  postTitle:string;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=>{
      this.postId = params['postId']
      this.postContent = params['content']
      this.postCreator = params['creator']
      this.postImagePath = params['imagePath']
      this.postTitle = params['title']
      console.log("postId from Order",params['postId']);
      console.log("postContent from Order",params['content']);
      console.log("postCreator from Order",params['creator']);
      console.log("postImagePath from Order",params['imagePath']);
      console.log("postTitle from Order",params['title']);
    })
  }

}
