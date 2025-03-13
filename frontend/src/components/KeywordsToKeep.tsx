import styled from 'styled-components';
import { useState } from 'react';

import { FlexColumn, FlexRow } from '../constants/BasicStyled';
import {
	Heading,
	ParagraphTextBold,
	ParagraphTextSmall,
} from '../constants/Text';
import TextArea from './TextArea';
import Button from './Button';
import { CloseIcon } from '../assets/Icons';
import { CARBON_COLOUR, GRANITE_COLOUR } from '../constants/Colours';
import { ErrorText } from './Prompt';

const MainContainer = styled(FlexColumn)`
	gap: 44px;
	flex-shrink: 0;
`;

const KeywordsAndTextAreaContainer = styled(FlexColumn)`
	gap: 24px;
`;

const TextAreaContainer = styled(FlexColumn)`
	align-items: flex-start;
	gap: 8px;
`;

const TextAreaAndButtonContainer = styled(FlexRow)`
	gap: 30px;
	align-items: flex-end;
`;

export const BoxContainer = styled(FlexRow)`
	display: flex;
	width: auto;
	height: auto;
	padding: 8px 11px;
	justify-content: flex-end;
	align-items: center;
	gap: 10px;
	border-radius: 3px;
	border: 1px solid ${GRANITE_COLOUR};
	background: rgba(217, 217, 217, 0);
`;

const KeywordsContainer = styled(FlexRow)`
	gap: 16px;
	align-items: center;
	flex-wrap: wrap;
`;

const CloseIconStyled = styled.button`
	width: 16px;
	height: 16px;
	flex-shrink: 0;
`;

const ParagraphTextSmallStyled = styled(ParagraphTextSmall)`
	white-space: nowrap;
`;
type KeywordsToKeepProps = {
	keywords: string[];
	setKeywords: (keywords: string[]) => void;
};

const PromptPlaceholder = `Enter the keywords that you want kept in the document. You can add or remove selected keywords.`;
const KeywordsPlaceholder = `e.g. claim`;

export default function KeywordsToKeep(params: KeywordsToKeepProps) {
	const { keywords, setKeywords } = params;
	const [inputValue, setInputValue] = useState('');
	const [error, setError] = useState(false);
	const [errorText, setErrorText] = useState('');

	const handleAddKeyword = () => {
		if (inputValue.trim() === '') {
			setError(true);
			setErrorText('Keyword cannot be empty.');
			return;
		} else if (keywords.includes(inputValue.trim())) {
			setError(true);
			setErrorText('Keyword has already been entered.');
			return;
		} else {
			setKeywords([...keywords, inputValue.trim()]);
			setInputValue(''); // Clear the input after adding
			setError(false);
		}
	};

	const changeInputValue = (value: string) => {
		setInputValue(value);
		if (value.trim() !== '') {
			setError(false);
		}
	};

	const handleKeyPress = (
		event: React.KeyboardEvent<HTMLTextAreaElement>
	) => {
		if (event.key === 'Enter') {
			event.preventDefault(); // This prevents the default Enter key action (like form submission)
			handleAddKeyword();
		}
	};

	return (
		<MainContainer>
			<Heading>Keywords to Keep</Heading>
			<KeywordsAndTextAreaContainer>
				<FlexColumn gap={8}>
					<TextAreaAndButtonContainer>
						<TextAreaContainer>
							<ParagraphTextBold>
								{PromptPlaceholder}
							</ParagraphTextBold>
							<TextArea
								text={inputValue}
								placeHolderText={KeywordsPlaceholder}
								onChange={changeInputValue}
								error={error}
								onKeyPress={handleKeyPress}
							/>
						</TextAreaContainer>
						<Button text="Add" onClick={handleAddKeyword} />
					</TextAreaAndButtonContainer>
					{error && <ErrorText>{errorText}</ErrorText>}
				</FlexColumn>

				{keywords.length > 0 && (
					<KeywordsContainer>
						{keywords.map((keyword, index) => (
							<BoxContainer key={index}>
								<ParagraphTextSmallStyled
									colour={CARBON_COLOUR}
								>
									{keyword}
								</ParagraphTextSmallStyled>
								<CloseIconStyled
									onClick={() => {
										setKeywords(
											keywords.filter(
												(value) => value !== keyword
											)
										);
									}}
								>
									<CloseIcon />
								</CloseIconStyled>
							</BoxContainer>
						))}
					</KeywordsContainer>
				)}
			</KeywordsAndTextAreaContainer>
		</MainContainer>
	);
}
