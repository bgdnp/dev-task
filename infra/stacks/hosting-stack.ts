import { Stack, StackProps } from 'aws-cdk-lib';
import { Certificate, CertificateValidation } from 'aws-cdk-lib/aws-certificatemanager';
import { HostedZone, IHostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

export class HostingStack extends Stack {
  readonly zone: IHostedZone;
  readonly certificate: Certificate;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.zone = HostedZone.fromLookup(this, 'HostedZone', { domainName: 'bgdn.dev' });
    this.certificate = new Certificate(this, 'HostCertificate', {
      domainName: 'deversity.bgdn.dev',
      validation: CertificateValidation.fromDns(this.zone),
    });
  }
}
