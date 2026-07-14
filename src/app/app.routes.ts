import { Routes } from '@angular/router';
import { Home } from './pages/home';
import { Infos } from './pages/infos';
import { Partner } from './pages/partner';
import { PlanzerMotel } from './pages/planzer-motel';
import { Verlosung } from './pages/verlosung';
import { Geschichtenzeit } from './pages/geschichtenzeit';
import { UeberUns } from './pages/ueber-uns';
import { Kontakt } from './pages/kontakt';

export const routes: Routes = [
  { path: '', component: Home, title: 'Maislabyrinth Freiamt – Villmergen' },
  { path: 'informationen', component: Infos, title: 'Wichtige Informationen – Maislabyrinth Freiamt' },
  { path: 'geschichtenzeit', component: Geschichtenzeit, title: 'Geschichtenzeit – Maislabyrinth Freiamt' },
  { path: 'partner', component: Partner, title: 'Partner und Sponsoren – Maislabyrinth Freiamt' },
  { path: 'planzer-motel', component: PlanzerMotel, title: 'Planzer-Motel – Maislabyrinth Freiamt' },
  { path: 'verlosung', component: Verlosung, title: 'Verlosung – Maislabyrinth Freiamt' },
  { path: 'ueber-uns', component: UeberUns, title: 'Über uns – Maislabyrinth Freiamt' },
  { path: 'kontakt', component: Kontakt, title: 'Kontakt – Maislabyrinth Freiamt' },
  { path: '**', redirectTo: '' },
];
