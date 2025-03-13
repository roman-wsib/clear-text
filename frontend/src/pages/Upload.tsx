import { useParams } from 'react-router-dom';
import TextArea from '../old_components/TextArea';
import FileUpload from '../old_components/FileUpload';
import axios from '../helpers/axios';
import { useRef, useState, useEffect } from 'react';
import Guidelines from '../old_components/Guidelines';
// import { uploadFileToADLS } from "../helpers/api-fetcher";
export default function Upload() {
  const [guidelines, setGuidelines] = useState<string[] | null>(null);
  const [documentText, setDocumentText] = useState('');
  const [basePrompt, setBasePrompt] = useState(); // base prompt
  const fileToUpload = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<boolean>(false); // ie) if user doesn't select a file to submit
  const { uploadType } = useParams();
  const [simplifiedText, setSimplifiedText] = useState('');
  const [score, setScore] = useState('');
  const [keywordsToKeep, setKeywordsToKeep] = useState<string[] | null>(null);
  const [keywordsToReplace, setKeywordsToReplace] = useState<string[] | null>(null);
  const [samples, setSamples] = useState<string[] | null>(null);
  const [simplifiedFileName, setSimplifiedFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Prepopulate base prompt from backend using API
  useEffect(() => {
    const fetchBasePrompt = async () => {
      try {
        const response = await axios.get('/default-config');
        setBasePrompt(response.data.base_prompt);
        if (response.data.keywords_to_keep) {
          setKeywordsToKeep(response.data.keywords_to_keep);
        }
        if (response.data.keywords_to_replace) {
          setKeywordsToReplace(response.data.keywords_to_replace);
        }
        if (response.data.samples) {
          setSamples(response.data.samples);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchBasePrompt();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    } else {
      console.log('handleFileChange file not set');
    }
  };

  const handleFormSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (fileToUpload?.current && fileToUpload.current.value !== '') {
      const formData = new FormData();
      console.log('FILE: ', file);
      formData.append('file', file!);
      formData.append('base_prompt', basePrompt || '');
      formData.append('keywords_to_keep', JSON.stringify(keywordsToKeep || []));
      formData.append('keywords_to_replace', JSON.stringify(keywordsToReplace || []));
      formData.append('samples', JSON.stringify(samples || []));
      
      const config = {
        headers: {
          'content-type': 'multipart/form-data',
        },
      };
      try {
        setIsLoading(true);
        const res = await axios.post('/docs/simplification', formData, config);
        fileToUpload.current.value = '';
        console.log('done, res: ', res);
        setScore('Score: ' + res.data.readabilityScore.toString());
        setSimplifiedText(res.data.simplifiedText);
        setSimplifiedFileName(res.data.filename);
        // Store filename in sessionStorage for file downloads
        sessionStorage.setItem('filename', res.data.filename);
        setIsLoading(false);
      } catch (error) {
        console.error('Error simplifying file:', error);
        setIsLoading(false);
      }
    } else if (uploadType == 'text' && documentText != '') {
      try {
        setIsLoading(true);
        const response = await axios.post('/text/simplification', {
          text: documentText,
          base_prompt: basePrompt || '',
          keywords_to_keep: keywordsToKeep || [],
          keywords_to_replace: keywordsToReplace || [],
          samples: samples || []
        });
        setScore('Score: ' + response.data.readabilityScore.toString());
        setSimplifiedText(response.data.simplifiedText);
        setIsLoading(false);
      } catch (error) {
        console.error('Error simplifying text:', error);
        setIsLoading(false);
      }
    } else {
      console.log('no file input');
      setError(true);
    }
  };

  return (
    <section className="w-screen">
      <div className="w-[30%] flex flex-col ml-auto mr-auto gap-[1rem]">
        {uploadType == 'text' ? (
          <TextArea
            title="Document Text"
            subTitle="Enter document text. We'll simplify it for you."
            onChange={(e) => setDocumentText(e.target.value)}
            placeholder_text="Enter document text here..."
          />
        ) : (
          <FileUpload handleFileChange={handleFileChange} ref={fileToUpload} />
        )}
        <TextArea
          title="Enter your base prompt"
          subTitle="Edit the default base prompt to help AI understand what you're looking for. Augment the base prompt by clicking the 'Add More Guidelines' button."
          onChange={(e) => setBasePrompt(e.target.value)}
          placeholder_text="Enter your base prompt here..."
        >
          {basePrompt}
        </TextArea>
        {guidelines && (
          <div className="flex flex-col gap-6 mt-5">
            <h1 className="text-[1.5rem] font-bold">Additional Guidelines</h1>
            {guidelines.map((_guideline, i) => (
              <Guidelines
                key={i}
                children={_guideline}
                handleTextChange={(e) => {
                  setGuidelines((prev) => {
                    const newGuidelines = [...prev!];
                    newGuidelines[i] = e.target.value;
                    return newGuidelines;
                  });
                }}
              />
            ))}
          </div>
        )}

        <button
          className="w-[200px] ml-auto bg-[#f9f9f9] text-[#161616] px-[1.2em] py-[0.4em] rounded-[10px]"
          onClick={() => {
            setGuidelines((prev) => (prev ? [...prev, ''] : ['']));
          }}
        >
          Add More Guidelines
        </button>

        <button
          onClick={(e) => {
            handleFormSubmit(e);
          }}
          className=" bg-blue-600 px-[1.2em] py-[0.4em] w-full rounded-[10px]"
        >
          Simplify Document
        </button>
        {error && uploadType != 'text' && (
          <p className="text-primary-red">
            Please select a file before submitting
          </p>
        )}
        {uploadType == 'text' && (
          <TextArea
            title="Simplified Text"
            subTitle={score}
            placeholder_text="Simplified text will appear here..."
          >
            {simplifiedText}
          </TextArea>
        )}
      </div>
    </section>
  );
}
