import {HTMLProps, ReactNode} from "react";

export default function Label(props: HTMLProps<HTMLParagraphElement>) {
    let domProps = {...props};
    delete domProps.className;

    return (
        <p className={`uppercase text-xs sm:text-sm font-bold ${props.className || ""}`} {...domProps}>{props.children}</p>
    )
}