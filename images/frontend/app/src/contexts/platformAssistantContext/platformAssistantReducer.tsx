import { PlatformAssistantContextProps, PlatformAssistantAction } from "./interfaces";
import {
    PLATFORM_ASSISTANT_OPTION,
} from "../../components/PlatformAssistant/Utils/platformAssistantOptions";

const initialUserProfile = {
    userId: 0,
    name: "",
    firstName: "",
    surname: "",
    login: "",
    email: "",
}

export const initialState = {
    userRole: "unknown",
    numOrganizationManaged: 0,
    numGroupsManaged: 0,
    numDevicesManage: 0,
    platformAssitantOptionToShow: PLATFORM_ASSISTANT_OPTION.HOME,
    selectOrgUsers: [],
    reloadSelectOrgUsersTable: true,
    organizations: [],
    nodeRedInstances: [],
    reloadNodeRedInstancesTable: true,
    buildings: [],
    reloadBuildingsTable: true,
    floors: [],
    reloadFloorsTable: true,
    globalUsers: [],
    reloadGlobalUsersTable: true,
    refreshTokens: [],
    orgsManaged: [],
    orgsOfGroupsManaged: [],
    reloadOrgsOfGroupsManagedTable: true,
    reloadOrgsManagedTable: true,
    orgUsers: [],
    reloadOrgUsersTable: true,
    groups: [],
    reloadGroupsTable: true,
    groupsManaged: [],
    reloadGroupsManagedTable: true,
    groupMembers: [],
    reloadGroupMembersTable: true,
    devices: [],
    reloadDevicesTable: true,
    topics: [],
    reloadTopicsTable: true,
    dashboards: [],
    reloadDashboardsTable: true,
    digitalTwins: [],
    reloadDigitalTwinsTable: true,
    userProfile: initialUserProfile,
    orgsMembership: [],
    reloadOrgsMembershipTable: true,
    groupsMembership: [],
    reloadGroupsMembershipTable: true,
};

export const PlatformAssitantReducer = (initialState: PlatformAssistantContextProps, action: PlatformAssistantAction) => {
    switch (action.type) {
        case "USER_ROLE":
            return {
                ...initialState,
                userRole: action.payload.userRole,
                numOrganizationManaged: action.payload.numOrganizationManaged,
                numGroupsManaged: action.payload.numGroupsManaged,
                numDevicesManage: action.payload.numDevicesManage
            };

        case "PLATFORM_ASSISTANT_OPTION_TO_SHOW":
            return {
                ...initialState,
                platformOptionsToShow: action.payload.platformAssitantOptionToShow
            };

        case "SELECT_ORG_USERS_TABLE":
            return {
                ...initialState,
                selectOrgUsers: action.payload.selectOrgUsers
            };

        case "RELOAD_SELECT_ORG_USERS_TABLE":
            return {
                ...initialState,
                reloadSelectOrgUsersTable: action.payload.reloadSelectOrgUsersTable
            };

        case "ORGANIZATIONS_TABLE":
            return {
                ...initialState,
                organizations: action.payload.organizations
            };

        case "NODERED_INSTANCES_TABLE":
            return {
                ...initialState,
                nodeRedInstances: action.payload.nodeRedInstances
            };

        case "RELOAD_NODERED_INSTANCES_TABLE":
            return {
                ...initialState,
                reloadNodeRedInstancesTable: action.payload.reloadNodeRedInstancesTable
            };

        case "BUILDINGS_TABLE":
            return {
                ...initialState,
                buildings: action.payload.buildings
            };

        case "RELOAD_BUILDINGS_TABLE":
            return {
                ...initialState,
                reloadBuildingsTable: action.payload.reloadBuildingsTable
            };

        case "FLOORS_TABLE":
            return {
                ...initialState,
                floors: action.payload.floors
            };

        case "RELOAD_FLOORS_TABLE":
            return {
                ...initialState,
                reloadFloorsTable: action.payload.reloadFloorsTable
            };

        case "GLOBAL_USERS_TABLE":
            return {
                ...initialState,
                globalUsers: action.payload.globalUsers
            };

        case "RELOAD_GLOBAL_USERS_TABLE":
            return {
                ...initialState,
                reloadGlobalUsersTable: action.payload.reloadGlobalUsersTable
            };

        case "REFRESH_TOKENS_TABLE":
            return {
                ...initialState,
                refreshTokens: action.payload.refreshTokens
            };

        case "ORGS_MANAGED_TABLE":
            return {
                ...initialState,
                orgsManaged: action.payload.orgsManaged
            };

        case "RELOAD_ORGS_MANAGED_TABLE":
            return {
                ...initialState,
                reloadOrgsManagedTable: action.payload.reloadOrgsManagedTable
            };

        case "ORGS_OF_GROUPS_MANAGED_TABLE":
            return {
                ...initialState,
                orgsOfGroupsManaged: action.payload.orgsOfGroupsManaged
            };

        case "RELOAD_ORGS_OF_GROUPS_MANAGED_TABLE":
            return {
                ...initialState,
                reloadOrgsOfGroupsManagedTable: action.payload.reloadOrgsOfGroupsManagedTable
            };

        case "ORGS_USERS_TABLE":
            return {
                ...initialState,
                orgUsers: action.payload.orgUsers
            };

        case "RELOAD_ORGS_USERS_TABLE":
            return {
                ...initialState,
                reloadOrgUsersTable: action.payload.reloadOrgUsersTable
            };

        case "GROUPS_TABLE":
            return {
                ...initialState,
                groups: action.payload.groups
            };

        case "RELOAD_GROUPS_TABLE":
            return {
                ...initialState,
                reloadGroupsTable: action.payload.reloadGroupsTable
            };

        case "GROUPS_MANAGED_TABLE":
            return {
                ...initialState,
                groupsManaged: action.payload.groupsManaged
            };

        case "RELOAD_GROUPS_MANAGED_TABLE":
            return {
                ...initialState,
                reloadGroupsManagedTable: action.payload.reloadGroupsManagedTable
            };

        case "GROUPS_MEMBERS_TABLE":
            return {
                ...initialState,
                groupMembers: action.payload.groupMembers
            };

        case "RELOAD_GROUPS_MEMBERS_TABLE":
            return {
                ...initialState,
                reloadGroupMembersTable: action.payload.reloadGroupMembersTable
            };

        case "DEVICES_TABLE":
            return {
                ...initialState,
                devices: action.payload.devices
            };

        case "RELOAD_DEVICES_TABLE":
            return {
                ...initialState,
                reloadDevicesTable: action.payload.reloadDevicesTable
            };

        case "TOPICS_TABLE":
            return {
                ...initialState,
                topics: action.payload.topics
            };

        case "RELOAD_TOPICS_TABLE":
            return {
                ...initialState,
                reloadTopicsTable: action.payload.reloadTopicsTable
            };

        case "DASHBOARDS_TABLE":
            return {
                ...initialState,
                dashboards: action.payload.dashboards
            };

        case "RELOAD_DASHBOARDS_TABLE":
            return {
                ...initialState,
                reloadDashboardsTable: action.payload.reloadDashboardsTable
            };

        case "DIGITAL_TWIN_TABLE":
            return {
                ...initialState,
                digitalTwins: action.payload.digitalTwins
            };

        case "RELOAD_DIGITAL_TWIN_TABLE":
            return {
                ...initialState,
                reloadDigitalTwinsTable: action.payload.reloadDigitalTwinsTable
            };

        case "USER_PROFILE_TABLE":
            return {
                ...initialState,
                userProfile: action.payload.userProfile
            };

        case "ORGS_MEMBERSHIP_TABLE":
            return {
                ...initialState,
                orgsMembership: action.payload.orgsMembership
            };

        case "RELOAD_ORGS_MEMBERSHIP_TABLE":
            return {
                ...initialState,
                reloadOrgsMembershipTable: action.payload.reloadOrgsMembershipTable
            };

        case "GROUP_MEMBERSHIP_TABLE":
            return {
                ...initialState,
                groupsMembership: action.payload.groupsMembership
            };

        case "RELOAD_GROUP_MEMBERSHIP_TABLE":
            return {
                ...initialState,
                reloadGroupsMembershipTable: action.payload.reloadGroupsMembershipTable
            };

        case "RESET_TABLES":
            return {
                userRole: "unknown",
                numOrganizationManaged: 0,
                numGroupsManaged: 0,
                numDevicesManage: 0,
                platformAssitantOptionToShow: PLATFORM_ASSISTANT_OPTION.HOME,
                selectOrgUsers: [],
                reloadSelectOrgUsersTable: true,
                organizations: [],
                nodeRedInstances: [],
                reloadNodeRedInstancesTable: true,
                buildings: [],
                reloadBuildingsTable: true,
                floors: [],
                reloadFloorsTable: true,
                globalUsers: [],
                reloadGlobalUsersTable: true,
                refreshTokens: [],
                orgsManaged: [],
                reloadOrgsManagedTable: true,
                orgsOfGroupsManaged: [],
                reloadOrgsOfGroupsManagedTable: true,
                orgUsers: [],
                reloadOrgUsersTable: true,
                groups: [],
                reloadGroupsTable: true,
                groupsManaged: [],
                reloadGroupsManagedTable: true,
                groupMembers: [],
                reloadGroupMembersTable: true,
                devices: [],
                reloadDevicesTable: true,
                topics: [],
                reloadTopicsTable: true,
                dashboards: [],
                reloadDashboardsTable: true,
                digitalTwins: [],
                reloadDigitalTwinsTable: true,
                userProfile: initialUserProfile,
                orgsMembership: [],
                reloadOrgsMembershipTable: true,
                groupsMembership: [],
                reloadGroupsMembershipTable: true
            };

        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};