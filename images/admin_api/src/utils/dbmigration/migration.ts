// import pool from "../../config/dbconfig";
import { logger } from "../../config/winston";
import { Pool, QueryResult } from "pg";
import grafanaApi from "../../GrafanaApi"
import { encrypt } from "../encryptAndDecrypt/encryptAndDecrypt";
import { createGroup } from "../../components/group/groupDAL";

export async function dataBaseInitialization() {
	const pool = new Pool({
		user: process.env.POSTGRES_USER,
		host: "postgres",
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB,
		port: 5432,
	});

	const tableName1 = "grafanadb.org";
	const queryString1a = 'SELECT COUNT(*) FROM grafanadb.org WHERE name = $1';
	const parameterArray1a = ["Main Org."];
	let result0;
	try {
		result0 = await pool.query(queryString1a, parameterArray1a);
	} catch (err) {
		logger.log("error", `Table ${tableName1} can not found: %s`, err.message);
	}

	if (result0.rows[0].count !== "0") {

		const tableUser = "grafanadb.user";
		const queryStringUser = 'ALTER TABLE grafanadb.user ADD COLUMN telegram_id varchar(30) UNIQUE';
		try {
			await pool.query(queryStringUser);
			logger.log("info", `Column telegram_id has been added sucessfully to Table ${tableUser}`);
		} catch (err) {
			logger.log("error", `Column telegram_id can not be added sucessfully to Table ${tableUser}: %s`, err.message);
		}

		const plaformAdminUser = {
			name: process.env.PLATFORM_ADMIN_NAME,
			email: process.env.PLATFORM_ADMIN_EMAIL,
			login: process.env.PLATFORM_ADMIN_USER_NAME,
			password: process.env.PLATFORM_ADMIN_PASSWORD,
			OrgId: 1
		}
		const grafanaAdminBasicAuthOptions = {
			username: 'admin',
			password: process.env.GRAFANA_ADMIN_PASSWORD,
			json: true
		}
		await grafanaApi.createUser(plaformAdminUser, grafanaAdminBasicAuthOptions);
		await grafanaApi.giveGrafanaAdminPermissions(2);
		await grafanaApi.changeUserRoleInOrganization(1, 2, "Admin");

		const queryString1b = 'ALTER TABLE grafanadb.org ADD COLUMN acronym varchar(20) UNIQUE';
		try {
			await pool.query(queryString1b);
			logger.log("info", `Column acronym has been added sucessfully to Table ${tableName1}`);
		} catch (err) {
			logger.log("error", `Column acronym can not be added sucessfully to Table ${tableName1}: %s`, err.message);
		}

		const queryString1c = 'UPDATE grafanadb.org SET name = $1,  acronym = $2, address1 = $3, city = $4, zip_code = $5, state = $6, country = $7 WHERE name = $8';
		const parameterArray1c = [
			process.env.MAIN_ORGANIZATION_NAME,
			process.env.MAIN_ORGANIZATION_ACRONYM,
			process.env.MAIN_ORGANIZATION_ADDRESS1,
			process.env.MAIN_ORGANIZATION_CITY,
			process.env.MAIN_ORGANIZATION_ZIP_CODE,
			process.env.MAIN_ORGANIZATION_STATE,
			process.env.MAIN_ORGANIZATION_COUNTRY,
			"Main Org."
		];
		let apiKeyMainOrg: string;

		try {
			await pool.query(queryString1c, parameterArray1c);
			const apyKeyName = `ApiKey_${process.env.MAIN_ORGANIZATION_ACRONYM}`
			const apiKeyData = { name: apyKeyName, role: "Admin" };
			const apiKeyObj = await grafanaApi.createApiKeyToken(apiKeyData);
			apiKeyMainOrg = apiKeyObj.key;
			logger.log("info", `Table ${tableName1} has been updated sucessfully`);
		} catch (err) {
			logger.log("error", `Table ${tableName1} can not be updated: %s`, err.message);
		}

		const tableName2 = "grafanadb.org_token";
		const queryString2a = `
			CREATE TABLE IF NOT EXISTS ${tableName2}(
				id serial PRIMARY KEY,
				org_id bigint,
				api_key_id integer,
				organization_key text,
				CONSTRAINT fk_api_key
					FOREIGN KEY(api_key_id)
						REFERENCES grafanadb.api_key(id)
						ON DELETE CASCADE,
				CONSTRAINT fk_org_id
					FOREIGN KEY(org_id)
						REFERENCES grafanadb.org(id)
						ON DELETE CASCADE
			);

			CREATE INDEX IF NOT EXISTS idx_org_token_org_id
			ON grafanadb.org_token(org_id);`;

		try {
			await pool.query(queryString2a);
			logger.log("info", `Table ${tableName2} has been created sucessfully`);
		} catch (err) {
			logger.log("error", `Table ${tableName2} can not be created: %s`, err.message);
		}

		const queryString2b = `INSERT INTO ${tableName2} (org_id, api_key_id, organization_key) VALUES ($1, $2, $3)`
		const hashedApiKey = encrypt(apiKeyMainOrg);
		const queryParameters2b = [1, 1, hashedApiKey];
		try {
			await pool.query(queryString2b, queryParameters2b);
			logger.log("info", `Data in table ${tableName2} has been inserted sucessfully`);
		} catch (err) {
			logger.log("error", `Data in table ${tableName2} con not been inserted: %s`, err.message);
		}

		const tableName3 = "grafanadb.group";
		const queryString3a = `
			CREATE TABLE IF NOT EXISTS ${tableName3}(
				id serial PRIMARY KEY,
				org_id bigint,
				team_id bigint,
				folder_id bigint,
				folder_uid VARCHAR(40),
				name VARCHAR(190) UNIQUE,
				acronym varchar(20) UNIQUE,
				group_uid VARCHAR(42),
				telegram_invitation_link VARCHAR(50),
				telegram_chatid VARCHAR(15),
				is_private BOOLEAN DEFAULT true,
				CONSTRAINT fk_org_id
					FOREIGN KEY(org_id)
						REFERENCES grafanadb.org(id)
						ON DELETE CASCADE,
				CONSTRAINT fk_team_id
					FOREIGN KEY(team_id)
						REFERENCES grafanadb.team(id)
						ON DELETE CASCADE,
				CONSTRAINT fk_folder_id
					FOREIGN KEY(folder_id)
						REFERENCES grafanadb.dashboard(id)
						ON DELETE CASCADE
			);

			CREATE INDEX IF NOT EXISTS idx_group_org_id
			ON grafanadb.group(org_id);

			CREATE INDEX IF NOT EXISTS idx_group_name
			ON grafanadb.group(name);

			CREATE INDEX IF NOT EXISTS idx_group_group_uid
			ON grafanadb.group(group_uid);`;

		try {
			await pool.query(queryString3a);
			const defaultMainOrgGroup = {
				name: `General_${process.env.MAIN_ORGANIZATION_ACRONYM}`,
				acronym: process.env.MAIN_ORGANIZATION_ACRONYM,
				email: ""
			}
			await createGroup(1, defaultMainOrgGroup, false);
			logger.log("info", `Table ${tableName3} has been created sucessfully`);
		} catch (err) {
			logger.log("error", `Table ${tableName3} can not be created: %s`, err.message);
		}

		pool.end(() => {
			logger.log("info", `Migration pool has ended`);
		})
	}
}
