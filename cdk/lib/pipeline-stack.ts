import { Stack, StackProps, SecretValue } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';

import { ThetaStack } from './theta-stack';

type PipelineStackProps = StackProps & {
    stack: ThetaStack
    branch: string
}

export class PipelineStack extends Stack {
    constructor(scope: Construct, id: string, props: PipelineStackProps) {
        super(scope, id, props);

        const cdkBuild = new codebuild.PipelineProject(this, 'CdkBuild', {
            buildSpec: codebuild.BuildSpec.fromSourceFilename("ci/build-cdk.yml"),
            environment: {
                buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
            }
        });

        const lambdaBuild = new codebuild.PipelineProject(this, 'LambdaBuild', {
            buildSpec: codebuild.BuildSpec.fromSourceFilename("ci/build-api.yml"),
            environment: {
                buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
            },
        });

        const appBuild = new codebuild.PipelineProject(this, 'AppBuild', {
            buildSpec: codebuild.BuildSpec.fromSourceFilename("ci/build-app.yml"),
            environment: {
                buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
            },
            environmentVariables: {
                "VITE_API_URL": { value: `https://${props.stack.apiDomain}/graphql` }
            }
        });

        // Create Artifacts
        const sourceArtifact = new codepipeline.Artifact("SrcOutput");
        const cdkBuildArtifact = new codepipeline.Artifact('CdkBuildArtifact');
        const lambdaBuildArtifact = new codepipeline.Artifact('LambdaBuildArtifact');
        const appBuildArtifact = new codepipeline.Artifact('AppBuildArtifact');

        const sourceAction = new codepipeline_actions.CodeStarConnectionsSourceAction({
            actionName: 'GitHub',
            output: sourceArtifact,
            connectionArn: "arn:aws:codestar-connections:eu-north-1:700595718361:connection/c196d509-6bef-45d7-bc6b-fd45e5dd9095",
            owner: 'johannesg',
            repo: 'theta-gang-sweden',
            branch: props.branch
        });

        const lambdaBuildAction = new codepipeline_actions.CodeBuildAction({
            actionName: 'Lambda_Build',
            project: lambdaBuild,
            input: sourceArtifact,
            outputs: [lambdaBuildArtifact],
        });
        const appBuildAction = new codepipeline_actions.CodeBuildAction({
            actionName: 'App_Build',
            project: appBuild,
            input: sourceArtifact,
            outputs: [appBuildArtifact],
        });
        const cdkBuildAction = new codepipeline_actions.CodeBuildAction({
            actionName: 'CDK_Build',
            project: cdkBuild,
            input: sourceArtifact,
            outputs: [cdkBuildArtifact],
        });

        const deployAction = new codepipeline_actions.CloudFormationCreateUpdateStackAction({
            actionName: 'CFN_Deploy',
            templatePath: cdkBuildArtifact.atPath(`${props.stack.stackName}.template.json`),
            stackName: props.stack.stackName,
            adminPermissions: true,
            parameterOverrides: {
                // ...props.stack.lambdaCode.assign(lambdaBuildArtifact.s3Location),
                // ...props.stack.appCode.assign(appBuildArtifact.s3Location),
            },
            extraInputs: [lambdaBuildArtifact, appBuildArtifact],
        });

        // Complete Pipeline Project
        const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
            restartExecutionOnUpdate: true,
            crossAccountKeys: false,
            stages: [
                {
                    stageName: 'Source',
                    actions: [sourceAction]
                },
                {
                    stageName: 'Build',
                    actions: [lambdaBuildAction, appBuildAction, cdkBuildAction]
                },
                {
                    stageName: 'Deploy',
                    actions: [deployAction]
                },
            ],
        });

        pipeline.artifactBucket.grantRead(deployAction.deploymentRole);
    }
}