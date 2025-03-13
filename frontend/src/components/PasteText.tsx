import styled from 'styled-components';
import TextArea from './TextArea';
import { Heading, ParagraphTextBold } from '../constants/Text';
import { FlexColumn } from '../constants/BasicStyled';
import { ErrorText } from './Prompt';

const StyledPasteTextContainer = styled(FlexColumn)`
	gap: 44px;
`;

const StyledDocumentTextContainer = styled.div`
	display: flex;
	width: 100%;
	flex-direction: column;
	align-items: flex-start;
	gap: 8px;
`;

type PasteTextProps = {
	text: string;
	setText: (text: string) => void;
	error: boolean;
};

export function PasteText(params: PasteTextProps) {
	const { text, setText, error } = params;

	return (
		<StyledPasteTextContainer>
			<Heading>Paste a Text</Heading>
			<StyledDocumentTextContainer>
				<ParagraphTextBold>
					Enter some text to simplify.
				</ParagraphTextBold>
				<TextArea
					placeHolderText="Enter some text to simplify"
					text={text}
					onChange={setText}
					height={255}
					error={error}
				/>
				{error && text == '' && (
					<ErrorText>No document text has been entered.</ErrorText>
				)}
			</StyledDocumentTextContainer>
		</StyledPasteTextContainer>
	);
}
