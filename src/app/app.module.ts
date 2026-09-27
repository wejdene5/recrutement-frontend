import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { AuthModule } from "./features/auth/auth-module";
import { CandidateModule } from "./features/candidate/candidate-module";
import { RouterModule } from "@angular/router";
import { routes } from "./app.routes.modules";
import { SidebarComponent } from "./lauouts/admin-layouts/sidebar/sidebar.component";
import { AuthInterceptor } from "./core/interceptors/auth-interceptor";
import { RecruteurModule } from "./features/recruteur/recruteur.module";

@NgModule({
    declarations: [AppComponent],
    imports: [
      BrowserModule,
      AuthModule,
      CandidateModule,
      RecruteurModule, 
      RouterModule.forRoot(routes)
    ],
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}