"use client";
import Socials from "./Socials";
import Image from "next/image";

export type executiveProps = {
  imgUrl: string;
  name: string;
  role: string;
  desc: string;
};

function Executive({ imgUrl, name, role, desc }: executiveProps) {
  return (
    <div className="flex flex-col justify-center items-center border-b-2 pb-10 border-dasalight">
      <div className="relative h-[15.8rem] w-60 scale-75">
        <Image
          src={imgUrl}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="rounded-full object-cover"
        />
      </div>

      <div className="text-center px-2 mt-4">
        <h1 className="font-bold text-lg text-[#4c4945]">{name}</h1>
        <p className="font-bold text-[#4c4945]">{role}</p>

        <p className="leading-7 text-justify px-4 mt-2">{desc}</p>
      </div>

      <Socials />
    </div>
  );
}

export default Executive;
