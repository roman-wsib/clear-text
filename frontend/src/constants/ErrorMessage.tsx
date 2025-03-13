import styled from "styled-components";
import { RED_COLOUR } from "./Colours";

const StyledErrorMessage = styled.p`
    color: ${RED_COLOUR};
`

type ErrorMessageParameters = {
    errorText: string;
}

export default function ErrorMessage(params: ErrorMessageParameters) {
    const { errorText } = params;
    return (
        <StyledErrorMessage>
            {errorText}
        </StyledErrorMessage>
    );
}
  