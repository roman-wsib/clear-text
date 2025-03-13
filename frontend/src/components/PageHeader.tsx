import React from 'react';
import { Heading, ParagraphTextSmallSemiBold } from '../constants/Text';
import { FlexRow } from '../constants/BasicStyled';
import styled from 'styled-components';
import { GRAY_3_COLOUR, TRILLIUM_COLOUR } from '../constants/Colours';
import WSIBLogo from '../assets/WSIB-logo.png';

const LogoAndTitleContainer = styled(FlexRow)`
	align-items: center;
	gap: 32px;
`;

const Logo = styled.div`
	display: flex;
	width: 130px;
	height: 70.417px;
	justify-content: center;
	align-items: center;
`;

const TextContainer = styled(FlexRow)`
	align-items: flex-start;
	gap: 30px;
	width: auto;
`;

const ContentContainer = styled(FlexRow)`
	justify-content: center;
	align-items: center;
	padding-left: 111px;
	padding-right: 111px;
`;

const StyledContainer = styled.div<{ shrink: boolean }>`
	display: flex;
	width: 100%;
	height: ${(props) => (props.shrink ? '120px' : '176px')};
	flex-direction: column;
	justify-content: center;
	align-items: center;
	flex-shrink: 0;

	box-shadow: 5px 0px 25px 2px ${GRAY_3_COLOUR};
	position: sticky;
	top: 0;
	background-color: ${TRILLIUM_COLOUR};
	transition: height 0.3s ease-in-out;
	z-index: 1;
`;

export default class PageHeader extends React.Component {
	state = {
		shrink: false,
	};

	componentDidMount() {
		window.addEventListener('scroll', this.handleScroll);
	}

	componentWillUnmount() {
		window.removeEventListener('scroll', this.handleScroll);
	}

	handleScroll = () => {
		const isShrink = window.scrollY !== 0;
		if (isShrink !== this.state.shrink) {
			this.setState({ shrink: isShrink });
		}
	};

	render() {
		return (
			<StyledContainer shrink={this.state.shrink}>
				<ContentContainer>
					<LogoAndTitleContainer>
						<Logo>
							<img src={WSIBLogo} />
						</Logo>
						<Heading>Document Simplification</Heading>
					</LogoAndTitleContainer>
					<TextContainer>
						<ParagraphTextSmallSemiBold>
							Français
						</ParagraphTextSmallSemiBold>
						<ParagraphTextSmallSemiBold>
							Exit
						</ParagraphTextSmallSemiBold>
					</TextContainer>
				</ContentContainer>
			</StyledContainer>
		);
	}
}
