import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {

  constructor(private route:ActivatedRoute) { }
  postId:string;
  postcontent:string;
  postcreator:string;
  postimagePath:string;
  posttitle:string;
  imageObject:any;
  
  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=>{
      this.postId = params['id']
      this.postcontent = params['content']
      this.postcreator = params['creator']
      this.postimagePath = params['imagePath']
      this.posttitle = params['title']
      console.log("postId",params['id']);
      console.log("postcontent",params['content']);
      console.log("postcreator",params['creator']);
      console.log("postimagePath",params['imagePath']);
      console.log("posttitle",params['title']);
    })

    this.imageObject= [
      {
        image: "http://localhost:3000/images/Front_View.jpg",
        thumbImage: "http://localhost:3000/images/Front_View.jpg",
        title: 'Slider Image 1',
        alt: 'Image Alt 1',
      }, 
      {
        image: "http://localhost:3000/images/Left_View.jpg",
        thumbImage: "http://localhost:3000/images/Left_View.jpg",
        title: 'Slider Image 1',
        alt: 'Image Alt 1',
      }, 
      {
        image: "http://localhost:3000/images/Right_View.jpg",
        thumbImage: "http://localhost:3000/images/Right_View.jpg",
        title: 'Slider Image 1',
        alt: 'Image Alt 1',
      }, 
      {
        image: 'http://localhost:3000/images/Special_View.jpg',
        thumbImage: 'http://localhost:3000/images/Special_View.jpg',
        title: 'Slider Image 1',
        alt: 'Image Alt 1',
      }, {
        image: 'http://localhost:3000/images/Top_View.jpg',
        thumbImage: 'http://localhost:3000/images/Top_View.jpg',
        title: 'Slider Image 2',
        alt: 'Image Alt 2'
      }
   ];

  }

  yourfunctionName(event){
    console.log("Your function is called", event)
  }

}
