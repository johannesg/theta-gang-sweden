import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

import { CfnOutput, Construct, Stack, StackProps } from '@aws-cdk/core';
import { Table, AttributeType, ProjectionType } from '@aws-cdk/aws-dynamodb';

export type ThetaTableProps = {

}

export class ThetaTableStack extends Stack {
    tableName: CfnOutput
    tableArn: CfnOutput

    constructor(scope: Construct, id: string, props: StackProps | undefined) {
        super(scope, id, props);

        const table = new dynamodb.Table(this, 'ThetaGang', {
            partitionKey: { name: 'PK', type: AttributeType.STRING },
            sortKey: { name: 'SK', type: AttributeType.STRING },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
        });

        table.addGlobalSecondaryIndex({
            indexName: "GSI1",
            partitionKey: { name: 'GSI1_PK', type: AttributeType.STRING},
            sortKey: { name: 'GSI1_SK', type: AttributeType.STRING }
        })

        this.tableName = new CfnOutput(this, "TableName", { value: table.tableName, exportName: "theta-gang-table-name" });
        this.tableArn = new CfnOutput(this, "TableArn", { value: table.tableArn, exportName: "theta-gang-table-arn" });
    }
}