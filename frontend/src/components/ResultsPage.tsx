import React from 'react';
import styled from 'styled-components';
import { FlexColumn, FlexRow } from '../constants/BasicStyled';
import { PageBodyContainer } from './PageBody';
import Button from './Button';
import {
	Heading,
	Heading2,
	Heading3,
	ParagraphTextBold,
} from '../constants/Text';
import QuestionCircleButton from './QuestionCircleButton';
import ColouredSlider from './ColouredSlider';

import axios from '../helpers/axios';
import fileDownload from 'js-file-download';
import ReactLoading from 'react-loading';
import TextArea from './TextArea';
import { BLUE_JAY_COLOUR } from '../constants/Colours';
import { DocumentViewer } from './DocumentViewer';
import ClipboardIcon from "../assets/clipboard.svg"

const StyledFlexRow = styled(FlexRow)`
	align-items: center;
	align-text: center;
	width: fit-content;
	gap: 15px;
`;

const TopContainer = styled(FlexRow)`
	justify-content: space-between;
	width: 100%;
	align-items: end;
`;

const PreviewContainer = styled(FlexColumn)`
	gap: 10px;
`;

const StyledSpinner = styled(ReactLoading)`
	align-self: center;
	padding-top: 10%;
	padding-bottom: 10%;
`;

const StyledFlexColumn = styled(FlexColumn)`
	gap: 44px;
`;
const ResultsButtonContainer = styled(FlexRow)`
	justify-content: space-between;
	width: 100%;
`;

const StyledClipboard = styled.div`
	margin-left: auto; 
	margin-right: 0;
	width: 24px;
	cursor: pointer;

	img:hover {
		filter: invert(81%) sepia(6%) saturate(54%) hue-rotate(349deg) brightness(96%) contrast(82%);
	}
`

type ResultsPageProps = {
	results: any;
	loading: boolean;
	setResultPage: (value: boolean) => void;
	uploadActive: boolean;
	regenerate: () => void;
};

export default class ResultsPage extends React.Component<ResultsPageProps, {}> {
	downloadFile = async () => {
		console.log(sessionStorage.getItem('filename'));
		await axios
			.get('/docs/simplification', {
				responseType: 'blob',
				headers: {
					'content-type': 'multipart/form-data',
				},
				params: {
					filename: sessionStorage.getItem('filename'),
				},
			})
			.then((res) => {
				fileDownload(res.data, sessionStorage.getItem('filename')!);
			})
			.catch((error) => {
				console.error('Error downloading file:', error);
			});
	};

	downloadPdf = async () => {
		console.log(sessionStorage.getItem('filename'));
		await axios
			.get('/get-pdf', {
				responseType: 'blob',
				headers: {
					'content-type': 'multipart/form-data',
				},
				params: {
					filename: sessionStorage.getItem('filename'),
				},
			})
			.then((res) => {
				// Change the extension from .docx to .pdf for the downloaded file
				const filename = sessionStorage.getItem('filename')!;
				const pdfFilename = filename.replace('.docx', '.pdf');
				fileDownload(res.data, pdfFilename);
			})
			.catch((error) => {
				console.error('Error downloading PDF:', error);
			});
	};

	render() {
		const { results, loading, uploadActive, regenerate } = this.props;
		const ariScore = results.readabilityScore || 0;
		const gradeLevel = getGradeLevelCase(ariScore);
		const simplifiedText = results.simplifiedText || '';
		return (
			<>
				{loading ? (
					<StyledSpinner
						type={'spinningBubbles'}
						color={BLUE_JAY_COLOUR}
						height={'10%'}
						width={'10%'}
					/>
				) : (
					<PageBodyContainer>
						<TopContainer>
							<FlexColumn gap={44}>
								<Heading>Document Generation</Heading>
								<StyledFlexRow>
									<Heading2>{'Grade Level:'}</Heading2>
									<Heading3>{gradeLevel}</Heading3>
								</StyledFlexRow>
								<StyledFlexRow>
									<Heading2>{'ARI Score:'}</Heading2>
									<Heading3>{ariScore.toFixed(2)}</Heading3>
									<QuestionCircleButton ariScore={ariScore} />
								</StyledFlexRow>
							</FlexColumn>
							<ColouredSlider score={ariScore} />
						</TopContainer>

						<StyledFlexColumn>
							<ResultsButtonContainer>
								<Heading>Results</Heading>
								<Button
									text="Regenerate"
									onClick={regenerate}
								/>
							</ResultsButtonContainer>
							<PreviewContainer>
								{ariScore <= 15 ? (
									<ParagraphTextBold>
										Your document has been simplified and
										has met the required grade level.
									</ParagraphTextBold>
								) : (
									<ParagraphTextBold>
										Your document has been simplified and
										has not met the required grade level.
									</ParagraphTextBold>
								)}
								<TextArea
									placeHolderText={simplifiedText}
									text={simplifiedText}
									onChange={() => {}}
									height={800}
								/>
								<StyledClipboard 
									onClick={() => navigator.clipboard.writeText(simplifiedText)}>
									<img src={ClipboardIcon} />
								</StyledClipboard>
							</PreviewContainer>
						</StyledFlexColumn>

						<ResultsButtonContainer>
							<Button
								text="Back"
								onClick={() => this.props.setResultPage(false)}
								alternatecolour={true}
							/>
							{uploadActive && (
								<Button
									text="Download as .docx"
									onClick={this.downloadFile}
								/>
							)}
						</ResultsButtonContainer>
					</PageBodyContainer>
				)}
			</>
		);
	}
}

function getGradeLevelCase(ariScore: number): number | string {
	if (ariScore <= 5) return 'Kindergarten'; // Kindergarten
	if (ariScore <= 7) return 2; // First/Second Grade
	if (ariScore <= 9) return 3; // Third Grade
	if (ariScore <= 11) return 4; // Fourth Grade
	if (ariScore <= 13) return 5; // Fifth Grade
	if (ariScore <= 15) return 6; // Sixth Grade
	if (ariScore <= 17) return 7; // Seventh Grade
	if (ariScore <= 19) return 8; // Eighth Grade
	if (ariScore <= 21) return 9; // Ninth Grade
	if (ariScore <= 23) return 10; // Tenth Grade
	if (ariScore <= 25) return 11; // Eleventh Grade
	if (ariScore <= 27) return 12; // Twelfth Grade
	return 13; // College
}
