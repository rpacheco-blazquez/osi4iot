import { Column } from 'react-table';
import EditIcon from '../EditIcon';
import DeleteIcon from '../DeleteIcon';
import ExChangeIcon from '../ExchangeIcon';

export interface IDevices {
    orgId: number;
    groupId: string;
    id: number;
    name: string;
    description: string;
    deviceUid: string;
	latitude: number;
	longitude: number;
    isDefaultGroupDevice: boolean;
    changeDeviceHash: string;
    edit: string;
    delete: string;
}

export const DEVICES_COLUMNS: Column<IDevices>[] = [
    {
        Header: "OrgId",
        accessor: "orgId",
        filter: 'equals'
    },
    {
        Header: "GroupId",
        accessor: "groupId",
        filter: 'equals'
    },
    {
        Header: "DeviceId",
        accessor: "id",
        filter: 'equals'
    },
    {
        Header: "Name",
        accessor: "name"
    },
    {
        Header: "Description",
        accessor: "description"
    },
    {
        Header: "Device hash",
        accessor: "deviceUid",
        disableFilters: true
    },
    {
        Header: "Longitude",
        accessor: "longitude",
        disableFilters: true
    },
    {
        Header: "Latitude",
        accessor: "latitude",
        disableFilters: true
    },
    {
        Header: () => <div style={{backgroundColor: '#202226'}}>Is group<br/>default?</div>,
        accessor: "isDefaultGroupDevice",
        disableFilters: true
    },
    {
        Header: () => <div style={{backgroundColor: '#202226'}}>Change<br/>hash</div>,
        accessor: "changeDeviceHash",
        disableFilters: true,
        disableSortBy: true,
        Cell: props => {
            const groupId = props.rows[props.row.id as unknown as number]?.cells[0].value;
            const rowIndex = props.rows[props.row.id as unknown as number]?.cells[0].row.id;
            return <ExChangeIcon id={groupId} rowIndex={parseInt(rowIndex,10)}/>
        }
    },
    {
        Header: "",
        accessor: "edit",
        disableFilters: true,
        disableSortBy: true,
        Cell: props => {
            const deviceId = props.rows[props.row.id as unknown as number]?.cells[0]?.value;
            const rowIndex = props.rows[props.row.id as unknown as number]?.cells[0]?.row?.id;
            return <EditIcon id={deviceId} rowIndex={parseInt(rowIndex)} />
        }
    },
    {
        Header: "",
        accessor: "delete",
        disableFilters: true,
        disableSortBy: true,
        Cell: props => {
            const deviceId = props.rows[props.row.id as unknown as number]?.cells[0]?.value;
            const rowIndex = props.rows[props.row.id as unknown as number]?.cells[0]?.row?.id;
            return <DeleteIcon id={deviceId} rowIndex={parseInt(rowIndex)} />
        }
    }
]