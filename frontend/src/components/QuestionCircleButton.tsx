import { useState } from 'react';
import styled from 'styled-components';
import Button from './Button';
import { FlexColumn } from '../constants/BasicStyled';
import { TRILLIUM_COLOUR } from '../constants/Colours';
import { Heading2, ParagraphText } from '../constants/Text';
import { QuestionMarkIcon } from '../assets/Icons';
import ColouredSlider from './ColouredSlider';

const ModalTitleText = 'What does ARI score represent?';
const ModalContentText =
	'The Automated Readability Index (ARI) assesses the reading level of a piece of text. It is calculated based on the number of characters, words, and sentences.';

const QuestionCircleButton = styled.button`
	background-color: transparent;
	cursor: pointer;
	width: 29px;
	height: 29px;
`;

const ModalWrapper = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 2
`;

const ModalContent = styled(FlexColumn)`
	background-color: ${TRILLIUM_COLOUR};
	display: flex;
	width: 515px;
	padding: 40px 56px;
	flex-direction: column;
	align-items: center;
	gap: 40px;
`;

const ModalTitle = styled(Heading2)`
	text-align: center;
`;

const CloseButton = styled(Button)`
	margin-top: 25px; /* Add vertical margin above the button */
`;

type CloseButtonProps = {
	ariScore: number;
};

export default function QuestionCircleButtonComponent(
	params: CloseButtonProps
) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { ariScore } = params;

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	return (
		<>
			<QuestionCircleButton onClick={toggleModal}>
				<QuestionMarkIcon />
			</QuestionCircleButton>

			{isModalOpen && (
				<ModalWrapper>
					<ModalContent>
						<ModalTitle>{ModalTitleText}</ModalTitle>
						<ParagraphText>{ModalContentText}</ParagraphText>
						<ColouredSlider score={ariScore} />
						<CloseButton text="Close" onClick={toggleModal} />
					</ModalContent>
				</ModalWrapper>
			)}
		</>
	);
}
