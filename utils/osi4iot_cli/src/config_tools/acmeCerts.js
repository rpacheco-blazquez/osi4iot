import fs from 'fs';

export default async function (osi4iotState) {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const limitTimestamp = currentTimestamp - 3600 * 24 * 15; //15 days of margin
    const domainName = osi4iotState.platformInfo.DOMAIN_NAME;

    const acmeDomainDir = `~/.acme.sh/${domainName}`;
    if (!fs.existsSync(acmeDomainDir)) {
        console.log(clc.green(`\nGenerating ssl certificates...`));
        try {
            execSync(`~/.acme.sh/acme.sh --issue --dns dns_aws -d ${domainName} --server letsencrypt`, { stdio: 'inherit', env })
        } catch (err) {
            throw new Error(`Error getting ssl certificates`)
        }
        
    }

    const privateKeyFile = `~/.acme.sh/acme.sh/${domainName}/${domainName}.key`;
    if (fs.existsSync(privateKeyFile)) {
        if (osi4iotState.certs.domain_certs.private_key === "") {
            const privateKeyFileText = fs.readFileSync(privateKeyFile, 'UTF-8');
            osi4iotState.certs.domain_certs.private_key = privateKeyFileText;
        }
    } else {
        throw new Error(`The file ${privateKeyFileTex} not exist`)
    }

    const expirationCaCert = parseInt(osi4iotState.certs.domain_certs.ca_pem_expiration_timestamp, 10);
    const expirationSslCert = parseInt(osi4iotState.certs.domain_certs.cert_crt_expiration_timestamp, 10);
    if (expirationCaCert < limitTimestamp || expirationSslCert < limitTimestamp) {
        const env = {
            ...process.env,
            AWS_ACCESS_KEY_ID: osi4iotState.platformInfo.AWS_ACCESS_KEY_ID,
            AWS_SECRET_ACCESS_KEY: osi4iotState.platformInfo.AWS_SECRET_ACCESS_KEY
        }
        try {
            execSync(`~/.acme.sh/acme.sh --renew -d ${domainName} --force`, { stdio: 'inherit', env });
        } catch (err) {
            throw new Error(`Error renewing ssl certificates`)
        }
        osi4iotState.certs.domain_certs.ssl_ca_pem = "";
        osi4iotState.certs.domain_certs.ssl_cert_crt = "";
    }

    const caCertFile = `~/.acme.sh/acme.sh/${domainName}/ca.cer`;
    if (fs.existsSync(caCertFile)) {
        if (osi4iotState.certs.domain_certs.ssl_ca_pem === "" ) {
            const caCertFileText = fs.readFileSync(caCertFile, 'UTF-8');
            osi4iotState.certs.domain_certs.ssl_ca_pem = caCertFileText;
        }
    } else {
        throw new Error(`The file ${caCertFile} not exist`)
    }

    const sslCertFile = `~/.acme.sh/acme.sh/${domainName}/${domainName}.cer`;
    if (fs.existsSync(sslCertFile)) {
        if (osi4iotState.certs.domain_certs.ssl_cert_crt === "") {
            const sslCertFileText = fs.readFileSync(sslCertFile, 'UTF-8');
            osi4iotState.certs.domain_certs.ssl_cert_crt = sslCertFileText;
        }
    } else {
        throw new Error(`The file ${sslCertFile} not exist`)
    }

}