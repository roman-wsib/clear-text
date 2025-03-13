import styled from 'styled-components';
import { FlexColumn, FlexRow } from '../constants/BasicStyled';
import { CaretDown } from '../assets/Icons';
import { Heading2, ParagraphText } from '../constants/Text';
import { CONCRETE_COLOUR, RED_COLOUR } from '../constants/Colours';

const StyledYellowBar = styled.div`
	width: 131px;
	height: 20px;
	flex-shrink: 0;
	background: #ffcc3f;
`;

const StyledGreen = styled.div`
	width: 39px;
	height: 20px;
	flex-shrink: 0;
	background: #00a851;
`;

const StyledRed = styled.div`
	width: 186px;
	height: 20px;
	flex-shrink: 0;
	background: ${RED_COLOUR};
`;

const StyledCaret = styled(CaretDown)`
	width: 24px;
	height: 24px;
	flex-shrink: 0;
`;

const StyledParagraph = styled(ParagraphText)`
	color: ${CONCRETE_COLOUR};
	width: 26px;
	text-align: center;
`;

const StyledDivider = styled.div<{ width: number }>`
	width: ${(props) => props.width}px;
	height: 1px;
`;

const MainContainer = styled.div`
	width: 369px;
	height: 132px;
`;

const StyledColourContainer = styled(FlexRow)`
	padding-left: 13px;
`;

const StyledNumbersContainer = styled(FlexRow)`
	padding-left: 5px;
`;

const StyledHeading2 = styled(Heading2)`
	text-align: center;
	width: 356px;
	padding-left: 13px;
`;

const CaretContainer = styled.div<{ paddingleft: number }>`
	display: flex;
	padding-left: ${(props) => props.paddingleft}px;
`;

type ColouredSliderProps = {
	score: number;
};

function calculatePadding(score: number) {
	if (score < 14) {
		return (131 / 14) * score;
	} else if (score <= 15) {
		return 131 + (39 / 1) * (score - 14);
	} else {
		return 131 + 39 + (186 / 13) * (score - 15);
	}
}

function getBottomText(score: number) {
	if (score < 14) return 'Needs Revision';
	else if (score <= 15) return 'Pass';
	else return 'Too Complex';
}

export default function ColouredSlider(props: ColouredSliderProps) {
	const { score } = props;
	return (
		<MainContainer>
			<FlexColumn gap={8}>
				<StyledHeading2>{getBottomText(score)}</StyledHeading2>
				<CaretContainer paddingleft={calculatePadding(score)}>
					<StyledCaret />
				</CaretContainer>
				<FlexColumn gap={16}>
					<FlexColumn gap={4}>
						<StyledColourContainer>
							<StyledYellowBar />
							<StyledGreen />
							<StyledRed />
						</StyledColourContainer>
						<StyledNumbersContainer>
							<StyledParagraph>{'0'}</StyledParagraph>
							<StyledDivider width={100} />
							<StyledParagraph>{'14'}</StyledParagraph>
							<StyledDivider width={13} />
							<StyledParagraph>{'15'}</StyledParagraph>
							<StyledDivider width={141} />
							<StyledParagraph>{'>28'}</StyledParagraph>
						</StyledNumbersContainer>
					</FlexColumn>
				</FlexColumn>
			</FlexColumn>
		</MainContainer>
	);
}
