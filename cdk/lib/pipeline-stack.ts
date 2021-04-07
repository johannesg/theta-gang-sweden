import { Stack, Construct, StackProps, SecretValue } from '@aws-cdk/core';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { ThetaStack } from './theta-stack';

type PipelineStackProps = StackProps & {
    stack: ThetaStack
}

export class PipelineStack extends Stack {
    constructor(scope: Construct, id: string, props: PipelineStackProps) {
        super(scope, id, props);

        const cdkBuild = new codebuild.PipelineProject(this, 'CdkBuild', {
            buildSpec: codebuild.BuildSpec.fromSourceFilename("ci/build-cdk.yml"),
            environment: {
                buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
            }
        });

        const lambdaBuild = new codebuild.PipelineProject(this, 'LambdaBuild', {
            buildSpec: codebuild.BuildSpec.fromSourceFilename("ci/build-api.yml"),
            environment: {
                buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
            },
        });

        const appBuild = new codebuild.PipelineProject(this, 'AppBuild', {
            buildSpec: codebuild.BuildSpec.fromSourceFilename("ci/build-app.yml"),
            environment: {
                buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
            },
        });

        // Create Artifacts
        const sourceArtifact = new codepipeline.Artifact("SrcOutput");
        const cdkBuildArtifact = new codepipeline.Artifact('CdkBuildArtifact');
        const lambdaBuildArtifact = new codepipeline.Artifact('LambdaBuildArtifact');
        const appBuildArtifact = new codepipeline.Artifact('AppBuildArtifact');

        const sourceAction = new codepipeline_actions.GitHubSourceAction({
            actionName: 'GitHub',
            output: sourceArtifact,
            oauthToken: SecretValue.secretsManager('GITHUB', { jsonField: "GITHUB_TOKEN" }),
            trigger: codepipeline_actions.GitHubTrigger.WEBHOOK,
            // Replace these with your actual GitHub project info
            owner: 'johannesg',
            repo: 'theta-gang-sweden',
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
            actionName: 'Theta_CFN_Deploy',
            templatePath: cdkBuildArtifact.atPath('ThetaStack.template.json'),
            stackName: 'ThetaStack',
            adminPermissions: true,
            parameterOverrides: {
                ...props.stack.lambdaCode.assign(lambdaBuildArtifact.s3Location),
                ...props.stack.appCode.assign(appBuildArtifact.s3Location),
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