import {ReactNode, useState} from "react";

export default function Accordion({title, children}: {
  title: string;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={"accordion" + (isOpen ? " active" : "")}>
      <div className="accordion__header">
        <h2>{title}</h2>
        <button onClick={() => setIsOpen(prev => !prev)}
                className={"accordion__btn btn"}>&lt;</button>
      </div>
      <div className={"accordion__body"}>
        {children}
      </div>
    </div>
  );
}