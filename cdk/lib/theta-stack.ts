import * as cdk from '@aws-cdk/core';
import { HostedZone } from '@aws-cdk/aws-route53';
import { Certificate } from '@aws-cdk/aws-certificatemanager';
// import { CatsAuthentication } from './cats-auth';
import { ThetaApi } from './theta-api';
// import { CatsApp } from './cats-app';
import { S3ObjectParameter } from './utils';
import { Table } from '@aws-cdk/aws-dynamodb';

export interface ThetaStackProps extends cdk.StackProps {
}

export class ThetaStack extends cdk.Stack {
  // public readonly lambdaCode: S3ObjectParameter;
  // public readonly appCode: S3ObjectParameter;

  constructor(scope: cdk.Construct, id: string, props: ThetaStackProps) {
    super(scope, id, props);

    // this.lambdaCode = new S3ObjectParameter(this, "LambdaCode");
    // this.appCode = new S3ObjectParameter(this, "AppCode");

    const certificateEdge =
      Certificate.fromCertificateArn(this, "CertificateEdge",
        "arn:aws:acm:us-east-1:700595718361:certificate/cdabb363-1608-46ff-8ca3-eb5d4f3c04a1");
    const certificateRegional =
      Certificate.fromCertificateArn(this, "CertificateRegional",
        "arn:aws:acm:eu-north-1:700595718361:certificate/3fac9580-bd98-429e-87c5-b46247cdf740");

    const zone = HostedZone.fromLookup(this, 'Zone', { domainName: "aws.jogus.io" });

    const table = Table.fromTableName(this, "Table", "ThetaGangTableStack-ThetaGangB9B62551-1W8Q572DJOLK9");

    // const auth = new CatsAuthentication(this, "Auth");

    const api = new ThetaApi(this, "Api", {
      domainName: "thetaapi.aws.jogus.io",
      // auth,
      zone,
      certificate: certificateRegional,
      // source: this.lambdaCode.location,
      table
    });

    // const site = new CatsApp(this, "AppSite", {
    //   domainName: "cats.aws.jogus.io",
    //   zone,
    //   certificate: certificateEdge,
    //   source: this.appCode.location
    // });
  }
}
