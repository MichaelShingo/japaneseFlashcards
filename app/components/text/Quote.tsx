import { FC, ReactNode } from "react";
import { twJoin } from "tailwind-merge";

interface QuoteProps {
    source?: string;
    children: ReactNode;
}

const Quote: FC<QuoteProps> = ({ source, children }) => {
    return (
        <section>
            <div className={twJoin(['my-5 px-4 sm:px-16 md:px-28 flex flex-col h-fit min-h-[135vh] w-full overflow-hidden text-4xl leading-[3rem] sm:text-5xl sm:leading-[3.5rem] md:text-6xl md:leading-[4.8rem] lg:text-7xl lg:leading-[5.3rem] gap-14 items-center justify-center'])}>
                <div className="">
                    <div className="absolute h-[12%] w-[5px] -translate-x-6 translate-y-2 rounded-sm bg-black md:w-[10px] md:-translate-x-10" />
                    {children}
                </div>
                {source &&
                    <p className="block self-start text-3xl italic sm:text-4xl md:text-5xl">- {source}</p>
                }
            </div>
        </section>
    );
};

export default Quote;