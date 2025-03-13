import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
	CONCRETE_COLOUR,
	TRILLIUM_COLOUR,
	CARBON_COLOUR,
	GRANITE_COLOUR,
	RED_COLOUR,
} from '../constants/Colours';

const StyledTextArea = styled.textarea<{ height: number; error?: boolean }>`
	width: 100%;
	display: flex;
	padding: 5px 8px;
	align-items: flex-start;
	gap: 10px;
	align-self: stretch;
	border-radius: 3px;
	border: 1px solid ${(props) => (props.error ? RED_COLOUR : GRANITE_COLOUR)};
	background: ${TRILLIUM_COLOUR};

	font-size: 16px;
	font-style: normal;
	font-weight: 600;
	line-height: 24px;
	color: ${CARBON_COLOUR};
	placeholdertextcolor: ${CONCRETE_COLOUR};
	height: ${(props) => props.height}px;
`;

type TextAreaParameters = {
	placeHolderText: string;
	text: string;
	height?: number;
	onChange: (value: string) => void;
	error?: boolean;
	onKeyPress?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

export default function TextArea(params: TextAreaParameters) {
	const { text, height, onChange, placeHolderText, error, onKeyPress } =
		params;
	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (error && textAreaRef.current) {
			textAreaRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}
	}, [error]);

	return (
		<StyledTextArea
			ref={textAreaRef}
			placeholder={placeHolderText}
			height={height || 36}
			value={text}
			onChange={(e) => onChange(e.target.value)}
			onKeyPress={onKeyPress}
			error={error}
		/>
	);
}
