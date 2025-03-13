import PageBody from '../components/PageBody';
import PageHeader from '../components/PageHeader';
import PageFooter from '../components/PageFooter';
import { FlexColumn } from '../constants/BasicStyled';
import styled from 'styled-components';

const HomeContainer = styled(FlexColumn)`
	width: 100%;
	height: 100%;
	align-items: flex-start;
	gap: 64px;
`;

export default function Home() {
	return (
		<HomeContainer>
			<PageHeader />
			<PageBody />
			<PageFooter />
		</HomeContainer>
	);
}
