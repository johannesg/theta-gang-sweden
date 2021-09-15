import { Stack, Construct, StackProps, CfnOutput } from '@aws-cdk/core';
import { HostedZone } from '@aws-cdk/aws-route53';
import { DnsValidatedCertificate } from '@aws-cdk/aws-certificatemanager';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class ResourcesStack extends Stack {
    public readonly certificateArn: CfnOutput
    public readonly certificateEdgeArn: CfnOutput
    public readonly tableName: CfnOutput
    public readonly tableArn: CfnOutput
    
    constructor(scope: Construct, id: string, props: StackProps | undefined) {
        super(scope, id, props);

        // Certificates
        const zoneName = "thetagang.se";
        const domainName = "thetagang.se";
        const subjectAlternativeNames = [
            "*.thetagang.se"
        ];

        const hostedZone = HostedZone.fromLookup(this, 'Zone', { domainName: zoneName });

        const certificate = new DnsValidatedCertificate(this, 'SiteCertificateRegional', {
            hostedZone,
            domainName,
            subjectAlternativeNames,
        });

        const certificateEdge = new DnsValidatedCertificate(this, 'SiteCertificateEdge', {
            hostedZone,
            domainName,
            subjectAlternativeNames,
            region: 'us-east-1', // Cloudfront only checks this region for certificates.
        });

        this.certificateArn = new CfnOutput(this, 'Certificate', { value: certificate.certificateArn, exportName: "theta-gang-certificate-arn-2" });
        this.certificateEdgeArn = new CfnOutput(this, 'CertificateEdge', { value: certificateEdge.certificateArn, exportName: "theta-gang-certificate-edge-arn-2" });

        // DynamoDB
        const table = new dynamodb.Table(this, 'ThetaGang', {
            partitionKey: { name: 'PK', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'SK', type: dynamodb.AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
        });

        table.addGlobalSecondaryIndex({
            indexName: "GSI1",
            partitionKey: { name: 'GSI1_PK', type: dynamodb.AttributeType.STRING},
            sortKey: { name: 'GSI1_SK', type: dynamodb.AttributeType.STRING }
        })

        this.tableName = new CfnOutput(this, "TableName", { value: table.tableName, exportName: "theta-gang-table-name-2" });
        this.tableArn = new CfnOutput(this, "TableArn", { value: table.tableArn, exportName: "theta-gang-table-arn-2" });
    }
}