import {PropsWithChildren} from "react";

export default function Error(props: PropsWithChildren) {
  if (props.children)
    return <p className={"error"}>{props.children}</p>

  return <></>
}