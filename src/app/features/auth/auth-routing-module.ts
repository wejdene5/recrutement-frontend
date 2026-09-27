import { Component, NgModule } from "@angular/core";
import { loginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { RouterModule, Routes } from "@angular/router";
import { ForgetPasswordComponent } from "./pages/forget-password/forget-password.component";
import { ResetPasswordComponent } from "./pages/reset-password/reset-password.component";
import { VerifyEmailComponent } from "./pages/verify-email/verify-email.component";
import { ChangePasswordComponent } from './pages/change-password/change-password.component';

const routes: Routes = [
    { path:'login', component: loginComponent},
    { path: 'register', component: RegisterComponent },
    { path: 'forget-password', component: ForgetPasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'verify-email', component: VerifyEmailComponent },
    { path: '', redirectTo:'login', pathMatch:'full' },
    { path: 'change-password', component: ChangePasswordComponent },

];
@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class AuthRoutingModule {}