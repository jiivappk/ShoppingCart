import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { AngularMaterialModule } from "../angular-material.module";
import { AccountComponent } from '../account/account.component';
import { PersonalInformationComponent } from './personal-information/personal-information.component';
import { ManageAddressComponent } from './manage-address/manage-address.component';
import { AccountRoutingModule } from './acount-routing.module';



@NgModule({
    imports: [ CommonModule, AngularMaterialModule, FormsModule, ReactiveFormsModule, AccountRoutingModule],
    declarations: [ AccountComponent, PersonalInformationComponent, ManageAddressComponent, ],

})
export class AccountModule {}
