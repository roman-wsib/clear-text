import { useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import {
	ParagraphTextBold,
	ParagraphTextSmall,
	Heading,
	ParagraphText,
} from '../constants/Text';
import Button from './Button';
import {
	CARBON_COLOUR,
	TRILLIUM_COLOUR,
	SNOW_COLOUR,
	BLUE_JAY_COLOUR,
	RED_COLOUR,
} from '../constants/Colours';
import UploadCloud from '../assets/cloud-upload-alt-solid.svg';
import { FlexColumn } from '../constants/BasicStyled';
import { ErrorText } from './Prompt';

const StyledUploadContainer = styled(FlexColumn)`
	gap: 44px;
`;

const StyledContainer = styled.div`
	display: inline-flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 8px;
	width: 100%;
`;

const StyledDragDropContainer = styled.div<{ error: boolean }>`
	display: flex;
	width: 100%;
	height: 297px;
	padding: 100px 16px;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	gap: 6px;
	border: 2px dashed ${(props) => (props.error ? RED_COLOUR : CARBON_COLOUR)};
	background: ${TRILLIUM_COLOUR};
`;

const StyledUploadCloud = styled.div`
	margin: auto;
	display: block;
`;

const StyledUploadProgress = styled.div`
	display: flex;
	align-items: flex-start;
	gap: 24px;
`;
const StyledUploadedContainer = styled.div`
	display: inline-flex;
	padding: 30px 32px;
	flex-direction: column;
	align-items: flex-start;
	gap: 9px;
	background: ${SNOW_COLOUR};
`;

const RemoveButton = styled.button`
	width: auto;
	height: auto;
	flex-shrink: 0;
`;

const RemoveText = styled(ParagraphTextBold)`
	color: ${BLUE_JAY_COLOUR};
`;

type FileUploadProps = {
	files: Array<File>;
	setFiles: (files: Array<File>) => void;
	error: boolean;
};

export function FileUpload(params: FileUploadProps) {
	const { files, setFiles, error } = params;

	const onDrop = useCallback((acceptedFiles: Array<File>) => {
		const formData = new FormData();
		formData.append('file', acceptedFiles[0]);
		sessionStorage.setItem('filename', acceptedFiles[0].name);

		setFiles([...files, ...acceptedFiles]);
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
	});

	const fileUploadRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (error && fileUploadRef.current) {
			fileUploadRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}
	}, [error]);

	return (
		<StyledUploadContainer ref={fileUploadRef}>
			<Heading>Upload a Document</Heading>
			<StyledContainer>
				<ParagraphTextBold>
					Upload a document to simplify.
				</ParagraphTextBold>
				<ParagraphTextSmall>
					Accepted file type: .DOCX
				</ParagraphTextSmall>
				{files.length == 0 ? (
					<StyledDragDropContainer {...getRootProps()} error={error}>
						<StyledUploadCloud>
							<img src={UploadCloud} />
						</StyledUploadCloud>
						<input accept=".docx" {...getInputProps()} />
						{isDragActive ? (
							<ParagraphTextBold>Drop!</ParagraphTextBold>
						) : (
							<ParagraphTextBold>
								Drag and drop document(s)
							</ParagraphTextBold>
						)}
						<Button
							text="Attach"
							onClick={() => {}}
							alternatecolour={false}
						/>
					</StyledDragDropContainer>
				) : (
					<StyledUploadedContainer>
						{files.map((file) => (
							<StyledUploadProgress>
								<ParagraphText>{file.name}</ParagraphText>
								<ParagraphText>
									{file.size / 1000} KB
								</ParagraphText>
								<RemoveButton
									onClick={() => {
										setFiles(
											files.filter(
												(value) =>
													value.name !== file.name
											)
										);
									}}
								>
									<RemoveText>Remove</RemoveText>
								</RemoveButton>
							</StyledUploadProgress>
						))}
					</StyledUploadedContainer>
				)}
				{error && files.length == 0 && (
					<ErrorText>A file has not been selected.</ErrorText>
				)}
			</StyledContainer>
		</StyledUploadContainer>
	);
}
