import inquirer from 'inquirer';
import { execSync } from 'child_process'
import platformInitForm from './platformInitForm.js';
import runStack from './runStack.js';
import stopStack from './stopStack.js';
import stackStatus from './stackStatus.js';
import deletePlatform from './deletePlatform.js';
import createOrganization from './createOrganization.js';
import modifyNumMasterDevicesInOrg from './modifyNumMasterDevicesInOrg.js';
import getOrganizations from './getOrganizations.js';
import updateOrganization from './updateOrganization.js';
import removeOrganization from './removeOrganization.js';

export const chooseOption = () => {
	inquirer
		.prompt([
			{
				name: 'option',
				message: 'Choose one of the following options: ',
				default: 'Init platform',
				type: 'list',
				pageSize: 15,
				loop: false,
				choices: [
					'Init platform',
					'Run platform',
					'Clear screen',
					'List organizations',
					'Create organization',
					'Update organization',
					'Remove organization',
					'List nodes',
					'Add node',
					'Update node',
					'Remove node',
					'Platform status',
					'Stop platform',
					'Delete platform',
					'Exit'
				]

			}
		])
		.then(async (answers) => {
			switch (answers.option) {
				case 'Init platform':
					await platformInitForm();
					break;
				case 'Run platform':
					await runStack();
					break;
				case 'Clear screen':
					clearScreen();
					break;
				case 'List organizations':
					await getOrganizations();
					break;
				case 'Create organization':
					await createOrganization();
					break;
				case 'Update organization':
					await updateOrganization();
					break;
				case 'Remove organization':
					await removeOrganization();
					break;
				case 'Modify number of master devices in org':
					await modifyNumMasterDevicesInOrg();
					break;
				case 'Platform status':
					await stackStatus();
					break;
				case 'Stop platform':
					await stopStack();
					break;
				case 'Delete platform':
					deletePlatform();
					break;
				case 'Exit':
					break;
			}

		})
		.catch((error) => {
			if (error.isTtyError) {
				console.log("Prompt couldn't be rendered in the current environment");
			} else {
				console.log("Error in osi4iot cli: ", error)
			}
		})
}

const clearScreen = () => {
	execSync("clear", { stdio: 'inherit' });
	chooseOption();
}