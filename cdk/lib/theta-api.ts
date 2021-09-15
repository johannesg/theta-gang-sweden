import * as cdk from '@aws-cdk/core';
import * as gw from '@aws-cdk/aws-apigatewayv2';
import * as gwi from '@aws-cdk/aws-apigatewayv2-integrations';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';
import { IHostedZone, ARecord, RecordTarget } from '@aws-cdk/aws-route53';
import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import * as targets from '@aws-cdk/aws-route53-targets';
import * as s3 from '@aws-cdk/aws-s3';
import { CfnOutput, Duration } from '@aws-cdk/core';
import { ITable } from '@aws-cdk/aws-dynamodb';

export interface ThetaApiProps {
    domainName: string
    appDomain: string
    // auth: CatsAuthentication
    zone: IHostedZone
    certificate: ICertificate
    source: s3.Location
    table: ITable
}

export class ThetaApi extends cdk.Construct {
    public readonly handler: Function;

    constructor(scope: cdk.Construct, id: string, props: ThetaApiProps) {
        super(scope, id);

        new cdk.CfnOutput(this, 'ApiUrl', { value: `https://${props.domainName}` });

        const sourceBucket = s3.Bucket.fromBucketName(this, 'LambdaSourceBucket', props.source.bucketName);

        this.handler = new Function(this, 'ApolloHandler', {
            runtime: Runtime.NODEJS_14_X,
            code: Code.fromBucket(sourceBucket, props.source.objectKey),
            // code: Code.fromAsset("../app/lambda/build"),
            handler: 'index.handler',
            description: `Function generated on: ${new Date().toISOString()}`,
            environment: {
                NODE_OPTIONS: "--enable-source-maps",
                DYNAMODB_TABLENAME: props.table.tableName
            },
            timeout: Duration.seconds(30),
            memorySize: 512
        });

        props.table.grantReadWriteData(this.handler);

        // HttpApi
        const domain = new gw.DomainName(this, 'DomainName', {
            domainName: props.domainName,
            certificate: props.certificate
        });

        const httpApi = new gw.HttpApi(this, 'ThetaGangProxyApi', {
            corsPreflight: {
                allowHeaders: ['Authorization', 'Content-Type'],
                allowMethods: [gw.CorsHttpMethod.GET, gw.CorsHttpMethod.HEAD, gw.CorsHttpMethod.OPTIONS, gw.CorsHttpMethod.POST],
                allowOrigins: [`https://${props.appDomain}`],
                maxAge: Duration.days(10),
            },
            defaultDomainMapping: {
                domainName: domain,
            },
        });

        new CfnOutput(this, "HttpApiEndpoint", { value: httpApi.apiEndpoint });

        httpApi.addRoutes({
            path: "/graphql",
            methods: [gw.HttpMethod.GET, gw.HttpMethod.POST],
            integration: new gwi.LambdaProxyIntegration({
                handler: this.handler,
                payloadFormatVersion: gw.PayloadFormatVersion.VERSION_1_0
            })
        });

        new ARecord(this, 'DomainAliasRecord', {
            recordName: props.domainName,
            zone: props.zone,
            target: RecordTarget.fromAlias(new targets.ApiGatewayv2DomainProperties(domain.regionalDomainName, domain.regionalHostedZoneId))
        });
    }
}