import { FC, useMemo, useState, useRef } from 'react'
import L, { LeafletMouseEvent, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useMap, Circle, SVGOverlay } from 'react-leaflet';
import styled from "styled-components";
import { LatLngTuple } from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { StyledTooltip as Tooltip } from './Tooltip';
import calcGeoBounds from '../../../tools/calcGeoBounds';



const CircleStyledDragging = styled(Circle)`
    &:hover {
        cursor: all-scroll;
    }
`;

const CircleStyledNoDragging = styled(Circle)`
    &:hover {
        cursor: auto;
    }
`;


let DefaultIcon = L.icon({
    iconUrl: icon,
    iconAnchor: [12, 41],
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;


const SELECTED = "#3274d9";
const DEVICE_COLOR = "#e0e0dc";

interface DraggableDeviceCircleProps {
    deviceName: string;
    deviceRadio: number;
    deviceType: string;
    devicePosition: LatLngExpression;
    setDevicePosition: (devicePosition: LatLngExpression) => void;
    deviceDragging: boolean;
    setDeviceDragging: (deviceDragging: boolean) => void;
}


const DraggableDeviceCircle: FC<DraggableDeviceCircleProps> = ({
    deviceName,
    deviceRadio,
    deviceType,
    devicePosition,
    setDevicePosition,
    deviceDragging,
    setDeviceDragging,
}) => {
    const map = useMap();
    const imageRef = useRef();

    const [bounds, setBounds] = useState(calcGeoBounds((devicePosition as number[])[1], (devicePosition as number[])[0], deviceRadio * 0.0004));


    const evenstHandlerCircle = useMemo(
        () => ({
            mousedown() {
                map.dragging.disable();
                setDeviceDragging(true);
            },
            mouseup(e: LeafletMouseEvent) {
                map.dragging.enable();
                setDeviceDragging(false);
                const bounds = calcGeoBounds(e.latlng.lng, e.latlng.lat, deviceRadio * 0.0004)

                setBounds(bounds);
                setDevicePosition([e.latlng.lat, e.latlng.lng])
            },
            mousemove(e: LeafletMouseEvent) {
                if (deviceDragging) {
                    if (imageRef.current) {
                        const bounds = calcGeoBounds(e.latlng.lng, e.latlng.lat, deviceRadio * 0.0004);
                        (imageRef.current as any).setBounds(bounds);
                        setBounds(bounds);
                    }
                    setDevicePosition([e.latlng.lat, e.latlng.lng])
                }
            },
        }),
        [map, setDeviceDragging, deviceDragging, setDevicePosition, deviceRadio],
    )


    return (
        <>
            {
                deviceDragging ?
                    <CircleStyledDragging
                        center={devicePosition}
                        pathOptions={{ color: SELECTED, fillColor: "#555555", fillOpacity: 0.5 }}
                        radius={deviceRadio}
                        eventHandlers={evenstHandlerCircle}
                    >
                    </CircleStyledDragging>
                    :
                    <CircleStyledNoDragging
                        center={devicePosition}
                        pathOptions={{ color: SELECTED, fillColor: "#555555", fillOpacity: 0.5 }}
                        radius={deviceRadio}
                        eventHandlers={evenstHandlerCircle}
                    >
                        <Tooltip sticky>
                            <span style={{ fontWeight: 'bold' }}>Device</span><br />
                            Name: {deviceName}<br />
                        </Tooltip>
                    </CircleStyledNoDragging>
            }
            <SVGOverlay ref={imageRef as any} attributes={{ viewBox: "0 0 512 512", fill: DEVICE_COLOR }} bounds={bounds as LatLngTuple[]}>
                {
                    deviceType === "Master" ?
                        <>
                            <path
                                d="M311.4 32.82C279.9 53.58 259 89.29 259 129.8c0 39.9 20.3 75.2 51.1 96.1l8.1-16.2c-25-17.8-41.2-46.9-41.2-79.9 0-33.59 16.8-63.17 42.5-80.82l-8.1-16.16zm127.2 0l-8.1 16.16C456.2 66.63 473 96.21 473 129.8c0 33-16.2 62.1-41.2 79.9l8.1 16.2c30.8-20.9 51.1-56.2 51.1-96.1 0-40.51-20.9-76.22-52.4-96.98zm-110 34.35C309.4 81.41 297 104.2 297 129.8c0 25 11.9 47.3 30.3 61.6l8.2-16.4c-12.6-11-20.5-27.1-20.5-45.2 0-18.7 8.5-35.3 21.8-46.29l-8.2-16.34zm92.8 0l-8.2 16.34C426.5 94.5 435 111.1 435 129.8c0 18.1-7.9 34.2-20.5 45.2l8.2 16.4c18.4-14.3 30.3-36.6 30.3-61.6 0-25.6-12.4-48.39-31.6-62.63zm-75.3 35.03c-6.9 7.2-11.2 16.9-11.2 27.6 0 10.1 3.8 19.3 10 26.4l9.4-18.7c-.9-2.4-1.4-5-1.4-7.7 0-3.5.8-6.7 2.2-9.6l-9-18zm57.8 0l-9 18c1.4 2.9 2.2 6.1 2.2 9.6 0 2.7-.5 5.3-1.4 7.7l9.4 18.7c6.2-7.1 10-16.3 10-26.4 0-10.7-4.3-20.4-11.2-27.6zM366 144v183h18V144h-18zM25 345v110h462V345H25zm55 39a16 16 0 0 1 16 16 16 16 0 0 1-16 16 16 16 0 0 1-16-16 16 16 0 0 1 16-16zm48 0a16 16 0 0 1 16 16 16 16 0 0 1-16 16 16 16 0 0 1-16-16 16 16 0 0 1 16-16zm48 0a16 16 0 0 1 16 16 16 16 0 0 1-16 16 16 16 0 0 1-16-16 16 16 0 0 1 16-16zM73 473v16h46v-16H73zm320 0v16h46v-16h-46z"
                                id="path5117" />
                            <path
                                d="m 203.29399,213.21263 a 15.805932,15.805932 0 0 0 3.16119,17.43442 l 0.57476,0.57477 a 19.158706,19.158706 0 0 1 0,27.10956 19.158706,19.158706 0 0 1 -27.10957,0 l -0.57476,-0.57476 a 15.805932,15.805932 0 0 0 -17.43442,-3.16118 15.805932,15.805932 0 0 0 -9.57936,14.46482 v 1.62849 a 19.158706,19.158706 0 0 1 -19.1587,19.1587 19.158706,19.158706 0 0 1 -19.15871,-19.1587 v -0.86214 a 15.805932,15.805932 0 0 0 -10.3457,-14.46483 15.805932,15.805932 0 0 0 -17.434421,3.16119 l -0.57476,0.57476 a 19.158706,19.158706 0 0 1 -27.109569,0 19.158706,19.158706 0 0 1 0,-27.10957 l 0.574761,-0.57476 a 15.805932,15.805932 0 0 0 3.161186,-17.43442 15.805932,15.805932 0 0 0 -14.464822,-9.57936 h -1.62849 a 19.158706,19.158706 0 0 1 -19.158706,-19.1587 19.158706,19.158706 0 0 1 19.158706,-19.1587 h 0.862142 a 15.805932,15.805932 0 0 0 14.464823,-10.3457 15.805932,15.805932 0 0 0 -3.161187,-17.43443 l -0.574762,-0.57476 a 19.158706,19.158706 0 0 1 0,-27.10956 19.158706,19.158706 0 0 1 27.109569,0 l 0.574762,0.57476 a 15.805932,15.805932 0 0 0 17.434418,3.16118 h 0.76635 a 15.805932,15.805932 0 0 0 9.57936,-14.464819 v -1.62849 a 19.158706,19.158706 0 0 1 19.15871,-19.158706 19.158706,19.158706 0 0 1 19.1587,19.158706 v 0.862142 a 15.805932,15.805932 0 0 0 9.57935,14.464827 15.805932,15.805932 0 0 0 17.43442,-3.16119 l 0.57477,-0.57476 a 19.158706,19.158706 0 0 1 27.10956,0 19.158706,19.158706 0 0 1 0,27.10956 l -0.57476,0.57476 a 15.805932,15.805932 0 0 0 -3.16118,17.43443 v 0.76635 a 15.805932,15.805932 0 0 0 14.46482,9.57934 h 1.62849 a 19.158706,19.158706 0 0 1 19.1587,19.15872 19.158706,19.158706 0 0 1 -19.1587,19.1587 h -0.86214 a 15.805932,15.805932 0 0 0 -14.46483,9.57935 z"
                                id="path5119" />
                            <circle
                                fill="#555555ff"
                                id="path5678"
                                cx="132.50845"
                                cy="184.23729"
                                r="45.013271"
                            />
                        </>
                        :
                        <path d="M311.4 32.82C279.9 53.58 259 89.29 259 129.8c0 39.9 20.3 75.2 51.1 96.1l8.1-16.2c-25-17.8-41.2-46.9-41.2-79.9 0-33.59 16.8-63.17 42.5-80.82l-8.1-16.16zm127.2 0l-8.1 16.16C456.2 66.63 473 96.21 473 129.8c0 33-16.2 62.1-41.2 79.9l8.1 16.2c30.8-20.9 51.1-56.2 51.1-96.1 0-40.51-20.9-76.22-52.4-96.98zm-110 34.35C309.4 81.41 297 104.2 297 129.8c0 25 11.9 47.3 30.3 61.6l8.2-16.4c-12.6-11-20.5-27.1-20.5-45.2 0-18.7 8.5-35.3 21.8-46.29l-8.2-16.34zm92.8 0l-8.2 16.34C426.5 94.5 435 111.1 435 129.8c0 18.1-7.9 34.2-20.5 45.2l8.2 16.4c18.4-14.3 30.3-36.6 30.3-61.6 0-25.6-12.4-48.39-31.6-62.63zm-75.3 35.03c-6.9 7.2-11.2 16.9-11.2 27.6 0 10.1 3.8 19.3 10 26.4l9.4-18.7c-.9-2.4-1.4-5-1.4-7.7 0-3.5.8-6.7 2.2-9.6l-9-18zm57.8 0l-9 18c1.4 2.9 2.2 6.1 2.2 9.6 0 2.7-.5 5.3-1.4 7.7l9.4 18.7c6.2-7.1 10-16.3 10-26.4 0-10.7-4.3-20.4-11.2-27.6zM366 144v183h18V144h-18zM25 345v110h462V345H25zm55 39a16 16 0 0 1 16 16 16 16 0 0 1-16 16 16 16 0 0 1-16-16 16 16 0 0 1 16-16zm48 0a16 16 0 0 1 16 16 16 16 0 0 1-16 16 16 16 0 0 1-16-16 16 16 0 0 1 16-16zm48 0a16 16 0 0 1 16 16 16 16 0 0 1-16 16 16 16 0 0 1-16-16 16 16 0 0 1 16-16zM73 473v16h46v-16H73zm320 0v16h46v-16h-46z" />
                }

            </SVGOverlay >
        </>
    )
};


export default DraggableDeviceCircle;