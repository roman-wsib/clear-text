import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import styled from 'styled-components';

const StyledDocViewer = styled.div`
	display: flex;
	width: 100%;
	height: 908px;
	flex-direction: column;
	align-items: flex-start;
	gap: 8px;
	flex-shrink: 0;
	z-index: 0;
`;

type DocumentViewerProps = {
	pdfURL: string;
};

export function DocumentViewer(params: DocumentViewerProps) {
	const { pdfURL } = params;

	return (
		<StyledDocViewer>
			<DocViewer
				documents={[{ uri: pdfURL }]}
				pluginRenderers={DocViewerRenderers}
				config={{
					header: {
						disableHeader: true,
						disableFileName: true,
					},
					pdfVerticalScrollByDefault: true,
				}}
			/>
		</StyledDocViewer>
	);
}
