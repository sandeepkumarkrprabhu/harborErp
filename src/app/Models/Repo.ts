export interface Repo {
  id: string;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  private: boolean;
  default_branch: string;
  stargazers_count: number;
  forks_count: number;
}
