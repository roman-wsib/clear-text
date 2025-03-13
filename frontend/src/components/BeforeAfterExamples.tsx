import React from 'react';
import styled from 'styled-components';
import TextArea from './TextArea';
import Button from './Button';
import { Heading, ParagraphTextBold } from '../constants/Text';
import { FlexColumn } from '../constants/BasicStyled';
import { ErrorText } from './Prompt';

const promptSubheading =
	'Add examples of complex text and how you want them simplified. This helps the model understand your specific needs and how to adapt its simplification style to your use case.';
const questionPlaceholder = `e.g. "Simplify: The landlord can apply to the Board for an order to end the tenancy and evict the tenant as soon as the tenant gives the landlord this notice. However, if the Board issues an order ending the tenancy, the order will not require the tenant to move out any earlier than the termination date the tenant included in this notice."`;
const answerPlaceholder = `e.g. "As soon as you tell your landlord you're leaving, they can ask the Board to make an order to end your lease and make you move out. But, if the Board makes this order, it won't make you leave before the date you said you would in your notice."`;

const StyledButtonContainer = styled.div`
	align-self: flex-end;
`;

export type BeforeAfterExampleType = {
	id: number;
	original: string;
	simplified: string;
	error1: boolean;
	error2: boolean;
};

type BeforeAfterExamplesProps = {
	sampleQuestions: BeforeAfterExampleType[];
	setSampleQuestions: (sampleQuestions: BeforeAfterExampleType[]) => void;
};

function BoxComponent(props: {
	header: string;
	subHeader: string;
	placeHolderText: string;
	text: string;
	onChange: (text: string) => void;
	error: boolean;
}) {
	const { placeHolderText, text, onChange, header, subHeader } = props;
	return (
		<FlexColumn gap={8}>
			<ParagraphTextBold>{header}</ParagraphTextBold>
			<ParagraphTextBold>{subHeader}</ParagraphTextBold>
			<TextArea
				placeHolderText={placeHolderText}
				text={text}
				onChange={onChange}
				height={107}
				error={props.error}
			/>
			{props.error && <ErrorText>This field cannot be empty.</ErrorText>}
		</FlexColumn>
	);
}

export default function BeforeAfterExamples(
	params: BeforeAfterExamplesProps
) {
	const { sampleQuestions, setSampleQuestions } = params;

	const addPair = () => {
		setSampleQuestions([
			...sampleQuestions,
			{
				id: Date.now() + Math.random(),
				original: '',
				simplified: '',
				error1: false,
				error2: false,
			},
		]);
	};

	const updatePair = (id: number, part: string, value: string) => {
		const updatedPairs = sampleQuestions.map((pair) => {
			if (pair.id === id) {
				return {
					...pair,
					[part]: value,
					[`error${part === 'original' ? 1 : 2}`]: value === '',
				};
			}
			return pair;
		});
		setSampleQuestions(updatedPairs);
	};

	const removePair = (id: number) => {
		setSampleQuestions(sampleQuestions.filter((pair) => pair.id !== id));
	};

	return (
		<FlexColumn gap={10}>
			<Heading>Before and After Examples</Heading>
			<ParagraphTextBold>{promptSubheading}</ParagraphTextBold>
			<FlexColumn gap={44}>
				{sampleQuestions.map((pair, index) => (
					<React.Fragment key={pair.id}>
						<BoxComponent
							header={`Example ${index + 1}`}
							subHeader="Enter example text"
							placeHolderText={questionPlaceholder}
							text={pair.original}
							onChange={(value) =>
								updatePair(pair.id, 'original', value)
							}
							error={pair.error1}
						/>
						<BoxComponent
							header={`Expected output ${index + 1}`}
							subHeader="Enter expected (simplified) output"
							placeHolderText={answerPlaceholder}
							text={pair.simplified}
							onChange={(value) =>
								updatePair(pair.id, 'simplified', value)
							}
							error={pair.error2}
						/>
						{sampleQuestions.length > 1 && (
							<StyledButtonContainer>
								<Button
									text="Remove"
									alternatecolour={true}
									onClick={() => removePair(pair.id)}
								/>
							</StyledButtonContainer>
						)}
						{index === sampleQuestions.length - 1 && (
							<StyledButtonContainer>
								<Button text="Add" onClick={addPair} />
							</StyledButtonContainer>
						)}
					</React.Fragment>
				))}
			</FlexColumn>
		</FlexColumn>
	);
} 