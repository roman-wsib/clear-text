// import { useState } from "react";
type TextArea = {
  title?: string;
  subTitle?: string;
  onChange?: (e: any) => any;
  children?: any;
  placeholder_text?: string;
};

export default function TextArea({
  title,
  subTitle,
  onChange,
  children,
  placeholder_text
}: TextArea) {
  return (
    <div className="flex flex-col gap-4 mt-4 first:mt-[3rem]">
      <h1 className="font-bold text-[2rem]">{title}</h1>
      <p className="text-[0.9em] text-primary-gray">{subTitle}</p>
      <textarea
        className="txt-area"
        placeholder={placeholder_text}
        onChange={onChange}
        value={children}
      ></textarea>
    </div>
  );
}
