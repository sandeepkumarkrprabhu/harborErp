export interface environment{
    id: string;
    environment_name: string;
    resources: resource[];
}

export interface resource{
    id: string;
    environment_id: string;
    aws_region: string,
    aws_service: string,
    aws_resource: string
}

export interface recentDeployment{
    number: number;
    environment: string;
    status: string;
    triggeredBy: string;
    duration: string;
    timestamp: string;
    commitID: string;
}