import { Injectable } from '@angular/core';
import { DeploymentHistory } from '../../Models/DeploymentHistory';
import { deployments } from '../data/history';

@Injectable({
  providedIn: 'root',
})
export class DeploymentService {

  // Return all deployments
  getDeployments(): DeploymentHistory[] {
    return deployments;
  }

  getDeploymentById(slNo: number): DeploymentHistory | undefined {
    return deployments.find(d => d.slNo === slNo);
  }
}
