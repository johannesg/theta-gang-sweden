#!/usr/bin/env node
import 'source-map-support/register';
import { App } from '@aws-cdk/core';
import { ThetaStack } from '../lib/theta-stack';
import { PipelineStack } from '../lib/pipeline-stack';
import { ResourcesStack } from '../lib/resources-stack';

const prefix = "ThetaGang"

const app = new App();
const env = { account: '700595718361', region: 'eu-north-1' };

const resources = new ResourcesStack(app, prefix + 'ResourcesStack', {
    env
});

const thetagang = new ThetaStack(app, prefix + 'Stack', {
    env,
    apiDomain: "api.thetagang.se",
    appDomain: "thetagang.se",
    resources
});

const thetagangDev = new ThetaStack(app, prefix + 'StackDev', {
    env,
    apiDomain: "api-dev.thetagang.se",
    appDomain: "dev.thetagang.se",
    resources
});

new PipelineStack(app, prefix + 'PipelineStack', {
    stack: thetagang,
    env,
    branch: "master"
});

new PipelineStack(app, prefix + 'PipelineStackDev', {
    stack: thetagangDev,
    env,
    branch: "dev"
});