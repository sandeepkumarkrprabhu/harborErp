import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { LucideAngularModule, Server, LayoutGrid, PanelsTopLeft } from 'lucide-angular';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    importProvidersFrom(
      LucideAngularModule.pick({ Server, LayoutGrid, PanelsTopLeft })
    )
  ]
}).catch((err) => console.error(err));
