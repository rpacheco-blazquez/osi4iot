import mkcert from 'mkcert';
import fs from 'fs';
import md5 from 'md5';
import { execSync } from 'child_process';
import { giveCountryCode } from '../generic_tools/countryCodes.js';

export default async function (osi4iotState) {
	const currentTimestamp = Math.floor(Date.now() / 1000);
	const limitTimestamp = currentTimestamp - 3600 * 24 * 15; //15 days of margin
	const defaultValidityDays = osi4iotState.platformInfo.MQTT_SSL_CERTS_VALIDITY_DAYS;
	const defaultExpirationTimestamp = currentTimestamp + 3600 * 24 * defaultValidityDays;

	const certs_dir = "./certs"
	if (!fs.existsSync(certs_dir)) {
		fs.mkdirSync(certs_dir);

		if (osi4iotState.platformInfo.DOMAIN_CERTS_TYPE !== "Let's encrypt certs") {
			const domain_certs_dir = "./certs/domain_certs"
			if (!fs.existsSync(domain_certs_dir)) {
				fs.mkdirSync(domain_certs_dir);
			}
		}

		const mqtt_certs_dir = "./certs/mqtt_certs"
		if (!fs.existsSync(mqtt_certs_dir)) {
			fs.mkdirSync(mqtt_certs_dir);

			const ca_certs_dir = "./certs/mqtt_certs/ca_certs";
			fs.mkdirSync(ca_certs_dir);

			const broker_dir = "./certs/mqtt_certs/broker";
			fs.mkdirSync(broker_dir);

			const nodered_dir = "./certs/mqtt_certs/nodered";
			fs.mkdirSync(nodered_dir);
		}
	}


	if (osi4iotState.platformInfo.DOMAIN_CERTS_TYPE === "Self-signed certs") {
		let domainCA = {
			key: osi4iotState.certs.domain_certs.private_key,
			cert: osi4iotState.certs.domain_certs.ssl_ca_pem
		}

		const iotPlatformCaExpTimestamp = osi4iotState.certs.domain_certs.ca_pem_expiration_timestamp;
		if ((domainCA.key === "" && domainCA.cert === "") || parseInt(iotPlatformCaExpTimestamp, 10) < limitTimestamp) {
			domainCA = await mkcert.createCA({
				organization: answers.MAIN_ORGANIZATION_ACRONYM.toUpperCase(),
				countryCode: giveCountryCode(answers.MAIN_ORGANIZATION_COUNTRY),
				state: answers.MAIN_ORGANIZATION_STATE,
				locality: answers.MAIN_ORGANIZATION_CITY,
				validityDays: 3650
			});
			osi4iotState.certs.domain_certs.private_key = domainCA.key;
			osi4iotState.certs.domain_certs.ssl_ca_pem = domainCA.cert;
		}

		const iotPlatformCertExpTimestamp = osi4iotState.certs.domain_certs.cert_crt_expiration_timestamp;
		if (osi4iotState.certs.domain_certs.ssl_cert_crt === "" || parseInt(iotPlatformCertExpTimestamp, 10) < limitTimestamp) {
			const domainCert = await mkcert.createCert({
				domains: [answers.DOMAIN_NAME],
				validityDays: 3650,
				caKey: domainCA.key,
				caCert: domainCA.cert
			});
			osi4iotState.certs.domain_certs.ssl_cert_crt = domainCert.cert;
		}
	}

	if (osi4iotState.platformInfo.DOMAIN_CERTS_TYPE !== "Let's encrypt certs") {
		const iot_platform_key_name = `iot_platform_key_${md5(osi4iotState.certs.domain_certs.private_key)}`;
		const current_iot_platform_key_name = osi4iotState.certs.domain_certs.iot_platform_key_name;
		if (!fs.existsSync('./certs/domain_certs/iot_platform.key') || current_iot_platform_key_name !== iot_platform_key_name) {
			fs.writeFileSync('./certs/domain_certs/iot_platform.key', osi4iotState.certs.domain_certs.private_key);
			osi4iotState.certs.domain_certs.iot_platform_key_name = iot_platform_key_name;
		}

		const iot_platform_ca_name = `iot_platform_ca_${md5(osi4iotState.certs.domain_certs.ssl_ca_pem)}`;
		const current_iot_platform_ca_name = osi4iotState.certs.domain_certs.iot_platform_ca_name;
		if (!fs.existsSync('./certs/domain_certs/iot_platform_ca.pem') || current_iot_platform_ca_name !== iot_platform_ca_name) {
			fs.writeFileSync('./certs/domain_certs/iot_platform_ca.pem', osi4iotState.certs.domain_certs.ssl_ca_pem);
			const iotPlatformCa = execSync('openssl x509 -enddate -noout -in ./certs/domain_certs/iot_platform_ca.pem');
			const iotPlatformCaExpDate = iotPlatformCa.toString().split("=")[1];
			const iotPlatformCaExpTimestamp = Date.parse(iotPlatformCaExpDate);
			osi4iotState.certs.domain_certs.ca_pem_expiration_timestamp = iotPlatformCaExpTimestamp;
			osi4iotState.certs.domain_certs.iot_platform_ca_name = iot_platform_ca_name;
		}

		const iot_platform_cert_name = `iot_platform_cert_${md5(osi4iotState.certs.domain_certs.ssl_cert_crt)}`;
		const current_iot_platform_cert_name = osi4iotState.certs.domain_certs.iot_platform_cert_name;
		if (!fs.existsSync('./certs/domain_certs/iot_platform_cert.cer') || current_iot_platform_cert_name !== iot_platform_cert_name) {
			fs.writeFileSync('./certs/domain_certs/iot_platform_cert.cer', osi4iotState.certs.domain_certs.ssl_cert_crt);
			const iotPlatformCert = execSync('openssl x509 -enddate -noout -in ./certs/domain_certs/iot_platform_ca.pem');
			const iotPlatformCertExpDate = iotPlatformCert.toString().split("=")[1];
			const iotPlatformCertExpTimestamp = Date.parse(iotPlatformCertExpDate);
			osi4iotState.certs.domain_certs.cert_crt_expiration_timestamp = iotPlatformCertExpTimestamp;
			osi4iotState.certs.domain_certs.iot_platform_cert_name = iot_platform_cert_name;
		}
	}

	let mqttCa = {
		key: osi4iotState.certs.mqtt_certs.ca_certs.ca_key,
		cert: osi4iotState.certs.mqtt_certs.ca_certs.ca_crt
	};

	if ((mqttCa.key === "" && mqttCa.cert === "") || parseInt(osi4iotState.certs.mqtt_certs.ca_certs.expiration_timestamp, 10) < limitTimestamp) {
		// create a certificate authority
		mqttCa = await mkcert.createCA({
			organization: osi4iotState.platformInfo.MAIN_ORGANIZATION_ACRONYM.toUpperCase(),
			countryCode: giveCountryCode(osi4iotState.platformInfo.MAIN_ORGANIZATION_COUNTRY),
			state: answers.MAIN_ORGANIZATION_STATE,
			locality: answers.MAIN_ORGANIZATION_CITY,
			validityDays: 3650
		});
		const expiration_timestamp = currentTimestamp + 3600 * 24 * 3650;
		osi4iotState.certs.mqtt_certs.ca_certs.ca_key = mqttCa.key;
		osi4iotState.certs.mqtt_certs.ca_certs.mqtt_certs_ca_cert_name = `mqtt_certs_ca_cert_${md5(mqttCa.key)}`;
		osi4iotState.certs.mqtt_certs.ca_certs.ca_crt = mqttCa.cert;
		osi4iotState.certs.mqtt_certs.ca_certs.mqtt_certs_ca_key_name = `mqtt_certs_ca_key_${md5(mqttCa.cert)}`;
		osi4iotState.certs.mqtt_certs.ca_certs.expiration_timestamp = expiration_timestamp;

		fs.writeFileSync('./certs/mqtt_certs/ca_certs/ca.key', mqttCa.key);

		fs.writeFileSync('./certs/mqtt_certs/ca_certs/ca.crt', mqttCa.cert);
	}

	const broker_server_crt = osi4iotState.certs.mqtt_certs.broker.server_crt;
	const broker_server_key = osi4iotState.certs.mqtt_certs.broker.server_key;
	const broker_expiration_timestamp = osi4iotState.certs.mqtt_certs.broker.expiration_timestamp;
	if ((broker_server_crt === "" && broker_server_key === "") || broker_expiration_timestamp < limitTimestamp) {
		const broker = await mkcert.createCert({
			domains: [osi4iotState.platformInfo.DOMAIN_NAME],
			validityDays: defaultValidityDays,
			caKey: mqttCa.key,
			caCert: mqttCa.cert
		});
		osi4iotState.certs.mqtt_certs.broker.server_crt = broker.cert;
		osi4iotState.certs.mqtt_certs.broker.mqtt_broker_cert_name = `mqtt_broker_cert_${md5(broker.cert)}`;
		osi4iotState.certs.mqtt_certs.broker.server_key = broker.key;
		osi4iotState.certs.mqtt_certs.broker.mqtt_broker_key_name = `mqtt_broker_key_${md5(broker.key)}`;
		osi4iotState.certs.mqtt_certs.broker.expiration_timestamp = defaultExpirationTimestamp;

		fs.writeFileSync('./certs/mqtt_certs/broker/server.key', broker.key);

		fs.writeFileSync('./certs/mqtt_certs/broker/server.crt', broker.cert);
	}

	const nodered_client_crt = osi4iotState.certs.mqtt_certs.nodered.client_crt;
	const nodered_client_key = osi4iotState.certs.mqtt_certs.nodered.client_key;
	const nodered_expiration_timestamp = osi4iotState.certs.mqtt_certs.nodered.expiration_timestamp;
	if ((nodered_client_crt === "" && nodered_client_key === "") || nodered_expiration_timestamp < limitTimestamp) {
		const nodered = await mkcert.createCert({
			domains: ['mqtt_nodered'],
			validityDays: defaultValidityDays,
			caKey: mqttCa.key,
			caCert: mqttCa.cert
		});

		osi4iotState.certs.mqtt_certs.nodered.client_crt = nodered.cert;
		osi4iotState.certs.mqtt_certs.nodered.mqtt_nodered_client_cert_name = `mqtt_nodered_client_cert_${md5(nodered.cert)}`
		osi4iotState.certs.mqtt_certs.nodered.client_key = nodered.key;
		osi4iotState.certs.mqtt_certs.nodered.mqtt_nodered_client_key_name = `mqtt_nodered_client_key_${md5(nodered.key)}`;
		osi4iotState.certs.mqtt_certs.nodered.expiration_timestamp = defaultExpirationTimestamp;

		fs.writeFileSync('./certs/mqtt_certs/nodered/client.key', nodered.key);

		fs.writeFileSync('./certs/mqtt_certs/nodered/client.crt', nodered.cert);
	}

	const masterDeviceCertsPromises = []
	for (let iorg = 1; iorg <= osi4iotState.certs.mqtt_certs.organizations.length; iorg++) {
		const org_acronym = osi4iotState.certs.mqtt_certs.organizations[iorg - 1].org_acronym;
		const num_master_devices = osi4iotState.certs.mqtt_certs.organizations[iorg - 1].master_devices.length;
		for (let idev = 1; idev <= num_master_devices; idev++) {
			const mdevices_client_crt = osi4iotState.certs.mqtt_certs.organizations[iorg - 1].master_devices[idev - 1].client_crt;
			const mdevices_client_key = osi4iotState.certs.mqtt_certs.organizations[iorg - 1].master_devices[idev - 1].client_key;
			const mdevices_exp_timestamp = osi4iotState.certs.mqtt_certs.organizations[iorg - 1].master_devices[idev - 1].expiration_timestamp;
			const md_hash = osi4iotState.certs.mqtt_certs.organizations[iorg - 1].master_devices[idev - 1].md_hash;

			if ((mdevices_client_crt === "" && mdevices_client_key === "") || mdevices_exp_timestamp < limitTimestamp) {
				const promise = mkcert.createCert({
					domains: [`org_${org_acronym}_md_${md_hash}`],
					validityDays: defaultValidityDays,
					caKey: mqttCa.key,
					caCert: mqttCa.cert
				});

				masterDeviceCertsPromises.push(promise);
			}

		}
	}

	const masterDeviceCerts = await Promise.all(masterDeviceCertsPromises).catch(err => console.log("Error in master device certs ", err));

	let counter = 0;
	for (let iorg = 1; iorg <= osi4iotState.certs.mqtt_certs.organizations.length; iorg++) {
		const num_master_devices = osi4iotState.certs.mqtt_certs.organizations[iorg - 1].master_devices.length;
		const org_acronym = osi4iotState.certs.mqtt_certs.organizations[iorg - 1].org_acronym;
		for (let idev = 1; idev <= num_master_devices; idev++) {
			const mdevices_client_crt = osi4iotState.certs.mqtt_certs.organizations[iorg - 1].master_devices[idev - 1].client_crt;
			const mdevices_client_key = osi4iotState.certs.mqtt_certs.organizations[iorg - 1].master_devices[idev - 1].client_key;
			const mdevices_exp_timestamp = osi4iotState.certs.mqtt_certs.organizations[iorg - 1].master_devices[idev - 1].expiration_timestamp;
			const md_hash = osi4iotState.certs.mqtt_certs.organizations[iorg - 1].master_devices[idev - 1].md_hash;

			if ((mdevices_client_crt === "" && mdevices_client_key === "") || mdevices_exp_timestamp < limitTimestamp) {
				const masterDeviceCertsDir = `./certs/mqtt_certs/org_${org_acronym}_md_${md_hash}`;
				if (!fs.existsSync(masterDeviceCertsDir)) {
					fs.mkdirSync(masterDeviceCertsDir);
				}

				const masterDeviceClientKey = `./certs/mqtt_certs/org_${org_acronym}_md_${md_hash}/client.key`;
				fs.writeFileSync(masterDeviceClientKey, masterDeviceCerts[counter].key);
				osi4iotState.certs.mqtt_certs.organizations[iorg - 1].master_devices[idev - 1].client_key = masterDeviceCerts[counter].key;
				osi4iotState.certs.mqtt_certs.organizations[iorg - 1].master_devices[idev - 1].client_key_name = `${org_acronym}_${md_hash}_key_${md5(masterDeviceCerts[counter].key)}`

				const masterDeviceClientCert = `./certs/mqtt_certs/org_${org_acronym}_md_${md_hash}/client.crt`;
				fs.writeFileSync(masterDeviceClientCert, masterDeviceCerts[counter].cert);
				osi4iotState.certs.mqtt_certs.organizations[iorg - 1].master_devices[idev - 1].client_crt = masterDeviceCerts[counter].cert;
				osi4iotState.certs.mqtt_certs.organizations[iorg - 1].master_devices[idev - 1].client_crt_name = `${org_acronym}_${md_hash}_cert_${md5(masterDeviceCerts[counter].cert)}`

				osi4iotState.certs.mqtt_certs.organizations[iorg - 1].master_devices[idev - 1].expiration_timestamp = defaultExpirationTimestamp;
				counter++;
			}
		}
	}
};