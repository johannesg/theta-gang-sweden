#!/usr/bin/env node
import 'source-map-support/register';
import { App, Fn } from '@aws-cdk/core';
import { ThetaStack } from '../lib/theta-stack';
import { PipelineStack } from '../lib/pipeline-stack';
import { CertStack } from '../lib/cert-stack';
import { ThetaTableStack } from '../lib/theta-table-stack';

const prefix = "ThetaGang"

const app = new App();
const certStack = new CertStack(app, prefix + 'CertStack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});
const tables = new ThetaTableStack(app, prefix + 'TableStack', {});

const thetagang = new ThetaStack(app, prefix + 'Stack', {
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    },
    certificateArn: Fn.importValue(certStack.certificateArn.exportName!),
    certificateEdgeArn: Fn.importValue(certStack.certificateEdgeArn.exportName!),
    tableArn: Fn.importValue(tables.tableArn.exportName!)
});

new PipelineStack(app, prefix + 'PipelineStack', {
    stack: thetagang,
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION
    }
});