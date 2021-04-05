#!/usr/bin/env node
import 'source-map-support/register';
import { App } from '@aws-cdk/core';
import { ThetaStack } from '../lib/theta-stack';
// import { CertStack } from '../lib/cert-stack';
import { PipelineStack } from '../lib/pipeline-stack';
import { ThetaTableStack } from '../lib/theta-table-stack';

const prefix = "ThetaGang"

const app = new App();
// const certStack = new CertStack(app, 'CertStack', {
//     env: { 
//       account: process.env.CDK_DEFAULT_ACCOUNT, 
//       region: process.env.CDK_DEFAULT_REGION 
//   }});
// const tables = new ThetaTableStack(app, prefix + 'TableStack', {});

const thetagang = new ThetaStack(app, prefix + 'Stack', {
    env: { 
      account: process.env.CDK_DEFAULT_ACCOUNT, 
      region: process.env.CDK_DEFAULT_REGION 
  }});

// new CatsPipelineStack(app, 'CatsPipelineStack', {
//     cats,
//     env: {
//         account: process.env.CDK_DEFAULT_ACCOUNT,
//         region: process.env.CDK_DEFAULT_REGION
//     }
// });