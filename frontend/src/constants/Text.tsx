import styled from 'styled-components';
import { BLACK_COLOUR, CARBON_COLOUR } from './Colours';

export const ParagraphText = styled.p<{ colour?: string }>`
	font-size: 16px;
	font-style: normal;
	font-weight: 400;
	line-height: 24px;
	color: ${(props) => (props.colour ? props.colour : CARBON_COLOUR)};
`;

export const ParagraphTextBold = styled(ParagraphText)`
	font-weight: 700;
`;

export const ParagraphTextSemiBold = styled(ParagraphText)`
	font-weight: 600;
`;

export const ParagraphTextSmall = styled(ParagraphText)`
	font-size: 14px;
	font-weight: 400;
	line-height: 22px;
	white-space: nowrap;
`;

export const ParagraphTextSmallSemiBold = styled(ParagraphTextSmall)`
	font-weight: 600;
`;

export const ParagraphTextSmallBold = styled(ParagraphTextSmall)`
	font-weight: 700;
`;

export const ParagraphTextExtraSmall = styled(ParagraphText)`
	font-size: 12px;
	font-weight: 400;
	line-height: 18px;
`;

export const Heading = styled.h1`
	font-size: 37px;
	font-style: normal;
	font-weight: 400;
	line-height: 47px;
	color: ${BLACK_COLOUR};
`;

export const Heading2 = styled.h2`
	font-size: 27px;
	font-style: normal;
	font-weight: 700;
	line-height: 34px;
	color: ${BLACK_COLOUR};
`;

export const Heading3 = styled.h3`
	font-size: 24px;
	font-style: normal;
	font-weight: 400;
	line-height: 26px;
	color: ${BLACK_COLOUR};
`;
