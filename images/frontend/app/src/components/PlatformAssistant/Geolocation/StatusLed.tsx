import styled from "styled-components";
import { STATUS_OK, STATUS_PENDING, STATUS_ALERTING } from "./statusTools";

interface StatusLedProps {
    readonly status: string;
}

export const StatusLed = styled.span<StatusLedProps>`
	background-color: ${(props) => {
        if (props.status === "ok") return STATUS_OK;
        else if (props.status === "pending") return STATUS_PENDING;
        else if (props.status === "alertingnding") return STATUS_ALERTING;
    }};
	width: 8px;
	height: 8px;
	margin: 1px 5px;
	border-radius: 50%;
	border: 1px solid #ffffff;
	display: inline-block;
`;