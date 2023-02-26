import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AccountComponent } from './account.component';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { ManageAddressComponent } from './manage-address/manage-address.component';

const routes: Routes = [
    { path:'', component: AccountComponent,
      children: [
        {path:'', pathMatch:'full' , redirectTo:'personal-information'},
        {path :'personal-information', component: PersonalInformationComponent},
        {path : 'manage-address', component: ManageAddressComponent}
      ]
    },
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AccountRoutingModule {}
