import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { User } from '../../../Models/User';
import { UserService } from '../../../core/users/services/userService';
import { RepoService } from '../../../core/aws/services/repoService';

@Component({
  selector: 'app-review-create',
  standalone: true,
  imports: [],
  templateUrl: './review-create.html',
  styleUrls: ['./review-create.css'],
})
export class ReviewCreate implements OnInit, OnChanges {
  @Input({ required: true }) projectForm!: FormGroup;

  memberDetails: User[] = [];

  constructor(
    private userService: UserService,
    private repoService: RepoService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.projectForm.get('members')?.valueChanges.subscribe(() => this.loadMemberDetails());
    this.loadMemberDetails();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projectForm'] && this.projectForm) {
      this.loadMemberDetails();
    }
  }

  private loadMemberDetails(): void {
    const selectedMembers = (this.projectForm.get('members')?.value || []) as Array<string | User>;

    if (!selectedMembers.length) {
      this.memberDetails = [];
      this.cdr.detectChanges();
      return;
    }

    this.userService.getUsers().subscribe((users) => {
      const userLookup = new Map((users || []).map((user) => [String(user.id), user]));

      this.memberDetails = selectedMembers.reduce<User[]>((acc, selected) => {
        const selectedId = typeof selected === 'string' ? selected : String(selected?.id || '');
        const matchedUser = userLookup.get(String(selectedId));

        if (matchedUser) {
          acc.push(matchedUser);
        } else if (selected && typeof selected !== 'string') {
          acc.push(selected);
        }

        return acc;
      }, []);

      this.cdr.detectChanges();
    });
  }

  getSelectedMembers(): User[] {
    return this.memberDetails;
  }

  getBranchLabel(): string {
    const branch = this.projectForm.get('branch')?.value;
    return branch ? String(branch) : 'Not specified';
  }

  getRepositoryLabel(): string {
    const repoValue = this.projectForm.get('repo')?.value;
    if (!repoValue) {
      return 'Not specified';
    }

    const selectedRepoId = String(repoValue);
    const organization = this.projectForm.get('organization')?.value;
    const organizationLogin = organization ? String(organization) : '';

    if (!organizationLogin) {
      return selectedRepoId;
    }

    this.repoService.fetchRepos(organizationLogin).subscribe((repos) => {
      const matchedRepo = (repos || []).find(
        (repo) => String(repo.id) === selectedRepoId || repo.name === selectedRepoId,
      );

      if (matchedRepo) {
        this.projectForm.get('repo')?.setValue(matchedRepo.name, { emitEvent: false });
      }
    });

    return selectedRepoId;
  }

  getDeploymentTargets(): Array<{ awsRegion: string; awsService: string; awsResource: string }> {
    return (
      (this.projectForm.get('deploymentTargets')?.value || []) as Array<{
        awsRegion: string;
        awsService: string;
        awsResource: string;
      }>
    ).filter((target) => target && (target.awsRegion || target.awsService || target.awsResource));
  }
}
