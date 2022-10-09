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
const NRI_COLOR = "#e0e0dc";

interface DraggableNriCircleProps {
    nriRadio: number;
    nriPosition: LatLngExpression;
    setNriPosition: (nriPosition: LatLngExpression) => void;
    nriDragging: boolean;
    setNriDragging: (nriDragging: boolean) => void;
}


const DraggableNriCircle: FC<DraggableNriCircleProps> = ({
    nriRadio,
    nriPosition,
    setNriPosition,
    nriDragging,
    setNriDragging,
}) => {
    const map = useMap();
    const imageRef = useRef();

    const [bounds, setBounds] = useState(calcGeoBounds((nriPosition as number[])[1], (nriPosition as number[])[0], nriRadio * 0.00097));


    const evenstHandlerCircle = useMemo(
        () => ({
            mousedown() {
                map.dragging.disable();
                setNriDragging(true);
            },
            mouseup(e: LeafletMouseEvent) {
                map.dragging.enable();
                setNriDragging(false);
                const bounds = calcGeoBounds(e.latlng.lng, e.latlng.lat, nriRadio * 0.00097)

                setBounds(bounds);
                setNriPosition([e.latlng.lat, e.latlng.lng])
            },
            mousemove(e: LeafletMouseEvent) {
                if (nriDragging) {
                    if (imageRef.current) {
                        const bounds = calcGeoBounds(e.latlng.lng, e.latlng.lat, nriRadio * 0.00097);
                        (imageRef.current as any).setBounds(bounds);
                        setBounds(bounds);
                    }
                    setNriPosition([e.latlng.lat, e.latlng.lng])
                }
            },
        }),
        [map, setNriDragging, nriDragging, setNriPosition, nriRadio],
    )


    return (
        <>
            {
                nriDragging ?
                    <CircleStyledDragging
                        center={nriPosition}
                        pathOptions={{ color: SELECTED, fillColor: "#555555", fillOpacity: 0.5 }}
                        radius={nriRadio}
                        eventHandlers={evenstHandlerCircle}
                    >
                    </CircleStyledDragging>
                    :
                    <CircleStyledNoDragging
                        center={nriPosition}
                        pathOptions={{ color: SELECTED, fillColor: "#555555", fillOpacity: 0.5 }}
                        radius={nriRadio}
                        eventHandlers={evenstHandlerCircle}
                    >
                        <Tooltip sticky>
                            <span style={{ fontWeight: 'bold' }}>Nodered instance</span><br />
                        </Tooltip>
                    </CircleStyledNoDragging>
            }
            <SVGOverlay ref={imageRef as any} attributes={{ viewBox: "0 0 560.00001 647.00001", fill: NRI_COLOR }} bounds={bounds as LatLngTuple[]}>
                <g transform="translate(0 -405.36)">
                    <g transform="translate(.000014172 .000022107)">
                        <path opacity="0.98" color-rendering="auto" color="#000000" mix-blend-mode="normal" shape-rendering="auto" solid-color="#000000" image-rendering="auto" d="m280 405.36 280 162.03v323.32l-280 161.69-280-161.7-0.0000055092-323.41z" fill="#8f0000" />
                        <path fill="#000000" d="m278.57 1019.5-28.122-14.758-219.32-239.19 3.8673-12.478h107.86l19.715-65.534 17.337 24.866 57.948-65.047 47.857-12.857 2.1429 33.571 33.571 3.5714 33.571 0.7143 87.143 2.1428 14.96-70.328 74.709 87.705-2.0935 65.238-115.11 0.0298-1.9844 60.416 120.23 12.653 1.4251 42.694z" fill-opacity=".19898" fill-rule="evenodd" />
                        <path fill="#8f0000" d="m278.57 1019.5-28.122-14.758-219.32-239.19 3.8673-12.478h107.86l19.715-65.534 17.337 24.866 57.948-65.047 47.857-12.857 2.1429 33.571 33.571 3.5714 33.571 0.7143 87.143 2.1428 14.96-70.328 74.709 87.705-2.0935 65.238-115.11 0.0298-1.9844 60.416 120.23 12.653 1.4251 42.694z" fill-opacity=".19898" fill-rule="evenodd" />
                        <path opacity="0.98" color-rendering="auto" text-decoration-color="#000000" color="#000000" mix-blend-mode="normal" shape-rendering="auto" solid-color="#000000" block-progression="tb" text-decoration-line="none" text-decoration-style="solid" image-rendering="auto" white-space="normal" text-indent="0" text-transform="none" d="m21.75 766.85v108.15c-0.000146 1.7862 0.95284 3.4368 2.5 4.3301l253.25 145.97c1.5471 0.8927 3.4529 0.8927 5 0l252.86-145.98c1.5472-0.8933 2.6427-2.5439 2.6426-4.3301v-35.361-22.285-50.504-22.281-161.46c0.00015-1.7862-1.0954-3.4368-2.6426-4.3301l-252.86-145.95c-0.72594-0.41802-1.5453-0.64704-2.3828-0.66602-0.91698-0.0221-1.8224 0.20827-2.6172 0.66602l-253.25 145.95c-1.5472 0.8933-2.5001 2.5439-2.5 4.3301v88.68 20.795 51.99zm258.25-323.93l248 143.06v158.38h-99.357c-17.583 0-32.643 14.683-32.643 32.267v4.3203c-59.713-0.44167-77.52-15.896-99.729-35.316-18.46-16.144-41.584-33.808-88.092-41.188 8.6712-8.6968 13.887-18.575 18.533-27.002 4.9936-9.0548 9.5102-16.227 16.734-21.184 5.6262-3.8616 15.231-6.1887 27.666-6.9277v4.0606c0 17.583 13.655 31.97 31.238 31.97h127.3c17.583 0 33.352-14.386 33.352-31.97v-31.279c0-17.583-15.706-31.75-33.289-31.75l-127.3-0.002c-17.583 0-31.301 14.167-31.301 31.75v5.7031c-16.445 0.81071-30.442 4.0316-39.949 10.557-11.762 8.0728-18.195 19.038-23.461 28.586-5.2657 9.5484-9.5828 17.764-15.855 23.518-5.3491 4.9052-12.841 8.2718-25.018 9.8086-1.5749-16.163-15.629-27.827-32.172-27.921h-102.66v-86.38zm22.414 169.44h127.3c5.9367 0 10.289 3.8124 10.289 9.7492v31.279c0 5.9367-4.415 9.9717-10.352 9.9716h-127.3c-5.9367 0-10.766-4.035-10.766-9.9716v-31.279c0-5.9367 4.8916-9.7492 10.828-9.7492zm-270.41 80h102.65c5.9367 0 10.348 4.9199 10.348 10.857v31.281c0 5.9367-4.411 9.8623-10.348 9.8622h-102.65zm135.44 30.243c71.712 1.1287 91.494 19.195 114.55 39.359 22.126 19.349 49.351 39.661 114.01 40.516v5.4297c0 17.583 15.059 31.452 32.643 31.452h99.357v32.747l-248 143.09-248-143.09v-105.75h102.66c17.583 0 32.777-14.277 32.777-31.86zm261.21 43.757h99.355v51h-99.355c-5.9367 0-10.645-4.0661-10.645-10.003v-30.73c0-5.9367 4.7078-10.267 10.645-10.267z" fill="#fff" />
                    </g>
                </g>
            </SVGOverlay >
        </>
    )
};


export default DraggableNriCircle;