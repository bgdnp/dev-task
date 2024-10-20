import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { IResource, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { resolve } from 'path';
import { CachePolicy, Distribution } from 'aws-cdk-lib/aws-cloudfront';
import { RestApiOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
import { AaaaRecord, ARecord, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { HostingStack } from './hosting-stack';

export class ApiStack extends Stack {
  private gateway: RestApi;
  private cacheBucket: Bucket;
  private hosting: HostingStack;

  constructor(scope: Construct, id: string, props: StackProps & { hosting: HostingStack }) {
    super(scope, id, props);

    this.hosting = props.hosting;

    this.gateway = new RestApi(this, 'Gateway');
    this.cacheBucket = new Bucket(this, 'CacheBucket', {
      removalPolicy: RemovalPolicy.DESTROY, // for demo purposes, not recommended in production
    });

    this.createStatusEndpoint();
    this.createSearchEndpoint();
    this.createCloudfront();
  }

  private createStatusEndpoint() {
    const lambda = new Function(this, 'StatusFunction', {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset(resolve(process.cwd(), 'dist/status')),
      handler: 'index.handler',
      functionName: 'get-status-handler',
      environment: {
        NODE_ENV: 'cloud',
      },
    });

    const api = this.getResource('api', this.gateway.root);
    const status = this.getResource('status', api);

    status.addMethod('get', new LambdaIntegration(lambda));
  }

  private createSearchEndpoint() {
    const lambda = new Function(this, 'SearchFunction', {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromAsset(resolve(process.cwd(), 'dist/get-search-result')),
      handler: 'index.handler',
      functionName: 'get-search-result-handler',
      timeout: Duration.seconds(30),
      memorySize: 1024,
      environment: {
        NODE_ENV: 'cloud',
        CACHE_BUCKET_NAME: this.cacheBucket.bucketName,
      },
    });

    this.cacheBucket.grantReadWrite(lambda);

    const api = this.getResource('api', this.gateway.root);
    const files = this.getResource('search', api);

    files.addMethod('get', new LambdaIntegration(lambda));
  }

  createCloudfront() {
    const cloudfront = new Distribution(this, 'ApiDistribution', {
      defaultBehavior: {
        origin: new RestApiOrigin(this.gateway),
        cachePolicy: CachePolicy.CACHING_DISABLED, //disabled cloudfront caching to test application level caching strategies
      },
      domainNames: ['deversity.bgdn.dev'],
      certificate: this.hosting.certificate,
    });

    new ARecord(this, 'SubdomainA', {
      zone: this.hosting.zone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(cloudfront)),
      recordName: 'deversity.bgdn.dev',
    });

    new AaaaRecord(this, 'SubdomainAAAA', {
      zone: this.hosting.zone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(cloudfront)),
      recordName: 'deversity.bgdn.dev',
    });
  }

  private getResource(name: string, parent: IResource) {
    let resource = parent.getResource(name);

    if (!resource) {
      resource = parent.addResource(name);
    }

    return resource;
  }
}
