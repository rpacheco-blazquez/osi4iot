import { FC, useMemo, useCallback, useState, useEffect } from 'react'
import L, { LatLngExpression } from 'leaflet';
import centerOfMass from '@turf/center-of-mass';
import { polygon } from '@turf/helpers';
import 'leaflet/dist/leaflet.css';
import { MapContainer, GeoJSON, useMap, LayerGroup, useMapEvents } from 'react-leaflet';
import styled from "styled-components";
import { MdZoomOutMap } from "react-icons/md";
import { RiZoomInLine, RiZoomOutLine } from "react-icons/ri";
import { FaRedo, FaRegTimesCircle, FaRegCheckCircle } from "react-icons/fa";
import { LatLngTuple } from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import NonDraggableDeviceCircle from './NonDraggableDeviceCircle';
import DraggableDeviceCircle from './DraggableDeviceCircle';
import GeoNodeRedInstance from './GeoNodeRedInstance';
import { IBuilding } from '../TableColumns/buildingsColumns';
import { IFloor } from '../TableColumns/floorsColumns';
import GeoBuilding from './GeoBuilding';
import { IFeatureCollection, spacesDivider } from '../../../tools/spacesDivider';
import { IDevice } from '../TableColumns/devicesColumns';
import { useDeviceIdToEdit, useDeviceInputData, useDevicesPreviousOption } from '../../../contexts/devicesOptions';
import { IGroupManaged } from '../TableColumns/groupsManagedColumns';
import { DEVICES_PREVIOUS_OPTIONS } from '../Utils/platformAssistantOptions';import DraggableNriCircle from './DraggableNriCircle';
import { useGroupManagedInputFormData } from '../../../contexts/groupsManagedOptions';


const MapContainerStyled = styled(MapContainer)`
    background-color: #212121;

    &.leaflet-container {
        background:  #212121;
        outline: 0;
    }
`;

let DefaultIcon = L.icon({
    iconUrl: icon,
    iconAnchor: [12, 41],
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;


const ControlsContainer = styled.div`
    background-color: green;
    width: 100%;
`;

const ZoomControlContainer = styled.div`
    position: absolute;
    z-index: 1000;
    left: 0;
    top: 0;
    margin: 15px;
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    // border: 3px solid #2c3235;
    border: 2px solid #3274d9;
    border-radius: 15px;
    background-color: #202226;
`;

const RiZoomInLineStyled = styled(RiZoomInLine)`
    font-size: 30px;
    color: white;
`;

const RiZoomOutLineStyled = styled(RiZoomOutLine)`
    font-size: 30px;
    color: white;
`;


const MdZoomOutMapStyled = styled(MdZoomOutMap)`
    font-size: 30px;
    color: white;
`;

const FaRedoStyled = styled(FaRedo)`
    font-size: 22px;
    color: white;
`;

const FaRegTimesCircleStyled = styled(FaRegTimesCircle)`
    font-size: 28px;
    color: white;
`;

const FaRegCheckCircleStyled = styled(FaRegCheckCircle)`
    font-size: 28px;
    color: white;
`;



const ZoomControlItem = styled.div`
    background-color: #202226;
    padding: 3px;
    margin: 3px 5px;
    width: 35px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
        cursor: pointer;

        & ${RiZoomInLineStyled} {
			color: #3274d9;
		}

        & ${RiZoomOutLineStyled} {
			color: #3274d9;
		}

        & ${MdZoomOutMapStyled} {
			color: #3274d9;
		}

        & ${FaRedoStyled} {
			color: #3274d9;
		}

        & ${FaRegTimesCircleStyled} {
			color: #3274d9;
		}

        & ${FaRegCheckCircleStyled} {
			color: #3274d9;
		}
    }
`;


const findOuterBounds = (bounds: L.LatLngBounds) => {
    const minLatitude = bounds.getSouthWest().lat;
    const minLongitude = bounds.getSouthWest().lng;
    const maxLatitude = bounds.getNorthEast().lat;
    const maxLongitude = bounds.getNorthEast().lng;
    const outerBounds = [[minLatitude, minLongitude], [maxLatitude, maxLongitude]];
    return outerBounds;
}

interface ControlProps {
    elementToDrag: string;
    initialOuterBounds: number[][];
    refreshAll: () => void;
    backToOption: () => void;
    devicePosition: LatLngExpression;
    nriPosition: LatLngExpression;
    setElementLocationData: (elementLong: number, elementLat: number) => void;
}


const Controls: FC<ControlProps> = ({
    elementToDrag,
    initialOuterBounds,
    refreshAll,
    backToOption,
    devicePosition,
    nriPosition,
    setElementLocationData
}) => {
    const map = useMap();
    const clickZoomInHandler = () => {
        map.zoomIn();
    }

    const clickZoomOutHandler = () => {
        map.zoomOut();
    }

    const clickZoomFrameHandler = () => {
        map.fitBounds(initialOuterBounds as LatLngTuple[]);
    }

    const clickReloadHandler = () => {
        refreshAll();
        map.fitBounds(initialOuterBounds as LatLngTuple[]);
    }

    const clickExitHandler = () => {
        backToOption();
    }

    const clickAccepHandler = () => {
        if (elementToDrag === "device") {
            setElementLocationData((devicePosition as number[])[1], (devicePosition as number[])[0]);
        } else if (elementToDrag === "nri") {
            setElementLocationData((nriPosition as number[])[1], (nriPosition as number[])[0]);
        }
        backToOption();
    }

    return (
        <ZoomControlContainer>
            <ZoomControlItem onClick={clickZoomInHandler}>
                <RiZoomInLineStyled />
            </ZoomControlItem>
            <ZoomControlItem onClick={clickZoomOutHandler}>
                <RiZoomOutLineStyled />
            </ZoomControlItem>
            <ZoomControlItem onClick={clickZoomFrameHandler}>
                <MdZoomOutMapStyled />
            </ZoomControlItem>
            <ZoomControlItem onClick={clickReloadHandler}>
                <FaRedoStyled />
            </ZoomControlItem>
            <ZoomControlItem onClick={clickExitHandler}>
                <FaRegTimesCircleStyled />
            </ZoomControlItem>
            <ZoomControlItem onClick={clickAccepHandler}>
                <FaRegCheckCircleStyled />
            </ZoomControlItem>
        </ZoomControlContainer>
    )
}

interface MapEventProps {
    setNewOuterBounds: (outerBounds: number[][]) => void;
}

const MapEvents: FC<MapEventProps> = ({ setNewOuterBounds }) => {
    const map = useMapEvents({
        zoomend: () => {
            const bounds = map.getBounds();
            const newOuterBounds = findOuterBounds(bounds);
            setNewOuterBounds(newOuterBounds);
        },
        dragend: () => {
            const bounds = map.getBounds();
            const newOuterBounds = findOuterBounds(bounds);
            setNewOuterBounds(newOuterBounds);
        }
    })
    return null
}

const STATUS_OK = "#3e3f3b";
const NORMAL = "#9c9a9a";

const floorStyle = () => {
    return {
        stroke: true,
        color: NORMAL,
        weight: 1.5,
        opacity: 0.5,
        fill: true,
        fillColor: STATUS_OK,
        fillOpacity: 0.2
    }
}

const groupStyle = () => {
    return {
        stroke: true,
        color: NORMAL,
        weight: 3,
        opacity: 1,
        fill: true,
        fillColor: STATUS_OK,
        fillOpacity: 0.2
    }
}

interface GeoFloorSpaceMapProps {
    floorSpace: IFeatureCollection
}

const GeoFloorSpaceMap: FC<GeoFloorSpaceMapProps> = ({
    floorSpace
}) => {
    const styleGeoFloorJson = (geoJsonFeature: any) => {
        return floorStyle();
    }

    return (
        <GeoJSON
            data={floorSpace}
            style={styleGeoFloorJson}
        />
    )
};

interface GeoGroupSpaceMapProps {
    elementToDrag: string;
    floorSpace: IFeatureCollection
    floorData: IFloor;
    groupManaged: IGroupManaged;
    devicesInGroup: IDevice[];
    devicePosition: LatLngExpression;
    setDevicePosition: (devicePosition: LatLngExpression) => void;
    nriPosition: LatLngExpression;
    setNriPosition: (nriPosition: LatLngExpression) => void;
}


const GeoGroupSpaceMap: FC<GeoGroupSpaceMapProps> = ({
    elementToDrag,
    floorSpace,
    floorData,
    groupManaged,
    devicesInGroup,
    devicePosition,
    setDevicePosition,
    nriPosition,
    setNriPosition
}) => {
    const map = useMap();
    const devicesPreviousOption = useDevicesPreviousOption();
    const deviceIdToEdit = useDeviceIdToEdit();
    const deviceInputData = useDeviceInputData();
    const groupManagedData = useGroupManagedInputFormData();
    const [deviceDragging, setDeviceDragging] = useState(false);
    const [nriDragging, setNriDragging] = useState(false);

    useEffect(() => {
        let groupOuterBounds = groupManaged.outerBounds;
        if (!groupOuterBounds) {
            groupOuterBounds = floorData.outerBounds;
        }
        map.fitBounds(groupOuterBounds as LatLngTuple[]);
    }, [groupManaged.outerBounds, floorData.outerBounds, map])


    const evenstHandlerGeoJson = useMemo(
        () => ({
            click() {
                let groupOuterBounds = groupManaged.outerBounds;
                if (!groupOuterBounds) {
                    groupOuterBounds = floorData.outerBounds;
                }
                map.fitBounds(groupOuterBounds as LatLngTuple[]);
            }
        }),
        [map, groupManaged.outerBounds, floorData.outerBounds],
    )


    return (
        <LayerGroup>
            <GeoJSON
                data={floorSpace}
                style={(geoJsonFeature: any) => groupStyle()}
                eventHandlers={evenstHandlerGeoJson}
            />
            {
                elementToDrag === "nri" ?
                    <DraggableNriCircle
                        nriRadio={groupManagedData.nriInGroupIconRadio}
                        nriPosition={nriPosition}
                        setNriPosition={(nriPosition: LatLngExpression) => setNriPosition(nriPosition)}
                        nriDragging={nriDragging}
                        setNriDragging={(nriDragging: boolean) => setNriDragging(nriDragging)}
                    />
                    :
                    <GeoNodeRedInstance
                        longitude={groupManaged.nriInGroupIconLongitude}
                        latitude={groupManaged.nriInGroupIconLatitude}
                        iconRadio={groupManaged.nriInGroupIconRadio}
                        nriHash={groupManaged.nriInGroupHash}
                        linkAvailable={false}
                    />
            }
            {
                devicesInGroup.map(device => {
                    if (
                        elementToDrag === "device" &&
                        device.id === deviceIdToEdit &&
                        devicesPreviousOption === DEVICES_PREVIOUS_OPTIONS.EDIT_DEVICE
                    ) {
                        return (
                            <DraggableDeviceCircle
                                key={device.id}
                                deviceName={device.name}
                                deviceRadio={deviceInputData.iconRadio}
                                deviceType={device.type}
                                devicePosition={devicePosition}
                                setDevicePosition={(devicePosition: LatLngExpression) => setDevicePosition(devicePosition)}
                                deviceDragging={deviceDragging}
                                setDeviceDragging={(deviceDragging: boolean) => setDeviceDragging(deviceDragging)}
                            />
                        )
                    } else {
                        return (
                            <NonDraggableDeviceCircle
                                key={device.id}
                                device={device}
                            />
                        )
                    }
                })
            }
            {
                (elementToDrag === "device" && devicesPreviousOption === DEVICES_PREVIOUS_OPTIONS.CREATE_DEVICE) &&
                <DraggableDeviceCircle
                    deviceName={deviceInputData.name === "" ? `New device for group ${groupManaged.acronym}` : deviceInputData.name}
                    deviceRadio={deviceInputData.iconRadio}
                    deviceType={"Generic"}
                    devicePosition={devicePosition}
                    setDevicePosition={(devicePosition: LatLngExpression) => setDevicePosition(devicePosition)}
                    deviceDragging={deviceDragging}
                    setDeviceDragging={(deviceDragging: boolean) => setDeviceDragging(deviceDragging)}
                />
            }

        </LayerGroup>
    )
};


const calcInitialDevicePosition = (
    floorSpaces: IFeatureCollection[] | null,
    featureIndex: number,
    devicesPreviousOption: string,
    deviceIdToEdit: number,
    devicesInGroup: IDevice[]) => {
    let devicePosition = [devicesInGroup[0].latitude, devicesInGroup[0].longitude]
    if (floorSpaces) {
        const floorSpace = floorSpaces.filter(space => space.features[0].properties.index === featureIndex)[0];
        if (devicesPreviousOption === DEVICES_PREVIOUS_OPTIONS.CREATE_DEVICE) {
            const geoPolygon = polygon(floorSpace.features[0].geometry.coordinates);
            const center = centerOfMass(geoPolygon);
            devicePosition = [center.geometry.coordinates[1], center.geometry.coordinates[0]]
        } else if (devicesPreviousOption === DEVICES_PREVIOUS_OPTIONS.EDIT_DEVICE) {
            const deviceToEdit = devicesInGroup.filter(device => device.id === deviceIdToEdit)[0];
            devicePosition = [deviceToEdit.latitude, deviceToEdit.longitude]
        }
    }
    return devicePosition;
}

interface ElementLocationMapProps {
    elementToDrag: string;
    outerBounds: number[][];
    building: IBuilding;
    floorData: IFloor;
    groupManaged: IGroupManaged;
    devicesInGroup: IDevice[];
    featureIndex: number;
    setNewOuterBounds: (outerBounds: number[][]) => void;
    refreshBuildings: () => void;
    refreshFloors: () => void;
    refreshGroups: () => void;
    refreshDevices: () => void;
    backToOption: () => void;
    setElementLocationData: (deviceLong: number, deviceLat: number) => void;
}


const ElementLocationMap: FC<ElementLocationMapProps> = (
    {
        elementToDrag,
        outerBounds,
        building,
        floorData,
        groupManaged,
        devicesInGroup,
        featureIndex,
        setNewOuterBounds,
        refreshBuildings,
        refreshFloors,
        refreshGroups,
        refreshDevices,
        backToOption,
        setElementLocationData,
    }) => {
    const { floorOutline, floorSpaces } = useMemo(() => spacesDivider(floorData), [floorData]);
    const floorOutlineData = useState<IFeatureCollection | null>(floorOutline)[0];
    const devicesPreviousOption = useDevicesPreviousOption();
    const deviceIdToEdit = useDeviceIdToEdit();
    const [devicePosition, setDevicePosition] = useState<LatLngExpression>(
        calcInitialDevicePosition(
            floorSpaces,
            featureIndex,
            devicesPreviousOption,
            deviceIdToEdit,
            devicesInGroup
        ) as LatLngExpression
    );

    const groupManagedData = useGroupManagedInputFormData();
    const [nriPosition, setNriPosition] = useState<LatLngExpression>([
        groupManagedData.nriInGroupIconLatitude,
        groupManagedData.nriInGroupIconLongitude
    ]);


    const styleGeoFloorJson = (geoJsonFeature: any) => {
        return floorStyle();
    }

    const refreshAll = useCallback(() => {
        refreshBuildings();
        refreshFloors();
        refreshGroups();
        refreshDevices();
    }, [
        refreshBuildings,
        refreshFloors,
        refreshGroups,
        refreshDevices
    ])

    return (
        <MapContainerStyled maxZoom={30} scrollWheelZoom={true} zoomControl={false} doubleClickZoom={false} >
            <MapEvents setNewOuterBounds={setNewOuterBounds} />
            <GeoBuilding
                outerBounds={outerBounds}
                buildingData={building}
                isNecessaryToFitBounds={false}
            />
            {floorOutlineData &&
                <GeoJSON data={floorOutlineData} style={styleGeoFloorJson} />
            }
            {
                floorSpaces &&
                floorSpaces.map(floorSpace =>
                    floorSpace.features[0].properties.index === featureIndex ?
                        <GeoGroupSpaceMap
                            key={floorSpace.features[0]?.properties?.index}
                            elementToDrag={elementToDrag}
                            floorSpace={floorSpace}
                            floorData={floorData}
                            groupManaged={groupManaged}
                            devicesInGroup={devicesInGroup}
                            devicePosition={devicePosition}
                            setDevicePosition={(devicePosition: LatLngExpression) => setDevicePosition(devicePosition)}
                            nriPosition={nriPosition}
                            setNriPosition={(nriPosition: LatLngExpression) => setNriPosition(nriPosition)}
                        />
                        :
                        <GeoFloorSpaceMap
                            key={floorSpace.features[0]?.properties?.index}
                            floorSpace={floorSpace}
                        />
                )
            }
            <ControlsContainer>
                <Controls
                    elementToDrag={elementToDrag}
                    initialOuterBounds={building.outerBounds}
                    refreshAll={refreshAll}
                    backToOption={backToOption}
                    devicePosition={devicePosition}
                    nriPosition={nriPosition}
                    setElementLocationData={setElementLocationData}
                />
            </ControlsContainer>
        </MapContainerStyled>
    )
}

export default ElementLocationMap;