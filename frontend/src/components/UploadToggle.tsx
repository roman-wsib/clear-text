import styled from 'styled-components';
import {
	BLUE_JAY_COLOUR,
	CARBON_COLOUR,
	GRAY_3_COLOUR,
} from '../constants/Colours';
import { ParagraphTextSemiBold } from '../constants/Text';
import { FlexRow } from '../constants/BasicStyled';

const ToggleDiv = styled.div<{ active: boolean }>`
	width: 298px;
	height: 75px;
	flex-shrink: 0;
	border-radius: 6px 6px 6px 6px;
	border: 1px solid
		${(props) => (props.active === true ? BLUE_JAY_COLOUR : '#CECECE')};
	background: ${(props) => (props.active === true ? '#E5F1F8' : '#EFF0F1')};

	&:hover {
		cursor: pointer;
		border: 1px solid ${BLUE_JAY_COLOUR};
		background: #e5f1f8;
		transition: 0.2s;
	}
`;

const Underline = styled.div`
	width: 296px;
	height: 9px;
	margin: auto;
	border-radius: 0px 0px 4px 4px;
	border: 0px 1px 1px 1px solid ${BLUE_JAY_COLOUR};
	background: ${BLUE_JAY_COLOUR};
`;

const TextStyle = styled(ParagraphTextSemiBold)<{ active: boolean }>`
	color: ${(props) =>
		props.active === true ? CARBON_COLOUR : GRAY_3_COLOUR};
	text-align: center;
	margin: 25px 80px 15px 80px;
	${ToggleDiv}:hover & {
		color: ${CARBON_COLOUR};
		transition: 0.2s;
	}
`;

type UploadToggleProps = {
	uploadActive: boolean;
	setUploadActive: (uploadActive: boolean) => void;
};

export default function UploadToggle(params: UploadToggleProps) {
	const { uploadActive, setUploadActive } = params;
	return (
		<FlexRow>
			<ToggleDiv
				active={uploadActive}
				onClick={() => {
					setUploadActive(true);
				}}
			>
				<TextStyle active={uploadActive}>Upload Document</TextStyle>
				{uploadActive && <Underline />}
			</ToggleDiv>
			<ToggleDiv
				active={!uploadActive}
				onClick={() => {
					setUploadActive(false);
				}}
			>
				<TextStyle active={!uploadActive}>Paste Text</TextStyle>
				{!uploadActive && <Underline />}
			</ToggleDiv>
		</FlexRow>
	);
}
