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
import ArrowRightSolid from '../assets/arrow-right-solid.svg';
import { CARBON_COLOUR } from '../constants/Colours';
import { BoxContainer } from './KeywordsToKeep';
import { KeywordsToReplaceType } from './PageBody';
import { ErrorText } from './Prompt';

const MainContainer = styled(FlexColumn)`
	gap: 10px;
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

const ArrowRightSolidStyled = styled.div`
	flex-shrink: 0;
	width: 28px;
	height: 24px;
	align-self: center;
	margin-top: 30px;
`;

type ReplaceKeywordsProps = {
	keywords: KeywordsToReplaceType[];
	setKeywords: (keywords: KeywordsToReplaceType[]) => void;
};

const promptPlaceholder = `Enter the keywords that you want to replace in the document.  You can add or remove selected keywords.`;
const oldKeywordPlaceHolder = `e.g. persons`;
const newKeywordPlaceHolder = `e.g. people`;

export default function ReplaceKeywords(params: ReplaceKeywordsProps) {
	const { keywords, setKeywords } = params;
	const [oldKeyword, setOldKeyword] = useState('');
	const [newKeyword, setNewKeyword] = useState('');
	const [errorText, setErrorText] = useState('');
	const [error1, setError1] = useState(false);
	const [error2, setError2] = useState(false);

	const handleAddKeyword = () => {
		if (
			keywords.some((keyword) => keyword.original === oldKeyword.trim())
		) {
			setError1(true);
			setErrorText('Keyword has already been entered.');
			return;
		} else {
			setError1(false);
		}

		// check for empty
		if (oldKeyword.trim() === '') {
			setError1(true);
			setErrorText('Keyword to replace cannot be empty.');
			return;
		} else {
			setError1(false);
		}

		if (newKeyword.trim() === '') {
			setError2(true);
			setErrorText('Replacement keyword cannot be empty.');
			return;
		} else {
			setError2(false);
		}

		setKeywords([
			...keywords,
			{
				original: oldKeyword.trim(),
				replacement: newKeyword.trim(),
			},
		]);
		setOldKeyword('');
		setNewKeyword('');
	};

	const changeOldKeyword = (text: string) => {
		setOldKeyword(text);
		if (text.trim() !== '') {
			setError1(false);
		}
	};

	const changeNewKeyword = (text: string) => {
		setNewKeyword(text);
		if (text.trim() !== '') {
			setError2(false);
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
			<Heading>Replace Keywords</Heading>
			<ParagraphTextBold>{promptPlaceholder}</ParagraphTextBold>

			<KeywordsAndTextAreaContainer>
				<FlexColumn gap={8}>
					<TextAreaAndButtonContainer>
						<TextAreaContainer>
							<ParagraphTextBold>
								Keyword to replace
							</ParagraphTextBold>
							<TextArea
								text={oldKeyword}
								placeHolderText={oldKeywordPlaceHolder}
								onChange={changeOldKeyword}
								error={error1}
								onKeyPress={handleKeyPress}
							/>
						</TextAreaContainer>
						<ArrowRightSolidStyled>
							<img src={ArrowRightSolid} />
						</ArrowRightSolidStyled>
						<TextAreaContainer>
							<ParagraphTextBold>Replace with</ParagraphTextBold>
							<TextArea
								text={newKeyword}
								placeHolderText={newKeywordPlaceHolder}
								onChange={changeNewKeyword}
								error={error2}
								onKeyPress={handleKeyPress}
							/>
						</TextAreaContainer>

						<Button text="Add" onClick={handleAddKeyword} />
					</TextAreaAndButtonContainer>
					{(error1 || error2) && <ErrorText>{errorText}</ErrorText>}
				</FlexColumn>

				{keywords.length > 0 && (
					<KeywordsContainer>
						{keywords.map((keyword, index) => (
							<BoxContainer key={index}>
								<ParagraphTextSmall colour={CARBON_COLOUR}>
									{keyword.original} → {keyword.replacement}
								</ParagraphTextSmall>
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
