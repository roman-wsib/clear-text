import styled from 'styled-components';
import {
	BLUE_JAY_COLOUR,
	MIDNIGHT_COLOUR,
	TRILLIUM_COLOUR,
} from '../constants/Colours';
import { ParagraphTextSemiBold } from '../constants/Text';

const ButtonContainer = styled.button<{ alternatecolour: boolean }>`
	display: flex;
	padding: 12px 40px;
	align-items: center;
	border-radius: 24px;
	height: fit-content;
	width: fit-content;
	background: ${BLUE_JAY_COLOUR};
	border: 2px solid ${BLUE_JAY_COLOUR};

	&:hover {
		cursor: pointer;
		transition: 0.2s;
		background: ${MIDNIGHT_COLOUR};
		border: 2px solid ${MIDNIGHT_COLOUR};
	}

	${(props) =>
		props.alternatecolour &&
		`
		background: ${TRILLIUM_COLOUR};
		
	`}
`;

const ButtonText = styled(ParagraphTextSemiBold)<{ alternatecolour: boolean }>`
	text-align: center;
	color: ${(props) =>
		props.alternatecolour ? BLUE_JAY_COLOUR : TRILLIUM_COLOUR};

	${ButtonContainer}:hover & {
		color: ${TRILLIUM_COLOUR};
	}
`;

type ButtonProps = {
	text: string;
	alternatecolour?: boolean;
	onClick: () => void;
};

export default function Button(params: ButtonProps) {
	const { text, onClick, alternatecolour } = params;
	return (
		<ButtonContainer
			alternatecolour={alternatecolour || false}
			onClick={onClick}
		>
			<ButtonText alternatecolour={alternatecolour || false}>
				{text}
			</ButtonText>
		</ButtonContainer>
	);
}
