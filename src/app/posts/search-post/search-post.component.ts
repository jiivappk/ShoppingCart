import { Component, OnInit, OnDestroy, AfterContentInit, AfterViewInit, AfterViewChecked, AfterContentChecked, OnChanges, SimpleChanges } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from "rxjs";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { CartService } from "../cart.service";
import { AuthService } from "../../auth/auth.service";
import { LoginComponent } from "../../auth/login/login.component";

import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: 'app-search-post',
  templateUrl: './search-post.component.html',
  styleUrls: ['./search-post.component.css']
})
export class SearchPostComponent implements OnInit, OnChanges {

  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  searchValue: string;
  private postsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route:ActivatedRoute,
    public postsService: PostsService,
    public cartService: CartService,
    private authService: AuthService
  ) {}
  ngOnChanges(changes: SimpleChanges) {
    console.log("Changes",changes);
  }
 

  ngOnInit() {
    this.route.queryParams.subscribe((params)=>{
      this.searchValue = params['searchValue']
      console.log("SearchValue from Search-post",params['searchValue']);
      this.isLoading = true;
      this.postsService.searchPost(this.searchValue, this.postsPerPage, this.currentPage);
      this.userId = this.authService.getUserId();
      this.postsSub = this.postsService
        .getPostUpdateListener()
        .subscribe((postData: { posts: Post[]; postCount: number }) => {
          this.isLoading = false;
          this.totalPosts = postData.postCount;
          this.posts = postData.posts;
          console.log("Post from Search-post",this.posts)
          console.log("PostCount from Search-post",this.totalPosts);
        });
      this.userIsAuthenticated = this.authService.getIsAuth();
      this.authStatusSub = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated => {
          this.userIsAuthenticated = isAuthenticated;
          this.userId = this.authService.getUserId();
        });
    })
  }



  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.searchPost(this.searchValue,this.postsPerPage, this.currentPage);
  }

  // order(post:any){
  //   this.router.navigate(['order'],{queryParams:{postId:post.id, content:post.content, imagePath:post.imagePath, title:post.title, creator:post.creator}})
  // }

  // addToCart(post:any){
  //   let userId = localStorage.getItem("userId");
  //   if(userId == null){
  //     console.log("User id is null");
  //     this.dialog.open(LoginComponent, {data: {message: "Login Component"}});
  //   }
  //   else{
  //     let cartItem = {
  //       userId: userId,
  //       postId: post.id,
  //       content: post.content,
  //       creator: post.creator,
  //       imagePath: post.imagePath,
  //       title: post.title,
  //     }
  //     console.log("Add to cart is cartItem", cartItem)
  //     console.log("Add to cart userId",userId)
  //     let result = this.cartService.addCartItems(cartItem)
  //     console.log(result)
  //   }
  // }

  // onDelete(postId: string) {
  //   this.isLoading = true;
  //   this.postsService.deletePost(postId).subscribe(() => {
  //     this.postsService.getPosts(this.postsPerPage, this.currentPage);
  //   }, () => {
  //     this.isLoading = false;
  //   });
  // }

  getSearchResults(){
    this.postsService.searchPost(this.searchValue,this.postsPerPage,this.currentPage);
    this.postsSub = this.postsService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; postCount: number }) => {
        this.isLoading = false;
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
        console.log(this.posts)
      });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
