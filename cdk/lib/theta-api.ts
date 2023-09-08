import { CfnOutput, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as gw from '@aws-cdk/aws-apigatewayv2-alpha';
import * as gwi from '@aws-cdk/aws-apigatewayv2-integrations-alpha';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as s3 from 'aws-cdk-lib/aws-s3';

import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { IHostedZone, ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { ICertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';

export interface ThetaApiProps {
    domainName: string
    appDomain: string
    // auth: CatsAuthentication
    zone: IHostedZone
    certificate: ICertificate
    source: s3.Location
    table: ITable
}

export class ThetaApi extends Construct {
    public readonly handler: Function;

    constructor(scope: Construct, id: string, props: ThetaApiProps) {
        super(scope, id);

        new cdk.CfnOutput(this, 'ApiUrl', { value: `https://${props.domainName}` });

        const sourceBucket = s3.Bucket.fromBucketName(this, 'LambdaSourceBucket', props.source.bucketName);

        this.handler = new Function(this, 'ApolloHandler', {
            runtime: Runtime.NODEJS_18_X,
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
            integration: new gwi.HttpLambdaIntegration ("ApiIntegration", this.handler, {
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