type Guidelines = {
  handleTextChange: (e: any) => void;
  children: string;
};

export default function Guidelines({ handleTextChange, children }: Guidelines) {
  return (
    <textarea
      className="w-full h-fit px-[20px] py-[12px]  rounded-lg bg-transparent text-[1rem] border-[1px] border-primary-gray resize-none"
      value={children}
      onChange={handleTextChange}
      placeholder="Enter additional guidelines to your prompt"
    ></textarea>
  );
}
