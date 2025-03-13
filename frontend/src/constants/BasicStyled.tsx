import styled from 'styled-components';

export const FlexColumn = styled.div<{ gap?: number }>`
	display: flex;
	flex-direction: column;
	width: 100%;
	${(props) => props.gap && `gap: ${props.gap}px;`}
`;

export const FlexRow = styled.div<{ gap?: number }>`
	display: flex;
	flex-direction: row;
	width: 100%;
	${(props) => props.gap && `gap: ${props.gap}px;`}
`;
