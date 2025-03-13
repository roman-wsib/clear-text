import styled from 'styled-components';

import { FlexColumn, FlexRow } from '../constants/BasicStyled';
import React from 'react';
import { DownChevron, UpChevron } from '../assets/Icons';
import {
	Heading,
	ParagraphTextBold,
	ParagraphTextSemiBold,
} from '../constants/Text';
import {
	CARBON_COLOUR,
	CONCRETE_COLOUR,
	GRANITE_COLOUR,
	GRAY_COLOUR,
	TRILLIUM_COLOUR,
} from '../constants/Colours';

const DropdownField = styled(FlexRow)`
	height: 34px;
	padding: 3px 8px;
	justify-content: space-between;
	align-items: center;
	flex-shrink: 0;
	align-self: stretch;
	border-radius: 3px;
	border: 1px solid ${GRANITE_COLOUR};
	background: ${TRILLIUM_COLOUR};
	&:hover {
		cursor: pointer;
	}
	user-select: none;
`;

const OptionsContainer = styled(FlexColumn)`
	border: 1px solid ${GRANITE_COLOUR};
`;

const SingleOptionContainers = styled.div`
	display: flex;
	padding: 5px 8px;
	align-items: flex-start;
	gap: 8px;
	align-self: stretch;
	background: ${TRILLIUM_COLOUR};
	&:hover {
		background-color: ${GRAY_COLOUR};
		cursor: pointer;
	}
	user-select: none;
`;

const MainContainer = styled(FlexColumn)`
	gap: 44px;
`;

const SecondaryContainer = styled(FlexColumn)`
	gap: 8px;
`;

const SubheaderText =
	'Select from the following pre-made communication style or customize your own style:';

type DropdownProps = {
	title: string;
	options: string[];
	selectedOption: string;
	setSelectedOption: (option: string) => void;
};

export default function Dropdown(params: DropdownProps) {
	const { title, options, selectedOption, setSelectedOption } = params;
	const [isOpen, setIsOpen] = React.useState(false);
	return (
		<MainContainer>
			<Heading>Communication Style</Heading>
			<SecondaryContainer>
				<ParagraphTextBold>{SubheaderText}</ParagraphTextBold>
				<FlexColumn>
					<DropdownField onClick={() => setIsOpen(!isOpen)}>
						<ParagraphTextSemiBold
							colour={
								selectedOption ? CARBON_COLOUR : CONCRETE_COLOUR
							}
						>
							{selectedOption ? selectedOption : title}
						</ParagraphTextSemiBold>
						{/* if is open then display upchevron otherwise downchevron */}
						{isOpen ? <UpChevron /> : <DownChevron />}
					</DropdownField>
					{isOpen && (
						<OptionsContainer>
							{options.map((option) => (
								<SingleOptionContainers
									key={option}
									onClick={() => {
										setSelectedOption(option);
										setIsOpen(false);
									}}
								>
									<ParagraphTextSemiBold
										colour={CARBON_COLOUR}
									>
										{option}
									</ParagraphTextSemiBold>
								</SingleOptionContainers>
							))}
						</OptionsContainer>
					)}
				</FlexColumn>
			</SecondaryContainer>
		</MainContainer>
	);
}
