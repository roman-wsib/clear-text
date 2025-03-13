import styled from 'styled-components';
import {
	Heading,
	ParagraphTextBold,
	ParagraphTextSmallSemiBold,
} from '../constants/Text';
import { RED_COLOUR } from '../constants/Colours';
import TextArea from './TextArea';

const promptSubheading =
	'Input how you want the document to be simplified. You can make edits the given prompt to be simplified.';
const promptPlaceholder = `You are an editor in the communications department of a government insurance firm that handles workplace compensation for injured / deceased workers. Your role is to re-write official communications to match a grade 6 reading level...`;

const StyledContainer = styled.div`
	display: flex;
	width: 100%;
	height: auto;
	flex-direction: column;
	align-items: flex-start;
	gap: 8px;
	flex-shrink: 0;
`;

const StyledPromptContainer = styled.div`
	display: flex;
	width: 100%;
	flex-direction: column;
	align-items: flex-start;
	gap: 44px;
	flex-shrink: 0;
`;

export const ErrorText = styled(ParagraphTextSmallSemiBold)`
	color: ${RED_COLOUR};
`;

type PromptProps = {
	basePrompt: string;
	setBasePrompt: (basePrompt: string) => void;
	error: boolean;
};

// TODO: Use a State Variable from the Page Body Component to store the Prompt Text Value, and use to be the initial placeholder text
//       for the TextArea Component. If it gets updated then update this variable as well, for API calls.
export default function Prompt(params: PromptProps) {
	// const [inputValue, setInputValue] = useState<string>('');
	const { basePrompt, setBasePrompt, error } = params;

	return (
		<StyledPromptContainer>
			<Heading>Prompt</Heading>
			<StyledContainer>
				<ParagraphTextBold>{promptSubheading}</ParagraphTextBold>
				<TextArea
					placeHolderText={promptPlaceholder}
					text={basePrompt}
					onChange={setBasePrompt}
					height={294}
					error={error}
				/>
				{error && basePrompt == '' && (
					<ErrorText>Field is required.</ErrorText>
				)}
			</StyledContainer>
		</StyledPromptContainer>
	);
}
