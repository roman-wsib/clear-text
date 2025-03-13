import styled from 'styled-components';
import React from 'react';
import Prompt from './Prompt';
import UploadToggle from './UploadToggle';
import Button from './Button';
import { Heading3 } from '../constants/Text';
import KeywordsToKeep from './KeywordsToKeep';
import ReplaceKeywords from './ReplaceKeywords';
import Warning from './Warning';
import { PasteText } from './PasteText';
import BeforeAfterExamples, {
	BeforeAfterExampleType,
} from './BeforeAfterExamples';
import { FileUpload } from './FileUpload';
import axios from '../helpers/axios';
import ResultsPage from './ResultsPage';

export const PageBodyContainer = styled.div`
	display: flex;
	width: 100%;
	height: 100%;
	padding: 0px 152px;
	flex-direction: column;
	align-items: flex-start;
	gap: 64px;
`;

const InitialText =
	"This tool facilitates the uploading of documents for simplification, ensuring adherence to various rules and communication guidelines established by WSIB while also aiming to meet the Ontario government's standards for a grade 6 reading level in communications.";

const WarningText =
	'Please note that editing the prompt details will result in a different output that may not match your requirements.  ';
// Create state of the Page Body

const InitialBasePrompt =
	'You are an editor in the communications department of a government insurance firm that handles workplace compensation for injured / deceased workers. Your role is to re-write official communications to match a grade 6 reading level...';

export type KeywordsToReplaceType = {
	original: string;
	replacement: string;
};

export default class PageBody extends React.Component {
	state = {
		uploadActive: true,
		keywordsToKeep: [] as string[],
		keywordsToReplace: [] as KeywordsToReplaceType[],
		documentText: '',
		sampleQuestions: [] as BeforeAfterExampleType[],
		files: [] as File[],
		basePrompt: InitialBasePrompt,
		resultsPage: false,
		results: {},
		loading: false,
		pdf_url: '',
		fileError: false,
		pasteError: false,
		promptError: false,
	};

	componentDidMount(): void {
		axios.get('/default-config').then((res) => {
			console.log(res.data);
			const {
				base_prompt,
				keywords_to_keep,
				keywords_to_replace,
				samples,
			} = res.data;
			this.setState({
				basePrompt: base_prompt,
				keywordsToKeep: keywords_to_keep,
				keywordsToReplace: keywords_to_replace,
			});
			const sampleQuestions = samples.map(
				(sample: BeforeAfterExampleType) => {
					return {
						id: Date.now() + Math.random(),
						original: sample.original,
						simplified: sample.simplified,
						error1: false,
						error2: false,
					};
				}
			);
			this.setState({ sampleQuestions });
		});
	}

	uploadError = async () => {
		if (this.state.basePrompt == '') {
			this.setState({ promptError: true });
		} else if (this.state.uploadActive && !this.state.files[0]) {
			// no file selected
			this.setState({ fileError: true });
		} else if (!this.state.uploadActive && this.state.documentText == '') {
			// no text pasted
			this.setState({ pasteError: true });
		} else if (this.checkForErrorsSampleQuestions()) {
			this.setState({ sampleQuestions: this.state.sampleQuestions });
		}
	};

	uploadFile = async () => {
		// Add file type validation
		if (this.state.files.length > 0 && this.state.files[0]?.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
			alert('Please upload only .docx files');
			return;
		}

		this.setState({ loading: true, resultsPage: true });

		const formData = new FormData();
		formData.append('file', this.state.files[0]);
		formData.append('base_prompt', this.state.basePrompt);
		// Serialize arrays/objects to JSON strings
		formData.append(
			'keywords_to_keep',
			JSON.stringify(this.state.keywordsToKeep)
		);
		formData.append(
			'keywords_to_replace',
			JSON.stringify(this.state.keywordsToReplace)
		);
		formData.append('samples', JSON.stringify(this.state.sampleQuestions));

		const config = {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		};

		const res = await axios.post('/docs/simplification', formData, config);

		// Get data from the response
		this.setState({ results: res.data, loading: false });
		
		// Store the filename for later download
		sessionStorage.setItem('filename', res.data.filename);
	};

	uploadText = async () => {
		console.log(this.state.documentText);
		console.log(this.state.basePrompt);
		console.log(this.state.keywordsToKeep);
		console.log(this.state.keywordsToReplace);
		console.log(this.state.sampleQuestions);

		this.setState({ loading: true, resultsPage: true });

		const config = {
			headers: {
				'content-type': 'application/json',
			},
		};
		const res = await axios.post(
			'/text/simplification',
			{
				text: this.state.documentText,
				base_prompt: this.state.basePrompt,
				keywords_to_keep: this.state.keywordsToKeep,
				keywords_to_replace: this.state.keywordsToReplace,
				samples: this.state.sampleQuestions,
			},
			config
		);
		this.setState({ results: res.data, loading: false });
	};

	checkForErrorsSampleQuestions = () => {
		let error = false;
		this.state.sampleQuestions.forEach((pair: any) => {
			if (pair.original == '' || pair.simplified == '') {
				error = true;
			}
		});
		return error;
	};

	render() {
		return (
			<>
				{this.state.resultsPage ? (
					<ResultsPage
						loading={this.state.loading}
						results={{
							...this.state.results,
							pdf_url: this.state.pdf_url,
						}}
						setResultPage={(value: boolean) => {
							this.setState({ resultsPage: value });
						}}
						uploadActive={this.state.uploadActive}
						regenerate={
							this.state.uploadActive
								? this.uploadFile
								: this.uploadText
						}
					/>
				) : (
					<PageBodyContainer>
						<Heading3>{InitialText}</Heading3>
						<UploadToggle
							uploadActive={this.state.uploadActive}
							setUploadActive={(value: boolean) => {
								this.setState({ uploadActive: value });
							}}
						/>
						{this.state.uploadActive ? (
							<FileUpload
								files={this.state.files}
								setFiles={(files: Array<File>) => {
									this.setState({ files });
								}}
								error={this.state.fileError}
							/>
						) : (
							<PasteText
								text={this.state.documentText}
								setText={(text: string) => {
									this.setState({ documentText: text });
								}}
								error={this.state.pasteError}
							/>
						)}
						<Warning text={WarningText} />
						<Prompt
							basePrompt={this.state.basePrompt}
							setBasePrompt={(basePrompt: string) => {
								this.setState({ basePrompt });
							}}
							error={this.state.promptError}
						/>

						<KeywordsToKeep
							keywords={this.state.keywordsToKeep}
							setKeywords={(keywords: string[]) => {
								this.setState({ keywordsToKeep: keywords });
							}}
						/>

						<ReplaceKeywords
							keywords={this.state.keywordsToReplace}
							setKeywords={(
								keywords: KeywordsToReplaceType[]
							) => {
								this.setState({ keywordsToReplace: keywords });
							}}
						/>
						{this.state.sampleQuestions && 
							<BeforeAfterExamples
								sampleQuestions={this.state.sampleQuestions}
								setSampleQuestions={(
									sampleQuestions: BeforeAfterExampleType[]
								) => {
									this.setState({
										sampleQuestions: sampleQuestions,
									});
								}}
							/>
						}
						{this.state.uploadActive ? (
							<Button
								text="Simplify File"
								alternatecolour={false}
								onClick={
									this.state.files[0] &&
									this.state.basePrompt != '' &&
									!this.checkForErrorsSampleQuestions()
										? this.uploadFile
										: this.uploadError
								}
							/>
						) : (
							<Button
								text="Simplify Text"
								alternatecolour={false}
								onClick={
									this.state.documentText != '' &&
									this.state.basePrompt != '' &&
									!this.checkForErrorsSampleQuestions()
										? this.uploadText
										: this.uploadError
								}
							/>
						)}
					</PageBodyContainer>
				)}
			</>
		);
	}
}
