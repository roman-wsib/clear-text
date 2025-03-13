import styled from 'styled-components';
import { YELLOW_COLOUR } from '../constants/Colours';

import { ParagraphText } from '../constants/Text';
import { InfoIcon } from '../assets/Icons';

const StyledWarning = styled.div`
	display: flex;
	width: 100%;
	padding: 32px;
	justify-content: center;
	align-items: center;
	gap: 16px;
	background: ${YELLOW_COLOUR};
`;
type WarningParameters = {
	text: string;
};

const StyledWarningAndIcon = styled.div`
	display: flex;
	padding: 8px;
	align-items: center;
	gap: 10px;
	flex: 1 0 0;
`;

export default function Warning(params: WarningParameters) {
	const { text } = params;
	return (
		<StyledWarning>
			<StyledWarningAndIcon>
				<InfoIcon />
				<ParagraphText>{text}</ParagraphText>
			</StyledWarningAndIcon>
		</StyledWarning>
	);
}
