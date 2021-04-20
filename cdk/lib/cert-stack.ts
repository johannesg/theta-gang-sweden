import { Stack, Construct, StackProps, CfnOutput } from '@aws-cdk/core';
import { HostedZone } from '@aws-cdk/aws-route53';
import { DnsValidatedCertificate } from '@aws-cdk/aws-certificatemanager';

export class CertStack extends Stack {
    certificateArn: CfnOutput
    certificateEdgeArn: CfnOutput
    
    constructor(scope: Construct, id: string, props: StackProps | undefined) {
        super(scope, id, props);

        const zoneName = "thetagang.se";
        const domainName = "thetagang.se";
        const subjectAlternativeNames = [
            "api.thetagang.se"
        ];

        const hostedZone = HostedZone.fromLookup(this, 'Zone', { domainName: zoneName });

        const certificate = new DnsValidatedCertificate(this, 'SiteCertificateRegional', {
            hostedZone,
            domainName,
            subjectAlternativeNames,
        });

        const certificateEdge = new DnsValidatedCertificate(this, 'SiteCertificate', {
            hostedZone,
            domainName,
            subjectAlternativeNames,
            region: 'us-east-1', // Cloudfront only checks this region for certificates.
        });

        this.certificateArn = new CfnOutput(this, 'Certificate', { value: certificate.certificateArn, exportName: "theta-gang-certificate-arn" });
        this.certificateEdgeArn = new CfnOutput(this, 'CertificateEdge', { value: certificateEdge.certificateArn, exportName: "theta-gang-certificate-edge-arn" });
    }
}