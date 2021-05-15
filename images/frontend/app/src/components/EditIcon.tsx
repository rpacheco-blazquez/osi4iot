import { FC, SyntheticEvent } from "react";
import { FaEdit } from "react-icons/fa";
import styled from "styled-components";


const FaEditStyled = styled(FaEdit)`
    font-size: 18px;
    color: white;
`;

interface FaEditProps {
    rowIndex: number
}

const FaEditWrapper = styled.div<FaEditProps>`
    ${FaEditStyled} {
        background-color:${(props) => (props.rowIndex % 2 === 0 ? '#0c0d0f' : '#202226')};
    }
`;


const IconContainer = styled.div<FaEditProps>`
	display: flex;
	justify-content: center;
	align-items: center;
    background-color:${(props) => (props.rowIndex % 2 === 0 ? '#0c0d0f' : '#202226')};

    &:hover {
        cursor: pointer;

		& ${FaEditStyled} {
			color: #3274d9;
		}
    }
`;

interface EditIconProps {
    id: number;
    rowIndex: number;
}

const EditIcon: FC<EditIconProps> = ({ id, rowIndex }) => {

    const handleClick = (e: SyntheticEvent) => {
        console.log("Click= ", id)
    };

    return (
        <IconContainer onClick={handleClick} rowIndex={rowIndex}>
            <FaEditWrapper rowIndex={rowIndex} >
                <FaEditStyled />
            </FaEditWrapper>
        </IconContainer>
    );
};

export default EditIcon;