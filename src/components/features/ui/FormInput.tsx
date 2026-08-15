import { ReactElement } from "react";
import {
  FieldValues,
  Path,
  UseFormRegister
} from "react-hook-form";

export type formInputProps<T extends FieldValues> = {
  icon: ReactElement;
  icon2?: ReactElement;
  type?: string;
  form?: string;
  placeholder: string;
  addClass?: string;
  style?: string;
  register: UseFormRegister<T>;
  inputName: Path<T>;
};
export type hallProps = {
  name: string;
  type: string;
  description: string;
  style: string;
};
function FormInput<T extends FieldValues>({
  icon,
  type,
  placeholder,
  addClass,
  style,
  inputName,
  register,
  icon2 
}: formInputProps<T>) {
  const universityOfGhanaHostels = [
    {
      name: "Legon Hall",
      type: "Traditional Hall",
      description:
        "Offers single and shared rooms with a central location ideal for socializing.",
    },
    {
      name: "Legon Hall Annexes",
      type: "Annex",
      description:
        "Additional accommodations part of Legon Hall, with similar amenities and shared rooms.",
    },
    {
      name: "Akuafo Hall",
      type: "Traditional Hall",
      description:
        "Affordable shared and single rooms with close access to campus facilities.",
    },
    {
      name: "Akuafo Hall Annexes",
      type: "Annex",
      description:
        "Provides extra capacity for Akuafo Hall, maintaining the same vibrant community.",
    },
    {
      name: "Commonwealth Hall",
      type: "Traditional Hall",
      description: "Male-only hall known for its spirited traditions.",
    },
    {
      name: "Volta Hall",
      type: "Traditional Hall",
      description: "Female-only hall offering a quieter environment.",
    },
    {
      name: "Mensah Sarbah Hall",
      type: "Traditional Hall",
      description:
        "Known for its community and proximity to lecture halls and amenities.",
    },
    {
      name: "Mensah Sarbah Hall Annexes",
      type: "Annex",
      description:
        "Additional rooms as part of Mensah Sarbah Hall, providing extra capacity.",
    },
    {
      name: "International Students Hostel (ISH)",
      type: "Private Hostel",
      description:
        "Offers privacy and modern facilities, catering mainly to international students.",
    },
    {
      name: "Jubilee Hall",
      type: "Private Hostel",
      description: "Provides relatively modern amenities for students.",
    },
    {
      name: "Valco Hostel",
      type: "Private Hostel",
      description:
        "Comfortable living space with additional facilities like study areas.",
    },
    {
      name: "UGEL Hostels (Pentagon)",
      type: "UGEL Hostel",
      description:
        "Managed by the University of Ghana Enterprise Limited, offering modern accommodation options for students.",
    },
  ];

  

  const wrapperStyle = style ? style.replace(/focus:/g, 'focus-within:') : "";

  return (
    <div className={`flex items-center rounded-lg relative overflow-hidden w-full ${wrapperStyle} ${addClass}`}>
      {icon} 
     
       {icon2}
     
      {type !== "select" ? (
        <input
          type={type}
          placeholder={placeholder}
          className={`py-3 px-1 pl-7 indent-8 font-poppins h-full w-full text-sm outline-none bg-transparent border-none focus:ring-0`}
          {...register(inputName,{})}
        required />
      ) : (
        <select
          
          {...register(inputName)}
          className={`indent-6 font-poppins h-full w-full text-gray-400 bg-transparent border-none outline-none focus:ring-0`}
        >
          <option value="">Select hall</option>
          {universityOfGhanaHostels &&
            universityOfGhanaHostels.map((hall, idx) => (
              <option key={idx} value={hall.name}>{hall.name}</option>
            ))}
        </select>
      )}
    </div>
  );
}

export default FormInput;
