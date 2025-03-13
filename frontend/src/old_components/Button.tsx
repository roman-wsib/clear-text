import { useNavigate } from 'react-router-dom';

type ButtonParameters = {
  text: string;
  path: string;
};

export default function Button(params: ButtonParameters) {
  const { text, path } = params;
  const navigate = useNavigate();
  const handleSubmit = () => navigate(path!);
  return (
    <button className="btn ml-[1rem]" onClick={handleSubmit}>
      {text}
    </button>
  );
}
