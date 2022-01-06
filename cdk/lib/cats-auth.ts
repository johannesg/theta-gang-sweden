import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';

export class CatsAuthentication extends Construct {
    public readonly userPool: cognito.UserPool;
    public readonly userPoolClient: cognito.UserPoolClient;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        this.userPool = new cognito.UserPool(this, "UserPool", {
            selfSignUpEnabled: false,
            accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
            userVerification: {
                emailStyle: cognito.VerificationEmailStyle.CODE
            },
            autoVerify: {
                email: true
            },
            standardAttributes: {
                email: {
                    required: true,
                    mutable: true
                }
            }
        });

        const domain = this.userPool.addDomain("CatsDomain", {
            cognitoDomain: {
                domainPrefix: "jogus-cats"
            }
        });

        this.userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
            userPool: this.userPool,
            authFlows: {
                userPassword: true,
                // adminUserPassword: true,
                userSrp: true
            }
        });

        new cdk.CfnOutput(this, "CognitoBaseUrl", { value: domain.baseUrl() })
        // new cdk.CfnOutput(this, "CognitoSigninUrl", { value: signInUrl });

        new cdk.CfnOutput(this, "UserPoolId", { value: this.userPool.userPoolId });
        new cdk.CfnOutput(this, "UserPoolClientId", { value: this.userPoolClient.userPoolClientId });
    }
}