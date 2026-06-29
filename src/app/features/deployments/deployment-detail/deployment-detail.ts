import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { DeploymentService } from '../../../mockdata/dataService/deployment-service';
import { DeploymentHistory } from '../../../Models/DeploymentHistory';
import { Badge } from '../../../shared/components/badge/badge';

@Component({
  selector: 'app-deployment-detail',
  standalone: true,
  imports: [Badge],
  templateUrl: './deployment-detail.html',
  styleUrls: ['./deployment-detail.css'],
 })
export class DeploymentDetail {
  deployment: DeploymentHistory | undefined;

  constructor(private route: ActivatedRoute, private deploymentService: DeploymentService) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.deployment = this.deploymentService.getDeploymentById(id);
    console.log("selected deployment:", this.deployment);
  }
}
