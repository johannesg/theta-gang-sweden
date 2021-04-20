import * as cdk from '@aws-cdk/core';
import { HostedZone } from '@aws-cdk/aws-route53';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
// import { CatsAuthentication } from './cats-auth';
import { ThetaApi } from './theta-api';
// import { CatsApp } from './cats-app';
import { S3ObjectParameter } from './utils';
import { Table } from '@aws-cdk/aws-dynamodb';
import { ThetaApp } from './theta-app';

export interface ThetaStackProps extends cdk.StackProps {
  certificateArn: string
  certificateEdgeArn: string
  tableArn: string
}

export class ThetaStack extends cdk.Stack {
  public readonly lambdaCode: S3ObjectParameter;
  public readonly appCode: S3ObjectParameter;

  constructor(scope: cdk.Construct, id: string, props: ThetaStackProps) {
    super(scope, id, props);

    this.lambdaCode = new S3ObjectParameter(this, "LambdaCode");
    this.appCode = new S3ObjectParameter(this, "AppCode");

    const zone = HostedZone.fromLookup(this, 'Zone', { domainName: "thetagang.se" });
    const certificate = Certificate.fromCertificateArn(this, "SiteCertificate", props.certificateArn);
    const certificateEdge = Certificate.fromCertificateArn(this, "SiteCertificateEdge", props.certificateEdgeArn);

    const table = Table.fromTableArn(this, "Table", props.tableArn);

    // const auth = new CatsAuthentication(this, "Auth");

    const api = new ThetaApi(this, "Api", {
      domainName: "api.thetagang.se",
      // auth,
      zone,
      certificate: certificate,
      source: this.lambdaCode.location,
      table
    });

    const site = new ThetaApp(this, "AppSite", {
      domainName: "thetagang.se",
      zone,
      certificate: certificateEdge,
      source: this.appCode.location
    });
  }
}
