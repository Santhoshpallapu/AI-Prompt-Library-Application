import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddPromptComponent } from './components/add-prompt/add-prompt.component';
import { PromptDetailComponent } from './components/prompt-detail/prompt-detail.component';
import { PromptListComponent } from './components/prompt-list/prompt-list.component';

@NgModule({
  declarations: [
    AppComponent,
    PromptListComponent,
    PromptDetailComponent,
    AddPromptComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
