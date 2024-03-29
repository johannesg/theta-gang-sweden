import * as cdk from 'aws-cdk-lib';
import { Fn } from 'aws-cdk-lib';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

import { ThetaApi } from './theta-api';
import { S3ObjectParameter } from './utils';
import { ThetaApp } from './theta-app';
import { ResourcesStack } from './resources-stack';

export interface ThetaStackProps extends cdk.StackProps {
  apiDomain: string
  appDomain: string
  resources: ResourcesStack
}

export class ThetaStack extends cdk.Stack {
  // public readonly lambdaCode: S3ObjectParameter;
  // public readonly appCode: S3ObjectParameter;
  public readonly apiDomain: string;
  public readonly appDomain: string;

  constructor(scope: Construct, id: string, props: ThetaStackProps) {
    super(scope, id, props);

    // this.lambdaCode = new S3ObjectParameter(this, "LambdaCode");
    // this.appCode = new S3ObjectParameter(this, "AppCode");

    const zone = HostedZone.fromLookup(this, 'Zone', { domainName: "thetagang.se" });
    const certificate = Certificate.fromCertificateArn(this, "SiteCertificate", Fn.importValue(props.resources.certificateArn.exportName!));
    const certificateEdge = Certificate.fromCertificateArn(this, "SiteCertificateEdge", Fn.importValue(props.resources.certificateEdgeArn.exportName!));

    const table = Table.fromTableArn(this, "Table", Fn.importValue(props.resources.tableArn.exportName!));

    this.apiDomain = props.apiDomain;
    this.appDomain = props.appDomain;

    console.log(`Stack: ${id}; api domain: ${this.apiDomain}`);
    console.log(`Stack: ${id}; app domain: ${this.appDomain}`);

    // const auth = new CatsAuthentication(this, "Auth");

    const api = new ThetaApi(this, "Api", {
      domainName: this.apiDomain,
      appDomain: this.appDomain,
      // auth,
      zone,
      certificate: certificate,
      // source: this.lambdaCode.location,
      table
    });

    const site = new ThetaApp(this, "AppSite", {
      domainName: this.appDomain,
      zone,
      certificate: certificateEdge,
      // source: this.appCode.location
    });
  }
}
