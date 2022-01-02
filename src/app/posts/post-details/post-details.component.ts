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
        image: "http://localhost:3000/images/image-1638082620002.jpg",
        thumbImage: "http://localhost:3000/images/image-1638082620002.jpg",
        title: 'Slider Image 1',
        alt: 'Image Alt 1',
      }, 
      {
        image: "http://localhost:3000/images/second-image-1638082938433.png",
        thumbImage: "http://localhost:3000/images/second-image-1638082938433.png",
        title: 'Slider Image 1',
        alt: 'Image Alt 1',
      }, 
      {
        image: "http://localhost:3000/images/third-image-1638720529708.png",
        thumbImage: "http://localhost:3000/images/third-image-1638720529708.png",
        title: 'Slider Image 1',
        alt: 'Image Alt 1',
      }, 
      {
        image: 'https://via.placeholder.com/600.png/345',
        thumbImage: 'https://via.placeholder.com/1200.png/345',
        title: 'Slider Image 1',
        alt: 'Image Alt 1',
      }, {
        image: 'https://via.placeholder.com/600.png/643',
        thumbImage: 'https://via.placeholder.com/1200.png/643',
        title: 'Slider Image 2',
        alt: 'Image Alt 2'
      }, {
        image: 'https://via.placeholder.com/600.png/8w4',
        thumbImage: 'https://via.placeholder.com/1200.png/8w4',
        title: 'Slider Image 3',
        alt: 'Image Alt 3'
      }, {
        image: 'https://via.placeholder.com/600.png/347',
        thumbImage: 'https://via.placeholder.com/1200.png/347',
        title: 'Slider Image 4',
        alt: 'Image Alt 4'
      }, {
        image: 'https://via.placeholder.com/600.png/953',
        thumbImage: 'https://via.placeholder.com/1200.png/953',
        title: 'Slider Image 5',
        alt: 'Image Alt 5'
      }
   ];

  }

}
