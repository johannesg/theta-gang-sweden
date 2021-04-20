import { Stack, Construct, StackProps, CfnOutput } from '@aws-cdk/core';
import { HostedZone } from '@aws-cdk/aws-route53';
import { DnsValidatedCertificate, ICertificate } from '@aws-cdk/aws-certificatemanager';

export class CertStack extends Stack {
    public readonly certificate: ICertificate;
    public readonly certificateEdge: ICertificate;

    constructor(scope: Construct, id: string, props: StackProps | undefined) {
        super(scope, id, props);

        const zoneName = "thetagang.se";
        const domainName = "thetagang.se";
        const subjectAlternativeNames = [
            "api.thetagang.se"
        ];

        const hostedZone = HostedZone.fromLookup(this, 'Zone', { domainName: zoneName });

        this.certificate = new DnsValidatedCertificate(this, 'SiteCertificateRegional', {
            hostedZone,
            domainName,
            subjectAlternativeNames,
        });

        this.certificateEdge = new DnsValidatedCertificate(this, 'SiteCertificate', {
            hostedZone,
            domainName,
            subjectAlternativeNames,
            region: 'us-east-1', // Cloudfront only checks this region for certificates.
        });

        new CfnOutput(this, 'Certificate', { value: this.certificate.certificateArn });
        new CfnOutput(this, 'CertificateEdge', { value: this.certificateEdge.certificateArn });
    }
}